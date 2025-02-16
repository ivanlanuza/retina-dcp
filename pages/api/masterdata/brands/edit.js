import prisma from "@/lib/prisma";

export default async function handler(req, res) {
  if (req.method !== "PUT") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { id, name, description } = req.body;

    if (!id) {
      return res.status(400).json({ error: "Brand ID is required" });
    }

    const brand = await prisma.brands.update({
      where: { id: parseInt(id) },
      data: { name, description },
    });

    res.status(200).json(brand);
  } catch (error) {
    res.status(500).json({ error: "Error updating brand", details: error.message });
  }
}
