import prisma from "@/lib/prisma";

export default async function handler(req, res) {
  if (req.method !== "PUT") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { id, name, competitorlevel, linkedbrandid, description } = req.body;

    if (!id) {
      return res.status(400).json({ error: "Competitor brand ID is required" });
    }

    const updatedCompetitorBrand = await prisma.competitorBrands.update({
      where: { id: parseInt(id) },
      data: { name, competitorlevel, linkedbrandid, description },
    });

    res.status(200).json(updatedCompetitorBrand);
  } catch (error) {
    res.status(500).json({ error: "Error updating competitor brand", details: error.message });
  }
}
