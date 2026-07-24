/**
 * Seed the Sanity `production` dataset for PROJE 01.
 *
 * - Downloads images from the live WordPress site and uploads them to Sanity
 *   (content-addressed, so re-running does not duplicate assets).
 * - Creates/replaces all documents with deterministic ids/slugs (idempotent).
 *
 * Run with:  npm run seed
 */
import { createClient } from "@sanity/client";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";

// ---- env ------------------------------------------------------------------
function loadEnv() {
  try {
    const raw = readFileSync(resolve(process.cwd(), ".env.local"), "utf8");
    for (const line of raw.split("\n")) {
      const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*"?([^"\n]*)"?\s*$/);
      if (m && !process.env[m[1]]) process.env[m[1]] = m[2];
    }
  } catch {
    /* ignore */
  }
}
loadEnv();

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";
const token = process.env.SANITY_API_WRITE_TOKEN;
if (!projectId || !token) {
  throw new Error("Missing NEXT_PUBLIC_SANITY_PROJECT_ID or SANITY_API_WRITE_TOKEN");
}

const client = createClient({
  projectId,
  dataset,
  apiVersion: "2024-10-01",
  token,
  useCdn: false,
});

const WP = "https://proje01.com/wp-content/uploads";
const MIRROR_DIR = resolve(process.cwd(), "assets/wp-mirror");

// ---- helpers --------------------------------------------------------------
const assetCache = new Map<string, string>();

