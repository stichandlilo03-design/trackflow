# ⚡ TrackFlow — Shipment Tracking System

A complete shipment tracking system with a customer-facing tracking page and admin dashboard. Built with Next.js and designed for deployment on Vercel.

---

## Features

### Customer Tracking Page (`/`)
- Enter tracking number to get real-time shipment status
- Visual progress tracker with all shipment stages
- Activity timeline showing all updates
- Shipment details (origin, destination, weight, type, etc.)

### Admin Dashboard (`/admin`)
- Password-protected admin panel
- Create, edit, and delete shipments
- Auto-generated tracking IDs (e.g., `TRK-A3K9MX5P`)
- Quick status change directly from the shipment list
- Copy tracking ID to clipboard (to share with customers)
- Search and filter shipments by status
- Add activity timeline updates with date, time, and location
- Dashboard stats (total, in transit, delivered, on hold)

### Shipment Statuses
📋 Order Placed → 📥 Picked Up → ⚙️ Processing → 🚚 In Transit → 🛃 Customs Clearance → 🏢 At Local Hub → 📦 Out for Delivery → ✅ Delivered

Additional: ↩️ Returned | ⏸️ On Hold

---

## Quick Setup (Deploy to Vercel)

### Step 1: Create Upstash Redis Database (Free)

1. Go to [https://console.upstash.com](https://console.upstash.com)
2. Sign up (free, no credit card needed)
3. Click **"Create Database"**
4. Choose a name (e.g., "trackflow") and pick the nearest region
5. Copy the **REST URL** and **REST Token** from the database details page

### Step 2: Push to GitHub

```bash
# Unzip the project
unzip trackflow.zip
cd trackflow

# Initialize git repo
git init
git add .
git commit -m "Initial commit"

# Create a repo on GitHub, then:
git remote add origin https://github.com/YOUR_USERNAME/trackflow.git
git branch -M main
git push -u origin main
```

### Step 3: Deploy on Vercel

1. Go to [https://vercel.com](https://vercel.com) and sign in with GitHub
2. Click **"Add New Project"**
3. Import your `trackflow` repository
4. In the **Environment Variables** section, add:
   | Variable | Value |
   |---|---|
   | `UPSTASH_REDIS_REST_URL` | Your Upstash REST URL |
   | `UPSTASH_REDIS_REST_TOKEN` | Your Upstash REST Token |
   | `ADMIN_PASSWORD` | Your admin password (or leave empty for "admin123") |
5. Click **Deploy**

That's it! Your tracking system is live.

---

## Local Development

```bash
# Install dependencies
npm install

# Copy env file and fill in your Upstash credentials
cp .env.local.example .env.local

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

> **Note:** Without Upstash credentials, the app uses an in-memory store (data resets on server restart). This is fine for testing locally.

---

## How to Use

### As Admin:
1. Go to `yoursite.com/admin` — this is a **hidden page**, not linked anywhere on the site. Only you know it!
2. Log in with your password (default: `admin123`, change via env variable)
3. Click **"+ New Shipment"** to create a tracking entry
4. Fill in the shipment details (recipient, origin, destination, etc.)
5. Set the current status
6. Add activity updates (e.g., "Package picked up from sender")
7. Save the shipment
8. Copy the tracking ID and share it with your customer

### As Customer:
1. Customer goes to your homepage (`yoursite.com`)
2. They enter the tracking ID you gave them
3. They see shipment progress and activity log
4. **They have no way to see or access the admin panel**

### Updating Shipment Status:
- **Quick way:** Use the status dropdown directly in the shipment list
- **Detailed way:** Click "Edit", change status, add a new activity update, save

---

## Customization

### SEO & Google Visibility (IMPORTANT!)

Your site is fully optimized for Google out of the box. To complete the setup:

1. **Edit `lib/siteConfig.js`** — Update your company name, domain, description, email, and keywords. This one file controls all your SEO tags.

2. **Update `public/robots.txt`** — Replace `https://yoursite.com` with your actual Vercel URL.

3. **Add an OG image** — Place a 1200×630px image at `public/og-image.png`. This shows when your link is shared on social media.

4. **Submit to Google Search Console:**
   - Go to [https://search.google.com/search-console](https://search.google.com/search-console)
   - Add your Vercel URL as a property
   - Verify ownership (Vercel makes this easy with DNS or HTML file)
   - Submit your sitemap: `https://yoursite.com/sitemap.xml`

5. **Optional — Google My Business:** If you're a local business, register at [Google Business Profile](https://business.google.com) to show up in map results.

**What's included for SEO:**
- Meta title, description, keywords on every page
- Open Graph tags (Facebook, WhatsApp, LinkedIn previews)
- Twitter Card tags
- JSON-LD structured data (Organization + WebApplication + SearchAction)
- Dynamic sitemap at `/sitemap.xml`
- `robots.txt` that blocks `/admin` from crawlers
- `noindex` on admin pages so Google never shows them
- FAQ section with real content (Google loves FAQ pages)
- Semantic HTML with proper heading structure (`h1`, `h2`, `h3`)
- Mobile responsive (Google ranks mobile-friendly sites higher)

### Change Branding
Edit `components/Layout.js` to change the logo and company name.

### Change Statuses
Edit `lib/constants.js` to add, remove, or rename shipment statuses.

### Change Admin Password
Set the `ADMIN_PASSWORD` environment variable in Vercel or in `.env.local`.

---

## Tech Stack

- **Framework:** Next.js 14 (Pages Router)
- **Styling:** Tailwind CSS
- **Database:** Upstash Redis (serverless, free tier)
- **Deployment:** Vercel
- **Fonts:** DM Sans + Space Mono
