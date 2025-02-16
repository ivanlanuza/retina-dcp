import prisma from "@/lib/prisma";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { id } = req.query;

    if (id) {
      const product = await prisma.products.findUnique({
        where: { id: parseInt(id) },
        include: {
          account: true,
          category: true,
          subcategory: true,
          class: true,
          subclass: true,
          brand: true,
          supplier: true,
        },
      });

      if (!product) {
        return res.status(404).json({ error: "Product not found" });
      }

      return res.status(200).json(product);
    }

    const products = await prisma.products.findMany({
      where: { isdeleted: false },
      include: {
        account: true,
        category: true,
        subcategory: true,
        class: true,
        subclass: true,
        brand: true,
        supplier: true,
      },
    });

    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ error: "Error fetching products", details: error.message });
  }
}
