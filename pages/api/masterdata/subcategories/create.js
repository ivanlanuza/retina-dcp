import prisma from "@/lib/prisma";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { name, accountid, categoryid, description } = req.body;

    if (!name || !accountid || !categoryid) {
      return res.status(400).json({ error: "Name, account ID, and category ID are required" });
    }

    const subcategory = await prisma.subcategories.create({
      data: {
        name,
        accountid,
        categoryid,
        description: description || null,
      },
    });

    res.status(201).json(subcategory);
  } catch (error) {
    res.status(500).json({ error: "Error creating subcategory", details: error.message });
  }
}
