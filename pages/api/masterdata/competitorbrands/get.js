import prisma from "@/lib/prisma";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { id } = req.query;

    if (id) {
      const competitorBrand = await prisma.competitorBrands.findUnique({
        where: { id: parseInt(id) },
        include: {
          competitor: true,
          linkedbrand: true,
          account: true,
        },
      });

      if (!competitorBrand) {
        return res.status(404).json({ error: "Competitor brand not found" });
      }

      return res.status(200).json(competitorBrand);
    }

    const competitorBrands = await prisma.competitorBrands.findMany({
      where: { isdeleted: false },
      include: {
        competitor: true,
        linkedbrand: true,
        account: true,
      },
    });

    res.status(200).json(competitorBrands);
  } catch (error) {
    res.status(500).json({ error: "Error fetching competitor brands", details: error.message });
  }
}
