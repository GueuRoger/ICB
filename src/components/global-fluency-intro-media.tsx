"use client";

import { useState } from "react";
import { normalizeYoutubeVideoId } from "@/lib/youtube-id";

type GlobalFluencyIntroMediaProps = {
  imageSrc: string;
  imageAlt: string;
  videoSrc: string;
  playLabel: string;
  /** Outer wrapper classes. Defaults match Global Fluency. */
  className?: string;
  /** Thumbnail / video element classes. */
  mediaClassName?: string;
  /** Centered play icon classes. */
  playClassName?: string;
};

const defaultWrap = "relative w-full max-w-[576px] shrink-0";
const defaultMedia = "block h-auto w-full object-contain";
const defaultPlay =
  "pointer-events-none absolute top-1/2 left-1/2 h-[76px] w-[76px] -translate-x-1/2 -translate-y-1/2";

type IntroVideoSource =
  | { type: "youtube"; id: string }
  | { type: "file"; src: string };

/** Detect YouTube (watch / youtu.be / embed / bare id) vs direct file/Storage URL. */
function resolveIntroVideo(raw: string): IntroVideoSource | null {
  const value = raw.trim();
  if (!value) return null;

  const looksYoutube =
    /(?:^|\/\/)(?:www\.)?(?:youtube\.com|m\.youtube\.com|music\.youtube\.com|youtu\.be|youtube-nocookie\.com)\b/i.test(
      value,
    ) || /^[a-zA-Z0-9_-]{6,15}$/.test(value);

  if (looksYoutube) {
    const id = normalizeYoutubeVideoId(value);
    if (id) return { type: "youtube", id };
  }

  return { type: "file", src: value };
}

export function GlobalFluencyIntroMedia({
  imageSrc,
  imageAlt,
  videoSrc,
  playLabel,
  className = defaultWrap,
  mediaClassName = defaultMedia,
  playClassName = defaultPlay,
}: GlobalFluencyIntroMediaProps) {
  const [playing, setPlaying] = useState(false);
  const source = resolveIntroVideo(videoSrc);
  const canPlay = source !== null;

  if (playing && source?.type === "youtube") {
    const embed = new URL(`https://www.youtube.com/embed/${source.id}`);
    embed.searchParams.set("autoplay", "1");
    embed.searchParams.set("rel", "0");
    embed.searchParams.set("modestbranding", "1");
    embed.searchParams.set("playsinline", "1");

    return (
      <div className={className}>
        <iframe
          src={embed.toString()}
          title={imageAlt || playLabel}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share; fullscreen"
          allowFullScreen
          className="aspect-video w-full border-0"
        />
      </div>
    );
  }

  if (playing && source?.type === "file") {
    return (
      <div className={className}>
        <video
          src={source.src}
          poster={imageSrc}
          controls
          autoPlay
          playsInline
          className={mediaClassName}
        />
      </div>
    );
  }

  return (
    <div className={className}>
      {canPlay ? (
        <button
          type="button"
          onClick={() => setPlaying(true)}
          aria-label={playLabel}
          className="relative block w-full cursor-pointer border-0 bg-transparent p-0 text-left"
        >
          <img
            src={imageSrc}
            alt={imageAlt}
            width={1672}
            height={941}
            className={mediaClassName}
          />
          <img
            src="/icons/circle-play.svg"
            alt=""
            width={76}
            height={76}
            className={playClassName}
          />
        </button>
      ) : (
        <>
          <img
            src={imageSrc}
            alt={imageAlt}
            width={1672}
            height={941}
            className={mediaClassName}
          />
          <img
            src="/icons/circle-play.svg"
            alt=""
            width={76}
            height={76}
            className={playClassName}
          />
        </>
      )}
    </div>
  );
}
