"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
} from "motion/react";
import { CaretDown, List, X } from "@phosphor-icons/react";
import { SocialIcon } from "@/components/site/social-icons";
import { cn } from "@/lib/utils";
import type { SiteData } from "@cms/lib/types";

/** Routes whose first viewport is light (no dark PageHero) — ink header from top. */
function isLightTopRoute(pathname: string | null) {
  if (!pathname) return false;
  return pathname === "/ekip" || pathname.startsWith("/ekip/");
}

function Wordmark({
  site,
  className,
}: {
  site: SiteData;
  className?: string;
}) {
  if (site.logo?.src) {
    return (
      <Image
        src={site.logo.src}
        alt={site.wordmark || "Proje 01"}
        width={120}
        height={32}
        className={cn("h-7 w-auto object-contain", className)}
        priority
      />
    );
  }
  return (
    <span className={cn("text-xl font-semibold tracking-tight", className)}>
      {site.wordmark}
    </span>
  );
}

function MobileNavAccordion({
  item,
  expanded,
  onToggle,
  onNavigate,
  reduceMotion,
}: {
  item: SiteData["nav"][number];
  expanded: boolean;
  onToggle: () => void;
  onNavigate: () => void;
  reduceMotion: boolean;
}) {
  const children = item.children ?? [];

  return (
    <div className="border-b border-[var(--color-border-warm)] py-2">
      <div className="flex items-center gap-1">
        <Link
          href={item.href}
          onClick={onNavigate}
          className="min-w-0 flex-1 py-3 font-display text-2xl text-[var(--color-ink)]"
        >
          {item.label}
        </Link>
        <button
          type="button"
          onClick={onToggle}
          aria-expanded={expanded}
          aria-controls={`mobile-nav-${item.label}`}
          className="inline-flex size-10 shrink-0 items-center justify-center text-[var(--color-ink)]"
        >
          <CaretDown
            className={cn(
              "size-5 transition-transform duration-200",
              expanded && "rotate-180"
            )}
            weight="bold"
          />
          <span className="sr-only">
            {expanded ? `${item.label} alt menüsünü kapat` : `${item.label} alt menüsünü aç`}
          </span>
        </button>
      </div>
      <AnimatePresence initial={false}>
        {expanded && (
          <motion.ul
            id={`mobile-nav-${item.label}`}
            initial={reduceMotion ? false : { height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={reduceMotion ? undefined : { height: 0, opacity: 0 }}
            transition={{ duration: reduceMotion ? 0 : 0.25, ease: "easeOut" }}
            className="overflow-hidden"
          >
            {children.map((c) => (
              <li key={c.href + c.label}>
                <Link
                  href={c.href}
                  onClick={onNavigate}
                  className="block py-1.5 pl-1 text-base text-[var(--color-muted-foreground)] transition-colors hover:text-[var(--color-clay)]"
                >
                  {c.label}
                </Link>
              </li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
}

export function Header({ site }: { site: SiteData }) {
  const pathname = usePathname();
  const lightTop = isLightTopRoute(pathname);
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [expandedSections, setExpandedSections] = useState<Set<string>>(
    () => new Set()
  );
  const reduceMotion = useReducedMotion() ?? false;
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (y) => {
    setScrolled(y > 40);
  });

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const toggleSection = (label: string) => {
    setExpandedSections((prev) => {
      const next = new Set(prev);
      if (next.has(label)) next.delete(label);
      else next.add(label);
      return next;
    });
  };

  const closeMenu = () => {
    setOpen(false);
    setExpandedSections(new Set());
  };

  // Light-top pages (e.g. /ekip/[slug]) need ink text even before scroll.
  const solid = scrolled || lightTop;
  const textBase = solid ? "text-[var(--color-ink)]" : "text-white";

  return (
    <>
      <header
        className={cn(
          "fixed inset-x-0 top-0 z-50 transition-colors duration-500",
          solid
            ? "border-b border-[var(--color-border-warm)] bg-[var(--color-bg)]/90 backdrop-blur-md"
            : "bg-transparent"
        )}
      >
        <div className="container-edge flex h-16 items-center md:h-20">
          <Link
            href="/"
            className={cn("transition-colors", textBase)}
            aria-label="Proje 01 ana sayfa"
          >
            <Wordmark
              site={site}
              className={site.logo?.src && !solid ? "brightness-0 invert" : ""}
            />
          </Link>

          <div className="ml-auto hidden items-center gap-8 lg:flex">
            <nav className="flex items-center gap-8" aria-label="Ana menü">
              {site.nav.map((item) => {
                const children = item.children ?? [];
                return (
                  <div key={item.label} className="group relative">
                    <Link
                      href={item.href}
                      className={cn(
                        "flex items-center gap-1 py-2 text-sm font-medium transition-colors hover:text-[var(--color-clay)]",
                        textBase
                      )}
                    >
                      {item.label}
                      {children.length > 0 && (
                        <CaretDown
                          className="size-3.5 opacity-60"
                          weight="bold"
                        />
                      )}
                    </Link>
                    {children.length > 0 && (
                      <div className="invisible absolute right-0 top-full w-56 pt-2 opacity-0 transition-all duration-200 group-hover:visible group-hover:opacity-100">
                        <ul className="rounded-lg border border-[var(--color-border-warm)] bg-[var(--color-bg)] p-2 shadow-lg shadow-black/5">
                          {children.map((c) => (
                            <li key={c.href + c.label}>
                              <Link
                                href={c.href}
                                className="block rounded-md px-3 py-2 text-sm text-[var(--color-ink)] transition-colors hover:bg-[var(--color-bg-warm)] hover:text-[var(--color-clay)]"
                              >
                                {c.label}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                );
              })}
            </nav>

            {site.socials.length > 0 && (
              <div className="flex items-center gap-3">
                {site.socials.map((s) => (
                  <a
                    key={s.platform}
                    href={s.href}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={s.label}
                    className={cn(
                      "transition-colors hover:text-[var(--color-clay)]",
                      textBase
                    )}
                  >
                    <SocialIcon platform={s.platform} className="size-5" />
                  </a>
                ))}
              </div>
            )}
          </div>

          <button
            type="button"
            onClick={() => setOpen(true)}
            className={cn(
              "ml-auto inline-flex size-10 items-center justify-center lg:hidden",
              textBase
            )}
            aria-label="Menüyü aç"
          >
            <List className="size-6" />
          </button>
        </div>
      </header>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-[120] flex flex-col bg-[var(--color-bg)] lg:hidden"
          >
            <div className="container-edge flex h-16 shrink-0 items-center justify-between">
              <span className="text-xl font-semibold tracking-tight text-[var(--color-ink)]">
                {site.wordmark}
              </span>
              <button
                type="button"
                onClick={closeMenu}
                className="inline-flex size-10 items-center justify-center text-[var(--color-ink)]"
                aria-label="Menüyü kapat"
              >
                <X className="size-6" />
              </button>
            </div>
            <nav
              className="container-edge flex flex-1 flex-col gap-1 overflow-y-auto overscroll-contain pb-10 pt-2"
              aria-label="Mobil menü"
            >
              {site.nav.map((item) => {
                const children = item.children ?? [];
                if (children.length === 0) {
                  return (
                    <div
                      key={item.label}
                      className="border-b border-[var(--color-border-warm)] py-2"
                    >
                      <Link
                        href={item.href}
                        onClick={closeMenu}
                        className="block py-3 font-display text-2xl text-[var(--color-ink)]"
                      >
                        {item.label}
                      </Link>
                    </div>
                  );
                }

                return (
                  <MobileNavAccordion
                    key={item.label}
                    item={item}
                    expanded={expandedSections.has(item.label)}
                    onToggle={() => toggleSection(item.label)}
                    onNavigate={closeMenu}
                    reduceMotion={reduceMotion}
                  />
                );
              })}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
