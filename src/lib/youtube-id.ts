/**
 * Normalize a bare YouTube video id or common watch/share URL to the 11-char id.
 * Returns "" when no valid id can be extracted.
 */
export function normalizeYoutubeVideoId(raw: string | null | undefined): string {
  const value = (raw ?? "").trim();
  if (!value) return "";

  // Bare id (standard YouTube ids are 11 chars; allow a small range).
  if (/^[a-zA-Z0-9_-]{6,15}$/.test(value)) return value;

  const candidates: string[] = [];

  const push = (id: string | null | undefined) => {
    const cleaned = (id ?? "").trim();
    if (/^[a-zA-Z0-9_-]{6,15}$/.test(cleaned)) candidates.push(cleaned);
  };

  try {
    const url = new URL(value.includes("://") ? value : `https://${value}`);
    const host = url.hostname.replace(/^www\./, "").toLowerCase();

    if (host === "youtu.be") {
      push(url.pathname.split("/").filter(Boolean)[0]);
    }

    if (
      host === "youtube.com" ||
      host === "m.youtube.com" ||
      host === "music.youtube.com" ||
      host === "youtube-nocookie.com"
    ) {
      push(url.searchParams.get("v"));
      const parts = url.pathname.split("/").filter(Boolean);
      if (parts.length >= 2 && ["embed", "shorts", "live", "v", "e", "youtu.be"].includes(parts[0])) {
        push(parts[1]);
      }
      // /watch/VIDEOID (rare)
      if (parts[0] === "watch" && parts[1]) push(parts[1]);
    }
  } catch {
    // Fall through to regex extraction.
  }

  const vMatch = value.match(/[?&]v=([a-zA-Z0-9_-]{6,15})/);
  if (vMatch) push(vMatch[1]);

  const shortMatch = value.match(/youtu\.be\/([a-zA-Z0-9_-]{6,15})/);
  if (shortMatch) push(shortMatch[1]);

  const pathMatch = value.match(/\/(?:embed|shorts|live|v|e)\/([a-zA-Z0-9_-]{6,15})/);
  if (pathMatch) push(pathMatch[1]);

  return candidates[0] ?? "";
}
