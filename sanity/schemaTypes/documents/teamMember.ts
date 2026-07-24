import { defineArrayMember, defineField, defineType } from "sanity";

export const teamMember = defineType({
  name: "teamMember",
  title: "Ekip Üyesi",
  type: "document",
  groups: [
    { name: "profile", title: "Profil", default: true },
    { name: "contact", title: "İletişim" },
    { name: "seo", title: "SEO" },
  ],
  fields: [
    defineField({
      name: "name",
      title: "İsim",
      type: "string",
      group: "profile",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "slug",
      title: "URL",
      type: "slug",
      group: "profile",
      options: { source: "name", maxLength: 96 },
      description: "Dijital kartvizit adresi: /ekip/bu-slug",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "role",
      title: "Görev / Ünvan",
      type: "string",
      group: "profile",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "photo",
      title: "Profil Fotoğrafı",
      type: "image",
      group: "profile",
      options: { hotspot: true },
      description: "Kartvizit ve Ekibimiz listesinde kullanılır.",
    }),
    defineField({
      name: "bio",
      title: "Kısa Biyografi",
      type: "text",
      rows: 3,
      group: "profile",
      description: "Ekibimiz listesinde ve kartvizitte görünür.",
    }),
    defineField({
      name: "email",
      title: "E-posta",
      type: "string",
      group: "contact",
    }),
    defineField({
      name: "phone",
      title: "Telefon",
      type: "string",
      group: "contact",
      description: "Örn. +90 5xx xxx xx xx. Arama ve WhatsApp için kullanılır.",
    }),
    defineField({
      name: "socials",
      title: "Sosyal Medya",
      type: "array",
      group: "contact",
      of: [defineArrayMember({ type: "socialLink" })],
    }),
    defineField({
      name: "order",
      title: "Sıralama",
      type: "number",
      group: "profile",
      initialValue: 0,
    }),
    defineField({
      name: "seo",
      title: "SEO & Paylaşım",
      type: "seo",
      group: "seo",
    }),
  ],
  orderings: [
    {
      title: "Sıralama",
      name: "orderAsc",
      by: [{ field: "order", direction: "asc" }],
    },
  ],
  preview: {
    select: { title: "name", subtitle: "role", media: "photo" },
  },
});
