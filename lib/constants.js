export const STATUS_STEPS = [
  { key: "order_placed", label: "Order Placed", icon: "📋", color: "gray" },
  { key: "picked_up", label: "Picked Up", icon: "📥", color: "blue" },
  { key: "processing", label: "Processing", icon: "⚙️", color: "blue" },
  { key: "in_transit", label: "In Transit", icon: "🚚", color: "amber" },
  { key: "customs", label: "Customs Clearance", icon: "🛃", color: "amber" },
  { key: "at_hub", label: "At Local Hub", icon: "🏢", color: "amber" },
  { key: "out_for_delivery", label: "Out for Delivery", icon: "📦", color: "amber" },
  { key: "delivered", label: "Delivered", icon: "✅", color: "green" },
  { key: "returned", label: "Returned", icon: "↩️", color: "red" },
  { key: "on_hold", label: "On Hold", icon: "⏸️", color: "red" },
];

export const SHIPMENT_TYPES = [
  "Standard Parcel",
  "Express Delivery",
  "Freight",
  "Documents",
  "Fragile Items",
  "Electronics",
  "Perishable Goods",
  "Heavy Cargo",
  "Furniture",
  "Other",
];

export function getStatusColor(status) {
  const step = STATUS_STEPS.find((s) => s.key === status);
  if (!step) return { bg: "rgba(148,163,184,0.12)", text: "#94a3b8" };
  const map = {
    gray: { bg: "rgba(148,163,184,0.12)", text: "#94a3b8" },
    blue: { bg: "rgba(59,130,246,0.12)", text: "#3b82f6" },
    amber: { bg: "rgba(245,158,11,0.12)", text: "#f59e0b" },
    green: { bg: "rgba(34,197,94,0.12)", text: "#22c55e" },
    red: { bg: "rgba(239,68,68,0.12)", text: "#ef4444" },
  };
  return map[step.color] || map.gray;
}
