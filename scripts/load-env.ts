import { config } from "dotenv";

// Next.js loads .env.local itself; standalone scripts and the drizzle-kit
// CLI don't, so load it explicitly here — falling back to .env for
// production. Must be the *first* import wherever it's used, so its side
// effect (populating process.env) runs before anything that reads env vars
// at module load time (e.g. src/lib/db.ts).
config({ path: ".env.local" });
config({ path: ".env" });
