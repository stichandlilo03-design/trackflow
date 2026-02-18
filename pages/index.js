import { useState } from "react";
import Head from "next/head";
import Layout from "../components/Layout";
import { STATUS_STEPS, getStatusColor } from "../lib/constants";
import siteConfig from "../lib/siteConfig";

export default function TrackPage() {
  const [trackingId, setTrackingId] = useState("");
  const [result, setResult] = useState(null);
  const [searched, setSearched] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleTrack = async () => {
    const id = trackingId.trim();
    if (!id) return;
    setLoading(true);
    setSearched(true);
    try {
      const res = await fetch(`/api/shipments/${encodeURIComponent(id)}`);
      if (res.ok) {
        const data = await res.json();
        setResult(data);
      } else {
        setResult(null);
      }
    } catch {
      setResult(null);
    }
    setLoading(false);
  };

  const currentStepIndex = result
    ? STATUS_STEPS.findIndex((s) => s.key === result.status)
    : -1;

  const statusColor = result ? getStatusColor(result.status) : null;

  // JSON-LD Structured Data for Google
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: `${siteConfig.name} — ${siteConfig.tagline}`,
    url: siteConfig.url,
    description: siteConfig.description,
    applicationCategory: "BusinessApplication",
    operatingSystem: "Any",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
    provider: {
      "@type": siteConfig.company.type,
      name: siteConfig.company.legalName,
      ...(siteConfig.company.email && { email: siteConfig.company.email }),
      ...(siteConfig.company.phone && { telephone: siteConfig.company.phone }),
      ...(siteConfig.company.address.city && {
        address: {
          "@type": "PostalAddress",
          ...(siteConfig.company.address.street && { streetAddress: siteConfig.company.address.street }),
          addressLocality: siteConfig.company.address.city,
          ...(siteConfig.company.address.region && { addressRegion: siteConfig.company.address.region }),
          addressCountry: siteConfig.company.address.country,
          ...(siteConfig.company.address.postalCode && { postalCode: siteConfig.company.address.postalCode }),
        },
      }),
    },
  };

  const orgData = {
    "@context": "https://schema.org",
    "@type": siteConfig.company.type,
    name: siteConfig.company.legalName,
    url: siteConfig.url,
    ...(siteConfig.company.email && { email: siteConfig.company.email }),
    ...(siteConfig.company.phone && { telephone: siteConfig.company.phone }),
    ...(siteConfig.company.foundingYear && {
      foundingDate: String(siteConfig.company.foundingYear),
    }),
    sameAs: [
      siteConfig.social.facebook,
      siteConfig.social.twitter,
      siteConfig.social.instagram,
      siteConfig.social.linkedin,
    ].filter(Boolean),
  };

  const searchActionData = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    url: siteConfig.url,
    name: siteConfig.name,
    potentialAction: {
      "@type": "SearchAction",
      target: `${siteConfig.url}/?track={tracking_number}`,
      "query-input": "required name=tracking_number",
    },
  };

  return (
    <Layout>
      <Head>
        <title>{`${siteConfig.name} — ${siteConfig.tagline}`}</title>
        <meta name="description" content={siteConfig.description} />
        <meta name="keywords" content={siteConfig.keywords} />
        <link rel="canonical" href={siteConfig.url} />

        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content={siteConfig.url} />
        <meta property="og:title" content={`${siteConfig.name} — ${siteConfig.tagline}`} />
        <meta property="og:description" content={siteConfig.description} />
        <meta property="og:image" content={`${siteConfig.url}${siteConfig.ogImage}`} />
        <meta property="og:site_name" content={siteConfig.name} />
        <meta property="og:locale" content="en_US" />

        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={`${siteConfig.name} — ${siteConfig.tagline}`} />
        <meta name="twitter:description" content={siteConfig.description} />
        <meta name="twitter:image" content={`${siteConfig.url}${siteConfig.ogImage}`} />
        {siteConfig.social.twitter && (
          <meta name="twitter:site" content={siteConfig.social.twitter} />
        )}

        {/* Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(orgData) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(searchActionData) }}
        />
      </Head>

      {/* ========== HERO SECTION ========== */}
      <section className="relative overflow-hidden py-20 sm:py-28 px-4 text-center">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_0%,rgba(245,158,11,0.07)_0%,transparent_60%)]" />
        <div className="relative max-w-2xl mx-auto animate-fade-up">
          <h1 className="font-mono text-3xl sm:text-5xl font-bold text-dark-50 mb-3 tracking-tight">
            Track Your Shipment
          </h1>
          <p className="text-dark-400 text-base sm:text-lg mb-10 leading-relaxed max-w-lg mx-auto">
            Enter your tracking number to get real-time updates on your package location and delivery status.
          </p>

          {/* Search Bar */}
          <div className="flex items-center bg-dark-800 border-2 border-dark-700 rounded-2xl p-1.5 max-w-xl mx-auto focus-within:border-brand-500/40 transition-colors">
            <span className="px-3 text-lg">🔍</span>
            <input
              type="text"
              placeholder="Enter tracking number (e.g. TRK-XXXXXXXX)"
              value={trackingId}
              onChange={(e) => setTrackingId(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleTrack()}
              aria-label="Tracking number"
              className="flex-1 bg-transparent border-none text-dark-50 text-sm sm:text-base font-mono py-3 px-1 placeholder:text-dark-500"
            />
            <button
              onClick={handleTrack}
              disabled={loading}
              className="bg-gradient-to-br from-brand-500 to-brand-600 text-dark-900 font-bold text-sm px-6 py-3 rounded-xl hover:from-brand-400 hover:to-brand-500 transition-all disabled:opacity-50"
            >
              {loading ? "..." : "Track"}
            </button>
          </div>
        </div>
      </section>

      {/* ========== TRACKING RESULTS ========== */}
      <div className="max-w-3xl mx-auto px-4 pb-16">
        {loading && (
          <div className="text-center py-12">
            <div
              className="w-10 h-10 border-dark-700 border-t-brand-500 rounded-full animate-spin mx-auto"
              style={{ borderWidth: 3 }}
            />
          </div>
        )}

        {searched && !loading && !result && (
          <div className="text-center py-16 animate-fade-up">
            <div className="text-5xl mb-4 opacity-40">🔍</div>
            <h2 className="text-dark-50 text-xl font-semibold mb-2">
              No shipment found
            </h2>
            <p className="text-dark-400">
              Please check your tracking number and try again.
            </p>
          </div>
        )}

        {result && !loading && (
          <div className="animate-fade-up space-y-5">
            {/* Header Card */}
            <div className="bg-dark-800 border border-dark-700 rounded-2xl p-6 sm:p-7">
              <div className="flex flex-wrap justify-between items-start gap-4 mb-6">
                <div>
                  <div className="text-dark-400 text-xs font-semibold tracking-widest mb-1">
                    TRACKING NUMBER
                  </div>
                  <div className="font-mono text-xl sm:text-2xl font-bold text-brand-500">
                    {result.trackingId}
                  </div>
                </div>
                <span
                  className="px-4 py-2 rounded-full text-sm font-semibold"
                  style={{ background: statusColor?.bg, color: statusColor?.text }}
                >
                  {STATUS_STEPS[currentStepIndex]?.icon}{" "}
                  {STATUS_STEPS[currentStepIndex]?.label}
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-5">
                {result.recipientName && (
                  <InfoItem label="Recipient" value={result.recipientName} />
                )}
                {result.senderName && (
                  <InfoItem label="Sender" value={result.senderName} />
                )}
                <InfoItem label="Origin" value={result.origin} />
                <InfoItem label="Destination" value={result.destination} />
                {result.estimatedDelivery && (
                  <InfoItem label="Est. Delivery" value={result.estimatedDelivery} />
                )}
                {result.shipmentType && (
                  <InfoItem label="Shipment Type" value={result.shipmentType} />
                )}
                {result.weight && <InfoItem label="Weight" value={result.weight} />}
                {result.pieces && <InfoItem label="Pieces" value={result.pieces} />}
                {result.description && (
                  <InfoItem label="Description" value={result.description} />
                )}
              </div>
            </div>

            {/* Progress Tracker */}
            <div className="bg-dark-800 border border-dark-700 rounded-2xl p-6 sm:p-7">
              <h3 className="font-mono text-base font-bold text-dark-50 mb-6 tracking-wide">
                Shipment Progress
              </h3>
              <div>
                {STATUS_STEPS.map((step, i) => {
                  const isComplete = i <= currentStepIndex;
                  const isCurrent = i === currentStepIndex;
                  const isPast = i < currentStepIndex;
                  if (
                    i > currentStepIndex + 1 &&
                    !["delivered", "returned"].includes(result.status)
                  ) {
                    if (i > currentStepIndex + 2) return null;
                  }
                  return (
                    <div
                      key={step.key}
                      className="flex gap-4 animate-slide-in"
                      style={{ animationDelay: `${i * 80}ms` }}
                    >
                      <div className="flex flex-col items-center">
                        <div
                          className={`w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 text-sm transition-all ${
                            isCurrent ? "pulse-dot" : ""
                          }`}
                          style={{
                            background: isComplete ? "#f59e0b" : "#1e293b",
                            border: isComplete
                              ? "3px solid #f59e0b"
                              : "3px solid #334155",
                          }}
                        >
                          {isComplete ? step.icon : ""}
                        </div>
                        {i < STATUS_STEPS.length - 1 && (
                          <div
                            className="w-0.5 flex-1 min-h-[24px] rounded transition-all"
                            style={{ background: isPast ? "#f59e0b" : "#1e293b" }}
                          />
                        )}
                      </div>
                      <div className="pb-7">
                        <div
                          className={`text-sm font-semibold pt-2 ${
                            isComplete ? "text-dark-50" : "text-dark-500"
                          }`}
                        >
                          {step.label}
                        </div>
                        {isCurrent && result.lastUpdate && (
                          <div className="text-dark-400 text-xs mt-1">
                            {result.lastUpdate}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Activity Timeline */}
            {result.updates && result.updates.length > 0 && (
              <div className="bg-dark-800 border border-dark-700 rounded-2xl p-6 sm:p-7">
                <h3 className="font-mono text-base font-bold text-dark-50 mb-5 tracking-wide">
                  Activity Log
                </h3>
                {result.updates.map((u, i) => (
                  <div
                    key={i}
                    className="flex items-start gap-3.5 py-3 border-b border-dark-700/60 last:border-0 animate-slide-in"
                    style={{ animationDelay: `${i * 50}ms` }}
                  >
                    <div className="w-2 h-2 rounded-full bg-brand-500 mt-1.5 flex-shrink-0" />
                    <div>
                      <div className="text-dark-100 text-sm leading-relaxed">
                        {u.message}
                      </div>
                      <div className="text-dark-500 text-xs mt-1">
                        {u.date} {u.time && `at ${u.time}`}{" "}
                        {u.location && `— ${u.location}`}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* ========== SEO CONTENT SECTIONS (visible to Google) ========== */}
      {!result && !searched && (
        <>
          {/* How It Works */}
          <section className="max-w-5xl mx-auto px-4 py-16">
            <h2 className="font-mono text-2xl sm:text-3xl font-bold text-dark-50 text-center mb-3">
              How It Works
            </h2>
            <p className="text-dark-400 text-center mb-12 max-w-lg mx-auto">
              Tracking your shipment is fast and easy. Just follow these simple steps.
            </p>
            <div className="grid sm:grid-cols-3 gap-6">
              {[
                {
                  step: "01",
                  icon: "📝",
                  title: "Get Your Tracking Number",
                  desc: "When your shipment is booked, you receive a unique tracking number starting with TRK-.",
                },
                {
                  step: "02",
                  icon: "🔍",
                  title: "Enter It Above",
                  desc: "Paste your tracking number in the search bar and hit Track to see your shipment status.",
                },
                {
                  step: "03",
                  icon: "📍",
                  title: "Follow Your Package",
                  desc: "See real-time status updates, location changes, and estimated delivery dates for your package.",
                },
              ].map((item) => (
                <article
                  key={item.step}
                  className="bg-dark-800 border border-dark-700 rounded-2xl p-6 hover:border-brand-500/20 transition-colors"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <span className="text-3xl">{item.icon}</span>
                    <span className="font-mono text-brand-500/40 text-sm font-bold">
                      STEP {item.step}
                    </span>
                  </div>
                  <h3 className="text-dark-50 font-semibold text-lg mb-2">
                    {item.title}
                  </h3>
                  <p className="text-dark-400 text-sm leading-relaxed">
                    {item.desc}
                  </p>
                </article>
              ))}
            </div>
          </section>

          {/* Tracking Statuses Explained */}
          <section className="max-w-5xl mx-auto px-4 py-16">
            <h2 className="font-mono text-2xl sm:text-3xl font-bold text-dark-50 text-center mb-3">
              Shipment Status Guide
            </h2>
            <p className="text-dark-400 text-center mb-12 max-w-lg mx-auto">
              Understand what each status means as your package moves through our delivery network.
            </p>
            <div className="grid sm:grid-cols-2 gap-4">
              {STATUS_STEPS.map((status) => {
                const color = getStatusColor(status.key);
                return (
                  <article
                    key={status.key}
                    className="bg-dark-800 border border-dark-700 rounded-xl p-5 flex items-start gap-4"
                  >
                    <span
                      className="w-10 h-10 rounded-xl flex items-center justify-center text-lg flex-shrink-0"
                      style={{ background: color.bg }}
                    >
                      {status.icon}
                    </span>
                    <div>
                      <h3 className="text-dark-50 font-semibold text-sm mb-1">
                        {status.label}
                      </h3>
                      <p className="text-dark-400 text-xs leading-relaxed">
                        {getStatusDescription(status.key)}
                      </p>
                    </div>
                  </article>
                );
              })}
            </div>
          </section>

          {/* FAQ Section (great for SEO) */}
          <section className="max-w-3xl mx-auto px-4 py-16">
            <h2 className="font-mono text-2xl sm:text-3xl font-bold text-dark-50 text-center mb-3">
              Frequently Asked Questions
            </h2>
            <p className="text-dark-400 text-center mb-12">
              Common questions about shipment tracking
            </p>
            <div className="space-y-4">
              {[
                {
                  q: "Where do I find my tracking number?",
                  a: "Your tracking number is provided when your shipment is booked. It starts with TRK- followed by 8 characters. Check your confirmation email or receipt, or contact the sender.",
                },
                {
                  q: "How often is tracking information updated?",
                  a: "Tracking information is updated at each checkpoint in the delivery process — from pickup to processing, transit, and final delivery. Updates typically appear within minutes of each scan.",
                },
                {
                  q: "My tracking number isn't working. What should I do?",
                  a: "Make sure you entered the full tracking number correctly, including the TRK- prefix. If it still doesn't work, your shipment may not have been scanned into the system yet. Please try again later or contact the sender.",
                },
                {
                  q: "What does 'In Transit' mean?",
                  a: "In Transit means your package is on its way and moving between facilities or toward your delivery address. It has left the origin and is actively being transported.",
                },
                {
                  q: "What does 'On Hold' mean?",
                  a: "On Hold means there's a temporary delay with your shipment. This could be due to customs clearance, address verification, or other processing requirements. Contact us for more details.",
                },
                {
                  q: "How long does delivery take?",
                  a: "Delivery times vary based on the shipment type, origin, and destination. Check the estimated delivery date shown in your tracking details for the most accurate timeline.",
                },
              ].map((faq, i) => (
                <details
                  key={i}
                  className="group bg-dark-800 border border-dark-700 rounded-xl overflow-hidden"
                >
                  <summary className="flex items-center justify-between p-5 cursor-pointer list-none text-dark-50 font-medium text-sm hover:text-brand-500 transition-colors">
                    <span>{faq.q}</span>
                    <span className="text-dark-400 group-open:rotate-45 transition-transform text-lg ml-4">
                      +
                    </span>
                  </summary>
                  <div className="px-5 pb-5 text-dark-400 text-sm leading-relaxed border-t border-dark-700 pt-4">
                    {faq.a}
                  </div>
                </details>
              ))}
            </div>
          </section>

          {/* CTA Section */}
          <section className="max-w-3xl mx-auto px-4 py-16 text-center">
            <div className="bg-gradient-to-br from-brand-500/10 to-brand-700/5 border border-brand-500/20 rounded-2xl p-10">
              <h2 className="font-mono text-xl sm:text-2xl font-bold text-dark-50 mb-3">
                Need Help With Your Shipment?
              </h2>
              <p className="text-dark-400 text-sm mb-6 max-w-md mx-auto">
                If you have any questions about your delivery or need assistance, don't hesitate to get in touch with our support team.
              </p>
              {siteConfig.company.email && (
                <a
                  href={`mailto:${siteConfig.company.email}`}
                  className="inline-block bg-gradient-to-br from-brand-500 to-brand-600 text-dark-900 font-bold text-sm px-8 py-3 rounded-xl hover:from-brand-400 hover:to-brand-500 transition-all no-underline"
                >
                  Contact Support
                </a>
              )}
            </div>
          </section>
        </>
      )}
    </Layout>
  );
}

function InfoItem({ label, value }) {
  return (
    <div>
      <div className="text-dark-500 text-[11px] font-semibold tracking-widest uppercase mb-1">
        {label}
      </div>
      <div className="text-dark-100 text-sm font-medium">{value}</div>
    </div>
  );
}

function getStatusDescription(key) {
  const descriptions = {
    order_placed: "Your shipment has been booked and is awaiting pickup from the sender.",
    picked_up: "The package has been collected from the sender and is heading to our facility.",
    processing: "Your package is being processed, sorted, and prepared for transport.",
    in_transit: "Your shipment is on the move, traveling between facilities toward its destination.",
    customs: "The package is going through customs clearance. This may take additional time.",
    at_hub: "Your package has arrived at the local distribution hub near the delivery address.",
    out_for_delivery: "Great news! Your package is on a delivery vehicle and will arrive today.",
    delivered: "Your package has been successfully delivered to the destination.",
    returned: "The shipment has been returned to the sender due to delivery issues.",
    on_hold: "There is a temporary hold on your shipment. Contact support for details.",
  };
  return descriptions[key] || "";
}
