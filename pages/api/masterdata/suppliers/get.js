import prisma from "@/lib/prisma";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { id } = req.query;

    if (id) {
      const supplier = await prisma.suppliers.findUnique({
        where: { id: parseInt(id) },
      });

      if (!supplier) {
        return res.status(404).json({ error: "Supplier not found" });
      }

      return res.status(200).json(supplier);
    }

    const suppliers = await prisma.suppliers.findMany({
      where: { isdeleted: false },
    });

    res.status(200).json(suppliers);
  } catch (error) {
    res.status(500).json({ error: "Error fetching suppliers", details: error.message });
  }
}
