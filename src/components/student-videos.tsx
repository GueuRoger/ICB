"use client";

import { useEffect, useRef, useState } from "react";
import type { ProgramAccess } from "@/lib/my-course";
import { createProgramVideoSignedUrl, type ProgramVideo } from "@/lib/program-videos";
import { normalizeYoutubeVideoId } from "@/lib/youtube-id";

const sans = { fontFamily: "var(--font-montserrat)" } as const;
const body = { fontFamily: "var(--font-barlow)" } as const;

const POSTER = { left: 86, width: 698, height: 380 } as const;
const FIRST_TOP = 20;
const STEP = 432;
const SECTION_HEIGHT = 400;
const FALLBACK_POSTER = "/images/global-fluency-intro.png";

type CourseVideo = ProgramVideo & { top: number };
type PlaybackMode = "youtube" | "storage" | null;

type YouTubePlayer = {
  loadVideoById: (videoId: string) => void;
  destroy: () => void;
  getIframe: () => HTMLIFrameElement;
  pauseVideo?: () => void;
  stopVideo?: () => void;
};

type YouTubePlayerOptions = {
  videoId?: string;
  width?: string | number;
  height?: string | number;
  playerVars?: Record<string, string | number>;
  events?: {
    onReady?: (event: { target: YouTubePlayer }) => void;
  };
};

declare global {
  interface Window {
    YT?: {
      Player: new (element: HTMLElement, options: YouTubePlayerOptions) => YouTubePlayer;
    };
    onYouTubeIframeAPIReady?: () => void;
  }
}

let youtubeApi: Promise<void> | null = null;

function loadYouTubeApi() {
  if (window.YT?.Player) return Promise.resolve();
  if (youtubeApi) return youtubeApi;
  youtubeApi = new Promise((resolve) => {
    const previous = window.onYouTubeIframeAPIReady;
    window.onYouTubeIframeAPIReady = () => {
      previous?.();
      resolve();
    };
    if (!document.querySelector("script[data-youtube-iframe-api]")) {
      const script = document.createElement("script");
      script.src = "https://www.youtube.com/iframe_api";
      script.async = true;
      script.dataset.youtubeIframeApi = "true";
      document.head.appendChild(script);
    }
  });
  return youtubeApi;
}

function canvasHeight(count: number) {
  if (count <= 0) return 240;
  return FIRST_TOP + (count - 1) * STEP + SECTION_HEIGHT + 50;
}

function prefersStorage(video: CourseVideo) {
  return video.storagePath.trim() !== "";
}

