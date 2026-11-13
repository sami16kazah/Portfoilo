# Sami Kazah — Software Engineer Portfolio

Modern full-stack portfolio built with **Next.js 16 (App Router)**, **React 19**, **Tailwind CSS**, **Framer Motion**, and **MongoDB** with an integrated admin dashboard and multilingual SEO/AI-ready support (`EN` / `DE` / `AR` with RTL).

## Highlights

- **Experience**: Current engineering work at [cloudvibe GmbH](https://cloudvibe.de/) with live performance telemetry.
- **Featured Project**: [shelforia](https://shelforia.de/) — cloud ERP for antiquarian booksellers and art dealers, planned and developed by Sami Kazah and Lukas Kowal with the help of Leon Kuck.
- **Interactive Showcase**: Embedded project stage supporting feature previews, multi-clip video demos, and architecture credits.
- **CMS & Fallbacks**: MongoDB-backed admin panel (`/admin`) with curated static fallbacks for instant deployment.

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Environment Variables (Optional for DB / Auth / Email / Media / SEO)

- `MONGODB_URI`
- `AUTH_SECRET`
- `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME`, `NEXT_PUBLIC_CLOUDINARY_API_KEY`, `NEXT_PUBLIC_CLOUDINARY_API_SECRET`
- `MJ_APIKEY_PUBLIC`, `MJ_APIKEY_PRIVATE`, `MAILJET_SENDER_EMAIL`
- `NEXT_PUBLIC_SITE_URL` (custom canonical domain, defaults automatically to Vercel URL)
- `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION`, `NEXT_PUBLIC_BING_SITE_VERIFICATION` (optional search console meta tags)
