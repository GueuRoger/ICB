import { supabase } from "@/lib/supabase";

export type ProgramAccess = "global-fluency" | "world-stage";

export const PROGRAM_VIDEO_PATH: Record<ProgramAccess, string> = {
  "global-fluency": "/courses/global-fluency/videos",
  "world-stage": "/courses/world-stage/videos",
};

export const MY_COURSE_PATH = "/my-course";

/** Canonical course UUIDs used by enrollment checks (must stay in sync with unify-enrollment-access.sql). */
export const PROGRAM_COURSE_IDS: Record<ProgramAccess, string> = {
  "global-fluency": "0187d679-9042-4b87-83fb-3d5978f3f6ac",
  "world-stage": "77536ce7-e0e5-4a9d-8960-33786caa3898",
};

type EnrollmentRow = {
  status?: string | null;
  statu?: string | null;
  expires_at?: string | null;
  course_id?: string | null;
  courses?:
    | { slug: string | null }
    | { slug: string | null }[]
    | null;
};

function normalizeSlug(slug: string | null | undefined): ProgramAccess | null {
  if (!slug) return null;
  const value = slug.trim().toLowerCase();
  if (value === "global-fluency") return "global-fluency";
  if (value === "world-stage" || value === "world stage") return "world-stage";
  return null;
}

function programFromCourseId(courseId: string | null | undefined): ProgramAccess | null {
  if (!courseId) return null;
  const normalized = courseId.trim().toLowerCase();
  for (const [program, id] of Object.entries(PROGRAM_COURSE_IDS) as [ProgramAccess, string][]) {
    if (id.toLowerCase() === normalized) return program;
  }
  return null;
}

function statusLabels(row: EnrollmentRow) {
  return [row.status, row.statu]
    .filter((value): value is string => typeof value === "string")
    .map((value) => value.trim().toLowerCase())
    .filter((value) => value !== "");
}

/**
 * Active if either modern `status` or legacy `statu` is "active".
 * Null/blank `status` must not hide a populated active `statu`.
 * Null `expires_at` means no expiration.
 */
function isActiveEnrollment(row: EnrollmentRow) {
  const labels = statusLabels(row);
  if (!labels.includes("active")) return false;
  if (row.expires_at) {
    const expires = Date.parse(row.expires_at);
    if (Number.isFinite(expires) && expires <= Date.now()) return false;
  }
  return true;
}

function courseSlugFromRow(row: EnrollmentRow) {
  const course = Array.isArray(row.courses) ? row.courses[0] : row.courses;
  return normalizeSlug(course?.slug ?? null);
}

function asProgramAccess(value: unknown): ProgramAccess | null {
  if (value === "global-fluency" || value === "world-stage") return value;
  return null;
}

/** Preferred path: same SECURITY DEFINER rules as video RLS. */
async function loadMyProgramsViaRpc(): Promise<ProgramAccess[] | null> {
  const { data, error } = await supabase.rpc("list_my_active_programs");
  if (error) return null;
  if (!Array.isArray(data)) return [];
  const programs = new Set<ProgramAccess>();
  for (const row of data) {
    const value =
      typeof row === "string"
        ? row
        : row && typeof row === "object" && "program" in row
          ? (row as { program: unknown }).program
          : null;
    const program = asProgramAccess(value);
    if (program) programs.add(program);
  }
  return [...programs];
}

async function resolveSlugsByCourseId(courseIds: string[]) {
  const unique = [...new Set(courseIds.filter(Boolean))];
  if (unique.length === 0) return new Map<string, ProgramAccess>();

  const { data, error } = await supabase.from("courses").select("id, slug").in("id", unique);
  if (error || !data) return new Map<string, ProgramAccess>();

  const map = new Map<string, ProgramAccess>();
  for (const row of data as { id: string; slug: string | null }[]) {
    const program = normalizeSlug(row.slug) ?? programFromCourseId(row.id);
    if (program) map.set(row.id, program);
  }
  return map;
}

async function loadMyProgramsViaTable(): Promise<ProgramAccess[]> {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return [];

  let rows: EnrollmentRow[] | null = null;

  const embedded = await supabase
    .from("enrollments")
    .select("status, statu, expires_at, course_id, courses(slug)")
    .eq("user_id", user.id);

  if (!embedded.error && embedded.data) {
    rows = embedded.data as EnrollmentRow[];
  } else {
    const withoutStatu = await supabase
      .from("enrollments")
      .select("status, expires_at, course_id, courses(slug)")
      .eq("user_id", user.id);
    if (!withoutStatu.error && withoutStatu.data) {
      rows = withoutStatu.data as EnrollmentRow[];
    } else {
      const plain = await supabase
        .from("enrollments")
        .select("status, statu, expires_at, course_id")
        .eq("user_id", user.id);
      if (plain.error || !plain.data) {
        const plainStatusOnly = await supabase
          .from("enrollments")
          .select("status, expires_at, course_id")
          .eq("user_id", user.id);
        if (plainStatusOnly.error || !plainStatusOnly.data) return [];
        rows = plainStatusOnly.data as EnrollmentRow[];
      } else {
        rows = plain.data as EnrollmentRow[];
      }
    }
  }

  const missingCourseIds = rows
    .filter((row) => isActiveEnrollment(row) && !courseSlugFromRow(row) && !programFromCourseId(row.course_id) && row.course_id)
    .map((row) => row.course_id as string);
  const slugByCourseId = await resolveSlugsByCourseId(missingCourseIds);

  const programs = new Set<ProgramAccess>();
  for (const row of rows) {
    if (!isActiveEnrollment(row)) continue;
    const program =
      courseSlugFromRow(row) ??
      programFromCourseId(row.course_id) ??
      (row.course_id ? slugByCourseId.get(row.course_id) : null);
    if (program) programs.add(program);
  }
  return [...programs];
}

/**
 * Active program enrollments for the authenticated user.
 * Prefer list_my_active_programs() so /my-course and video pages share RLS helper rules.
 */
export async function loadMyPrograms(): Promise<ProgramAccess[]> {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return [];

  const viaRpc = await loadMyProgramsViaRpc();
  if (viaRpc) return viaRpc;
  return loadMyProgramsViaTable();
}
