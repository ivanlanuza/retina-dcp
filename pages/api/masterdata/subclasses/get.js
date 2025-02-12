import prisma from "@/lib/prisma";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { id } = req.query;

    if (id) {
      const subclassData = await prisma.subclasses.findUnique({
        where: { id: parseInt(id) },
        include: {
            account: true, 
            category: true, 
            subcategory: true, 
            class: true, 
            Products: true,
        },
      });

      if (!subclassData) {
        return res.status(404).json({ error: "Subclass not found" });
      }

      return res.status(200).json(subclassData);
    }

    const subclasses = await prisma.subclasses.findMany({
      where: { isdeleted: false },
    });

    res.status(200).json(subclasses);
  } catch (error) {
    res.status(500).json({ error: "Error fetching subclasses", details: error.message });
  }
}
