import { writeFileSync } from "node:fs";
import { contentCatalog, entryFrench } from "../src/lib/cms-catalog.ts";
import { courseRecords, newsRecord } from "../src/lib/cms-records.ts";

function sqlText(value: string) {
  if (value.includes("$icb$")) throw new Error("Dollar-quote tag appears in content");
  const pieces: string[] = [];
  let buffer = "";
  const flush = () => {
    if (buffer.length === 0) return;
    pieces.push(`$icb$${buffer}$icb$`);
    buffer = "";
  };
  for (const char of value) {
    if (char === ";" || char === "\n") {
      flush();
      pieces.push(char === ";" ? "chr(59)" : "chr(10)");
    } else if (char !== "\r") {
      buffer += char;
    }
  }
  flush();
  return pieces.length > 0 ? pieces.join(" || ") : "$icb$$icb$";
}

function sql(value: string | number | boolean | null) {
  if (value === null) return "null";
  if (typeof value === "number") return String(value);
  if (typeof value === "boolean") return value ? "true" : "false";
  return sqlText(value);
}

const contentRows = contentCatalog.map((entry) => ({
  page: entry.page,
  section: entry.section,
  content_key: entry.content_key,
  value_en: entry.en,
  value_fr: entryFrench(entry),
}));

const statements = [
  "begin;",
  `delete from public.course_modules where course_id in (select id from public.courses where slug in (${sql("world-stage")}, ${sql("global-fluency")}));`,
  `delete from public.courses where slug in (${sql("world-stage")}, ${sql("global-fluency")});`,
  `delete from public.news where slug = ${sql("black-friday-sale")};`,
];

for (let index = 0; index < contentRows.length; index += 8) {
  const group = contentRows.slice(index, index + 8);
  statements.push(
    `delete from public.site_content where (page, content_key) in (${group
      .map((row) => `(${sql(row.page)}, ${sql(row.content_key)})`)
      .join(", ")});`,
  );
}

for (const row of contentRows) {
  statements.push(
    `insert into public.site_content (page, section, content_key, value_en, value_fr) values (${sql(row.page)}, ${sql(row.section)}, ${sql(row.content_key)}, ${sql(row.value_en)}, ${sql(row.value_fr)});`,
  );
}

for (const course of courseRecords) {
  statements.push(
    `insert into public.courses (slug, name_en, name_fr, description_en, description_fr, short_description_en, short_description_fr, price, currency, thumbnail_url) values (${sql(course.slug)}, ${sql(course.name_en)}, ${sql(course.name_fr)}, ${sql(course.description_en)}, ${sql(course.description_fr)}, ${sql(course.short_description_en)}, ${sql(course.short_description_fr)}, ${sql(course.price)}, ${sql(course.currency)}, ${sql(course.thumbnail_url)});`,
  );
  for (const module of course.modules) {
    statements.push(
      `insert into public.course_modules (course_id, position, title_en, title_fr, description_en, description_fr) select id, ${sql(module.position)}, ${sql(module.title_en)}, ${sql(module.title_fr)}, ${sql(module.description_en)}, ${sql(module.description_fr)} from public.courses where slug = ${sql(course.slug)};`,
    );
  }
}

statements.push(
  `insert into public.news (slug, title_en, title_fr, summary_en, summary_fr, image_url, is_published, type) values (${sql(newsRecord.slug)}, ${sql(newsRecord.title_en)}, ${sql(newsRecord.title_fr)}, ${sql(newsRecord.summary_en)}, ${sql(newsRecord.summary_fr)}, ${sql(newsRecord.image_url)}, ${sql(newsRecord.is_published)}, ${sql(newsRecord.type)});`,
);
statements.push("commit;");

for (const statement of statements) {
  const semicolons = [...statement].filter((char) => char === ";").length;
  if (semicolons !== 1 || !statement.endsWith(";")) {
    throw new Error(`Statement does not have exactly one trailing semicolon: ${statement.slice(0, 120)}`);
  }
  if (statement.length > 3500) {
    throw new Error(`Statement is too long (${statement.length}): ${statement.slice(0, 120)}`);
  }
  const tags = statement.split("$icb$").length - 1;
  if (tags % 2 !== 0) throw new Error(`Unbalanced dollar quote: ${statement.slice(0, 120)}`);
  if (statement.includes("course_videos")) throw new Error("course_videos must not be seeded");
  if (statement.startsWith("insert into public.site_content") && !statement.includes("content_key, value_en, value_fr")) {
    throw new Error(`Truncated site_content insert: ${statement}`);
  }
}

const sqlPath = "scripts/seed-content.sql";
writeFileSync(sqlPath, `${statements.join("\n")}\n`);
console.log(`Wrote ${sqlPath} (${contentRows.length} site_content rows, ${statements.length} statements)`);

const sqlOnly = process.argv.includes("--sql-only");
const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
if (sqlOnly || !url || !key) {
  console.log("SQL file written. Remote insert skipped.");
  process.exit(0);
}

const headers = {
  apikey: key,
  Authorization: `Bearer ${key}`,
  "Content-Type": "application/json",
  Prefer: "return=minimal",
};

async function insert(table: string, body: unknown) {
  const response = await fetch(`${url}/rest/v1/${table}`, {
    method: "POST",
    headers,
    body: JSON.stringify(body),
  });
  if (response.ok) return;
  const detail = await response.text();
  throw new Error(`${table} ${response.status} ${detail}`);
}

try {
  await insert("site_content", contentRows);
  for (const course of courseRecords) {
    await insert("courses", {
      slug: course.slug,
      name_en: course.name_en,
      name_fr: course.name_fr,
      description_en: course.description_en,
      description_fr: course.description_fr,
      short_description_en: course.short_description_en,
      short_description_fr: course.short_description_fr,
      price: course.price,
      currency: course.currency,
      thumbnail_url: course.thumbnail_url,
    });
  }
  const courseResponse = await fetch(
    `${url}/rest/v1/courses?select=id,slug&slug=in.(world-stage,global-fluency)`,
    { headers },
  );
  const courses = (await courseResponse.json()) as { id: string; slug: string }[];
  const modules = courseRecords.flatMap((course) => {
    const id = courses.find((item) => item.slug === course.slug)?.id;
    return course.modules.map((module) => ({ ...module, course_id: id }));
  });
  await insert("course_modules", modules);
  await insert("news", {
    slug: newsRecord.slug,
    title_en: newsRecord.title_en,
    title_fr: newsRecord.title_fr,
    summary_en: newsRecord.summary_en,
    summary_fr: newsRecord.summary_fr,
    image_url: newsRecord.image_url,
    is_published: newsRecord.is_published,
    type: newsRecord.type,
  });
  console.log("Inserted content with the publishable key.");
} catch (error) {
  console.error(error instanceof Error ? error.message : error);
  console.error("Insert was blocked. Run scripts/seed-content.sql in the Supabase SQL editor.");
}
