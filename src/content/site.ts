/**
 * Central content + brand constants for PROJE 01.
 *
 * This is the EXACT copy from the live WordPress site (see docs/02-CONTENT-MAP.md).
 * It acts as the default/fallback content. Once Sanity is connected, the landing
 * page reads CMS data and falls back to these values when a field is empty.
 *
 * Images currently point at the live WordPress public URLs (see docs/03-RULES.md).
 */

const WP = "https://proje01.com/wp-content/uploads";

export const site = {
  name: "Proje 01",
  wordmark: "proje01",
  email: "info@proje01.com",
  address:
    "Türkiye, Kültür Mahallesi, Şehit Nevres Bulvarı, No: 3 Kat: 5 Daire: 53, 35220 Konak/İzmir",
  legal: "© Proje 01, Bir Egekale Group Markasıdır. Tüm Hakları Saklıdır.",
  builtBy: "FeyzLab Teknoloji",
  socials: [
    { label: "Instagram", href: "https://instagram.com/" },
    { label: "Behance", href: "https://behance.net/" },
    { label: "Twitter", href: "https://twitter.com/" },
    { label: "Pinterest", href: "https://pinterest.com/" },
  ],
  nav: [
    { label: "Ana Sayfa", href: "/" },
    {
      label: "Hakkında",
      href: "/hakkinda",
      children: [
        { label: "Hakkımızda", href: "/hakkinda" },
        { label: "Ekibimiz", href: "/ekibimiz" },
        { label: "Memnuniyet", href: "/memnuniyet" },
        { label: "Sık Sorulan Sorular", href: "/sss" },
      ],
    },
    { label: "Hizmetler", href: "/hizmetler" },
    {
      label: "Projeler",
      href: "/projeler",
      children: [{ label: "Proje 01", href: "/projeler" }],
    },
    { label: "Blog", href: "/blog" },
    { label: "İletişim", href: "/iletisim" },
  ],
} as const;

