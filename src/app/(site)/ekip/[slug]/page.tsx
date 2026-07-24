import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  EnvelopeSimple,
  Phone,
  WhatsappLogo,
} from "@phosphor-icons/react/dist/ssr";
import { CmsImage } from "@/components/site/cms-image";
import { SocialIcon } from "@/components/site/social-icons";
import { Reveal } from "@/components/motion/reveal";
import { SaveContactButton } from "@/components/team/save-contact-button";
import { Button } from "@/components/ui/button";
import {
  getSiteData,
  getTeamMember,
  getTeamSlugs,
} from "@cms/lib/fetch";
import { buildMetadata, SITE_URL } from "@/lib/seo";

function telHref(phone: string) {
  return `tel:${phone.replace(/\D/g, "")}`;
}

export const revalidate = 3600;

function whatsappHref(phone: string) {
  const digits = phone.replace(/\D/g, "");
  if (!digits) return null;
  return `https://wa.me/${digits}`;
}

export async function generateStaticParams() {
  const slugs = await getTeamSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const [member, site] = await Promise.all([
    getTeamMember(slug),
    getSiteData(),
  ]);
  if (!member) return {};
  return buildMetadata({
    seo: member.seo,
    title: member.name,
    fallbackDescription:
      member.bio || `${member.name} · ${member.role} · Proje 01`,
    contentImage: member.photo,
    siteDefaultOg: site.defaultSeo?.ogImage,
    path: `/ekip/${slug}`,
  });
}

export default async function TeamMemberCardPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const [member, site] = await Promise.all([
    getTeamMember(slug),
    getSiteData(),
  ]);
  if (!member) notFound();

  const pageUrl = `${SITE_URL}/ekip/${member.slug}`;
  const wa = member.phone ? whatsappHref(member.phone) : null;
  const hasContact = !!(member.email || member.phone || wa);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: member.name,
    jobTitle: member.role,
    description: member.bio,
    image: member.photo?.src,
    email: member.email,
    telephone: member.phone,
    url: pageUrl,
    worksFor: {
      "@type": "Organization",
      name: site.name || "Proje 01",
      url: SITE_URL,
    },
    sameAs: member.socials.map((s) => s.href),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <section className="relative min-h-[100dvh] overflow-hidden bg-[var(--color-bg-warm)]">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(181,83,41,0.08),_transparent_55%)]"
        />

        <div className="container-edge relative flex min-h-[100dvh] flex-col pb-10 pt-28 md:pb-16 md:pt-36">
          <Link
            href="/ekibimiz"
            className="inline-flex w-fit items-center gap-2 text-sm font-medium text-[var(--color-meta)] transition-colors hover:text-[var(--color-clay)]"
          >
            <ArrowLeft className="size-4" />
            Ekibimiz
          </Link>

          <div className="mx-auto flex w-full max-w-xl flex-1 flex-col justify-center py-10 md:py-14">
            <Reveal className="overflow-hidden rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg)] shadow-[0_24px_60px_-28px_rgba(18,20,20,0.28)]">
              <div className="relative aspect-[4/5] w-full bg-[var(--color-bg-warm)] sm:aspect-[5/6]">
                {member.photo ? (
                  <CmsImage
                    image={member.photo}
                    alt={member.name}
                    fill
                    priority
                    sizes="(max-width: 640px) 100vw, 576px"
                    className="object-cover"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center font-display text-6xl font-medium text-[var(--color-clay)]/40">
                    {member.name
                      .split(" ")
                      .slice(0, 2)
                      .map((p) => p[0])
                      .join("")}
                  </div>
                )}
                <div
                  aria-hidden
                  className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-[var(--color-bg)] to-transparent"
                />
              </div>

              <div className="relative -mt-10 px-6 pb-8 pt-0 sm:px-8 sm:pb-10">
                <p className="text-xs font-medium uppercase tracking-[0.2em] text-[var(--color-clay)]">
                  {site.name || "Proje 01"}
                </p>
                <h1 className="mt-2 font-display text-3xl font-medium leading-[1.1] tracking-tight text-[var(--color-ink)] sm:text-4xl">
                  {member.name}
                </h1>
                <p className="mt-2 text-base text-[var(--color-muted-foreground)]">
                  {member.role}
                </p>

                {member.bio ? (
                  <p className="mt-5 max-w-prose text-[15px] leading-relaxed text-[var(--color-muted-foreground)]">
                    {member.bio}
                  </p>
                ) : null}

                {hasContact ? (
                  <div className="mt-7 space-y-3 border-t border-[var(--color-border)] pt-6">
                    {member.phone ? (
                      <a
                        href={telHref(member.phone)}
                        className="flex items-center gap-3 text-sm text-[var(--color-ink)] transition-colors hover:text-[var(--color-clay)]"
                      >
                        <span className="flex size-9 items-center justify-center rounded-full bg-[var(--color-bg-warm)] text-[var(--color-clay)]">
                          <Phone className="size-4" weight="bold" />
                        </span>
                        {member.phone}
                      </a>
                    ) : null}
                    {member.email ? (
                      <a
                        href={`mailto:${member.email}`}
                        className="flex items-center gap-3 text-sm text-[var(--color-ink)] transition-colors hover:text-[var(--color-clay)]"
                      >
                        <span className="flex size-9 items-center justify-center rounded-full bg-[var(--color-bg-warm)] text-[var(--color-clay)]">
                          <EnvelopeSimple className="size-4" weight="bold" />
                        </span>
                        {member.email}
                      </a>
                    ) : null}
                    {wa ? (
                      <a
                        href={wa}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center gap-3 text-sm text-[var(--color-ink)] transition-colors hover:text-[var(--color-clay)]"
                      >
                        <span className="flex size-9 items-center justify-center rounded-full bg-[var(--color-bg-warm)] text-[var(--color-clay)]">
                          <WhatsappLogo className="size-4" weight="bold" />
                        </span>
                        WhatsApp
                      </a>
                    ) : null}
                  </div>
                ) : null}

                {member.socials.length > 0 ? (
                  <div className="mt-6 flex flex-wrap gap-3">
                    {member.socials.map((s) => (
                      <a
                        key={s.platform}
                        href={s.href}
                        target="_blank"
                        rel="noreferrer"
                        aria-label={`${member.name} ${s.label}`}
                        className="flex size-10 items-center justify-center rounded-full border border-[var(--color-border)] text-[var(--color-meta)] transition-colors hover:border-[var(--color-clay)] hover:text-[var(--color-clay)]"
                      >
                        <SocialIcon platform={s.platform} className="size-4" />
                      </a>
                    ))}
                  </div>
                ) : null}

                <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                  <SaveContactButton
                    name={member.name}
                    role={member.role}
                    email={member.email}
                    phone={member.phone}
                    url={pageUrl}
                    org={site.name || "Proje 01"}
                  />
                  {member.phone ? (
                    <Button asChild size="lg" className="w-full sm:w-auto">
                      <a href={telHref(member.phone)}>
                        <Phone className="size-4" weight="bold" />
                        Ara
                      </a>
                    </Button>
                  ) : null}
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>
    </>
  );
}
