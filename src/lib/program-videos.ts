import { supabase } from "@/lib/supabase";
import type { ProgramAccess } from "@/lib/my-course";
import { normalizeYoutubeVideoId } from "@/lib/youtube-id";

export type ProgramVideoSlug = ProgramAccess;

export type ProgramVideo = {
  id: string;
  position: number;
  number: string;
  title: string;
  description: string;
  duration: string;
  /** Legacy YouTube id — used when storagePath is empty. */
  youtubeId: string;
  /** Path inside the private course bucket (e.g. lessons/01-intro.mp4). */
  storagePath: string;
  thumbnailUrl: string;
};

export const PROGRAM_VIDEO_BUCKET: Record<ProgramVideoSlug, string> = {
  "global-fluency": "global-fluency-videos",
  "world-stage": "world-stage-videos",
};

type ProgramVideoRow = {
  id: string;
  position: number | null;
  title_en: string | null;
  title_fr: string | null;
  description_en: string | null;
  description_fr: string | null;
  duration: string | null;
  youtube_id: string | null;
  storage_path: string | null;
  thumbnail_url: string | null;
};

function tableName(program: ProgramVideoSlug) {
  return program === "global-fluency" ? "global_fluency_videos" : "world_stage_videos";
}

function pick(locale: "en" | "fr", en: string | null | undefined, fr: string | null | undefined) {
  const value = locale === "fr" ? fr : en;
  if (typeof value === "string" && value.trim() !== "") return value;
  if (typeof en === "string" && en.trim() !== "") return en;
  if (typeof fr === "string" && fr.trim() !== "") return fr;
  return "";
}

function mapRows(rows: ProgramVideoRow[], locale: "en" | "fr"): ProgramVideo[] {
  return rows
    .map((row, index) => {
      // Accept bare ids or common YouTube URL formats stored in youtube_id.
      const youtubeId = normalizeYoutubeVideoId(row.youtube_id);
      const storagePath = (row.storage_path ?? "").trim();
      const position = row.position && row.position > 0 ? row.position : index + 1;
      return {
        id: row.id,
        position,
        number: String(position).padStart(2, "0"),
        title: pick(locale, row.title_en, row.title_fr),
        description: pick(locale, row.description_en, row.description_fr),
        duration: (row.duration ?? "").trim(),
        youtubeId,
        storagePath,
        thumbnailUrl: (row.thumbnail_url ?? "").trim(),
      };
    })
    .filter((row) => row.youtubeId !== "" || row.storagePath !== "");
}

/**
 * Client-safe loader — requires an authenticated enrolled session (RLS).
 * Locale is passed in so this module never imports `@/i18n/server`.
 */
export async function fetchProgramVideos(
  program: ProgramVideoSlug,
  locale: "en" | "fr" = "en",
): Promise<ProgramVideo[]> {
  const { data, error } = await supabase
    .from(tableName(program))
    .select(
      "id, position, title_en, title_fr, description_en, description_fr, duration, youtube_id, storage_path, thumbnail_url",
    )
    .eq("is_published", true)
    .order("position", { ascending: true });

  if (error || !data) return [];
  return mapRows(data as ProgramVideoRow[], locale);
}

/** Create a short-lived signed URL for a private Storage video. */
export async function createProgramVideoSignedUrl(program: ProgramVideoSlug, storagePath: string) {
  const path = storagePath.trim().replace(/^\/+/, "");
  if (!path) return null;
  const { data, error } = await supabase.storage
    .from(PROGRAM_VIDEO_BUCKET[program])
    .createSignedUrl(path, 60 * 60);
  if (error || !data?.signedUrl) return null;
  return data.signedUrl;
}
