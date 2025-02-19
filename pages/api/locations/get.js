import prisma from "@/lib/prisma";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { id } = req.query;

    if (id) {
      const location = await prisma.locations.findUnique({
        where: { id: parseInt(id) },
        include: { account: true }
      });

      if (!location) {
        return res.status(404).json({ error: "Location not found" });
      }

      return res.status(200).json(location);
    }

    const locations = await prisma.locations.findMany({
      where: { isdeleted: false },
    });

    res.status(200).json(locations);
  } catch (error) {
    res.status(500).json({ error: "Error fetching locations", details: error.message });
  }
}
