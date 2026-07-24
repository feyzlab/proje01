import "server-only";

import { client } from "./client";
import { resolveImage, resolveImages } from "./image";
import {
  allBlogPostsQuery,
  allBlogSlugsQuery,
  blogPageQuery,
  blogPostBySlugQuery,
  aboutPageQuery,
  allProjectSlugsQuery,
  allProjectsQuery,
  allServiceSlugsQuery,
  allServicesQuery,
  contactPageQuery,
  faqPageQuery,
  faqQuery,
  landingQuery,
  projectBySlugQuery,
  projectsPageQuery,
  serviceBySlugQuery,
  servicesNavQuery,
  servicesPageQuery,
  siteSettingsQuery,
  teamMemberBySlugQuery,
  teamPageQuery,
  teamQuery,
  allTeamSlugsQuery,
  testimonialsPageQuery,
  testimonialsQuery,
} from "./queries";
import type {
  Img,
  LandingData,
  NavItem,
  ProjectCard,
  ServiceCard,
  SiteData,
  Social,
  Testimonial,
} from "./types";
import { landing as fb, site as fbSite } from "@/content/site";

export const TAGS = {
  settings: "siteSettings",
  landing: "landingPage",
  service: "service",
  project: "project",
  team: "teamMember",
  testimonial: "testimonial",
  faq: "faq",
  partnerLogo: "partnerLogo",
  blogPost: "blogPost",
  pages: "pages",
} as const;

const SOCIAL_LABELS: Record<string, string> = {
  instagram: "Instagram",
  behance: "Behance",
  twitter: "Twitter / X",
  pinterest: "Pinterest",
  linkedin: "LinkedIn",
  facebook: "Facebook",
  youtube: "YouTube",
  whatsapp: "WhatsApp",
};

async function fetchCached<T>(
  query: string,
  params: Record<string, unknown>,
  tags: string[]
): Promise<T | null> {
  try {
    return await client.fetch<T>(query, params, {
      next: { tags, revalidate: 3600 },
    });
  } catch (err) {
    console.error("[sanity] fetch failed:", err);
    return null;
  }
}

// ---------------------------------------------------------------------------
// Site settings (header / footer)
// ---------------------------------------------------------------------------

function fallbackSite(): SiteData {
  return {
    name: fbSite.name,
    wordmark: fbSite.wordmark,
    logo: null,
    email: fbSite.email,
    address: fbSite.address,
    legal: fbSite.legal,
    builtBy: fbSite.builtBy,
    footerBlurb: fb.footer.blurb,
    nav: fbSite.nav.map((n) => ({
      label: n.label,
      href: n.href,
      children: "children" in n ? [...n.children] : undefined,
    })),
    socials: fbSite.socials.map((s) => ({
      platform: s.label.toLowerCase(),
      label: s.label,
      href: s.href,
    })),
  };
}

export async function getSiteData(): Promise<SiteData> {
  const [doc, servicesNav] = await Promise.all([
    fetchCached<Record<string, unknown> | null>(
      siteSettingsQuery,
      {},
      [TAGS.settings, TAGS.service]
    ),
    fetchCached<{ label: string; href: string }[]>(
      servicesNavQuery,
      {},
      [TAGS.service]
    ),
  ]);

  if (!doc) return fallbackSite();

  const d = doc as {
    wordmark?: string;
    logo?: Parameters<typeof resolveImage>[0];
    email?: string;
    phone?: string;
    address?: string;
    legal?: string;
    builtBy?: string;
    footerBlurb?: string;
    nav?: {
      label: string;
      href: string;
      autoChildrenFromServices?: boolean;
      children?: { label: string; href: string }[];
    }[];
    socials?: { platform: string; href?: string }[];
    defaultSeo?: unknown;
  };

  const nav: NavItem[] = (d.nav ?? []).map((n) => ({
    label: n.label,
    href: n.href,
    autoChildrenFromServices: n.autoChildrenFromServices,
    children: n.autoChildrenFromServices
      ? servicesNav ?? []
      : n.children ?? undefined,
  }));

  const socials: Social[] = (d.socials ?? [])
    .filter((s) => !!s.href)
    .map((s) => ({
      platform: s.platform,
      label: SOCIAL_LABELS[s.platform] ?? s.platform,
      href: s.href as string,
    }));

  const fallback = fallbackSite();

  return {
    name: fbSite.name,
    wordmark: d.wordmark || fallback.wordmark,
    logo: resolveImage(d.logo ?? null, "Proje 01"),
    email: d.email || fallback.email,
    phone: d.phone,
    address: d.address || fallback.address,
    legal: d.legal || fallback.legal,
    builtBy: d.builtBy || fallback.builtBy,
    footerBlurb: d.footerBlurb || fallback.footerBlurb,
    nav: nav.length ? nav : fallback.nav,
    // When the settings doc exists, respect its socials list verbatim — an
    // empty list means the icons are intentionally hidden until URLs are added.
    socials,
    defaultSeo: (d.defaultSeo as SiteData["defaultSeo"]) ?? undefined,
  };
}

