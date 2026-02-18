import { getShipment, saveShipment, deleteShipment, searchShipment } from "../../../lib/store";
import { verifyAdmin } from "../../../lib/auth";

export default async function handler(req, res) {
  const { id } = req.query;

  if (req.method === "GET") {
    try {
      const shipment = await searchShipment(id);
      if (!shipment) {
        return res.status(404).json({ error: "Shipment not found" });
      }
      return res.status(200).json(shipment);
    } catch (error) {
      console.error("Failed to fetch shipment:", error);
      return res.status(500).json({ error: "Failed to fetch shipment" });
    }
  }

  if (req.method === "PUT") {
    if (!verifyAdmin(req)) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    try {
      const existing = await getShipment(id);
      if (!existing) {
        return res.status(404).json({ error: "Shipment not found" });
      }
      const updated = {
        ...existing,
        ...req.body,
        trackingId: id,
        updatedAt: Date.now(),
      };
      const saved = await saveShipment(updated);
      return res.status(200).json(saved);
    } catch (error) {
      console.error("Failed to update shipment:", error);
      return res.status(500).json({ error: "Failed to update shipment" });
    }
  }

  if (req.method === "DELETE") {
    if (!verifyAdmin(req)) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    try {
      await deleteShipment(id);
      return res.status(200).json({ success: true });
    } catch (error) {
      console.error("Failed to delete shipment:", error);
      return res.status(500).json({ error: "Failed to delete shipment" });
    }
  }

  return res.status(405).json({ error: "Method not allowed" });
}
