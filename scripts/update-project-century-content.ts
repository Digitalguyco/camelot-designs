/**
 * One-off: replaces Project Century's condensed concept/materials with the
 * client's full write-up (verbatim, paragraph breaks preserved) and adds
 * the Materials / Custom Furniture split they sent separately.
 *
 * Run with: npx tsx scripts/update-project-century-content.ts
 */
import "./load-env";
import { eq } from "drizzle-orm";
import { db } from "../src/lib/db";
import { projects } from "../src/lib/db/schema";

const concept = `Project Century was a complete transformation of the Chairman's private office and adjoining sit out — a space designed not only for work, but also for hosting, entertaining and stepping away from the pace of the day.

For this project, we didn't simply furnish an existing room. We transformed the entire space from floor to ceiling.

The floors, walls, ceilings, lighting, feature wall, furniture, soft furnishings and decorative details were all carefully considered and brought together to create one cohesive environment.

The brief was to keep things classy, warm and sophisticated without making the space feel excessive. We worked with a rich combination of warm neutrals, deep wood tones and textured finishes, then brought in touches of the company's signature burgundy. The colour appears subtly throughout the space in the cushions, rug and artwork, giving the room a sense of identity without taking over.

The adjoining sit out was designed to feel like a natural extension of the office: comfortable enough for the Chairman to unwind, yet polished enough to welcome clients, colleagues and personal guests. The statement artwork adds colour and personality, while the fluted wall brings depth and character to the room.

Every decision was made with the Chairman in mind, from the proportions of the furniture to the lighting, textures and placement of each decorative piece.

The finished space is sophisticated without being showy, personal without losing its executive character, and comfortable without compromising on elegance.

This is what we love about our work at Camelot Designs — taking a space and completely reimagining how it can look, feel and function.

Designed & executed by Camelot Designs.`;

const materials =
  "Warm wood finishes, textured walls, fluted detailing, refined upholstery, statement artwork and subtle burgundy accents.";

const customFurniture =
  "Bespoke seating and occasional pieces, designed and finished specifically for the space.";

async function main() {
  const result = await db
    .update(projects)
    .set({ concept, materials, customFurniture, updatedAt: new Date() })
    .where(eq(projects.slug, "project-century"));
  console.log("Updated Project Century:", result);
  process.exit(0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
