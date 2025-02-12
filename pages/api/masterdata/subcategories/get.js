import prisma from "@/lib/prisma";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { id } = req.query;

    if (id) {
      const subcategory = await prisma.subcategories.findUnique({
        where: { id: parseInt(id) },
      });

      if (!subcategory) {
        return res.status(404).json({ error: "Subcategory not found" });
      }

      return res.status(200).json(subcategory);
    }

    const subcategories = await prisma.subcategories.findMany({
      where: { isdeleted: false },
    });

    res.status(200).json(subcategories);
  } catch (error) {
    res.status(500).json({ error: "Error fetching subcategories", details: error.message });
  }
}
