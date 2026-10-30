"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useCopy } from "@/i18n/provider";
import { DocumentTitle } from "@/components/document-title";
import { supabase } from "@/lib/supabase";
import {
  loadMyPrograms,
  MY_COURSE_PATH,
  PROGRAM_VIDEO_PATH,
  type ProgramAccess,
} from "@/lib/my-course";

const sans = { fontFamily: "var(--font-montserrat)" } as const;

export function MyCoursePage() {
  const router = useRouter();
  const text = useCopy("my-course", "shared");
  const [programs, setPrograms] = useState<ProgramAccess[] | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function run() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.replace(`/login?next=${encodeURIComponent(MY_COURSE_PATH)}`);
        return;
      }

      const access = await loadMyPrograms();
      if (cancelled) return;

      if (access.length === 1) {
        router.replace(PROGRAM_VIDEO_PATH[access[0]]);
        return;
      }

      setPrograms(access);
    }

    void run();
    return () => {
      cancelled = true;
    };
  }, [router]);

  if (programs === null) {
    return (
      <div style={{ width: "min(1440px, 100%)", marginInline: "auto", containerType: "inline-size" }}>
        <div style={{ position: "relative", height: "calc(420px * (100cqw / 1440px))", overflow: "hidden" }}>
          <main
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: 1440,
              height: 420,
              transform: "scale(calc(100cqw / 1440px))",
              transformOrigin: "top left",
              background: "#ffffff",
            }}
          >
            <DocumentTitle title={text("title")} description={text("document_description")} />
            <p
              className="absolute top-[180px] left-0 m-0 w-[1440px] text-center text-[18px] leading-[24px] text-[#5c5c5c]"
              style={sans}
            >
              {text("loading")}
            </p>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div style={{ width: "min(1440px, 100%)", marginInline: "auto", containerType: "inline-size" }}>
      <div style={{ position: "relative", height: "calc(520px * (100cqw / 1440px))", overflow: "hidden" }}>
        <main
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: 1440,
            height: 520,
            transform: "scale(calc(100cqw / 1440px))",
            transformOrigin: "top left",
            background: "#ffffff",
          }}
        >
          <DocumentTitle title={text("title")} description={text("document_description")} />
          <h1
            className="absolute top-[72px] left-0 m-0 w-[1440px] text-center text-[36px] leading-[42px] font-bold text-[#061E38]"
            style={sans}
          >
            {text("heading")}
          </h1>

          {programs.length === 0 ? (
            <p
              role="status"
              className="absolute top-[180px] left-[320px] m-0 w-[800px] text-center text-[18px] leading-[28px] text-[#5c5c5c]"
              style={sans}
            >
              {text("empty")}
            </p>
          ) : (
            <>
              <p
                className="absolute top-[140px] left-0 m-0 w-[1440px] text-center text-[16px] leading-[24px] text-[#5c5c5c]"
                style={sans}
              >
                {text("choice_prompt")}
              </p>
              <div className="absolute top-[220px] left-[370px] flex w-[700px] justify-center gap-[24px]">
                {programs.includes("global-fluency") ? (
                  <a
                    href={PROGRAM_VIDEO_PATH["global-fluency"]}
                    className="flex h-[48px] min-w-[260px] items-center justify-center bg-[#2251FF] px-[24px] text-[15px] leading-[18px] font-semibold text-white"
                    style={sans}
                  >
                    {text("choice_global_fluency")}
                  </a>
                ) : null}
                {programs.includes("world-stage") ? (
                  <a
                    href={PROGRAM_VIDEO_PATH["world-stage"]}
                    className="flex h-[48px] min-w-[260px] items-center justify-center bg-[#061E38] px-[24px] text-[15px] leading-[18px] font-semibold text-white"
                    style={sans}
                  >
                    {text("choice_world_stage")}
                  </a>
                ) : null}
              </div>
            </>
          )}
        </main>
      </div>
    </div>
  );
}
