/**
 * One-time (idempotent) seed: creates the admin account from
 * SEED_ADMIN_EMAIL/SEED_ADMIN_PASSWORD, and — only if the tables are empty —
 * loads the 9 demo products / 5 demo posts that used to live in content.ts,
 * so the site isn't blank on first launch. Replace these via /admin once live.
 *
 * Run with: npm run seed
 */
import "./load-env";
import { hash } from "bcryptjs";
import { count } from "drizzle-orm";
import { db } from "../src/lib/db";
import { adminUsers, posts, products, projects } from "../src/lib/db/schema";

async function tableCount(table: typeof products | typeof posts | typeof projects) {
  const [row] = await db.select({ n: count() }).from(table);
  return row?.n ?? 0;
}

async function seedAdmin() {
  const email = process.env.SEED_ADMIN_EMAIL?.toLowerCase().trim();
  const password = process.env.SEED_ADMIN_PASSWORD;
  if (!email || !password) {
    console.log("Skipping admin seed — SEED_ADMIN_EMAIL/SEED_ADMIN_PASSWORD not set.");
    return;
  }

  const existing = await db.query.adminUsers.findFirst({ where: (u, { eq }) => eq(u.email, email) });
  if (existing) {
    console.log(`Admin user ${email} already exists — skipping.`);
    return;
  }

  const passwordHash = await hash(password, 12);
  await db.insert(adminUsers).values({ email, passwordHash });
  console.log(`Created admin user: ${email}`);
}

async function seedProducts() {
  const existing = await tableCount(products);
  if (existing > 0) {
    console.log(`${existing} product(s) already exist — skipping product seed.`);
    return;
  }

  const demoProducts = [
    {
      slug: "tufted-accent-chair",
      name: "The Tufted Accent Chair",
      category: "Furniture",
      priceCents: 124000,
      material: "Boucle, turned beechwood",
      dimensions: "26\"W x 28\"D x 33\"H",
      sku: "CD-014",
      status: "available" as const,
      description:
        "A quiet, sculptural chair upholstered in undyed boucle over a hand-turned beechwood frame. Sits low and wide for reading corners and window seats.",
      images: ["/images/shop/tufted-accent-chair.jpg"],
    },
    {
      slug: "nordic-shell-chair",
      name: "The Nordic Shell Chair",
      category: "Furniture",
      priceCents: 68000,
      material: "Molded shell, ash legs",
      dimensions: "20\"W x 22\"D x 31\"H",
      sku: "CD-021",
      status: "available" as const,
      description:
        "A pared-back dining companion with a single-shell seat and splayed ash legs. Sold individually; pairs well in twos along a farm table.",
      images: ["/images/shop/nordic-shell-chair.jpg"],
    },
    {
      slug: "larkspur-velvet-sofa",
      name: "The Larkspur Velvet Sofa",
      category: "Furniture",
      priceCents: 345000,
      material: "Emerald velvet, brass feet",
      dimensions: "82\"W x 34\"D x 31\"H",
      sku: "CD-002",
      status: "sold-out" as const,
      description:
        "Deep-seated and generously scaled, upholstered in an emerald cotton velvet with polished brass feet. Our most requested piece — currently sold out while we source the next run of fabric.",
      images: ["/images/shop/larkspur-velvet-sofa.jpg"],
    },
    {
      slug: "ellery-loveseat",
      name: "The Ellery Loveseat",
      category: "Furniture",
      priceCents: 218000,
      material: "Burnt-sienna linen, walnut legs",
      dimensions: "62\"W x 33\"D x 30\"H",
      sku: "CD-009",
      status: "available" as const,
      description:
        "A compact loveseat in a burnt-sienna linen blend, built for reading nooks and entryway benches where a full sofa won't fit.",
      images: ["/images/shop/ellery-loveseat.jpg"],
    },
    {
      slug: "reverie-chaise",
      name: "The Reverie Chaise",
      category: "Furniture",
      priceCents: 289000,
      material: "Camel suede, oak frame",
      dimensions: "64\"W x 30\"D x 29\"H",
      sku: "CD-011",
      status: "preorder" as const,
      description:
        "An armless chaise in camel suede, styled here with a linen throw and dried pampas. Made to order in small batches — reserve now for delivery in the next run, roughly 10–12 weeks out.",
      images: ["/images/shop/reverie-chaise.jpg"],
    },
    {
      slug: "bedside-table",
      name: "The Bedside Table",
      category: "Furniture",
      priceCents: 42000,
      material: "White lacquer, dipped oak legs",
      dimensions: "16\"W x 16\"D x 22\"H",
      sku: "CD-033",
      status: "available" as const,
      description:
        "A slim, round bedside table in white lacquer with dipped oak legs — enough surface for a lamp, a book, and a glass of water.",
      images: ["/images/shop/bedside-table.jpg"],
    },
    {
      slug: "studio-task-lamp",
      name: "The Studio Task Lamp",
      category: "Lightings",
      priceCents: 34000,
      material: "Matte steel",
      dimensions: "7\"W x 20\"H, adjustable",
      sku: "CD-045",
      status: "available" as const,
      description:
        "An articulating task lamp in matte steel, built for desks and reading chairs. The joint holds any angle without drifting.",
      images: ["/images/shop/studio-task-lamp.jpg"],
    },
    {
      slug: "heirloom-rug",
      name: "The Heirloom Rug",
      category: "Rugs",
      priceCents: 186000,
      material: "Hand-knotted wool",
      dimensions: "8' x 10'",
      sku: "CD-058",
      status: "preorder" as const,
      description:
        "Hand-knotted wool in a soft, faded palette that reads as though it's always been there. Each rug varies slightly — a mark of the loom, not a flaw. Knotted to order; expect 12–16 weeks from reservation to delivery.",
      images: ["/images/shop/heirloom-rug.jpg"],
    },
    {
      slug: "aloe-planter",
      name: "The Aloe Planter",
      category: "Decor Accessories",
      priceCents: 6400,
      material: "Glazed ceramic",
      dimensions: "6\"W x 6\"H",
      sku: "CD-071",
      status: "available" as const,
      description:
        "A small glazed ceramic planter, shown here with aloe. Good on a bedside table, a bathroom shelf, or a kitchen windowsill.",
      images: ["/images/shop/aloe-planter.jpg"],
    },
  ];

  await db.insert(products).values(demoProducts);
  console.log(`Seeded ${demoProducts.length} products.`);
}

