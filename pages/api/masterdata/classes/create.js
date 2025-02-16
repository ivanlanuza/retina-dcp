import prisma from "@/lib/prisma";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { name, accountid, categoryid, subcategoryid, description } = req.body;

    if (!name || !accountid || !categoryid || !subcategoryid) {
      return res.status(400).json({ error: "Name, account ID, category ID, and subcategory ID are required" });
    }

    const newClass = await prisma.classes.create({
      data: {
        name,
        accountid,
        categoryid,
        subcategoryid,
        description: description || null,
      },
    });

    res.status(201).json(newClass);
  } catch (error) {
    res.status(500).json({ error: "Error creating class", details: error.message });
  }
}
