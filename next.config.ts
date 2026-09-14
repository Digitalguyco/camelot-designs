import type { NextConfig } from "next";

// No `output: "export"` — the app now needs a live Node server (Server
// Actions, auth, DB access) rather than a static export. Deploy with
// `next build` + `next start` behind Nginx; see DEPLOY.md.
const nextConfig: NextConfig = {
  output: "standalone",
};

export default nextConfig;
