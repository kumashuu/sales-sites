"use client";

import { useEffect, useState } from "react";

export type HeroBackgroundSlide = { src: string; alt: string };

type Props = {
  slides: HeroBackgroundSlide[];
  /** 既定 5500 */
  intervalMs?: number;
  className?: string;
};

/**
 * ヒーロー全面背景の自動スライド（フェード切替）。
 * 親は `relative`、本コンポーネントは通常 `absolute inset-0`.
 */
export function HeroBackgroundSlider({ slides, intervalMs = 5500, className = "" }: Props) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (slides.length <= 1) return undefined;
    const id = window.setInterval(() => {
      setIndex((i) => (i + 1) % slides.length);
    }, intervalMs);
    return () => window.clearInterval(id);
  }, [slides.length, intervalMs]);

  if (slides.length === 0) return null;

  if (slides.length === 1) {
    const s = slides[0];
    return (
      <div
        className={`bg-cover bg-center bg-no-repeat ${className}`}
        style={{ backgroundImage: `url('${s.src}')` }}
        role="img"
        aria-label={s.alt}
      />
    );
  }

  return (
    <div className={`${className} overflow-hidden`}>
      {slides.map((s, i) => (
        <div
          key={s.src}
          className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-opacity duration-1000 ease-in-out motion-reduce:transition-none"
          style={{
            backgroundImage: `url('${s.src}')`,
            opacity: i === index ? 1 : 0,
          }}
          aria-hidden={i !== index}
        />
      ))}
      <span className="sr-only">{slides[index]?.alt}</span>
    </div>
  );
}
