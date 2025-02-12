import prisma from "@/lib/prisma";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { 
      name, accountid, description, categoryid, subcategoryid, 
      classid, subclassid, brandid, supplierid 
    } = req.body;

    if (!name || !accountid) {
      return res.status(400).json({ error: "Name and Account ID are required" });
    }

    const newProduct = await prisma.products.create({
      data: {
        name,
        accountid,
        description: description || null,
        categoryid: categoryid || null,
        subcategoryid: subcategoryid || null,
        classid: classid || null,
        subclassid: subclassid || null,
        brandid: brandid || null,
        supplierid: supplierid || null,
      },
    });

    res.status(201).json(newProduct);
  } catch (error) {
    res.status(500).json({ error: "Error creating product", details: error.message });
  }
}