// ---------------------------------------------------------------------------
// Landing page
// ---------------------------------------------------------------------------

function fallbackLanding(): LandingData {
  const galleries = fb.statement.segments
    .filter((s) => s.type === "gallery")
    .map((s) => ("images" in s ? (s.images as readonly string[]) : []));
  return {
    hero: {
      title: fb.hero.title,
      intro: fb.hero.intro,
      image: { src: fb.hero.image, alt: fb.hero.imageAlt },
      imageAlt: fb.hero.imageAlt,
    },
    featured: {
      eyebrow: fb.featured.eyebrow,
      title: fb.featured.title,
      projects: fb.featured.projects.map((p) => ({
        title: p.title,
        subtitle: p.subtitle,
        image: { src: p.image, alt: p.title },
        href: p.href,
      })),
    },
    services: {
      eyebrow: fb.services.eyebrow,
      title: fb.services.title,
      items: fb.services.items.map((s) => ({
        title: s.title,
        excerpt: s.body,
        href: "/hizmetler",
        image: null,
      })),
    },
    statement: {
      title: fb.statement.title,
      galleryA: [...(galleries[0] ?? [])],
      galleryB: [...(galleries[1] ?? [])],
      collage: fb.statement.collage.map((c) => ({ image: c.image, alt: c.alt })),
      stats: fb.statement.stats.map((s) => ({ ...s })),
    },
    process: {
      eyebrow: fb.process.eyebrow,
      title: fb.process.title,
      body: fb.process.body,
      body2: fb.process.body2,
      tabs: fb.process.tabs.map((t) => ({ title: t.title, image: t.image })),
    },
    testimonials: {
      eyebrow: fb.testimonials.eyebrow,
      title: fb.testimonials.title,
      items: fb.testimonials.items.map((t) => ({
        quote: t.quote,
        name: t.name,
        role: t.role,
      })),
    },
    contact: {
      eyebrow: fb.contact.eyebrow,
      title: fb.contact.title,
      marqueeText: fb.contact.marqueeText,
      image: { src: fb.contact.image, alt: "Proje 01 iç mekan" },
      clientsTitle: fb.clients.title,
    },
    clients: {
      logos: fb.clients.logos.map((l) => ({ src: l.src, alt: l.alt })),
    },
  };
}

type RawImg = Parameters<typeof resolveImage>[0];