async function uploadImage(url: string): Promise<string> {
  const cached = assetCache.get(url);
  if (cached) return cached;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Image fetch failed ${res.status}: ${url}`);
  const buf = Buffer.from(await res.arrayBuffer());

  const rel = url.replace(`${WP}/`, "");
  const localPath = resolve(MIRROR_DIR, rel);
  mkdirSync(dirname(localPath), { recursive: true });
  writeFileSync(localPath, buf);

  const filename = url.split("/").pop() || "image";
  const asset = await client.assets.upload("image", buf, { filename });
  assetCache.set(url, asset._id);
  process.stdout.write(".");
  return asset._id;
}

async function img(url: string, alt = "") {
  const _ref = await uploadImage(url);
  return { _type: "image", alt, asset: { _type: "reference", _ref } };
}

async function imgList(urls: string[], alt = "") {
  const out = [];
  for (const u of urls) {
    out.push({ _key: key(), ...(await img(u, alt)) });
  }
  return out;
}

let k = 0;
function key() {
  k += 1;
  return `k${k.toString(36)}${Math.random().toString(36).slice(2, 7)}`;
}

function keyed<T extends object>(arr: T[]): (T & { _key: string })[] {
  return arr.map((o) => ({ _key: key(), ...o }));
}

function pt(paragraphs: string[]) {
  return paragraphs.map((text) => ({
    _type: "block",
    _key: key(),
    style: "normal",
    markDefs: [],
    children: [{ _type: "span", _key: key(), text, marks: [] }],
  }));
}

function blocks(
  items: { style: "normal" | "h2"; text: string }[]
) {
  return items.map((item) => ({
    _type: "block",
    _key: key(),
    style: item.style,
    markDefs: [],
    children: [{ _type: "span", _key: key(), text: item.text, marks: [] }],
  }));
}

// ---- content --------------------------------------------------------------
const ADDRESS =
  "Türkiye, Kültür Mahallesi, Şehit Nevres Bulvarı, No: 3 Kat: 5 Daire: 53, 35220 Konak/İzmir";

const SERVICES = [
  {
    slug: "anahtar-teslim-tadilat",
    title: "Anahtar teslim tadilat",
    icon: "Key",
    cover: `${WP}/2025/12/custom-img-59.jpg`,
    highlight: true,
    excerpt:
      "Tasarımdan uygulamaya, tek ekip ve tek sorumlulukla; projenizi baştan sona biz yönetiyor, eksiksiz teslim ediyoruz.",
    body: [
      "Anahtar teslim tadilat hizmetimiz; keşif, tasarım, yıkım, altyapı, uygulama, mobilya üretimi ve teslim süreçlerinin tamamını kapsar. Tek bir ekip tarafından yönetilen süreçte zaman, bütçe ve kalite kontrol altında tutulur.",
      "Konut, ofis ve ticari mekanlar için uçtan uca renovasyon çözümleri sunuyor, taşınmaya hazır mekanlar teslim ediyoruz.",
    ],
  },
  {
    slug: "banyo-ve-mutfak-yenileme",
    title: "Banyo ve mutfak yenileme",
    icon: "Bathtub",
    cover: `${WP}/2025/12/custom-img-14.jpg`,
    highlight: true,
    excerpt:
      "Seramik, tesisat, özel ölçü dolap ve aydınlatma çözümleriyle banyo ve mutfaklarınızı yeniden tasarlıyoruz.",
    body: [
      "Mutfak yenileme kapsamında mekan planlaması, dolap tasarımı, özel ölçü üretim, tezgah seçimi ve elektrik-tesisat yenileme süreçlerinin tümünü yönetiyoruz.",
      "Banyo tadilatında seramik uygulamaları, tesisat yenileme, duş alanı çözümleri, özel ölçü banyo dolapları ve aydınlatma tasarımı bir arada ele alınır.",
    ],
  },
  {
    slug: "ev-ve-ofis-tadilati",
    title: "Ev ve ofis tadilatı",
    icon: "House",
    cover: `${WP}/2025/12/custom-img-15.jpg`,
    highlight: true,
    excerpt:
      "Yaşam ve çalışma alanlarınızı; ihtiyaç analizi, planlama ve nitelikli işçilikle yeniliyoruz.",
    body: [
      "Ev tadilatı ve ofis yenileme projelerinde mekanın potansiyelini ve kullanım alışkanlıklarını analiz ederek işlevsel, estetik ve dayanıklı çözümler üretiyoruz.",
      "Daire yenileme, komple ev renovasyonu ve ticari alan tadilatı süreçlerini titizlikle planlayıp uyguluyoruz.",
    ],
  },
  {
    slug: "proje-ve-ic-mimari-tasarim",
    title: "Proje ve iç mimari tasarım",
    icon: "PenNib",
    cover: `${WP}/2025/12/custom-img-16.jpg`,
    highlight: false,
    excerpt:
      "İhtiyaç analizinden 3D görselleştirmeye; konsept, malzeme ve uygulama planını birlikte kurguluyoruz.",
    body: [
      "İç mimari tasarım sürecimiz ihtiyaç analizi, konsept tasarımı, malzeme seçimi, 3D görselleştirme ve uygulama planlaması aşamalarından oluşur.",
      "Modern, minimalist ve kullanıcı odaklı mekanlar için bütüncül tasarım çözümleri geliştiriyoruz.",
    ],
  },
  {
    slug: "mobilya-tasarimi-ve-imalati",
    title: "Mobilya tasarımı ve imalatı",
    icon: "Armchair",
    cover: `${WP}/2025/12/custom-img-57.jpg`,
    highlight: false,
    excerpt:
      "Mutfak dolabı, TV ünitesi, giyinme odası ve depolama çözümlerinde özel ölçü üretim.",
    body: [
      "Projeye özel tasarlanan mobilyaları kendi üretim sürecimizde hayata geçiriyoruz: mutfak dolabı, TV ünitesi, giyinme odası, vestiyer ve depolama çözümleri.",
      "Özel ölçü üretim, mekanla bütünleşen ve uzun ömürlü çözümler sunar.",
    ],
  },
  {
    slug: "boya-parke-alci-ve-duvar-uygulamalari",
    title: "Boya, parke, alçı ve duvar uygulamaları",
    icon: "PaintRoller",
    cover: `${WP}/2025/12/custom-img-17.jpg`,
    highlight: false,
    excerpt:
      "Yüzey hazırlığından son kata; boya, parke, alçı ve dekoratif duvar uygulamalarında nitelikli işçilik.",
    body: [
      "Boya, parke, alçı ve duvar uygulamalarında yüzey hazırlığından son kata kadar tüm aşamaları nitelikli ekiplerle yürütüyoruz.",
      "Malzeme seçiminde profesyonel danışmanlık sunarak mekana uygun, dayanıklı ve estetik sonuçlar elde ediyoruz.",
    ],
  },
  {
    slug: "elektrik-ve-su-tesisati-duzenlemeleri",
    title: "Elektrik ve su tesisatı düzenlemeleri",
    icon: "Lightning",
    cover: `${WP}/2025/12/custom-img-18.jpg`,
    highlight: false,
    excerpt:
      "Güvenli ve standartlara uygun elektrik ve su tesisatı yenileme, düzenleme ve altyapı çözümleri.",
    body: [
      "Elektrik ve su tesisatı düzenlemelerinde mevcut altyapıyı analiz ederek güvenli, standartlara uygun ve geleceğe hazır çözümler uyguluyoruz.",
      "Tadilat sürecinde tesisat yenileme, aydınlatma altyapısı ve su tesisatı düzenlemeleri eksiksiz şekilde yönetilir.",
    ],
  },
];

const PROJECTS = [
  { slug: "ashwood-suite", title: "Ashwood Suite", subtitle: "Office Revive", cover: `${WP}/2025/12/custom-img-59.jpg`, gallery: ["14", "15", "16"], highlight: true, location: "İzmir", year: "2025" },
  { slug: "urban-design", title: "Urban Design", subtitle: "City Living", cover: `${WP}/2025/12/custom-img-07.jpg`, gallery: ["08", "09", "10"], highlight: true, location: "İzmir", year: "2025" },
  { slug: "elmview-refresh", title: "Elmview Refresh", subtitle: "Style Update", cover: `${WP}/2025/12/custom-img-06.jpg`, gallery: ["11", "12", "13"], highlight: true, location: "Manisa", year: "2024" },
  { slug: "bath-spaces", title: "Bath Spaces", subtitle: "Bath Remodel", cover: `${WP}/2025/12/custom-img-08.jpg`, gallery: ["14", "17"], highlight: false, location: "İzmir", year: "2024" },
  { slug: "loft-homes", title: "Loft Homes", subtitle: "Home Update", cover: `${WP}/2025/12/custom-img-09.jpg`, gallery: ["15", "18"], highlight: false, location: "İzmir", year: "2024" },
  { slug: "harbour-lofts", title: "Harbour Lofts", subtitle: "High-end Upgrade", cover: `${WP}/2025/12/custom-img-10.jpg`, gallery: ["16", "11"], highlight: false, location: "Manisa", year: "2023" },
];

const TEAM = [
  {
    slug: "mumin-can-ozturk",
    name: "Mümin Can Öztürk",
    role: "Kurucu",
    photo: `${WP}/2025/08/custom-img-27.jpg`,
    bio: "Proje 01'in kurucusu. Mimarlık, iç mimarlık ve anahtar teslim tadilat projelerinde tasarım vizyonunu yönetir.",
    email: "mcanzturk@gmail.com",
    phone: "+90 555 555 55 55",
  },
  {
    slug: "eren-huseyin-ozturk",
    name: "Eren Hüseyin Öztürk",
    role: "Kurucu Ortak",
    photo: `${WP}/2025/08/custom-img-28.jpg`,
    bio: "Proje 01 kurucu ortağı. Proje yönetimi ve uygulama süreçlerinde ekiple birlikte çalışır.",
    email: "",
    phone: "+90 555 555 55 55",
  },
];

const TESTIMONIALS = [
  { slug: "ayse-k", quote: "Ev tadilatı sürecinde baştan sona profesyonel bir ekip ile çalıştık. Tasarım aşamasından uygulamaya kadar her detay düşünüldü ve sonuç beklentimizin çok üzerinde oldu.", name: "Ayşe K.", role: "Konut Tadilatı", highlight: true },
  { slug: "murat-d", quote: "Anahtar teslim tadilat sürecinde tüm aşamalar kontrollü şekilde ilerledi. Kaliteli işçilik ve profesyonel süreç yönetimi bizi çok memnun etti.", name: "Murat D.", role: "Ofis Yenileme", highlight: true },
  { slug: "mehmet-akif-d", quote: "Proje 01 projemizi zamanında ve büyük bir özenle tamamladı. Ekibi her zaman net ve anlaşılırdı; sonuçlar ise beklentilerimizin ötesindeydi.", name: "Mehmet Akif Doğramacı", role: "İzmir, TR", highlight: true },
  { slug: "selin-t", quote: "Mutfak yenileme sürecinde özel ölçü dolaplar ve malzeme seçiminde aldığımız destek harikaydı. Mekanımız tamamen değişti.", name: "Selin T.", role: "Mutfak Yenileme", highlight: false },
  { slug: "burak-s", quote: "Banyo tadilatımız hem hızlı hem de titiz bir şekilde tamamlandı. İşçilik kalitesi ve iletişim için teşekkürler.", name: "Burak Ş.", role: "Banyo Tadilatı", highlight: false },
];

const FAQS: [string, string][] = [
  ["Anahtar teslim tadilat hizmeti neleri kapsar?", "Anahtar teslim tadilat hizmeti tasarım, yıkım, altyapı, uygulama, mobilya üretimi ve teslim süreci dahil olmak üzere tüm proje aşamalarını kapsar."],
  ["Ev tadilatı ne kadar sürer?", "Ev tadilatı süresi mekanın büyüklüğüne, uygulama kapsamına ve özel üretim ihtiyaçlarına göre değişir. Ortalama 1-2 ay sürmektedir ancak proje detaylarına göre planlanır."],
  ["İzmir'de anahtar teslim tadilat hizmeti veriyor musunuz?", "Evet. Proje 01 olarak İzmir'de ev tadilatı, daire yenileme, iç mimarlık ve anahtar teslim renovasyon hizmetleri sunuyoruz."],
  ["Manisa'da iç mimarlık hizmetiniz var mı?", "Evet. Manisa'da konut, ofis ve ticari alan projeleri için iç mimarlık ve uygulama hizmetleri veriyoruz."],
  ["Mutfak tadilatı sürecinde hangi hizmetler sunuluyor?", "Mutfak tadilatı kapsamında mekan planlaması, dolap tasarımı, özel ölçü üretim, tezgah seçimi, elektrik ve tesisat yenileme gibi tüm süreçler yönetilir."],
  ["Banyo tadilatı hizmetiniz neleri içeriyor?", "Banyo tadilatı hizmetimiz; seramik uygulamaları, tesisat yenileme, duş alanı çözümleri, özel ölçü banyo dolapları ve aydınlatma tasarımlarını kapsar."],
  ["İç mimarlık hizmeti almadan sadece tadilat yaptırabilir miyim?", "Evet. İhtiyaca göre yalnızca tadilat uygulaması veya tasarım + uygulama hizmeti birlikte sunabiliyoruz."],
  ["Özel ölçü mobilya üretimi yapıyor musunuz?", "Evet. Mutfak dolabı, TV ünitesi, giyinme odası, vestiyer ve depolama çözümleri dahil özel ölçü mobilya üretimi yapıyoruz."],
  ["Ev yenileme sürecinde proje yönetimini kim üstleniyor?", "Tüm proje yönetimi, uygulama takibi ve koordinasyon süreçleri Proje 01 tarafından yürütülür."],
  ["Ofis tadilatı ve ticari mekan yenileme hizmetiniz var mı?", "Evet. Ofis, mağaza, kafe ve ticari alanlar için iç mekan tasarımı ve anahtar teslim tadilat hizmetleri sunuyoruz."],
  ["Tadilat öncesinde keşif hizmeti sağlıyor musunuz?", "Evet. Proje öncesinde mekan keşfi yaparak ihtiyaçları, teknik detayları ve uygulama sürecini analiz ediyoruz."],
  ["İç mekan tasarım süreci nasıl ilerliyor?", "Süreç; ihtiyaç analizi, konsept tasarımı, malzeme seçimi, 3D görselleştirme ve uygulama planlaması aşamalarından oluşur."],
  ["Daire yenileme maliyetleri nasıl belirleniyor?", "Maliyetler; mekan büyüklüğü, malzeme tercihleri, uygulama kapsamı ve özel üretim ihtiyaçlarına göre belirlenir."],
  ["Anahtar teslim daire yenileme hizmeti nedir?", "Anahtar teslim daire yenileme; tasarım, uygulama, üretim ve teslim sürecinin tek bir ekip tarafından yönetildiği kapsamlı renovasyon hizmetidir."],
  ["Modern iç mekan tasarımı hizmeti sunuyor musunuz?", "Evet. Modern, minimalist ve kullanıcı odaklı iç mekan tasarımı çözümleri geliştiriyoruz."],
  ["Tadilat sırasında özel üretim mobilyalar projeye dahil ediliyor mu?", "Evet. Projeye özel tasarlanan mobilyalar üretim ve uygulama sürecine dahil edilir."],
  ["İzmir'de mutfak ve banyo tadilatı hizmeti veriyor musunuz?", "Evet. İzmir genelinde mutfak yenileme, banyo tadilatı ve komple ev renovasyonu hizmetleri sunuyoruz."],
  ["Tadilat sürecinde malzeme seçim desteği sağlıyor musunuz?", "Evet. Seramik, parke, boya, aydınlatma ve mobilya seçimlerinde profesyonel danışmanlık sunuyoruz."],
  ["Proje 01 hangi alanlarda hizmet veriyor?", "Proje 01; mimarlık, iç mimarlık, ev tadilatı, ofis yenileme, anahtar teslim renovasyon ve özel ölçü mobilya üretimi alanlarında hizmet verir."],
  ["Proje süreci nasıl başlıyor?", "Süreç, ilk görüşme ve mekan keşfiyle başlar. İhtiyaçların belirlenmesinin ardından tasarım, planlama ve uygulama aşamalarına geçilir."],
];

const galleryUrls = (nums: string[]) =>
  nums.map((n) => `${WP}/2025/12/custom-img-${n}.jpg`);

const BLOG_POSTS = [
  {
    slug: "anahtar-teslim-tadilat-nedir",
    title: "Anahtar teslim tadilat nedir? Süreç nasıl işler?",
    excerpt:
      "Anahtar teslim tadilat; keşiften teslime kadar tüm sürecin tek ekip tarafından yönetildiği kapsamlı bir renovasyon modelidir. Adım adım nasıl ilerlediğini anlatıyoruz.",
    category: "tadilat",
    cover: `${WP}/2025/12/custom-img-59.jpg`,
    publishedAt: "2025-11-12T09:00:00.000Z",
    body: blocks([
      {
        style: "normal",
        text: "Anahtar teslim tadilat, ev veya iş yeri sahibinin yıkımdan mobilya montajına kadar tüm süreci tek bir ekibe devrettiği kapsamlı bir renovasyon modelidir. Ayrı ayrı ustalar, tedarikçiler ve koordinasyon yükü ortadan kalkar; zaman, bütçe ve kalite tek elden kontrol altında tutulur.",
      },
      { style: "h2", text: "Süreç hangi aşamalardan oluşur?" },
      {
        style: "normal",
        text: "İlk adım keşif ve ihtiyaç analizidir. Mekanın mevcut durumu, altyapı ihtiyaçları ve kullanım alışkanlıkları birlikte değerlendirilir. Ardından konsept tasarımı, malzeme seçimi ve uygulama planı hazırlanır. Onay sonrası yıkım, tesisat, elektrik, zemin ve duvar uygulamaları, özel üretim mobilyalar ve son kat işçilikler sırayla tamamlanır.",
      },
      {
        style: "normal",
        text: "Proje 01 olarak İzmir ve Manisa'da anahtar teslim tadilat projelerinde tasarım, uygulama ve teslim süreçlerini aynı ekip yönetir. Böylece sahada sürpriz maliyetler azalır, teslim tarihi netleşir ve sonuç, onaylanan tasarıma sadık kalır.",
      },
    ]),
  },
  {
    slug: "mutfak-yenilemede-dikkat-edilecekler",
    title: "Mutfak yenilemede dikkat edilmesi gereken 7 nokta",
    excerpt:
      "Mutfak renovasyonunda planlama, tesisat, özel ölçü dolap ve aydınlatma kararları uzun vadeli konforu belirler. İşe başlamadan önce bilmeniz gerekenleri derledik.",
    category: "ic-mimari",
    cover: `${WP}/2025/12/custom-img-14.jpg`,
    publishedAt: "2025-10-28T09:00:00.000Z",
    body: blocks([
      {
        style: "normal",
        text: "Mutfak, evin en çok kullanılan ve en çok yatırım gerektiren alanlarından biridir. Doğru planlanmış bir mutfak yenilemesi hem günlük kullanımı kolaylaştırır hem de konut değerine doğrudan katkı sağlar.",
      },
      { style: "h2", text: "Planlama ve ergonomi" },
      {
        style: "normal",
        text: "Ocak, evye ve buzdolabı arasındaki çalışma üçgeni mutfağın omurgasını oluşturur. Depolama ihtiyacı, tezgah uzunluğu ve aydınlatma seviyeleri tasarım aşamasında netleştirilmelidir. Özel ölçü dolaplar, standart modüllere göre mekana daha iyi oturur ve boş alanları verimli kullanır.",
      },
      {
        style: "normal",
        text: "Tesisat ve elektrik altyapısı yenilenmeden görünür yüzeylere geçmek ileride maliyetli hatalara yol açabilir. Proje 01 mutfak yenileme süreçlerinde altyapı, üretim ve montajı tek çatı altında koordine ederek sorunsuz bir teslim hedefler.",
      },
    ]),
  },
  {
    slug: "banyo-tadilatinda-su-yalitimi",
    title: "Banyo tadilatında su yalıtımı neden kritik?",
    excerpt:
      "Banyo renovasyonunda görünmeyen ama en önemli adım su yalıtımıdır. Yanlış uygulama komşu dairelere ve yapıya zarar verebilir; doğru yalıtım nasıl yapılır?",
    category: "tadilat",
    cover: `${WP}/2025/12/custom-img-08.jpg`,
    publishedAt: "2025-09-15T09:00:00.000Z",
    body: blocks([
      {
        style: "normal",
        text: "Banyo, evin en yüksek nem ve su temasına maruz kalan bölümüdür. Seramik ve armatür seçimi kadar önemli olan su yalıtımı, uzun vadede yapı güvenliğini doğrudan etkiler.",
      },
      { style: "h2", text: "Yalıtım nerede uygulanmalı?" },
      {
        style: "normal",
        text: "Duş alanı, küvet çevresi, evye altı ve zemin döşemesi yalıtımın zorunlu olduğu bölgelerdir. Uygulama öncesi yüzey temizliği, astar ve katman kalınlığı standartlara uygun yapılmalıdır. Aksi halde su sızıntıları duvar arkasında küf, kabarma ve komşu daire şikayetlerine dönüşebilir.",
      },
      {
        style: "normal",
        text: "Proje 01 banyo tadilatlarında tesisat yenileme ile birlikte su yalıtımını kontrollü şekilde uygular; seramik, dolap ve aydınlatma montajına geçmeden önce test süreçlerini tamamlar.",
      },
    ]),
  },
  {
    slug: "izmir-ev-tadilati-maliyeti-nasil-planlanir",
    title: "İzmir'de ev tadilatı maliyeti nasıl planlanır?",
    excerpt:
      "Ev tadilatı bütçesi mekan büyüklüğü, malzeme kalitesi ve kapsamına göre değişir. İzmir'de gerçekçi bir bütçe planı için nelere dikkat etmelisiniz?",
    category: "rehber",
    cover: `${WP}/2025/12/custom-img-16.jpg`,
    publishedAt: "2025-08-22T09:00:00.000Z",
    body: blocks([
      {
        style: "normal",
        text: "Ev tadilatı maliyeti tek bir rakamla özetlenemez; projenin kapsamı, mevcut altyapı durumu ve malzeme tercihleri bütçeyi belirleyen üç temel faktördür. İzmir'de konut tadilatı planlarken önce ihtiyaçları netleştirmek, gereksiz harcamaların önüne geçer.",
      },
      { style: "h2", text: "Maliyeti etkileyen başlıklar" },
      {
        style: "normal",
        text: "Yıkım ve hafriyat, elektrik-su tesisatı, zemin ve duvar kaplamaları, mutfak-banyo yenileme, özel ölçü mobilya ve işçilik kalitesi ayrı kalemler olarak değerlendirilmelidir. Anahtar teslim modelde tüm kalemler tek teklifte toplanır; parça parça uygulamada ise koordinasyon maliyeti ve sürpriz gider riski artar.",
      },
      {
        style: "normal",
        text: "Proje 01 olarak keşif sonrası kapsamı şeffaf şekilde paylaşır, malzeme alternatifleri sunar ve bütçeyi aşmadan kaliteli sonuç için önceliklendirme yapmanıza yardımcı oluruz.",
      },
    ]),
  },
  {
    slug: "ic-mimari-tasarimda-malzeme-secimi",
    title: "İç mimari tasarımda malzeme seçimi nasıl yapılır?",
    excerpt:
      "Doğru malzeme seçimi estetik kadar dayanıklılığı da belirler. Ahşap, seramik, boya ve tekstil tercihlerinde nelere dikkat etmelisiniz?",
    category: "tasarim",
    cover: `${WP}/2025/12/custom-img-55.jpg`,
    publishedAt: "2025-07-10T09:00:00.000Z",
    body: blocks([
      {
        style: "normal",
        text: "İç mimari projelerde malzeme seçimi, mekanın karakterini ve kullanım ömrünü belirler. Yalnızca görsel uyum değil; bakım kolaylığı, nem direnci ve günlük kullanım alışkanlıkları da değerlendirilmelidir.",
      },
      { style: "h2", text: "Malzeme seçiminde üç temel kriter" },
      {
        style: "normal",
        text: "İşlevsellik: Mutfak ve banyoda suya dayanıklı yüzeyler, oturma alanlarında konforlu ve temizlenebilir dokular tercih edilmelidir. Estetik bütünlük: Zemin, duvar ve mobilya tonları birbirini destekleyen bir palet oluşturmalıdır. Sürdürülebilirlik: Uzun ömürlü malzemeler, tekrar tadilat ihtiyacını azaltır.",
      },
      {
        style: "normal",
        text: "Proje 01 iç mimari süreçlerinde numune ve referans görsellerle malzeme seçimini birlikte yapar; uygulama öncesi tüm detayları netleştirerek sahada sürprizleri minimuma indirir.",
      },
    ]),
  },
];

// ---- seed -----------------------------------------------------------------
async function run() {
  console.log("Seeding Sanity dataset:", dataset);
  const docs: Record<string, unknown>[] = [];

  // Site settings
  console.log("\n- site settings & logo");
  docs.push({
    _id: "siteSettings",
    _type: "siteSettings",
    wordmark: "proje01",
    logo: await img(`${WP}/2026/05/Proje-01-Siyah-Logo.png`, "Proje 01"),
    email: "info@proje01.com",
    phone: "+90 555 555 55 55",
    address: ADDRESS,
    legal: "© Proje 01, Bir Egekale Group Markasıdır. Tüm Hakları Saklıdır.",
    builtBy: "FeyzLab Teknoloji",
    footerBlurb:
      "Proje 01, konut, ticari ve endüstriyel projeler için kaliteli inşaat çözümleri sunmaya kendini adamış, sektörün önde gelen bir mimarlık ve tadilat markasıdır.",
    nav: keyed([
      { _type: "navItem", label: "Ana Sayfa", href: "/" },
      {
        _type: "navItem",
        label: "Hakkında",
        href: "/hakkinda",
        children: keyed([
          { label: "Hakkımızda", href: "/hakkinda" },
          { label: "Ekibimiz", href: "/ekibimiz" },
          { label: "Memnuniyet", href: "/memnuniyet" },
          { label: "Sık Sorulan Sorular", href: "/sik-sorulan-sorular" },
        ]),
      },
      {
        _type: "navItem",
        label: "Hizmetler",
        href: "/hizmetler",
        autoChildrenFromServices: true,
      },
      { _type: "navItem", label: "Projeler", href: "/projeler" },
      { _type: "navItem", label: "Blog", href: "/blog" },
      { _type: "navItem", label: "İletişim", href: "/iletisim" },
    ]),
    socials: keyed([
      { _type: "socialLink", platform: "instagram" },
      { _type: "socialLink", platform: "behance" },
      { _type: "socialLink", platform: "twitter" },
      { _type: "socialLink", platform: "pinterest" },
    ]),
    defaultSeo: {
      _type: "seo",
      metaTitle: "PROJE 01 – Tadilat & Mimarlık | İzmir İç Mimarlık",
      metaDescription:
        "Konut, ofis ve ticari mekan projelerinde iç mekan tasarımı, tadilat ve özel üretim çözümlerle estetik ve işlevsel alanlar tasarlıyoruz. İzmir & Manisa.",
      noindex: false,
    },
  });

  // Landing
  console.log("\n- landing page");
  docs.push({
    _id: "landingPage",
    _type: "landingPage",
    heroTitle: "Mimarlık, iç mimarlık ve anahtar teslim tadilat çözümleri.",
    heroIntro:
      "Konut, ofis ve ticari mekan projelerinde iç mekan tasarımı, tadilat ve özel üretim çözümlerle estetik ve işlevsel alanlar tasarlıyoruz.",
    heroImage: await img(
      `${WP}/2025/12/custom-img-50.jpg`,
      "Sıcak tonlarda, terracotta duvarlı modern oturma odası"
    ),
    featuredEyebrow: "TADİLAT GÖREN MEKANLARI İNCELEYİN",
    featuredTitle: "İlham verici iç mekanlar ve sonuçlar",
    servicesEyebrow:
      "Mimarlık, iç mekan tasarımı ve anahtar teslim tadilat çözümleri",
    servicesTitle: "Ege'ye ilham veren mekanlara tadilat yapıyoruz",
    statementTitle:
      "Proje 01 mimarlık, ve anahtar teslim tadilat alanlarında hizmet sunan tasarım stüdyosudur.",
    statementGalleryA: await imgList(galleryUrls(["10", "09", "08"])),
    statementGalleryB: await imgList(galleryUrls(["11", "12", "13"])),
    statementCollage: await imgList(galleryUrls(["14", "15", "18", "17", "16"])),
    stats: keyed([
      { _type: "statItem", value: 90, suffix: "+", label: "Tadilat yapılan mekanlar" },
      { _type: "statItem", value: 150, suffix: "+", label: "Hayallerin gerçeğe dönüşmesi" },
      { _type: "statItem", value: 10, suffix: "", label: "Yıllara dayanan tecrübe" },
    ]),
    processEyebrow: "TADİLAT SÜREÇLERİ",
    processTitle:
      "Başarılı tadilat ve mimari projeler, doğru planlama süreciyle başlar.",
    processBody:
      "Süreç, ilk keşif ve danışmanlık görüşmesiyle başlar. Müşterinin ihtiyaçları, yaşam alışkanlıkları ve mekânın potansiyeli detaylı şekilde analiz edilir. İç mimarlık, konsept tasarımı, ev tadilatı ve anahtar teslim uygulama süreçleri boyunca her detay titizlikle planlanır.",
    processBody2:
      "Proje 01, tasarımdan uygulamaya ve taşınma sürecine kadar tüm aşamaları yöneterek estetik, işlevsel ve kullanıcı odaklı yaşam alanları oluşturur.",
    processTabs: keyed([
      { title: "Mimarlık Hizmetleri", image: await img(`${WP}/2025/12/custom-img-56.jpg`) },
      { title: "Tadilat Hizmetleri", image: await img(`${WP}/2025/12/custom-img-58.jpg`) },
      { title: "Mobilya Hizmetleri", image: await img(`${WP}/2025/12/custom-img-57.jpg`) },
      { title: "Tasarım Hizmetleri", image: await img(`${WP}/2025/12/custom-img-55.jpg`) },
    ]),
    testimonialsEyebrow: "Müşteri yorumları",
    testimonialsTitle: "Proje 01 ile çalışma deneyimleri",
    contactEyebrow: "İLETİŞİM FORMU",
    contactTitle: "Sorularınız mı var? Bize ulaşın!",
    marqueeText: "TADİLAT MİMARLIK TASARIM",
    contactImage: await img(`${WP}/2025/12/custom-img-59.jpg`, "Proje 01 iç mekan"),
    clientsTitle: "Önde gelen şirketlerin tercihi",
  });

  // Services
  console.log("\n- services");
  for (let i = 0; i < SERVICES.length; i++) {
    const s = SERVICES[i];
    docs.push({
      _id: `service-${s.slug}`,
      _type: "service",
      title: s.title,
      slug: { _type: "slug", current: s.slug },
      icon: s.icon,
      excerpt: s.excerpt,
      coverImage: await img(s.cover, s.title),
      body: pt(s.body),
      highlightOnLanding: s.highlight,
      order: i + 1,
    });
  }

  // Projects
  console.log("\n- projects");
  for (let i = 0; i < PROJECTS.length; i++) {
    const p = PROJECTS[i];
    docs.push({
      _id: `project-${p.slug}`,
      _type: "project",
      title: p.title,
      subtitle: p.subtitle,
      slug: { _type: "slug", current: p.slug },
      coverImage: await img(p.cover, p.title),
      gallery: await imgList(galleryUrls(p.gallery), p.title),
      location: p.location,
      year: p.year,
      description: pt([
        `${p.title}, Proje 01 tarafından ${p.location} bölgesinde hayata geçirilen ${p.subtitle.toLowerCase()} odaklı bir renovasyon projesidir.`,
        "Tasarımdan uygulamaya kadar tüm süreç tek ekip tarafından yönetilmiş; estetik, işlevsellik ve kalite bir arada ele alınmıştır.",
      ]),
      highlightOnLanding: p.highlight,
      order: i + 1,
    });
  }

  // Team
  console.log("\n- team");
  for (let i = 0; i < TEAM.length; i++) {
    const m = TEAM[i];
    docs.push({
      _id: `team-${m.slug}`,
      _type: "teamMember",
      name: m.name,
      slug: { _type: "slug", current: m.slug },
      role: m.role,
      bio: m.bio,
      email: m.email || undefined,
      phone: m.phone || undefined,
      photo: await img(m.photo, m.name),
      order: i + 1,
    });
  }

  // Testimonials
  console.log("\n- testimonials");
  TESTIMONIALS.forEach((t, i) =>
    docs.push({
      _id: `testimonial-${t.slug}`,
      _type: "testimonial",
      quote: t.quote,
      name: t.name,
      role: t.role,
      highlightOnLanding: t.highlight,
      order: i + 1,
    })
  );

  // FAQs
  console.log("- faqs");
  FAQS.forEach(([question, answer], i) =>
    docs.push({
      _id: `faq-${i + 1}`,
      _type: "faq",
      question,
      answer,
      order: i + 1,
    })
  );

  // Partner logos
  console.log("- partner logos");
  const logoUrls = [
    `${WP}/2025/08/custom-img-06.png`,
    `${WP}/2025/08/custom-img-07.png`,
    `${WP}/2025/08/custom-img-08.webp`,
    `${WP}/2025/08/custom-img-09.webp`,
    `${WP}/2025/08/custom-img-10.webp`,
  ];
  for (let i = 0; i < logoUrls.length; i++) {
    docs.push({
      _id: `partner-${i + 1}`,
      _type: "partnerLogo",
      name: `İş Ortağı ${i + 1}`,
      logo: await img(logoUrls[i], `İş ortağı logosu ${i + 1}`),
      order: i + 1,
    });
  }

  // Blog posts
  console.log("\n- blog posts");
  for (const b of BLOG_POSTS) {
    docs.push({
      _id: `blog-${b.slug}`,
      _type: "blogPost",
      title: b.title,
      slug: { _type: "slug", current: b.slug },
      excerpt: b.excerpt,
      body: b.body,
      category: b.category,
      authorName: "Proje 01",
      publishedAt: b.publishedAt,
      seo: {
        _type: "seo",
        metaTitle: b.title,
        metaDescription: b.excerpt,
        noindex: false,
      },
    });
  }

  // Page singletons
  console.log("\n- page singletons");
  docs.push({
    _id: "aboutPage",
    _type: "aboutPage",
    eyebrow: "Kaliteli çalışmasıyla güven kazanmış",
    title: "Her gün tadilat yapıyor ve teslim ediyoruz",
    intro:
      "Kaliteye, güvenliğe ve takım çalışmasına büyük önem veriyoruz; her projenin yüksek standartlarımıza ve müşterilerimizin ihtiyaçlarına uygun olmasını sağlıyoruz. 2019 yılından bu yana güvenilir ve verimli inşaat çözümleri arayanların gözünde güvenilir bir isim haline geldik.",
    heroImage: await img(`${WP}/2025/12/custom-img-50.jpg`, "Proje 01"),
    bodyTitle: "Uzmanlığımızla mekanlara değer katın",
    body: pt([
      "Proje 01 olarak, güçlü bir ekip çalışmasının ve net hedeflerin değerine inanıyoruz. Ekibimiz, her müşterimiz için güvenli ve kalıcı mekanlar yaratmaya odaklanmıştır.",
      "Yeni yöntemlere odaklanarak çalışmalarımızın akıllı ve güvenilir olmasını sağlıyor; müşterilerimizin her projede hedeflerine ulaşmasına yardımcı oluyoruz.",
    ]),
    images: await imgList(galleryUrls(["14", "15"])),
    stats: keyed([
      { _type: "statItem", value: 150, suffix: "+", label: "Tamamlanan projeler" },
      { _type: "statItem", value: 90, suffix: "+", label: "Müşteri memnuniyeti" },
      { _type: "statItem", value: 10, suffix: "+", label: "Yıllara dayanan deneyim" },
      { _type: "statItem", value: 100, suffix: "%", label: "Güvenliği onaylanmış" },
    ]),
  });
  docs.push({
    _id: "servicesPage",
    _type: "servicesPage",
    eyebrow: "Tadilat & Mimarlık & Uygulama",
    title: "En iyi tasarım ve inşaat hizmetlerini sunuyoruz",
    intro:
      "Konut, ofis ve ticari mekanlar için anahtar teslim tadilat, mimarlık, iç mimarlık ve özel üretim çözümlerini tek çatı altında sunuyoruz.",
  });
  docs.push({
    _id: "projectsPage",
    _type: "projectsPage",
    eyebrow: "En iyi çalışmalarımızı keşfedin",
    title: "Yaşam alanlarını şekillendiren projeler",
    intro:
      "Konut, ofis ve ticari mekanlar için tasarımdan uygulamaya hayata geçirdiğimiz projelerden bir seçki.",
  });
  docs.push({
    _id: "teamPage",
    _type: "teamPage",
    eyebrow: "Her projeyle güven inşa etmek",
    title: "Her zaman özenle mekanlar yaratmak",
    intro:
      "Proje 01, İzmir'in önde gelen tadilat ve mimarlık markalarından biridir ve konutlar, ofisler ve endüstriyel tesisler için kaliteli inşaat ve yenileme hizmetleri sunmaktadır.",
    bodyTitle: "Proje 01'in arkasındaki uzmanlarla tanışın",
    bodyText:
      "Proje 01, her projede istikrarlı bir şekilde üstün sonuçlar elde etmek amacıyla yenilikçilik, uzmanlık ve müşteri odaklılığı bir araya getirerek birinci sınıf inşaat ve yenileme hizmetleri sunmaya kendini adamıştır.",
  });
  docs.push({
    _id: "testimonialsPage",
    _type: "testimonialsPage",
    eyebrow: "Müşteri yorumları",
    title: "Müşterilerimizin gözünden Proje 01",
    intro:
      "Birlikte çalıştığımız müşterilerimizin tadilat ve tasarım sürecine dair deneyimleri.",
  });
  docs.push({
    _id: "faqPage",
    _type: "faqPage",
    eyebrow: "Sorularınızın yanıtları",
    title: "Sık sorulan sorular",
    intro:
      "Proje 01, tüm mimarlık ve tadilat ihtiyaçlarınızda size yardımcı olmak için burada. Aşağıda en sık sorulan soruların yanıtlarını bulabilirsiniz.",
  });
  docs.push({
    _id: "blogPage",
    _type: "blogPage",
    eyebrow: "Blog",
    title: "Tadilat ve tasarım üzerine yazılar",
    intro:
      "Anahtar teslim tadilat, iç mimarlık ve mekan yenileme süreçlerine dair pratik rehberler, uzman görüşleri ve İzmir'den örnekler.",
    seo: {
      _type: "seo",
      metaTitle: "Blog | Tadilat ve İç Mimarlık Rehberleri",
      metaDescription:
        "Anahtar teslim tadilat, mutfak-banyo yenileme ve iç mimari tasarım üzerine Proje 01 blog yazıları. İzmir ve Manisa için pratik rehberler.",
      noindex: false,
    },
  });
  docs.push({
    _id: "contactPage",
    _type: "contactPage",
    eyebrow: "İLETİŞİM FORMU",
    title: "Sorularınız mı var? Bize ulaşın!",
    intro:
      "Her türlü sorunuz veya talebiniz için buradayız. İstediğiniz zaman bize ulaşabilirsiniz.",
    formNote:
      "Formu doldurun, en kısa sürede size geri dönelim. Dilerseniz doğrudan e-posta veya telefon ile de iletişime geçebilirsiniz.",
  });

  // Commit
  console.log(`\nCommitting ${docs.length} documents...`);
  const tx = client.transaction();
  for (const d of docs) tx.createOrReplace(d as { _id: string; _type: string });
  for (const b of BLOG_POSTS) {
    tx.patch(`blog-${b.slug}`, (p) => p.unset(["coverImage"]));
  }
  await tx.commit();
  console.log("\nLocal mirror:", MIRROR_DIR);
  console.log("Done. Seeded", docs.length, "documents.");
}

run().catch((e) => {
  console.error("\nSeed failed:", e);
  process.exit(1);
});
