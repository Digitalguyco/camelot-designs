export const site = {
  name: "Camelot Designs",
  tagline:
    "Established in 2015, Camelot Designs is a Lagos-based interior design and procurement studio creating considered residential, commercial and hospitality spaces. We combine thoughtful design, quality materials, bespoke furniture and professional procurement to create spaces that are both distinctive and enduring.",
  phone: "+234 809 786 6243",
  email: "hello@camelot-designs.com",
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
export const processSteps = ["Let's Talk", "Let's Meet", "Approval & Procurement"];

export const stats = [
  { value: "50+", label: "Projects Delivered" },
  { value: "100+", label: "Clients Served" },
  { value: "10+", label: "Years of Experience" },
];

export const portfolio = [
  { src: "/images/living-room-1.jpg", alt: "Light, airy living room with layered textiles" },
  { src: "/images/living-room-2.jpg", alt: "Contemporary living room seating area" },
  { src: "/images/navy-living-room.jpg", alt: "Living room in a rich navy palette" },
  { src: "/images/bespoke-furniture.jpg", alt: "Bespoke furniture detail" },
  { src: "/images/gallery-1.jpg", alt: "Interior design project detail" },
  { src: "/images/gallery-2.jpg", alt: "Interior design project detail" },
  { src: "/images/gallery-3.jpg", alt: "Interior design project detail" },
];