export async function getLanding(): Promise<LandingData> {
  const doc = await fetchCached<Record<string, unknown> | null>(
    landingQuery,
    {},
    [
      TAGS.landing,
      TAGS.project,
      TAGS.service,
      TAGS.testimonial,
      TAGS.partnerLogo,
    ]
  );

  if (!doc) return fallbackLanding();
  const d = doc as Record<string, unknown>;
  const fbl = fallbackLanding();

  const str = (k: string, f: string) => (d[k] as string) || f;
  const galleryToSrc = (k: string): string[] =>
    resolveImages(d[k] as RawImg[]).map((i) => i.src);

  const featured = (
    (d.featuredProjects as
      | { title: string; subtitle?: string; image: RawImg; href: string }[]
      | undefined) ?? []
  ).map((p) => ({
    title: p.title,
    subtitle: p.subtitle,
    image: resolveImage(p.image, p.title),
    href: p.href,
  }));

  const services = (
    (d.highlightServices as
      | { title: string; excerpt: string; icon?: string; image: RawImg; href: string }[]
      | undefined) ?? []
  ).map((s) => ({
    title: s.title,
    excerpt: s.excerpt,
    icon: s.icon,
    image: resolveImage(s.image, s.title),
    href: s.href,
  }));

  const testimonials = (
    (d.highlightTestimonials as Testimonial[] | undefined) ?? []
  ).map((t) => ({ quote: t.quote, name: t.name, role: t.role }));

  const logos = (
    (d.logos as { src?: string; name?: string }[] | undefined) ?? []
  )
    .filter((l) => !!l.src)
    .map((l) => ({ src: l.src as string, alt: l.name || "İş ortağı logosu" }));

  return {
    hero: {
      title: str("heroTitle", fbl.hero.title),
      intro: str("heroIntro", fbl.hero.intro),
      image: resolveImage(d.heroImage as RawImg, "Proje 01") ?? fbl.hero.image,
    },
    featured: {
      eyebrow: str("featuredEyebrow", fbl.featured.eyebrow),
      title: str("featuredTitle", fbl.featured.title),
      projects: featured.length ? featured : fbl.featured.projects,
    },
    services: {
      eyebrow: str("servicesEyebrow", fbl.services.eyebrow),
      title: str("servicesTitle", fbl.services.title),
      items: services.length ? services : fbl.services.items,
    },
    statement: {
      title: str("statementTitle", fbl.statement.title),
      galleryA: galleryToSrc("statementGalleryA").length
        ? galleryToSrc("statementGalleryA")
        : fbl.statement.galleryA,
      galleryB: galleryToSrc("statementGalleryB").length
        ? galleryToSrc("statementGalleryB")
        : fbl.statement.galleryB,
      collage: resolveImages(d.statementCollage as RawImg[]).length
        ? resolveImages(d.statementCollage as RawImg[]).map((i) => ({
            image: i.src,
            alt: i.alt,
          }))
        : fbl.statement.collage,
      stats: ((d.stats as LandingData["statement"]["stats"]) ?? []).length
        ? (d.stats as LandingData["statement"]["stats"])
        : fbl.statement.stats,
    },
    process: {
      eyebrow: str("processEyebrow", fbl.process.eyebrow),
      title: str("processTitle", fbl.process.title),
      body: str("processBody", fbl.process.body),
      body2: str("processBody2", fbl.process.body2),
      tabs: (
        (d.processTabs as { title: string; image: RawImg }[] | undefined) ?? []
      ).length
        ? (d.processTabs as { title: string; image: RawImg }[]).map((t) => ({
            title: t.title,
            image: resolveImage(t.image, t.title)?.src ?? "",
          }))
        : fbl.process.tabs,
    },
    testimonials: {
      eyebrow: str("testimonialsEyebrow", fbl.testimonials.eyebrow),
      title: str("testimonialsTitle", fbl.testimonials.title),
      items: testimonials.length ? testimonials : fbl.testimonials.items,
    },
    contact: {
      eyebrow: str("contactEyebrow", fbl.contact.eyebrow),
      title: str("contactTitle", fbl.contact.title),
      marqueeText: str("marqueeText", fbl.contact.marqueeText),
      image: resolveImage(d.contactImage as RawImg, "Proje 01 iç mekan"),
      clientsTitle: str("clientsTitle", fbl.contact.clientsTitle),
    },
    clients: { logos: logos.length ? logos : fbl.clients.logos },
    seo: (d.seo as LandingData["seo"]) ?? undefined,
  };
}

// ---------------------------------------------------------------------------
// Collections
// ---------------------------------------------------------------------------

type ServiceRaw = {
  title: string;
  excerpt: string;
  icon?: string;
  image: RawImg;
  href: string;
  slug: string;
};

