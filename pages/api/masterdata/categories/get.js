import prisma from "@/lib/prisma";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { id } = req.query;

    if (id) {
      const category = await prisma.categories.findUnique({
        where: { id: parseInt(id) },
        include: {
            account: true,
            Subcategories: true,
            Classes: true,
            Subclasses: true,
            Products: true,
          },
      });

      if (!category) {
        return res.status(404).json({ error: "Category not found" });
      }

      return res.status(200).json(category);
    }

    const categories = await prisma.categories.findMany({
      where: { isdeleted: false },
    });

    res.status(200).json(categories);
  } catch (error) {
    res.status(500).json({ error: "Error fetching categories", details: error.message });
  }
}
