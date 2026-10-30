"use client";

import { useState } from "react";

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
  const canPlay = Boolean(videoSrc.trim());

  if (playing && canPlay) {
    return (
      <div className={className}>
        <video
          src={videoSrc}
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