export async function getServices(): Promise<(ServiceCard & { slug: string })[]> {
  const rows = await fetchCached<ServiceRaw[]>(allServicesQuery, {}, [
    TAGS.service,
  ]);
  if (!rows?.length) return [];
  return rows.map((s) => ({
    title: s.title,
    excerpt: s.excerpt,
    icon: s.icon,
    image: resolveImage(s.image, s.title),
    href: s.href,
    slug: s.slug,
  }));
}

export async function getServiceSlugs(): Promise<string[]> {
  return (await fetchCached<string[]>(allServiceSlugsQuery, {}, [TAGS.service])) ?? [];
}

export async function getService(slug: string) {
  const s = await fetchCached<{
    title: string;
    excerpt: string;
    icon?: string;
    image: RawImg;
    body?: unknown;
    slug: string;
    seo?: LandingData["seo"];
  } | null>(serviceBySlugQuery, { slug }, [TAGS.service]);
  if (!s) return null;
  return {
    title: s.title,
    excerpt: s.excerpt,
    icon: s.icon,
    image: resolveImage(s.image, s.title),
    body: s.body,
    slug: s.slug,
    seo: s.seo,
  };
}

type ProjectRaw = {
  title: string;
  subtitle?: string;
  location?: string;
  year?: string;
  image: RawImg;
  href: string;
  slug: string;
};

export async function getProjects(): Promise<(ProjectCard & { slug: string })[]> {
  const rows = await fetchCached<ProjectRaw[]>(allProjectsQuery, {}, [
    TAGS.project,
  ]);
  if (!rows?.length) return [];
  return rows.map((p) => ({
    title: p.title,
    subtitle: p.subtitle,
    image: resolveImage(p.image, p.title),
    href: p.href,
    slug: p.slug,
  }));
}

export async function getProjectSlugs(): Promise<string[]> {
  return (await fetchCached<string[]>(allProjectSlugsQuery, {}, [TAGS.project])) ?? [];
}

export async function getProject(slug: string) {
  const p = await fetchCached<{
    title: string;
    subtitle?: string;
    location?: string;
    year?: string;
    image: RawImg;
    gallery?: RawImg[];
    description?: unknown;
    slug: string;
    seo?: LandingData["seo"];
  } | null>(projectBySlugQuery, { slug }, [TAGS.project]);
  if (!p) return null;
  return {
    title: p.title,
    subtitle: p.subtitle,
    location: p.location,
    year: p.year,
    image: resolveImage(p.image, p.title),
    gallery: resolveImages(p.gallery, p.title),
    description: p.description,
    slug: p.slug,
    seo: p.seo,
  };
}

export type TeamMemberData = {
  name: string;
  role: string;
  bio?: string;
  email?: string;
  phone?: string;
  photo: Img | null;
  socials: Social[];
  slug: string;
  href: string;
};

type TeamRaw = {
  name: string;
  role: string;
  bio?: string;
  email?: string;
  phone?: string;
  photo: RawImg;
  socials?: { platform: string; href?: string }[];
  slug?: string;
  seo?: LandingData["seo"];
};

function mapTeamMember(m: TeamRaw): TeamMemberData | null {
  if (!m.slug) return null;
  return {
    name: m.name,
    role: m.role,
    bio: m.bio,
    email: m.email || undefined,
    phone: m.phone || undefined,
    photo: resolveImage(m.photo, m.name),
    socials: (m.socials ?? [])
      .filter((s) => !!s.href)
      .map((s) => ({
        platform: s.platform,
        label: SOCIAL_LABELS[s.platform] ?? s.platform,
        href: s.href as string,
      })),
    slug: m.slug,
    href: `/ekip/${m.slug}`,
  };
}

export async function getTeam(): Promise<TeamMemberData[]> {
  const rows = await fetchCached<TeamRaw[]>(teamQuery, {}, [TAGS.team]);
  if (!rows?.length) return [];
  return rows.map(mapTeamMember).filter((m): m is TeamMemberData => !!m);
}

