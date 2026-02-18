import { useState, useEffect, useCallback } from "react";
import Head from "next/head";
import Layout from "../components/Layout";
import { STATUS_STEPS, SHIPMENT_TYPES, getStatusColor } from "../lib/constants";

export default function AdminPage() {
  const [authed, setAuthed] = useState(false);
  const [password, setPassword] = useState("");
  const [token, setToken] = useState("");
  const [authError, setAuthError] = useState("");
  const [shipments, setShipments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [searchFilter, setSearchFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [form, setForm] = useState(getEmptyForm());
  const [newUpdate, setNewUpdate] = useState({ message: "", date: "", time: "", location: "" });
  const [saving, setSaving] = useState(false);
  const [copiedId, setCopiedId] = useState(null);

  function getEmptyForm() {
    return {
      trackingId: generateId(),
      recipientName: "",
      senderName: "",
      origin: "",
      destination: "",
      status: "order_placed",
      shipmentType: "Standard Parcel",
      estimatedDelivery: "",
      weight: "",
      pieces: "",
      description: "",
      lastUpdate: "",
      updates: [],
    };
  }

  function generateId() {
    const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
    let id = "";
    for (let i = 0; i < 8; i++) id += chars[Math.floor(Math.random() * chars.length)];
    return "TRK-" + id;
  }

  // Auth
  const handleLogin = async () => {
    setAuthError("");
    try {
      const res = await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      if (res.ok) {
        const data = await res.json();
        setToken(data.token);
        setAuthed(true);
      } else {
        setAuthError("Incorrect password");
      }
    } catch {
      setAuthError("Connection failed");
    }
  };

  // Fetch shipments
  const fetchShipments = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/shipments");
      if (res.ok) {
        const data = await res.json();
        setShipments(data);
      }
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    if (authed) fetchShipments();
  }, [authed, fetchShipments]);

  // Save
  const handleSave = async () => {
    if (!form.recipientName || !form.origin || !form.destination) {
      alert("Please fill in Recipient Name, Origin, and Destination.");
      return;
    }
    setSaving(true);
    try {
      if (editingId) {
        await fetch(`/api/shipments/${editingId}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(form),
        });
      } else {
        await fetch("/api/shipments", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(form),
        });
      }
      await fetchShipments();
      setShowForm(false);
      setEditingId(null);
      setForm(getEmptyForm());
    } catch (e) {
      alert("Failed to save. Please try again.");
    }
    setSaving(false);
  };

  // Delete
  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this shipment?")) return;
    try {
      await fetch(`/api/shipments/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      await fetchShipments();
    } catch (e) {
      alert("Failed to delete.");
    }
  };

  // Quick status change
  const handleQuickStatus = async (shipment, newStatus) => {
    try {
      await fetch(`/api/shipments/${shipment.trackingId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...shipment,
          status: newStatus,
          lastUpdate: `Status updated to ${STATUS_STEPS.find(s => s.key === newStatus)?.label} on ${new Date().toLocaleDateString()}`,
          updates: [
            ...(shipment.updates || []),
            {
              message: `Status changed to ${STATUS_STEPS.find(s => s.key === newStatus)?.label}`,
              date: new Date().toLocaleDateString(),
              time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
            },
          ],
        }),
      });
      await fetchShipments();
    } catch (e) {
      alert("Failed to update status.");
    }
  };

  // Copy tracking ID
  const copyId = (id) => {
    navigator.clipboard.writeText(id);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Add update entry
  const addUpdate = () => {
    if (!newUpdate.message.trim()) return;
    setForm({
      ...form,
      updates: [
        ...form.updates,
        {
          message: newUpdate.message,
          date: newUpdate.date || new Date().toLocaleDateString(),
          time: newUpdate.time || new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          location: newUpdate.location,
        },
      ],
    });
    setNewUpdate({ message: "", date: "", time: "", location: "" });
  };

  const removeUpdate = (i) => {
    setForm({ ...form, updates: form.updates.filter((_, idx) => idx !== i) });
  };

  // Filter
  const filtered = shipments.filter((s) => {
    const matchSearch =
      s.trackingId.toLowerCase().includes(searchFilter.toLowerCase()) ||
      s.recipientName?.toLowerCase().includes(searchFilter.toLowerCase()) ||
      s.destination?.toLowerCase().includes(searchFilter.toLowerCase());
    const matchStatus = statusFilter === "all" || s.status === statusFilter;
    return matchSearch && matchStatus;
  });

  // Login screen
  if (!authed) {
    return (
      <Layout>
        <Head>
          <title>Admin Login — TrackFlow</title>
        </Head>
        <div className="flex items-center justify-center min-h-[calc(100vh-64px)] px-4">
          <div className="bg-dark-800 border border-dark-700 rounded-2xl p-10 sm:p-12 text-center max-w-sm w-full animate-fade-up">
            <div className="text-4xl mb-4">🔒</div>
            <h2 className="font-mono text-xl font-bold text-dark-50 mb-2">
              Admin Access
            </h2>
            <p className="text-dark-400 text-sm mb-7">
              Enter your password to manage shipments
            </p>
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleLogin()}
              className="w-full bg-dark-900 border-2 border-dark-700 rounded-xl px-4 py-3 text-dark-50 text-sm mb-3"
            />
            {authError && (
              <p className="text-red-400 text-sm mb-3">{authError}</p>
            )}
            <button
              onClick={handleLogin}
              className="w-full bg-gradient-to-br from-brand-500 to-brand-600 text-dark-900 font-bold text-sm py-3 rounded-xl hover:from-brand-400 hover:to-brand-500 transition-all"
            >
              Unlock Dashboard
            </button>
            <p className="text-dark-500 text-xs mt-5">
              Default password: <span className="font-mono text-dark-300">admin123</span>
            </p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <Head>
        <title>Admin Dashboard — TrackFlow</title>
      </Head>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 animate-fade-up">
        {/* Header */}
        <div className="flex flex-wrap justify-between items-center gap-4 mb-7">
          <div>
            <h2 className="font-mono text-2xl sm:text-3xl font-bold text-dark-50">
              Shipment Management
            </h2>
            <p className="text-dark-400 text-sm mt-1">
              {shipments.length} total shipments
            </p>
          </div>
          <button
            onClick={() => {
              setForm(getEmptyForm());
              setEditingId(null);
              setShowForm(true);
            }}
            className="bg-gradient-to-br from-brand-500 to-brand-600 text-dark-900 font-bold text-sm px-6 py-3 rounded-xl hover:from-brand-400 hover:to-brand-500 transition-all"
          >
            + New Shipment
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-7">
          {[
            { label: "Total", count: shipments.length, icon: "📦", color: "#94a3b8" },
            { label: "In Transit", count: shipments.filter(s => ["in_transit", "out_for_delivery", "customs", "at_hub"].includes(s.status)).length, icon: "🚚", color: "#f59e0b" },
            { label: "Delivered", count: shipments.filter(s => s.status === "delivered").length, icon: "✅", color: "#22c55e" },
            { label: "On Hold", count: shipments.filter(s => ["on_hold", "returned"].includes(s.status)).length, icon: "⏸️", color: "#ef4444" },
          ].map((stat) => (
            <div key={stat.label} className="bg-dark-800 border border-dark-700 rounded-xl p-4">
              <div className="text-dark-400 text-xs font-semibold tracking-wider mb-2">{stat.label}</div>
              <div className="flex items-end gap-2">
                <span className="text-2xl font-bold font-mono" style={{ color: stat.color }}>
                  {stat.count}
                </span>
                <span className="text-lg mb-0.5">{stat.icon}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-3 mb-6">
          <div className="relative flex-1 min-w-[200px]">
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm">🔍</span>
            <input
              value={searchFilter}
              onChange={(e) => setSearchFilter(e.target.value)}
              placeholder="Search tracking ID, recipient, destination..."
              className="w-full bg-dark-800 border-2 border-dark-700 rounded-xl py-3 pl-10 pr-4 text-dark-50 text-sm"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-dark-800 border-2 border-dark-700 rounded-xl py-3 px-4 text-dark-200 text-sm min-w-[160px]"
          >
            <option value="all">All Statuses</option>
            {STATUS_STEPS.map((s) => (
              <option key={s.key} value={s.key}>
                {s.icon} {s.label}
              </option>
            ))}
          </select>
        </div>

        {/* Shipments List */}
        {loading ? (
          <div className="text-center py-16">
            <div
              className="w-10 h-10 border-dark-700 border-t-brand-500 rounded-full animate-spin mx-auto"
              style={{ borderWidth: 3 }}
            />
          </div>
        ) : filtered.length === 0 ? (
          <div className="bg-dark-800 border border-dark-700 rounded-2xl text-center py-16">
            <div className="text-5xl mb-4">📦</div>
            <h3 className="text-dark-50 text-lg font-semibold mb-2">
              {shipments.length === 0 ? "No shipments yet" : "No matching shipments"}
            </h3>
            <p className="text-dark-400 text-sm">
              {shipments.length === 0
                ? 'Click "New Shipment" to create your first tracking entry'
                : "Try adjusting your search or filter"}
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map((s, i) => {
              const statusColor = getStatusColor(s.status);
              const step = STATUS_STEPS.find((st) => st.key === s.status);
              return (
                <div
                  key={s.trackingId}
                  className="bg-dark-800 border border-dark-700 rounded-xl p-4 sm:p-5 hover:border-dark-600 transition-colors animate-slide-in"
                  style={{ animationDelay: `${i * 40}ms` }}
                >
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    {/* Left Info */}
                    <div className="flex-1 min-w-[200px]">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="font-mono text-brand-500 font-bold text-sm">
                          {s.trackingId}
                        </span>
                        <button
                          onClick={() => copyId(s.trackingId)}
                          className="text-dark-500 hover:text-brand-500 text-xs px-1.5 py-0.5 rounded border border-dark-600 hover:border-brand-500/30 transition-all"
                          title="Copy tracking ID"
                        >
                          {copiedId === s.trackingId ? "✓ Copied" : "Copy"}
                        </button>
                      </div>
                      <div className="text-dark-100 font-medium text-sm mb-1">
                        {s.recipientName}
                      </div>
                      <div className="text-dark-400 text-xs">
                        {s.origin}
                        <span className="text-brand-500 mx-1.5">→</span>
                        {s.destination}
                      </div>
                      {s.shipmentType && (
                        <div className="text-dark-500 text-xs mt-1">{s.shipmentType}</div>
                      )}
                    </div>

                    {/* Status + Actions */}
                    <div className="flex flex-wrap items-center gap-2">
                      {/* Quick Status Dropdown */}
                      <select
                        value={s.status}
                        onChange={(e) => handleQuickStatus(s, e.target.value)}
                        className="text-xs font-semibold rounded-full px-3 py-1.5 border-none cursor-pointer"
                        style={{
                          background: statusColor.bg,
                          color: statusColor.text,
                        }}
                      >
                        {STATUS_STEPS.map((st) => (
                          <option key={st.key} value={st.key}>
                            {st.icon} {st.label}
                          </option>
                        ))}
                      </select>

                      <button
                        onClick={() => {
                          setForm({ ...s });
                          setEditingId(s.trackingId);
                          setShowForm(true);
                        }}
                        className="text-xs font-semibold text-blue-400 bg-blue-400/10 px-3 py-1.5 rounded-lg hover:bg-blue-400/20 transition-colors"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(s.trackingId)}
                        className="text-xs font-semibold text-red-400 bg-red-400/10 px-3 py-1.5 rounded-lg hover:bg-red-400/20 transition-colors"
                      >
                        Delete
                      </button>
                    </div>
                  </div>

                  {/* Extra Info Row */}
                  {(s.estimatedDelivery || s.weight || s.lastUpdate) && (
                    <div className="flex flex-wrap gap-x-6 gap-y-1 mt-3 pt-3 border-t border-dark-700/50">
                      {s.estimatedDelivery && (
                        <span className="text-dark-400 text-xs">
                          Est: <span className="text-dark-200">{s.estimatedDelivery}</span>
                        </span>
                      )}
                      {s.weight && (
                        <span className="text-dark-400 text-xs">
                          Weight: <span className="text-dark-200">{s.weight}</span>
                        </span>
                      )}
                      {s.updates?.length > 0 && (
                        <span className="text-dark-400 text-xs">
                          Updates: <span className="text-dark-200">{s.updates.length}</span>
                        </span>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Modal Form */}
      {showForm && (
        <div
          className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-start justify-center z-[200] p-4 sm:p-8 overflow-y-auto"
          onClick={() => setShowForm(false)}
        >
          <div
            className="bg-dark-800 border border-dark-700 rounded-2xl max-w-2xl w-full animate-fade-up my-4"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex justify-between items-center px-6 py-5 border-b border-dark-700">
              <h3 className="font-mono text-lg font-bold text-dark-50">
                {editingId ? "Edit Shipment" : "Create New Shipment"}
              </h3>
              <button
                onClick={() => setShowForm(false)}
                className="text-dark-400 hover:text-dark-200 text-xl"
              >
                ✕
              </button>
            </div>

            {/* Modal Body */}
            <div className="px-6 py-5 max-h-[70vh] overflow-y-auto">
              {/* Tracking ID */}
              <div className="mb-5 bg-dark-900 rounded-xl p-4 flex items-center justify-between">
                <div>
                  <div className="text-dark-400 text-xs font-semibold tracking-wider mb-1">
                    TRACKING ID
                  </div>
                  <div className="font-mono text-brand-500 font-bold text-lg">
                    {form.trackingId}
                  </div>
                </div>
                {!editingId && (
                  <button
                    onClick={() => setForm({ ...form, trackingId: generateId() })}
                    className="text-xs text-dark-300 hover:text-brand-500 border border-dark-600 px-3 py-1.5 rounded-lg transition-colors"
                  >
                    Regenerate
                  </button>
                )}
              </div>

              {/* Form Fields */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
                <FormField
                  label="Recipient Name *"
                  value={form.recipientName}
                  onChange={(v) => setForm({ ...form, recipientName: v })}
                  placeholder="John Doe"
                />
                <FormField
                  label="Sender Name"
                  value={form.senderName}
                  onChange={(v) => setForm({ ...form, senderName: v })}
                  placeholder="Your Company"
                />
                <FormField
                  label="Origin *"
                  value={form.origin}
                  onChange={(v) => setForm({ ...form, origin: v })}
                  placeholder="Nairobi, Kenya"
                />
                <FormField
                  label="Destination *"
                  value={form.destination}
                  onChange={(v) => setForm({ ...form, destination: v })}
                  placeholder="Mombasa, Kenya"
                />
                <div>
                  <label className="block text-dark-300 text-xs font-semibold tracking-wide mb-1.5">
                    Status
                  </label>
                  <select
                    value={form.status}
                    onChange={(e) => setForm({ ...form, status: e.target.value })}
                    className="w-full bg-dark-900 border-2 border-dark-700 rounded-xl px-3 py-2.5 text-dark-50 text-sm"
                  >
                    {STATUS_STEPS.map((s) => (
                      <option key={s.key} value={s.key}>
                        {s.icon} {s.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-dark-300 text-xs font-semibold tracking-wide mb-1.5">
                    Shipment Type
                  </label>
                  <select
                    value={form.shipmentType}
                    onChange={(e) => setForm({ ...form, shipmentType: e.target.value })}
                    className="w-full bg-dark-900 border-2 border-dark-700 rounded-xl px-3 py-2.5 text-dark-50 text-sm"
                  >
                    {SHIPMENT_TYPES.map((t) => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </div>
                <FormField
                  label="Estimated Delivery"
                  value={form.estimatedDelivery}
                  onChange={(v) => setForm({ ...form, estimatedDelivery: v })}
                  placeholder="2025-02-25"
                  type="date"
                />
                <FormField
                  label="Weight"
                  value={form.weight}
                  onChange={(v) => setForm({ ...form, weight: v })}
                  placeholder="2.5 kg"
                />
                <FormField
                  label="Number of Pieces"
                  value={form.pieces}
                  onChange={(v) => setForm({ ...form, pieces: v })}
                  placeholder="3"
                />
                <FormField
                  label="Last Status Note"
                  value={form.lastUpdate}
                  onChange={(v) => setForm({ ...form, lastUpdate: v })}
                  placeholder="Package scanned at hub"
                />
              </div>

              <div className="mb-5">
                <label className="block text-dark-300 text-xs font-semibold tracking-wide mb-1.5">
                  Description
                </label>
                <textarea
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  placeholder="Package contents, special handling notes..."
                  rows={2}
                  className="w-full bg-dark-900 border-2 border-dark-700 rounded-xl px-3 py-2.5 text-dark-50 text-sm resize-y"
                />
              </div>

              {/* Activity Updates */}
              <div>
                <label className="block text-dark-300 text-xs font-semibold tracking-wide mb-2">
                  Activity Timeline Updates
                </label>
                <div className="bg-dark-900 rounded-xl p-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-2">
                    <input
                      value={newUpdate.message}
                      onChange={(e) => setNewUpdate({ ...newUpdate, message: e.target.value })}
                      onKeyDown={(e) => e.key === "Enter" && addUpdate()}
                      placeholder="Update message *"
                      className="bg-dark-800 border-2 border-dark-700 rounded-lg px-3 py-2 text-dark-50 text-sm sm:col-span-2"
                    />
                    <input
                      value={newUpdate.date}
                      onChange={(e) => setNewUpdate({ ...newUpdate, date: e.target.value })}
                      placeholder="Date (e.g. Feb 18, 2025)"
                      className="bg-dark-800 border-2 border-dark-700 rounded-lg px-3 py-2 text-dark-50 text-sm"
                    />
                    <input
                      value={newUpdate.time}
                      onChange={(e) => setNewUpdate({ ...newUpdate, time: e.target.value })}
                      placeholder="Time (e.g. 2:30 PM)"
                      className="bg-dark-800 border-2 border-dark-700 rounded-lg px-3 py-2 text-dark-50 text-sm"
                    />
                    <input
                      value={newUpdate.location}
                      onChange={(e) => setNewUpdate({ ...newUpdate, location: e.target.value })}
                      placeholder="Location (e.g. Nairobi Hub)"
                      className="bg-dark-800 border-2 border-dark-700 rounded-lg px-3 py-2 text-dark-50 text-sm"
                    />
                    <button
                      onClick={addUpdate}
                      className="bg-dark-700 hover:bg-dark-600 border-2 border-dark-600 text-brand-500 font-semibold text-sm px-4 py-2 rounded-lg transition-colors"
                    >
                      + Add Update
                    </button>
                  </div>

                  {form.updates.length > 0 && (
                    <div className="mt-3 space-y-2 max-h-48 overflow-y-auto">
                      {form.updates.map((u, i) => (
                        <div
                          key={i}
                          className="flex items-start gap-2 bg-dark-800 rounded-lg px-3 py-2 text-sm"
                        >
                          <div className="w-1.5 h-1.5 rounded-full bg-brand-500 mt-1.5 flex-shrink-0" />
                          <div className="flex-1 min-w-0">
                            <div className="text-dark-100 text-sm">{u.message}</div>
                            <div className="text-dark-500 text-xs mt-0.5">
                              {u.date} {u.time && `at ${u.time}`}{" "}
                              {u.location && `— ${u.location}`}
                            </div>
                          </div>
                          <button
                            onClick={() => removeUpdate(i)}
                            className="text-red-400 hover:text-red-300 text-xs flex-shrink-0"
                          >
                            ✕
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex justify-end gap-3 px-6 py-4 border-t border-dark-700">
              <button
                onClick={() => setShowForm(false)}
                className="text-dark-300 hover:text-dark-100 border-2 border-dark-700 font-semibold text-sm px-5 py-2.5 rounded-xl transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="bg-gradient-to-br from-brand-500 to-brand-600 text-dark-900 font-bold text-sm px-6 py-2.5 rounded-xl hover:from-brand-400 hover:to-brand-500 transition-all disabled:opacity-50"
              >
                {saving ? "Saving..." : editingId ? "Update Shipment" : "Create Shipment"}
              </button>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
}

function FormField({ label, value, onChange, placeholder, type = "text" }) {
  return (
    <div>
      <label className="block text-dark-300 text-xs font-semibold tracking-wide mb-1.5">
        {label}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full bg-dark-900 border-2 border-dark-700 rounded-xl px-3 py-2.5 text-dark-50 text-sm"
      />
    </div>
  );
}
