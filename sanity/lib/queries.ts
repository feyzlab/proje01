import { groq } from "next-sanity";

// Expanded image projection (asset url + LQIP + dimensions).
const IMG = `{ alt, asset->{ url, metadata{ lqip, dimensions } } }`;

const SEO = `{ metaTitle, metaDescription, noindex, "ogImage": ogImage${IMG} }`;

export const siteSettingsQuery = groq`*[_type == "siteSettings"][0]{
  wordmark,
  "logo": logo${IMG},
  email,
  phone,
  address,
  legal,
  builtBy,
  footerBlurb,
  nav[]{ label, href, autoChildrenFromServices, children[]{ label, href } },
  socials[]{ platform, href },
  defaultSeo${SEO}
}`;

export const servicesNavQuery = groq`*[_type == "service"] | order(order asc){
  "label": title,
  "href": "/hizmetler/" + slug.current
}`;

export const landingQuery = groq`*[_type == "landingPage"][0]{
  heroTitle,
  heroIntro,
  "heroImage": heroImage${IMG},
  featuredEyebrow,
  featuredTitle,
  servicesEyebrow,
  servicesTitle,
  statementTitle,
  "statementGalleryA": statementGalleryA[]${IMG},
  "statementGalleryB": statementGalleryB[]${IMG},
  "statementCollage": statementCollage[]${IMG},
  stats[]{ value, suffix, label },
  processEyebrow,
  processTitle,
  processBody,
  processBody2,
  processTabs[]{ title, "image": image${IMG} },
  testimonialsEyebrow,
  testimonialsTitle,
  contactEyebrow,
  contactTitle,
  marqueeText,
  "contactImage": contactImage${IMG},
  clientsTitle,
  seo${SEO},
  "featuredProjects": *[_type == "project" && highlightOnLanding == true] | order(order asc){
    title, subtitle, "image": coverImage${IMG}, "href": "/projeler/" + slug.current
  },
  "highlightServices": *[_type == "service" && highlightOnLanding == true] | order(order asc){
    title, excerpt, icon, "image": coverImage${IMG}, "href": "/hizmetler/" + slug.current
  },
  "highlightTestimonials": *[_type == "testimonial" && highlightOnLanding == true] | order(order asc){
    quote, name, role
  },
  "logos": *[_type == "partnerLogo"] | order(order asc){ "src": logo.asset->url, name, href }
}`;

// ---- Collections ----

export const allServicesQuery = groq`*[_type == "service"] | order(order asc){
  title, excerpt, icon, "image": coverImage${IMG}, "href": "/hizmetler/" + slug.current,
  "slug": slug.current
}`;

export const serviceBySlugQuery = groq`*[_type == "service" && slug.current == $slug][0]{
  title, excerpt, icon, "image": coverImage${IMG}, body, "slug": slug.current, seo${SEO}
}`;

export const allServiceSlugsQuery = groq`*[_type == "service" && defined(slug.current)].slug.current`;

export const allProjectsQuery = groq`*[_type == "project"] | order(order asc){
  title, subtitle, location, year, "image": coverImage${IMG},
  "href": "/projeler/" + slug.current, "slug": slug.current
}`;

export const projectBySlugQuery = groq`*[_type == "project" && slug.current == $slug][0]{
  title, subtitle, location, year, "image": coverImage${IMG},
  "gallery": gallery[]${IMG}, description, "slug": slug.current, seo${SEO}
}`;

export const allProjectSlugsQuery = groq`*[_type == "project" && defined(slug.current)].slug.current`;

export const teamQuery = groq`*[_type == "teamMember"] | order(order asc){
  name, role, bio, email, phone,
  "photo": photo${IMG},
  socials[]{ platform, href },
  "slug": slug.current
}`;

export const teamMemberBySlugQuery = groq`*[_type == "teamMember" && slug.current == $slug][0]{
  name, role, bio, email, phone,
  "photo": photo${IMG},
  socials[]{ platform, href },
  "slug": slug.current,
  seo${SEO}
}`;

export const allTeamSlugsQuery = groq`*[_type == "teamMember" && defined(slug.current)].slug.current`;

export const testimonialsQuery = groq`*[_type == "testimonial"] | order(order asc){
  quote, name, role
}`;

export const faqQuery = groq`*[_type == "faq"] | order(order asc){ question, answer }`;

export const allBlogPostsQuery = groq`*[_type == "blogPost"] | order(publishedAt desc){
  title, excerpt, category, authorName, publishedAt,
  "image": coverImage${IMG}, "href": "/blog/" + slug.current, "slug": slug.current
}`;

export const blogPostBySlugQuery = groq`*[_type == "blogPost" && slug.current == $slug][0]{
  title, excerpt, category, authorName, publishedAt, body,
  "image": coverImage${IMG}, "slug": slug.current, seo${SEO}
}`;

export const allBlogSlugsQuery = groq`*[_type == "blogPost" && defined(slug.current)].slug.current`;

// ---- Page singletons ----

const pageProjection = `{ eyebrow, title, intro, seo${SEO} }`;

export const aboutPageQuery = groq`*[_type == "aboutPage"][0]{
  eyebrow, title, intro,
  "heroImage": heroImage${IMG},
  bodyTitle, body,
  "images": images[]${IMG},
  stats[]{ value, suffix, label },
  seo${SEO}
}`;

export const servicesPageQuery = groq`*[_type == "servicesPage"][0]${pageProjection}`;
export const projectsPageQuery = groq`*[_type == "projectsPage"][0]${pageProjection}`;
export const teamPageQuery = groq`*[_type == "teamPage"][0]{ eyebrow, title, intro, bodyTitle, bodyText, seo${SEO} }`;
export const testimonialsPageQuery = groq`*[_type == "testimonialsPage"][0]${pageProjection}`;
export const faqPageQuery = groq`*[_type == "faqPage"][0]${pageProjection}`;
export const blogPageQuery = groq`*[_type == "blogPage"][0]${pageProjection}`;
export const contactPageQuery = groq`*[_type == "contactPage"][0]{ eyebrow, title, intro, formNote, seo${SEO} }`;
