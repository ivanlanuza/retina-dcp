import prisma from "@/lib/prisma";

export default async function handler(req, res) {
  if (req.method !== "PUT") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { id, name, description } = req.body;

    if (!id) {
      return res.status(400).json({ error: "Category ID is required" });
    }

    const category = await prisma.categories.update({
      where: { id: parseInt(id) },
      data: { name, description },
    });

    res.status(200).json(category);
  } catch (error) {
    res.status(500).json({ error: "Error updating category", details: error.message });
  }
}
