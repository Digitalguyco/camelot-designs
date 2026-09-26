/**
 * One-off: the 4 demo projects seeded from content.ts (Ikoyi Family
 * Residence, Victoria Island Penthouse, Lekki Showroom Fit-Out, Banana
 * Island Villa) had single-sentence "concept" placeholders that read as
 * summaries rather than full write-ups. Expands each into a fuller
 * multi-paragraph placeholder in the same voice/facts as the original —
 * these are still demo content and should be replaced with the client's
 * real project write-ups whenever those are available.
 *
 * Run with: npx tsx scripts/expand-demo-project-descriptions.ts
 */
import "./load-env";
import { eq } from "drizzle-orm";
import { db } from "../src/lib/db";
import { projects } from "../src/lib/db/schema";

const UPDATES: Record<string, { concept: string; customFurniture?: string }> = {
  "ikoyi-family-residence": {
    concept: `The brief was a family home that could hold a growing art collection without feeling like a gallery — every room needed to work as a place to live in first.

We built the palette outward from the pieces already on the walls: textured neutrals on the larger surfaces, warm brass detailing on hardware and lighting, and a considered layering of lamp light so the rooms read as calm during the day and intimate in the evening.

Nothing in the finished home competes with the art. The furniture, rugs and joinery were chosen to sit quietly in the background, so the collection — and the family living around it — stays the focus.`,
  },
  "victoria-island-penthouse": {
    concept: `Floor-to-ceiling glass on two sides meant the skyline was always going to be the room's real focal point — so the interior was designed to hold its own against that view rather than compete with it.

We settled on a deep navy and ink palette, grounded with walnut joinery and brushed brass fixtures, letting the furniture read as sculptural against the glass rather than simply filling the floor plan.

Across both levels, the same material language carries through — velvet and bouclé seating, consistent metal tones, and lighting that shifts the mood from a bright entertaining space by day to something quieter after dark.`,
  },
  "lekki-showroom-fit-out": {
    concept: `A retail showroom floor has to survive being touched, sat in and rearranged every day — so this project started from durability rather than styling.

We designed a set of custom pieces in solid oak with brass inlay detailing, upholstered in performance-grade fabric that could take daily handling without losing the same level of finish as our residential work.

The result is a showroom that doubles as a working demonstration of what the brand can do — every piece on the floor is something a customer can actually experience, not just look at.`,
    customFurniture:
      "All showroom furniture custom-designed and fabricated in solid oak with brass inlay detailing, purpose-built for the space.",
  },
  "banana-island-villa": {
    concept: `A ground-up build gave us the rare chance to plan every room — formal and private — around one consistent material and colour language from the start.

Limestone flooring and plastered walls run through the common areas, giving the formal rooms a composed, considered feel, while the private rooms use the same palette in a softer, more unguarded way.

Custom joinery and mixed-metal lighting tie the sequence of spaces together, so moving from a formal reception room to a private family space never feels like stepping into a different house.`,
  },
};

async function main() {
  for (const [slug, fields] of Object.entries(UPDATES)) {
    const result = await db
      .update(projects)
      .set({ ...fields, updatedAt: new Date() })
      .where(eq(projects.slug, slug));
    console.log(slug, result);
  }
  process.exit(0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
