// =============================================
// EDIT THIS FILE TO CUSTOMIZE YOUR SITE SEO
// =============================================

const siteConfig = {
  // Your company/brand name
  name: "TrackFlow",

  // Your domain (no trailing slash) — update this after deploying
  url: "https://www.trackflow.sbs",

  // Short tagline shown in search results
  tagline: "Real-Time Shipment & Package Tracking",

  // Full description for Google (150-160 characters is ideal)
  description:
    "Track your shipments and packages in real-time. Enter your tracking number to get instant updates on your delivery status, location, and estimated arrival.",

  // Keywords Google should associate with your site
  keywords:
    "package tracking, shipment tracking, delivery tracking, track my order, parcel tracking, cargo tracking, logistics tracking, courier tracking",

  // Your company info for Google structured data
  company: {
    type: "Organization", // or "LocalBusiness"
    legalName: "TrackFlow Logistics",
    foundingYear: 2025,
    email: "support@trackflow.sbs",
    phone: "+1 803 639 2892", // e.g. "+4700000000"
    address: {
      street: "",
      city: "Florida",
      region: "Winter,Haven",
      country: "USA",
      postalCode: "33880",
    },
  },

  // Social media links (leave empty if you don't have them)
  social: {
    twitter: "@trackflow", // e.g. "@trackflow"
    facebook: "@trackflow",
    instagram: "@trackflow",
    linkedin: "@trackflow",
  },

  // Open Graph image — place a 1200x630 image in /public/og-image.png
  ogImage: "/og-image.png",
};

export default siteConfig;
