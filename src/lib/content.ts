import { slugify } from "@/lib/slug";

export const site = {
  name: "Camelot Designs",
  tagline:
    "Established in 2015, Camelot Designs is a Nigeria-based interior design and procurement studio creating considered residential, commercial and hospitality spaces. We combine thoughtful design, quality materials, bespoke furniture and professional procurement to create spaces that are both distinctive and enduring.",
  phone: "+234 809 786 6243",
  email: "designs@camelot-designs.com",
  address: "332 Close, Banana Island, Ikoyi, Lagos, Nigeria",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://camelot-designs.com",
};

export const legalLinks = [
  { href: "/privacy", label: "Privacy Policy" },
  { href: "/terms", label: "Terms & Conditions" },
  { href: "/cookies", label: "Cookies Policy" },
];

// Canonical profile URLs — the links you sent carried personal share/tracking
// tokens (?stkn=, ?utm_..., ?mibextid=) that are single-use or reveal referral
// data, so they're stripped here to the stable public URLs.
export const socials = [
  { label: "Instagram", href: "https://www.instagram.com/camelotdesigns" },
  { label: "Facebook", href: "https://www.facebook.com/share/1Btk6Rpc3B/" },
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/imuetinyan-daniel-79338074",
  },
];

export const nav = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/portfolio", label: "Portfolio" },
  { href: "/shop", label: "Shop" },
  { href: "/blog", label: "Journal" },
  { href: "/contact", label: "Contact" },
];

export const services = [
  {
    title: "Full Home Design",
    description:
      "End-to-end design direction for every room, from concept boards to final styling.",
  },
  {
    title: "Space Planning",
    description:
      "Thoughtful layouts that balance flow, function, and the way you actually live.",
  },
  {
    title: "Bespoke Furnishing",
    description:
      "Custom and curated furniture sourced to fit your space and sensibility exactly.",
  },
  {
    title: "Styling & Staging",
    description:
      "Finishing touches — art, textiles, and accessories — that make a house feel considered.",
  },
];

// Named processSteps, not process — that name shadows Node's global `process`,
// which site.url above needs to read from.
// Placeholder write-ups — replace with the studio's own wording later.
export const processSteps = [
  {
    title: "Let's Talk",
    body: "We start with a conversation, not a questionnaire. Tell us about the space, how you actually live or work in it, and what's not working — in person or over a call, whichever is easier for you.",
  },
  {
    title: "Let's Meet",
    body: "We walk the space together, take measurements, and get a real feel for the light, the flow, and the details a photo never quite captures. This is also where we start talking budget and timeline honestly.",
  },
  {
    title: "Approval & Procurement",
    body: "You'll see a clear proposal — concept, materials, and cost — before anything is committed. Once it's approved, we handle sourcing and procurement end to end, keeping you updated at every stage.",
  },
];

export const stats = [
  { value: "50+", label: "Projects Delivered" },
  { value: "100+", label: "Clients Served" },
  { value: "10+", label: "Years of Experience" },
];

// The fixed shop taxonomy — used both as the admin's category picker and
// the shop's category tiles, so the two can never drift out of sync.
export const productCategories = [
  "Decor Accessories",
  "Lightings",
  "Furniture",
  "Beddings / Mattresses",
  "Cushions / Throw Blankets",
  "Rugs",
  "Vintage",
];

const CATEGORY_SLUGS: Record<string, string> = Object.fromEntries(
  productCategories.map((c) => [c, slugify(c)]),
);
const SLUG_TO_CATEGORY: Record<string, string> = Object.fromEntries(
  productCategories.map((c) => [slugify(c), c]),
);

export function categoryToSlug(category: string): string {
  return CATEGORY_SLUGS[category] ?? slugify(category);
}

export function categoryFromSlug(slug: string): string | undefined {
  return SLUG_TO_CATEGORY[slug];
}

