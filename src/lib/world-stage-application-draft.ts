export const WORLD_STAGE_APPLY_PATH = "/courses/world-stage/apply";

const STORAGE_KEY = "icb:world-stage-application-draft";

export type WorldStageApplicationDraft = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  company: string;
  title: string;
  industry: string;
  industryOther: string;
  assignments: string;
  phoneConsent: boolean;
  termsConsent: boolean;
  /** When true, the apply page should submit automatically after auth returns. */
  pendingSubmit?: boolean;
};

export function saveWorldStageApplicationDraft(draft: WorldStageApplicationDraft) {
  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(draft));
  } catch {
    // Storage can be blocked; signup still works, but fields may not restore.
  }
}

export function readWorldStageApplicationDraft(): WorldStageApplicationDraft | null {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<WorldStageApplicationDraft>;
    return {
      firstName: String(parsed.firstName ?? ""),
      lastName: String(parsed.lastName ?? ""),
      email: String(parsed.email ?? ""),
      phone: String(parsed.phone ?? ""),
      company: String(parsed.company ?? ""),
      title: String(parsed.title ?? ""),
      industry: String(parsed.industry ?? ""),
      industryOther: String(parsed.industryOther ?? ""),
      assignments: String(parsed.assignments ?? ""),
      phoneConsent: Boolean(parsed.phoneConsent),
      termsConsent: Boolean(parsed.termsConsent),
      pendingSubmit: Boolean(parsed.pendingSubmit),
    };
  } catch {
    return null;
  }
}

export function clearWorldStageApplicationDraft() {
  try {
    sessionStorage.removeItem(STORAGE_KEY);
  } catch {
    // Ignore storage failures.
  }
}
