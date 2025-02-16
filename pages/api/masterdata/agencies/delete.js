import prisma from "@/lib/prisma";

export default async function handler(req, res) {
  if (req.method !== "DELETE") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { id } = req.body;

    if (!id) {
      return res.status(400).json({ error: "Agency ID is required" });
    }

    await prisma.agencies.update({
      where: { id: parseInt(id) },
      data: { isdeleted: true },
    });

    res.status(200).json({ message: "Agency deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Error deleting agency", details: error.message });
  }
}
