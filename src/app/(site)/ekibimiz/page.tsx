import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/site/page-hero";
import { CmsImage } from "@/components/site/cms-image";
import { SocialIcon } from "@/components/site/social-icons";
import { Reveal } from "@/components/motion/reveal";
import { getTeam, getTeamPage, getSiteData } from "@cms/lib/fetch";
import { buildMetadata } from "@/lib/seo";

export const revalidate = 3600;

export async function generateMetadata(): Promise<Metadata> {
  const [page, site] = await Promise.all([getTeamPage(), getSiteData()]);
  return buildMetadata({
    seo: page?.seo,
    title: page?.title || "Ekibimiz",
    fallbackDescription: page?.intro,
    siteDefaultOg: site.defaultSeo?.ogImage,
    path: "/ekibimiz",
  });
}

export default async function EkibimizPage() {
  const [page, team] = await Promise.all([getTeamPage(), getTeam()]);

  return (
    <>
      <PageHero
        eyebrow={page?.eyebrow}
        title={page?.title || "Ekibimiz"}
        intro={page?.intro}
      />

      {(page?.bodyTitle || page?.bodyText) && (
        <section className="bg-[var(--color-bg-warm)] py-16 md:py-20">
          <div className="container-edge grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-16">
            {page?.bodyTitle ? (
              <h2 className="font-display text-3xl font-medium leading-tight text-[var(--color-ink)] md:text-4xl">
                {page.bodyTitle as string}
              </h2>
            ) : (
              <span />
            )}
            {page?.bodyText ? (
              <p className="text-[15px] leading-relaxed text-[var(--color-muted-foreground)] md:text-base lg:pt-2">
                {page.bodyText as string}
              </p>
            ) : null}
          </div>
        </section>
      )}

      <section className="bg-[var(--color-bg)] py-20 md:py-28">
        <div className="container-edge grid grid-cols-1 gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
          {team.map((m, i) => (
            <Reveal key={m.slug} delay={(i % 4) * 0.05}>
              <Link href={m.href} className="group block">
                <div className="relative aspect-[3/4] overflow-hidden bg-[var(--color-bg-warm)]">
                  <CmsImage
                    image={m.photo}
                    alt={m.name}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  />
                </div>
                <h3 className="mt-4 font-display text-lg font-medium text-[var(--color-ink)] transition-colors group-hover:text-[var(--color-clay)]">
                  {m.name}
                </h3>
                <p className="text-sm text-[var(--color-clay)]">{m.role}</p>
                {m.bio && (
                  <p className="mt-2 text-sm leading-relaxed text-[var(--color-muted-foreground)]">
                    {m.bio}
                  </p>
                )}
                {m.socials.length > 0 && (
                  <div className="mt-3 flex gap-3 text-[var(--color-meta)]">
                    {m.socials.map((s) => (
                      <span
                        key={s.platform}
                        aria-hidden
                        className="transition-colors group-hover:text-[var(--color-clay)]"
                      >
                        <SocialIcon platform={s.platform} className="size-4" />
                      </span>
                    ))}
                  </div>
                )}
              </Link>
            </Reveal>
          ))}
        </div>
      </section>
    </>
  );
}
