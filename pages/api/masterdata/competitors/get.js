import prisma from "@/lib/prisma";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { id } = req.query;

    if (id) {
      const competitor = await prisma.competitors.findUnique({
        where: { id: parseInt(id) },
      });

      if (!competitor) {
        return res.status(404).json({ error: "Competitor not found" });
      }

      return res.status(200).json(competitor);
    }

    const competitors = await prisma.competitors.findMany({
      where: { isdeleted: false },
    });

    res.status(200).json(competitors);
  } catch (error) {
    res.status(500).json({ error: "Error fetching competitors", details: error.message });
  }
}
