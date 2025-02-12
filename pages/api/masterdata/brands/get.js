import prisma from "@/lib/prisma";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { id } = req.query;

    if (id) {
      const brand = await prisma.brands.findUnique({
        where: { id: parseInt(id) },
        include: {
            account: true, 
            CompetitorBrands: true, 
            Products: true,
          },
      });

      if (!brand) {
        return res.status(404).json({ error: "Brand not found" });
      }

      return res.status(200).json(brand);
    }

    const brands = await prisma.brands.findMany({
      where: { isdeleted: false },
    });

    res.status(200).json(brands);
  } catch (error) {
    res.status(500).json({ error: "Error fetching brands", details: error.message });
  }
}
