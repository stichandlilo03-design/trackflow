import { getAllShipments, saveShipment } from "../../../lib/store";
import { verifyAdmin } from "../../../lib/auth";

export default async function handler(req, res) {
  if (req.method === "GET") {
    try {
      const shipments = await getAllShipments();
      return res.status(200).json(shipments);
    } catch (error) {
      console.error("Failed to fetch shipments:", error);
      return res.status(500).json({ error: "Failed to fetch shipments" });
    }
  }

  if (req.method === "POST") {
    if (!verifyAdmin(req)) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    try {
      const shipment = {
        ...req.body,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      };
      const saved = await saveShipment(shipment);
      return res.status(201).json(saved);
    } catch (error) {
      console.error("Failed to create shipment:", error);
      return res.status(500).json({ error: "Failed to create shipment" });
    }
  }

  return res.status(405).json({ error: "Method not allowed" });
}
