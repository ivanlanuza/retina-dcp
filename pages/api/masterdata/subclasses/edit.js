import prisma from "@/lib/prisma";

export default async function handler(req, res) {
  if (req.method !== "PUT") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { id, name, description } = req.body;

    if (!id) {
      return res.status(400).json({ error: "Subclass ID is required" });
    }

    const updatedSubclass = await prisma.subclasses.update({
      where: { id: parseInt(id) },
      data: { name, description },
    });

    res.status(200).json(updatedSubclass);
  } catch (error) {
    res.status(500).json({ error: "Error updating subclass", details: error.message });
  }
}
