"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useLocale } from "@/i18n/provider";
import { StudentVideos } from "@/components/student-videos";
import {
  loadMyPrograms,
  MY_COURSE_PATH,
  PROGRAM_VIDEO_PATH,
  type ProgramAccess,
} from "@/lib/my-course";
import { fetchProgramVideos, type ProgramVideo } from "@/lib/program-videos";
import { supabase } from "@/lib/supabase";

const sans = { fontFamily: "var(--font-montserrat)" } as const;

type AccessState = "loading" | "ready" | "denied";

export type ProgramVideoLibraryLabels = {
  playLabel: string;
  loadingLabel: string;
  deniedLabel: string;
  myCourseLabel: string;
};

/**
 * Client gate + player shell.
 * Auth/enrollment/video rows stay client-side because the Supabase JWT lives in the browser;
 * RSC pages only pass serializable translated labels.
 */
export function ProgramVideoLibrary({
  program,
  playLabel,
  loadingLabel,
  deniedLabel,
  myCourseLabel,
}: {
  program: ProgramAccess;
} & ProgramVideoLibraryLabels) {
  const router = useRouter();
  const locale = useLocale();
  const [access, setAccess] = useState<AccessState>("loading");
  const [videos, setVideos] = useState<ProgramVideo[]>([]);

  useEffect(() => {
    let cancelled = false;

    async function boot() {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (cancelled) return;

      if (!user) {
        router.replace(`/login?next=${encodeURIComponent(PROGRAM_VIDEO_PATH[program])}`);
        return;
      }

      const programs = await loadMyPrograms();
      if (cancelled) return;

      if (!programs.includes(program)) {
        setAccess("denied");
        return;
      }

      const rows = await fetchProgramVideos(program, locale);
      if (cancelled) return;
      setVideos(rows);
      setAccess("ready");
    }

    void boot();
    return () => {
      cancelled = true;
    };
  }, [locale, program, router]);

  if (access === "loading") {
    return (
      <p
        className="mx-auto my-16 max-w-[1440px] px-6 text-center text-[16px] leading-[24px] text-[#787B82]"
        style={sans}
      >
        {loadingLabel}
      </p>
    );
  }

  if (access === "denied") {
    return (
      <div className="mx-auto my-16 max-w-[720px] px-6 text-center">
        <p className="m-0 text-[18px] leading-[28px] text-[#5c5c5c]" style={sans}>
          {deniedLabel}
        </p>
        <a
          href={MY_COURSE_PATH}
          className="mt-6 inline-flex h-[44px] items-center justify-center bg-[#2251FF] px-6 text-[15px] font-semibold text-white"
          style={sans}
        >
          {myCourseLabel}
        </a>
      </div>
    );
  }

  return <StudentVideos program={program} videos={videos} playLabel={playLabel} />;
}