export async function getTeamSlugs(): Promise<string[]> {
  return (
    (await fetchCached<string[]>(allTeamSlugsQuery, {}, [TAGS.team])) ?? []
  );
}

export async function getTeamMember(slug: string) {
  const m = await fetchCached<TeamRaw | null>(
    teamMemberBySlugQuery,
    { slug },
    [TAGS.team]
  );
  if (!m) return null;
  const mapped = mapTeamMember(m);
  if (!mapped) return null;
  return { ...mapped, seo: m.seo };
}

export async function getTestimonials(): Promise<Testimonial[]> {
  return (
    (await fetchCached<Testimonial[]>(testimonialsQuery, {}, [
      TAGS.testimonial,
    ])) ?? []
  );
}

export async function getFaqs(): Promise<{ question: string; answer: string }[]> {
  return (
    (await fetchCached<{ question: string; answer: string }[]>(faqQuery, {}, [
      TAGS.faq,
    ])) ?? []
  );
}

// ---------------------------------------------------------------------------
// Blog
// ---------------------------------------------------------------------------

export type BlogPostCard = {
  title: string;
  excerpt: string;
  category?: string;
  authorName?: string;
  publishedAt: string;
  image: Img | null;
  href: string;
  slug: string;
};

type BlogRaw = {
  title: string;
  excerpt: string;
  category?: string;
  authorName?: string;
  publishedAt: string;
  image: RawImg;
  href: string;
  slug: string;
};

export async function getBlogPosts(): Promise<BlogPostCard[]> {
  const rows = await fetchCached<BlogRaw[]>(allBlogPostsQuery, {}, [
    TAGS.blogPost,
  ]);
  if (!rows?.length) return [];
  return rows.map((p) => ({
    title: p.title,
    excerpt: p.excerpt,
    category: p.category,
    authorName: p.authorName,
    publishedAt: p.publishedAt,
    image: resolveImage(p.image, p.title),
    href: p.href,
    slug: p.slug,
  }));
}

export async function getBlogSlugs(): Promise<string[]> {
  return (
    (await fetchCached<string[]>(allBlogSlugsQuery, {}, [TAGS.blogPost])) ?? []
  );
}

export async function getBlogPost(slug: string) {
  const p = await fetchCached<{
    title: string;
    excerpt: string;
    category?: string;
    authorName?: string;
    publishedAt: string;
    image: RawImg;
    body?: unknown;
    slug: string;
    seo?: LandingData["seo"];
  } | null>(blogPostBySlugQuery, { slug }, [TAGS.blogPost]);
  if (!p) return null;
  return {
    title: p.title,
    excerpt: p.excerpt,
    category: p.category,
    authorName: p.authorName ?? "Proje 01",
    publishedAt: p.publishedAt,
    image: resolveImage(p.image, p.title),
    body: p.body,
    slug: p.slug,
    seo: p.seo,
  };
}

// ---------------------------------------------------------------------------
// Page singletons
// ---------------------------------------------------------------------------

export type PageContent = {
  eyebrow?: string;
  title?: string;
  intro?: string;
  seo?: LandingData["seo"];
  [key: string]: unknown;
};

async function getPage(query: string): Promise<PageContent | null> {
  return fetchCached<PageContent | null>(query, {}, [TAGS.pages]);
}

export const getAboutPage = async (): Promise<
  (PageContent & { heroImage: Img | null; images: Img[] }) | null
> => {
  const p = await getPage(aboutPageQuery);
  if (!p) return null;
  return {
    ...p,
    heroImage: resolveImage((p.heroImage as RawImg) ?? null, "Proje 01"),
    images: resolveImages(p.images as RawImg[]),
  };
};
export const getServicesPage = () => getPage(servicesPageQuery);
export const getProjectsPage = () => getPage(projectsPageQuery);
export const getTeamPage = () => getPage(teamPageQuery);
export const getTestimonialsPage = () => getPage(testimonialsPageQuery);
export const getFaqPage = () => getPage(faqPageQuery);
export const getBlogPage = () => getPage(blogPageQuery);
export const getContactPage = () => getPage(contactPageQuery);