async function seedPosts() {
  const existing = await tableCount(posts);
  if (existing > 0) {
    console.log(`${existing} post(s) already exist — skipping post seed.`);
    return;
  }

  const demoPosts = [
    {
      slug: "inside-a-considered-bedroom",
      title: "Inside a Considered Bedroom",
      dek: "What a recent primary suite taught us about restraint — and where it pays to spend instead.",
      publishedAt: new Date("2026-06-02"),
      readTime: "5 min",
      coverImage: "/images/blog/considered-bedroom.jpg",
      published: true,
      contentHtml: [
        "The brief for this primary suite was short: make it feel like the end of the day, not another room to manage. We kept the palette to two moves — a charcoal accent wall and warm, undyed linens — so nothing in the room competes with actually sleeping in it.",
        "The channel-tufted bed frame does most of the talking. Everything else, the nightstands, the bench, the sconces, was chosen to sit slightly behind it rather than beside it as an equal.",
        "The lesson we keep relearning: a bedroom doesn't need more furniture, it needs fewer decisions left for you to make at 11pm. Everything has a place before you own it.",
      ]
        .map((p) => `<p>${p}</p>`)
        .join("\n"),
    },
    {
      slug: "the-art-of-the-gallery-wall",
      title: "The Art of the Gallery Wall",
      dek: "A working method for hanging art that looks collected over years, not assembled in an afternoon.",
      publishedAt: new Date("2026-05-14"),
      readTime: "4 min",
      coverImage: "/images/blog/gallery-wall.jpg",
      published: true,
      contentHtml: [
        "Most gallery walls fail for the same reason: everything on them is the same size, framed the same way, hung the same year. We build ours in from mismatched pairs — a large graphic piece, a small original, something functional like a clock — so the eye has somewhere to land first.",
        "We lay every piece out on the floor before a single nail goes in the wall, and we leave the arrangement for a full day. Almost always, something moves.",
        "The rule we hold to: leave one wall in the room bare. A gallery wall reads as intentional only when it isn't competing with itself elsewhere in the room.",
      ]
        .map((p) => `<p>${p}</p>`)
        .join("\n"),
    },
    {
      slug: "warming-up-a-modern-palette",
      title: "Warming Up a Modern Palette",
      dek: "How a single deep green wall kept a very clean-lined living room from feeling cold.",
      publishedAt: new Date("2026-04-22"),
      readTime: "6 min",
      coverImage: "/images/blog/warm-modern-palette.jpg",
      published: true,
      contentHtml: [
        "This living room came to us with good bones and a palette that had drifted too cool — gray on gray, nothing to hold onto. We repainted the back wall a deep, near-black green and let the existing camel sofa suddenly make sense as the warm note it always wanted to be.",
        "Brass hardware and a taxidermy-style pair of sculptural forms on the flanking walls do the rest of the work. They're a wink, not a theme.",
        "Cool, modern rooms don't need color everywhere to feel warm. They need one wall willing to commit.",
      ]
        .map((p) => `<p>${p}</p>`)
        .join("\n"),
    },
    {
      slug: "architecture-that-sets-the-tone",
      title: "Architecture That Sets the Tone",
      dek: "Notes from a recent build where the interior design started at the site plan, not the paint chips.",
      publishedAt: new Date("2026-03-08"),
      readTime: "7 min",
      coverImage: "/images/blog/architecture-tone.jpg",
      published: true,
      contentHtml: [
        "We're usually brought in after the walls exist. This project was different — we sat in on early conversations about window placement and roofline, and it changed how we think about every room that followed.",
        "A house that lets in this much evening light doesn't need heavy window treatments or saturated color to feel finished. The interior's job became protecting that light, not competing with it.",
        "When we can shape the architecture and the interior together, the furniture list gets shorter. The room is already doing most of the work.",
      ]
        .map((p) => `<p>${p}</p>`)
        .join("\n"),
    },
    {
      slug: "styling-the-console",
      title: "Styling the Console: A Small-Space Ritual",
      dek: "The entry console is the smallest surface in a home and the one guests actually look at. Here's how we build ours.",
      publishedAt: new Date("2026-02-19"),
      readTime: "3 min",
      coverImage: "/images/blog/styling-console.jpg",
      published: true,
      contentHtml: [
        "A console gets restyled more than any other surface in a house — mail, keys, a coat. We design ours to survive that: a low bowl for the daily clutter, a mirror to check yourself on the way out, one plant, one object with no function at all.",
        "Height variation matters more than symmetry here. We build in odd numbers and let one piece — usually the mirror — break the frame of the wall behind it.",
        "If a console still looks styled after a week of actual use, it was built for real life, not just for photographs.",
      ]
        .map((p) => `<p>${p}</p>`)
        .join("\n"),
    },
  ];

  await db.insert(posts).values(demoPosts);
  console.log(`Seeded ${demoPosts.length} posts.`);
}

