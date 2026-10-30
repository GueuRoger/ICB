/**
 * Uploads the three About photos to the public `about` Storage bucket.
 * Requires scripts/about-images-storage.sql (bucket + insert/update policies).
 *
 * Usage: node scripts/upload-about-images.mjs
 * Then run: scripts/about-images-urls.sql
 */
import { readFileSync, existsSync } from "node:fs";
import { resolve, dirname, join } from "node:path";
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

const files = [
  { local: "public/images/about-speaker.png", object: "speaker.png" },
  { local: "public/images/about-engineer.png", object: "engineer.png" },
  { local: "public/images/about-inventor.png", object: "inventor.png" },
];

const results = [];
for (const file of files) {
  const path = join(root, file.local);
  const body = readFileSync(path);
  const endpoint = `${url}/storage/v1/object/about/${file.object}`;
  const res = await fetch(endpoint, {
    method: "POST",
    headers: {
      apikey: key,
      Authorization: `Bearer ${key}`,
      "Content-Type": "image/png",
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
  const publicUrl = `${url}/storage/v1/object/public/about/${file.object}`;
  results.push(publicUrl);
  console.log(`OK ${file.object} -> ${publicUrl}`);
}

if (results.length === files.length) {
  console.log("\nUploads OK. Next: run scripts/about-images-urls.sql in the SQL editor.");
}
