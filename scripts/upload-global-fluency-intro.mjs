/**
 * Uploads Global Fluency intro media to the public `global-fluency` bucket.
 * Requires scripts/global-fluency-intro-storage.sql (bucket + insert/update policies).
 *
 * Usage:
 *   node scripts/upload-global-fluency-intro.mjs
 *   node scripts/upload-global-fluency-intro.mjs path/to/intro-video.mp4
 *
 * Then run: scripts/global-fluency-intro-urls.sql
 */
import { readFileSync, existsSync } from "node:fs";
import { resolve, dirname, join, extname } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const envPath = join(root, ".env.local");
if (!existsSync(envPath)) throw new Error("Missing .env.local");

const env = Object.fromEntries(
  readFileSync(envPath, "utf8")
    .split(/\r?\n/)
    .filter((line) => line && !line.startsWith("#") && line.includes("="))
    .map((line) => {
      const i = line.indexOf("=");
      return [line.slice(0, i).trim(), line.slice(i + 1).trim()];
    }),
);

const url = env.NEXT_PUBLIC_SUPABASE_URL;
const key =
  env.SUPABASE_SERVICE_ROLE_KEY ||
  env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
  env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
if (!url || !key) throw new Error("Missing Supabase URL or key");

const mimeByExt = {
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".mp4": "video/mp4",
  ".webm": "video/webm",
  ".mov": "video/quicktime",
};

const files = [
  {
    local: "public/images/global-fluency-intro.png",
    object: "intro-thumbnail.png",
    contentType: "image/png",
  },
];

const videoArg = process.argv[2];
const defaultVideo = join(root, "public/videos/global-fluency-intro.mp4");
const videoLocal = videoArg
  ? resolve(process.cwd(), videoArg)
  : existsSync(defaultVideo)
    ? defaultVideo
    : null;

if (videoLocal) {
  const ext = extname(videoLocal).toLowerCase();
  if (ext !== ".mp4") {
    throw new Error("Video must be .mp4 so it matches the CMS URL (intro-video.mp4).");
  }
  files.push({
    local: videoLocal,
    object: "intro-video.mp4",
    contentType: "video/mp4",
    absolute: true,
  });
} else {
  console.log(
    "No video file provided. Upload intro-video.mp4 via the Supabase Dashboard, or pass a path:\n  node scripts/upload-global-fluency-intro.mjs path/to/video.mp4",
  );
}

let ok = 0;
for (const file of files) {
  const path = file.absolute ? file.local : join(root, file.local);
  if (!existsSync(path)) {
    console.error(`FAIL missing local file: ${path}`);
    process.exitCode = 1;
    continue;
  }
  const body = readFileSync(path);
  const endpoint = `${url}/storage/v1/object/global-fluency/${file.object}`;
  const res = await fetch(endpoint, {
    method: "POST",
    headers: {
      apikey: key,
      Authorization: `Bearer ${key}`,
      "Content-Type": file.contentType,
      "x-upsert": "true",
    },
    body,
  });
  const text = await res.text();
  if (!res.ok) {
    console.error(`FAIL ${file.object}: ${res.status} ${text}`);
    process.exitCode = 1;
    continue;
  }
  ok += 1;
  console.log(`OK ${file.object} -> ${url}/storage/v1/object/public/global-fluency/${file.object}`);
}

if (ok > 0) {
  console.log("\nNext: run scripts/global-fluency-intro-urls.sql in the SQL editor.");
  if (!videoLocal) {
    console.log(
      "Then upload intro-video.mp4 to Storage → global-fluency (or re-run this script with the video path).",
    );
  }
}
