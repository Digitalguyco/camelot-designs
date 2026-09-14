// PM2 process manager config. Usage: pm2 start ecosystem.config.js
module.exports = {
  apps: [
    {
      name: "camelot-designs",
      // output: "standalone" (next.config.ts) produces this self-contained server.
      script: ".next/standalone/server.js",
      cwd: __dirname,
      env: {
        NODE_ENV: "production",
        PORT: "3000",
        HOSTNAME: "127.0.0.1",
      },
      instances: 1,
      autorestart: true,
      max_memory_restart: "512M",
    },
  ],
};