async function seedProjects() {
  const existing = await tableCount(projects);
  if (existing > 0) {
    console.log(`${existing} project(s) already exist — skipping project seed.`);
    return;
  }

  const demoProjects = [
    {
      slug: "ikoyi-family-residence",
      name: "Ikoyi Family Residence",
      location: "Ikoyi, Lagos",
      projectType: "Residential",
      scope: "Full interior design and procurement across a four-bedroom family home.",
      concept:
        "A warm, layered palette built around the family's existing art collection — textured neutrals, brass detailing, and considered lighting that reads as calm during the day and intimate in the evening.",
      materials: "Boucle and linen upholstery, brass hardware, hand-knotted wool rugs, oak millwork.",
      role: "Interior design, space planning, furniture procurement and installation.",
      images: ["/images/living-room-1.jpg", "/images/living-room-2.jpg"],
    },
    {
      slug: "victoria-island-penthouse",
      name: "Victoria Island Penthouse",
      location: "Victoria Island, Lagos",
      projectType: "Residential",
      scope: "Full interior fit-out for a two-floor penthouse, from concept through styling.",
      concept:
        "A deep navy and ink palette against floor-to-ceiling glass, chosen to hold its own against the skyline view rather than compete with it.",
      materials: "Velvet and bouclé seating, walnut joinery, brushed brass fixtures.",
      role: "Concept development, 3D visualization, procurement and installation.",
      images: ["/images/navy-living-room.jpg"],
    },
    {
      slug: "lekki-showroom-fit-out",
      name: "Lekki Showroom Fit-Out",
      location: "Lekki, Lagos",
      projectType: "Commercial",
      scope: "Bespoke furniture design and fabrication for a retail showroom floor.",
      concept:
        "Custom pieces designed to be handled and sat in by shoppers — durable joinery and finishes dressed up with the same detailing as our residential work.",
      materials: "Solid oak frames, brass inlay, performance-grade upholstery fabric.",
      role: "Bespoke furniture design, fabrication oversight, and delivery.",
      images: ["/images/bespoke-furniture.jpg"],
    },
    {
      slug: "banana-island-villa",
      name: "Banana Island Villa",
      location: "Banana Island, Lagos",
      projectType: "Residential",
      scope: "Ground-up interior design for a new-build villa, all common and private areas.",
      concept:
        "A considered sequence of spaces — formal rooms that feel composed, private rooms that feel unguarded — held together by one consistent material and color language throughout.",
      materials: "Limestone flooring, plaster walls, custom joinery, mixed-metal lighting.",
      role: "Full interior design, procurement, and project coordination.",
      images: ["/images/gallery-1.jpg", "/images/gallery-2.jpg", "/images/gallery-3.jpg"],
    },
  ];

  await db.insert(projects).values(demoProjects);
  console.log(`Seeded ${demoProjects.length} projects.`);
}

async function main() {
  await seedAdmin();
  await seedProducts();
  await seedPosts();
  await seedProjects();
  process.exit(0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