export function StudentVideos({
  program,
  videos: source,
  playLabel,
}: {
  program: ProgramAccess;
  videos: ProgramVideo[];
  playLabel: string;
}) {
  const videos: CourseVideo[] = source.map((video, index) => ({
    ...video,
    top: FIRST_TOP + index * STEP,
  }));
  const frameRef = useRef<HTMLDivElement>(null);
  const hostRef = useRef<HTMLDivElement>(null);
  const htmlVideoRef = useRef<HTMLVideoElement>(null);
  const playerRef = useRef<YouTubePlayer | null>(null);
  const pendingYoutubeId = useRef<string | null>(null);
  const playRequest = useRef(0);
  const [scale, setScale] = useState(1);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [mode, setMode] = useState<PlaybackMode>(null);
  const [storageUrl, setStorageUrl] = useState<string | null>(null);
  const [ready, setReady] = useState(false);
  const [error, setError] = useState("");
  const height = canvasHeight(videos.length);

  useEffect(() => {
    const frame = frameRef.current;
    if (!frame) return;
    const update = () => setScale(frame.clientWidth / 1440);
    update();
    const observer = new ResizeObserver(update);
    observer.observe(frame);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;
    const mount = document.createElement("div");
    mount.style.width = "100%";
    mount.style.height = "100%";
    host.appendChild(mount);
    let cancelled = false;
    let player: YouTubePlayer | null = null;

    loadYouTubeApi().then(() => {
      if (cancelled || !mount.isConnected || !window.YT) return;
      player = new window.YT.Player(mount, {
        width: "100%",
        height: "100%",
        playerVars: {
          autoplay: 0,
          controls: 1,
          fs: 1,
          rel: 0,
          modestbranding: 1,
          playsinline: 1,
          enablejsapi: 1,
          origin: window.location.origin,
        },
        events: {
          onReady: (event) => {
            if (cancelled) {
              event.target.destroy();
              return;
            }
            const iframe = event.target.getIframe();
            iframe.style.width = "100%";
            iframe.style.height = "100%";
            iframe.style.border = "0";
            iframe.setAttribute("allowfullscreen", "");
            iframe.setAttribute(
              "allow",
              "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share; fullscreen",
            );
            playerRef.current = event.target;
            setReady(true);
            if (pendingYoutubeId.current) {
              event.target.loadVideoById(pendingYoutubeId.current);
              pendingYoutubeId.current = null;
            }
          },
        },
      });
    });

    return () => {
      cancelled = true;
      playerRef.current = null;
      setReady(false);
      try {
        player?.destroy();
      } catch {
        // The iframe is removed with the host below.
      }
      host.replaceChildren();
    };
  }, []);

  function stopYouTube() {
    try {
      playerRef.current?.stopVideo?.();
      playerRef.current?.pauseVideo?.();
    } catch {
      // Player may not be ready.
    }
  }

  function stopStorage() {
    const el = htmlVideoRef.current;
    if (!el) return;
    el.pause();
    el.removeAttribute("src");
    el.load();
  }

  async function play(video: CourseVideo) {
    const requestId = ++playRequest.current;
    setActiveId(video.id);
    setError("");

    if (prefersStorage(video)) {
      stopYouTube();
      setMode("storage");
      setStorageUrl(null);
      const signed = await createProgramVideoSignedUrl(program, video.storagePath);
      if (playRequest.current !== requestId) return;
      if (!signed) {
        const youtubeId = normalizeYoutubeVideoId(video.youtubeId);
        // Fall back to YouTube when Storage fails but a usable id exists.
        if (youtubeId) {
          setMode("youtube");
          playYouTube(video);
          return;
        }
        setError("This video could not be loaded. Please try again.");
        return;
      }
      setStorageUrl(signed);
      return;
    }

    stopStorage();
    setStorageUrl(null);
    setMode("youtube");
    playYouTube(video);
  }

  function playYouTube(video: CourseVideo) {
    const youtubeId = normalizeYoutubeVideoId(video.youtubeId);
    const player = playerRef.current;
    if (!player || !youtubeId) {
      pendingYoutubeId.current = youtubeId || null;
      return;
    }
    player.getIframe().title = video.title;
    player.loadVideoById(youtubeId);
  }

  useEffect(() => {
    if (mode !== "storage" || !storageUrl) return;
    const el = htmlVideoRef.current;
    if (!el) return;
    el.src = storageUrl;
    void el.play().catch(() => {
      // Autoplay may be blocked; native controls remain available.
    });
  }, [mode, storageUrl]);

  const active = videos.find((video) => video.id === activeId) ?? null;
  const showYouTube = Boolean(active && mode === "youtube");
  const showStorage = Boolean(active && mode === "storage");

  return (
    <div
      ref={frameRef}
      data-player-ready={ready ? "true" : "false"}
      style={{
        position: "relative",
        width: "min(1440px, 100%)",
        marginInline: "auto",
        containerType: "inline-size",
      }}
    >
      <div style={{ position: "relative", height: `calc(${height}px * (100cqw / 1440px))`, overflow: "hidden" }}>
        <main
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: 1440,
            height,
            transform: "scale(calc(100cqw / 1440px))",
            transformOrigin: "top left",
            background: "#ffffff",
          }}
        >
          {videos.length === 0 ? (
            <p
              className="absolute top-[40px] left-[86px] m-0 text-[16px] leading-[24px] text-[#787B82]"
              style={body}
            >
              —
            </p>
          ) : null}

          {error ? (
            <p
              role="alert"
              className="absolute top-[8px] left-[86px] z-10 m-0 text-[14px] leading-[20px] text-[#061E38]"
              style={sans}
            >
              {error}
            </p>
          ) : null}

          {videos.map((video) => {
            const playing = activeId === video.id;
            const poster = video.thumbnailUrl || FALLBACK_POSTER;
            return (
              <section
                key={video.id}
                className="absolute left-0 h-[400px] w-[1440px]"
                style={{ top: video.top }}
              >
                {playing ? (
                  <div className="absolute top-0 left-[86px] h-[380px] w-[698px] bg-black" />
                ) : (
                  <button
                    type="button"
                    onClick={() => void play(video)}
                    aria-label={`${playLabel} ${video.title}`}
                    className="absolute top-0 left-[86px] h-[380px] w-[698px] border-0 bg-transparent p-0"
                  >
                    <img
                      src={poster}
                      alt=""
                      className="h-full w-full object-contain"
                    />
                    <img
                      src="/icons/circle-play.svg"
                      alt=""
                      width={72}
                      height={72}
                      className="pointer-events-none absolute top-1/2 left-1/2 h-[72px] w-[72px] -translate-x-1/2 -translate-y-1/2"
                    />
                    {video.duration ? (
                      <span
                        className="absolute right-[12px] bottom-[10px] flex h-[22px] items-center rounded-[3px] bg-[#061E38] px-[8px] text-[12px] leading-[14px] font-semibold text-white"
                        style={sans}
                      >
                        {video.duration}
                      </span>
                    ) : null}
                  </button>
                )}

                <h2 className="absolute top-[4px] left-[812px] m-0 flex items-center gap-[24px]">
                  <span className="text-[28px] leading-[32px] font-bold text-[#1764FF]" style={sans}>
                    {video.number}
                  </span>
                  <span className="text-[14px] leading-[18px] font-bold text-[#08112E] uppercase" style={sans}>
                    {video.title}
                  </span>
                </h2>
                <p
                  className="absolute top-[54px] left-[812px] m-0 w-[500px] text-[16px] leading-[26px] font-normal text-[#787B82]"
                  style={body}
                >
                  {video.description}
                </p>
              </section>
            );
          })}
        </main>
      </div>

      <div
        ref={hostRef}
        id="course-player"
        aria-hidden={showYouTube ? undefined : true}
        style={{
          position: "absolute",
          zIndex: 5,
          left: POSTER.left * scale,
          top: (active?.top ?? 0) * scale,
          width: POSTER.width * scale,
          height: POSTER.height * scale,
          visibility: showYouTube ? "visible" : "hidden",
          pointerEvents: showYouTube ? "auto" : "none",
          background: "#000000",
        }}
      />

      <video
        ref={htmlVideoRef}
        controls
        playsInline
        preload="metadata"
        aria-label={active?.title || playLabel}
        style={{
          position: "absolute",
          zIndex: 6,
          left: POSTER.left * scale,
          top: (active?.top ?? 0) * scale,
          width: POSTER.width * scale,
          height: POSTER.height * scale,
          visibility: showStorage ? "visible" : "hidden",
          pointerEvents: showStorage ? "auto" : "none",
          background: "#000000",
          objectFit: "contain",
        }}
      />
    </div>
  );
}
