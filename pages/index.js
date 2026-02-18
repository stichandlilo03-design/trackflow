import { useState } from "react";
import Head from "next/head";
import Layout from "../components/Layout";
import { STATUS_STEPS, getStatusColor } from "../lib/constants";

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

  return (
    <Layout>
      <Head>
        <title>Track Your Shipment — TrackFlow</title>
      </Head>

      {/* Hero Section */}
      <div className="relative overflow-hidden py-20 sm:py-28 px-4 text-center">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_0%,rgba(245,158,11,0.07)_0%,transparent_60%)]" />
        <div className="relative max-w-2xl mx-auto animate-fade-up">
          <h1 className="font-mono text-3xl sm:text-5xl font-bold text-dark-50 mb-3 tracking-tight">
            Track Your Shipment
          </h1>
          <p className="text-dark-400 text-base sm:text-lg mb-10 leading-relaxed">
            Enter your tracking number to get real-time updates on your package
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
      </div>

      {/* Results */}
      <div className="max-w-3xl mx-auto px-4 pb-16">
        {/* Loading */}
        {loading && (
          <div className="text-center py-12">
            <div className="w-10 h-10 border-3 border-dark-700 border-t-brand-500 rounded-full animate-spin mx-auto" 
                 style={{ borderWidth: 3 }} />
          </div>
        )}

        {/* Not Found */}
        {searched && !loading && !result && (
          <div className="text-center py-16 animate-fade-up">
            <div className="text-5xl mb-4 opacity-40">🔍</div>
            <h3 className="text-dark-50 text-xl font-semibold mb-2">
              No shipment found
            </h3>
            <p className="text-dark-400">
              Please check your tracking number and try again.
            </p>
          </div>
        )}

        {/* Found */}
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

              {/* Info Grid */}
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
                {result.weight && (
                  <InfoItem label="Weight" value={result.weight} />
                )}
                {result.pieces && (
                  <InfoItem label="Pieces" value={result.pieces} />
                )}
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
                  // Skip steps far beyond current unless delivered/returned
                  if (i > currentStepIndex + 1 && !["delivered", "returned"].includes(result.status)) {
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
                            style={{
                              background: isPast ? "#f59e0b" : "#1e293b",
                            }}
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
                        {u.date} {u.time && `at ${u.time}`} {u.location && `— ${u.location}`}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
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
