"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import {
  animate,
  motion,
  useInView,
  useReducedMotion,
} from "motion/react";
import { cn } from "@/lib/utils";
import type { LandingData } from "@cms/lib/types";

// Fixed editorial structure for the headline; gallery slots are filled from the
// CMS (statementGalleryA / statementGalleryB). Clusters keep a word + image on one
// line on narrow viewports (e.g. "sunan" + inline gallery).
const SEGMENTS = [
  { type: "text", text: "Proje 01", underline: false },
  { type: "gallery" },
  { type: "text", text: "mimarlık, ve anahtar teslim tadilat", underline: true },
  { type: "text", text: " alanlarında hizmet ", underline: false },
  {
    type: "cluster",
    parts: [
      { type: "text", text: "sunan", underline: false },
      { type: "gallery" },
    ],
  },
  { type: "text", text: " tasarım stüdyosudur.", underline: true },
] as const;

function InlineGallery({ images }: { images: string[] }) {
  const [index, setIndex] = useState(0);
  const reduce = useReducedMotion();

  useEffect(() => {
    if (reduce || images.length < 2) return;
    const id = setInterval(
      () => setIndex((p) => (p + 1) % images.length),
      1500
    );
    return () => clearInterval(id);
  }, [images.length, reduce]);

  if (!images.length) return null;

  return (
    <span className="relative mx-[0.12em] inline-block h-[0.82em] w-[1.35em] shrink-0 translate-y-[0.1em] overflow-hidden align-baseline">
      {images.map((src, i) => (
        <Image
          key={src}
          src={src}
          alt=""
          fill
          sizes="120px"
          aria-hidden
          className={cn(
            "object-cover transition-opacity duration-700 ease-out",
            i === index ? "opacity-100" : "opacity-0"
          )}
        />
      ))}
    </span>
  );
}

function Counter({ value, suffix }: { value: number; suffix: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.5 });
  const reduce = useReducedMotion();
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (!reduce && !inView) return;
    const controls = animate(0, value, {
      duration: reduce ? 0 : 1.6,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (v) => setDisplay(Math.round(v)),
    });
    return () => controls.stop();
  }, [inView, value, reduce]);

  return (
    <span ref={ref} className="tabular-nums">
      {display}
      {suffix}
    </span>
  );
}

export function StatementStats({ data }: { data: LandingData["statement"] }) {
  const reduce = useReducedMotion();
  const galleries = [data.galleryA, data.galleryB];
  const hasGalleries = galleries.some((g) => g.length > 0);
  const collage = data.collage.slice(0, 5);

  let galleryIndex = 0;

  const renderGallery = (key: string) => {
    const images = galleries[galleryIndex++] ?? [];
    return <InlineGallery key={key} images={images} />;
  };

  const renderText = (
    text: string,
    underline: boolean | undefined,
    key: string
  ) => (
    <span
      key={key}
      className={cn(
        underline &&
          "underline decoration-1 underline-offset-[0.18em] decoration-white/80"
      )}
    >
      {text}
    </span>
  );

  return (
    <>
      <section className="overflow-hidden bg-[var(--color-ink-deep)] py-24 text-white md:py-32 lg:py-40">
        <div className="container-edge">
          <motion.h2
            initial={reduce ? false : { opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="mx-auto max-w-6xl text-center font-display text-[clamp(2.2rem,5.2vw,4.8rem)] font-medium leading-[1.2] tracking-tight"
          >
            {hasGalleries ? (
              SEGMENTS.map((seg, i) => {
                if (seg.type === "gallery") {
                  return renderGallery(`gallery-${i}`);
                }
                if (seg.type === "cluster") {
                  return (
                    <span
                      key={i}
                      className="inline-flex items-baseline whitespace-nowrap align-baseline"
                    >
                      {seg.parts.map((part, j) =>
                        part.type === "gallery"
                          ? renderGallery(`cluster-${i}-${j}`)
                          : renderText(part.text, part.underline, `cluster-${i}-${j}`)
                      )}
                    </span>
                  );
                }
                return renderText(seg.text, seg.underline, `text-${i}`);
              })
            ) : (
              <span>{data.title}</span>
            )}
          </motion.h2>

          {collage.length >= 5 && (
            <div className="mt-16 grid grid-cols-12 gap-3 md:mt-24 md:gap-4">
              {[
                "relative col-span-5 aspect-[636/780] overflow-hidden md:col-span-4",
                "relative col-span-7 col-start-6 aspect-[1051/884] overflow-hidden md:col-span-7 md:col-start-5 md:mt-16",
                "relative col-span-5 aspect-[636/780] overflow-hidden md:col-span-3",
                "relative col-span-4 aspect-[636/780] overflow-hidden md:col-span-3",
                "relative col-span-3 col-start-10 aspect-[636/780] overflow-hidden md:col-span-3",
              ].map((cls, i) => (
                <motion.div
                  key={collage[i].image}
                  initial={reduce ? false : { opacity: 0, y: 36 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{
                    duration: 0.8,
                    delay: (i % 3) * 0.1,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                  className={cls}
                >
                  <Image
                    src={collage[i].image}
                    alt={collage[i].alt}
                    fill
                    sizes="(max-width: 768px) 45vw, 25vw"
                    className="object-cover"
                  />
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {data.stats.length > 0 && (
        <section className="bg-[var(--color-bg-warm)] py-12 md:py-20">
          <div className="container-edge">
            <div className="mx-auto flex max-w-[18rem] flex-col divide-y divide-[var(--color-border-warm)] sm:max-w-none sm:grid sm:grid-cols-3 sm:divide-x sm:divide-y-0">
              {data.stats.map((s, i) => (
                <motion.div
                  key={s.label}
                  initial={reduce ? false : { opacity: 0, y: 14 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.45 }}
                  transition={{
                    duration: 0.6,
                    delay: i * 0.07,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                  className="flex flex-col items-center gap-1.5 py-7 text-center first:pt-0 last:pb-0 sm:gap-2.5 sm:px-8 sm:py-0"
                >
                  <div className="font-display text-4xl font-medium leading-none tracking-tight text-[var(--color-ink)] sm:text-5xl md:text-6xl">
                    <Counter value={s.value} suffix={s.suffix} />
                  </div>
                  <p className="max-w-[15rem] text-[0.8125rem] leading-snug text-[var(--color-muted-foreground)] sm:max-w-[10rem] sm:text-sm">
                    {s.label}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
