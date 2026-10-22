"use client";

import { useEffect, useRef, useState } from "react";
import { useCopy } from "@/i18n/provider";

const sans = { fontFamily: "var(--font-montserrat)" } as const;
const body = { fontFamily: "var(--font-barlow)" } as const;

const POSTER = { left: 86, width: 698, height: 380 } as const;

type CourseVideo = {
  id: string;
  title: string;
  description: string;
  duration: string;
  youtubeId: string;
  top: number;
};

type YouTubePlayer = {
  loadVideoById: (videoId: string) => void;
  destroy: () => void;
  getIframe: () => HTMLIFrameElement;
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

export function StudentVideos() {
  const text = useCopy("videos");
  const videos: CourseVideo[] = [
    {
      id: text("video_1_number"),
      title: text("video_1_title"),
      description: text("video_1_description"),
      duration: text("video_1_duration"),
      youtubeId: text("video_1_youtube_id"),
      top: 20,
    },
    {
      id: text("video_2_number"),
      title: text("video_2_title"),
      description: text("video_2_description"),
      duration: text("video_2_duration"),
      youtubeId: text("video_2_youtube_id"),
      top: 452,
    },
  ];
  const frameRef = useRef<HTMLDivElement>(null);
  const hostRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<YouTubePlayer | null>(null);
  const pendingId = useRef<string | null>(null);
  const [scale, setScale] = useState(1);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [ready, setReady] = useState(false);

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
            if (pendingId.current) {
              event.target.loadVideoById(pendingId.current);
              pendingId.current = null;
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

  function play(video: CourseVideo) {
    setActiveId(video.id);
    const player = playerRef.current;
    if (!player) {
      pendingId.current = video.youtubeId;
      return;
    }
    player.getIframe().title = video.title;
    player.loadVideoById(video.youtubeId);
  }

  const active = videos.find((video) => video.id === activeId) ?? null;

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
      <div style={{ position: "relative", height: "calc(870px * (100cqw / 1440px))", overflow: "hidden" }}>
        <main
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: 1440,
            height: 870,
            transform: "scale(calc(100cqw / 1440px))",
            transformOrigin: "top left",
            background: "#ffffff",
          }}
        >
          {videos.map((video) => {
            const playing = activeId === video.id;
            return (
              <section key={video.id} className="absolute left-0 h-[400px] w-[1440px]" style={{ top: video.top }}>
                {playing ? (
                  <div className="absolute top-0 left-[86px] h-[380px] w-[698px] bg-black" />
                ) : (
                  <button
                    type="button"
                    onClick={() => play(video)}
                    aria-label={`${text("play")} ${video.title}`}
                    className="absolute top-0 left-[86px] h-[380px] w-[698px] border-0 bg-transparent p-0"
                  >
                    <img
                      src={text("poster")}
                      alt=""
                      width={1672}
                      height={941}
                      className="h-full w-full object-cover"
                    />
                    <img
                      src="/icons/circle-play.svg"
                      alt=""
                      width={72}
                      height={72}
                      className="pointer-events-none absolute top-1/2 left-1/2 h-[72px] w-[72px] -translate-x-1/2 -translate-y-1/2"
                    />
                    <span
                      className="absolute right-[12px] bottom-[10px] flex h-[22px] items-center rounded-[3px] bg-[#061E38] px-[8px] text-[12px] leading-[14px] font-semibold text-white"
                      style={sans}
                    >
                      {video.duration}
                    </span>
                  </button>
                )}

                <h2 className="absolute top-[4px] left-[812px] m-0 flex items-center gap-[24px]">
                  <span className="text-[28px] leading-[32px] font-bold text-[#1764FF]" style={sans}>
                    {video.id}
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
        aria-hidden={active ? undefined : true}
        style={{
          position: "absolute",
          zIndex: 5,
          left: POSTER.left * scale,
          top: (active?.top ?? 0) * scale,
          width: POSTER.width * scale,
          height: POSTER.height * scale,
          visibility: active ? "visible" : "hidden",
          pointerEvents: active ? "auto" : "none",
          background: "#000000",
        }}
      />
    </div>
  );
}
