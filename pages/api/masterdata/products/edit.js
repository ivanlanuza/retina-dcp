import prisma from "@/lib/prisma";

export default async function handler(req, res) {
  if (req.method !== "PUT") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { id, name, description, categoryid, subcategoryid, classid, subclassid, brandid, supplierid } = req.body;

    if (!id) {
      return res.status(400).json({ error: "Product ID is required" });
    }

    const updatedProduct = await prisma.products.update({
      where: { id: parseInt(id) },
      data: {
        name,
        description,
        categoryid,
        subcategoryid,
        classid,
        subclassid,
        brandid,
        supplierid,
      },
    });

    res.status(200).json(updatedProduct);
  } catch (error) {
    res.status(500).json({ error: "Error updating product", details: error.message });
  }
}