export const landing = {
  hero: {
    intro:
      "Konut, ofis ve ticari mekan projelerinde iç mekan tasarımı, tadilat ve özel üretim çözümlerle estetik ve işlevsel alanlar tasarlıyoruz.",
    title: "Mimarlık, iç mimarlık ve anahtar teslim tadilat çözümleri.",
    image: `${WP}/2025/12/custom-img-50.jpg`,
    imageAlt:
      "Sıcak tonlarda, terracotta duvarlı ve doğal dokulu modern oturma odası",
  },
  featured: {
    eyebrow: "TADİLAT GÖREN MEKANLARI İNCELEYİN",
    title: "İlham verici iç mekanlar ve sonuçlar",
    strip: [
      `${WP}/2025/12/custom-img-08.jpg`,
      `${WP}/2025/12/custom-img-09.jpg`,
      `${WP}/2025/12/custom-img-10.jpg`,
    ],
    projects: [
      {
        title: "Ashwood suite",
        subtitle: "Office Revive",
        image: `${WP}/2025/12/custom-img-59.jpg`,
        href: "/projeler",
      },
      {
        title: "Urban design",
        subtitle: "City Living",
        image: `${WP}/2025/12/custom-img-07.jpg`,
        href: "/projeler",
      },
      {
        title: "Elmview refresh",
        subtitle: "Style Update",
        image: `${WP}/2025/12/custom-img-06.jpg`,
        href: "/projeler",
      },
    ],
  },
  services: {
    eyebrow: "Mimarlık, iç mekan tasarımı ve anahtar teslim tadilat çözümleri",
    title: "Ege'ye ilham veren mekanlara tadilat yapıyoruz",
    items: [
      {
        no: "01",
        title: "Konut İç Mimarlığı Anahtar Teslim Tadilat",
        body: "İzmir ve Manisa'da konut projelerine özel iç mimarlık, ev tadilatı ve anahtar teslim renovasyon hizmetleri sunar. Yaşam alışkanlıklarını ve mekanın potansiyelini analiz ederek estetik, işlevsel ve zamansız yaşam alanları tasarlıyoruz. Tasarım sürecinden uygulamaya kadar tüm detayları titizlikle yöneterek bütüncül çözümler üretiyoruz.",
      },
      {
        no: "02",
        title: "Ticari Mekan Tasarımı Uygulama Hizmetleri",
        body: "Ofis, mağaza, kafe ve ticari alan projelerinde modern mimarlık ve iç mekan tasarımı çözümleri geliştiriyoruz. Markanın kimliğini yansıtan, kullanıcı deneyimini güçlendiren ve verimliliği artıran mekanlar oluşturuyoruz. İzmir ve Manisa'da konsept geliştirme, mekan yenileme ve uygulama süreçlerini profesyonel şekilde yönetiyoruz.",
      },
      {
        no: "03",
        title: "Mimari Tasarım Tadilat Çözümleri",
        body: "Mimarlık, iç mimarlık, anahtar teslim tadilat ve özel ölçü mobilya üretimini tek çatı altında bir araya getirir. Konut ve ticari alan projelerinde proje yönetimi, uygulama, üretim ve detay çözümlerini bütünsel bir yaklaşımla ele alıyoruz. Her projede estetik, teknik kalite ve işlevselliği dengeli şekilde buluşturuyoruz.",
      },
    ],
  },
  statement: {
    // Plain version kept for SEO / fallback / screen readers.
    title:
      "Proje 01 mimarlık, ve anahtar teslim tadilat alanlarında hizmet sunan tasarım stüdyosudur.",
    // Rich version: text fragments interleaved with small rotating image
    // galleries, mirroring the original advanced-title widget.
    segments: [
      { type: "text", text: "Proje 01", underline: false },
      {
        type: "gallery",
        images: [
          `${WP}/2025/12/custom-img-10.jpg`,
          `${WP}/2025/12/custom-img-09.jpg`,
          `${WP}/2025/12/custom-img-08.jpg`,
        ],
      },
      {
        type: "text",
        text: "mimarlık, ve anahtar teslim tadilat",
        underline: true,
      },
      { type: "text", text: " alanlarında hizmet sunan", underline: false },
      {
        type: "gallery",
        images: [
          `${WP}/2025/12/custom-img-11.jpg`,
          `${WP}/2025/12/custom-img-12.jpg`,
          `${WP}/2025/12/custom-img-13.jpg`,
        ],
      },
      { type: "text", text: "tasarım stüdyosudur.", underline: true },
    ],
    stats: [
      { value: 90, suffix: "+", label: "Tadilat yapılan mekanlar" },
      { value: 150, suffix: "+", label: "Hayallerin gerçeğe dönüşmesi" },
      { value: 10, suffix: "", label: "Yıllara dayanan tecrübe" },
    ],
    collage: [
      { image: `${WP}/2025/12/custom-img-14.jpg`, alt: "İç mekan detay" },
      { image: `${WP}/2025/12/custom-img-15.jpg`, alt: "Mutfak ve yemek alanı" },
      { image: `${WP}/2025/12/custom-img-18.jpg`, alt: "Yaşam alanı" },
      { image: `${WP}/2025/12/custom-img-17.jpg`, alt: "İç mekan tasarım" },
      { image: `${WP}/2025/12/custom-img-16.jpg`, alt: "Mekan detay" },
    ],
  },
  process: {
    eyebrow: "TADİLAT SÜREÇLERİ",
    title:
      "Başarılı tadilat ve mimari projeler, doğru planlama süreciyle başlar.",
    body: "Süreç, ilk keşif ve danışmanlık görüşmesiyle başlar. Müşterinin ihtiyaçları, yaşam alışkanlıkları ve mekânın potansiyeli detaylı şekilde analiz edilir. İç mimarlık, konsept tasarımı, ev tadilatı ve anahtar teslim uygulama süreçleri boyunca her detay titizlikle planlanır.",
    body2:
      "Proje 01, tasarımdan uygulamaya ve taşınma sürecine kadar tüm aşamaları yöneterek estetik, işlevsel ve kullanıcı odaklı yaşam alanları oluşturur.",
    tabs: [
      {
        title: "Mimarlık Hizmetleri",
        image: `${WP}/2025/12/custom-img-56.jpg`,
      },
      {
        title: "Tadilat Hizmetleri",
        image: `${WP}/2025/12/custom-img-58.jpg`,
      },
      {
        title: "Mobilya Hizmetleri",
        image: `${WP}/2025/12/custom-img-57.jpg`,
      },
      {
        title: "Tasarım Hizmetleri",
        image: `${WP}/2025/12/custom-img-55.jpg`,
      },
    ],
  },
  testimonials: {
    eyebrow: "Müşteri yorumları",
    title: "Proje 01 ile çalışma deneyimleri",
    items: [
      {
        quote:
          "Ev tadilatı sürecinde baştan sona profesyonel bir ekip ile çalıştık. Tasarım aşamasından uygulamaya kadar her detay düşünüldü ve sonuç beklentimizin çok üzerinde oldu.",
        name: "Ayşe K.",
        role: "Konut Tadilatı",
      },
      {
        quote:
          "Anahtar teslim tadilat sürecinde tüm aşamalar kontrollü şekilde ilerledi. Kaliteli işçilik ve profesyonel süreç yönetimi bizi çok memnun etti.",
        name: "Murat D.",
        role: "Ofis Yenileme",
      },
    ],
  },
  contact: {
    eyebrow: "İLETİŞİM FORMU",
    title: "Sorularınız mı var? Bize ulaşın!",
    image: `${WP}/2025/12/custom-img-59.jpg`,
    marqueeText: "TADİLAT MİMARLIK TASARIM",
  },
  clients: {
    title: "Önde gelen şirketlerin tercihi",
    logos: [
      {
        src: `${WP}/2025/08/custom-img-06.png`,
        alt: "İş ortağı logosu",
      },
      {
        src: `${WP}/2025/08/custom-img-07.png`,
        alt: "İş ortağı logosu",
      },
      {
        src: `${WP}/2025/08/custom-img-08.webp`,
        alt: "İş ortağı logosu",
      },
      {
        src: `${WP}/2025/08/custom-img-10.webp`,
        alt: "İş ortağı logosu",
      },
      {
        src: `${WP}/2025/08/custom-img-09.webp`,
        alt: "İş ortağı logosu",
      },
    ],
  },
  footer: {
    blurb:
      "Proje 01, konut, ticari ve endüstriyel projeler için kaliteli inşaat çözümleri sunmaya kendini adamış, sektörün önde gelen bir mimarlık ve tadilat markasıdır.",
  },
} as const;

export type Landing = typeof landing;
