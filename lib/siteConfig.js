// =============================================
// EDIT THIS FILE TO CUSTOMIZE YOUR SITE SEO
// =============================================

const siteConfig = {
  // Your company/brand name
  name: "TrackFlow",

  // Your domain (no trailing slash) — update this after deploying
  url: "https://yoursite.com",

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
    email: "support@yoursite.com",
    phone: "", // e.g. "+254700000000"
    address: {
      street: "",
      city: "Nairobi",
      region: "Nairobi",
      country: "KE",
      postalCode: "",
    },
  },

  // Social media links (leave empty if you don't have them)
  social: {
    twitter: "", // e.g. "@trackflow"
    facebook: "",
    instagram: "",
    linkedin: "",
  },

  // Open Graph image — place a 1200x630 image in /public/og-image.png
  ogImage: "/og-image.png",
};

export default siteConfig;
