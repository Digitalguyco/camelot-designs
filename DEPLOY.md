# Deploying to the VPS

One-time server setup, then a repeatable deploy routine. The database is a single SQLite
file — no separate DB service to install or manage.

## 1. One-time server setup

```bash
# Node (use whatever version-manager you prefer; this needs Node 20+)

# Build tools — better-sqlite3 compiles a native addon on install
sudo apt install build-essential python3

# PM2 (process manager) and Nginx
sudo npm install -g pm2
sudo apt install nginx certbot python3-certbot-nginx

# Swap — recommended on anything under ~2GB RAM, `next build` is memory-hungry
sudo fallocate -l 2G /swapfile && sudo chmod 600 /swapfile && sudo mkswap /swapfile
sudo swapon /swapfile
echo '/swapfile none swap sw 0 0' | sudo tee -a /etc/fstab

# Persistent storage — outside the app directory so redeploys never touch it
sudo mkdir -p /var/www/camelot-data /var/www/camelot-uploads
sudo chown $USER /var/www/camelot-data /var/www/camelot-uploads
```

Note: image uploads are processed with Jimp (pure JS), not sharp — some budget VPS
hosts run older virtualized CPUs that sharp's prebuilt binaries refuse to load on.

Copy `deploy/nginx.example.conf` to `/etc/nginx/sites-available/camelot-designs.com`, adjust the
paths for where you clone this repo, symlink it into `sites-enabled`, then run
`certbot --nginx -d camelot-designs.com -d www.camelot-designs.com` for TLS.

## 2. App setup (first deploy)

```bash
git clone <your-repo-url> /var/www/camelot-designs
cd /var/www/camelot-designs
npm ci

cp .env.example .env
# Fill in: DATABASE_URL=/var/www/camelot-data/camelot.db, NEXT_PUBLIC_SITE_URL,
# AUTH_SECRET (npx auth secret), UPLOADS_DIR=/var/www/camelot-uploads,
# SEED_ADMIN_EMAIL / SEED_ADMIN_PASSWORD, and SMTP_* if you want contact-form emails.

npm run db:migrate     # creates the SQLite file and its tables
npm run seed           # creates your admin login + demo products/posts

npm run build
# output: "standalone" doesn't bundle public/ or the static asset cache — copy them in:
cp -r public .next/standalone/
cp -r .next/static .next/standalone/.next/

pm2 start ecosystem.config.js
pm2 save
pm2 startup            # follow its printed instructions to survive a reboot
```

Visit `https://camelot-designs.com/admin/login` and sign in with `SEED_ADMIN_EMAIL` /
`SEED_ADMIN_PASSWORD`.

## 3. Redeploying after changes

```bash
cd /var/www/camelot-designs
git pull
npm ci
npm run db:migrate     # no-op if there's no new migration
npm run build
cp -r public .next/standalone/
cp -r .next/static .next/standalone/.next/
pm2 restart camelot-designs
```

## 4. Backups

Everything that matters lives in two places outside the repo — back up both, e.g. a nightly cron:

```bash
cp /var/www/camelot-data/camelot.db /var/backups/camelot-$(date +%F).db
tar czf /var/backups/camelot-uploads-$(date +%F).tar.gz /var/www/camelot-uploads
```
