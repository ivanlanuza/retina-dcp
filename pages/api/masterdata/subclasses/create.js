import prisma from "@/lib/prisma";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { name, accountid, categoryid, subcategoryid, classid, description } = req.body;

    if (!name || !accountid || !categoryid || !subcategoryid || !classid) {
      return res.status(400).json({ error: "Name, account ID, category ID, subcategory ID, and class ID are required" });
    }

    const newSubclass = await prisma.subclasses.create({
      data: {
        name,
        accountid,
        categoryid,
        subcategoryid,
        classid,
        description: description || null,
      },
    });

    res.status(201).json(newSubclass);
  } catch (error) {
    res.status(500).json({ error: "Error creating subclass", details: error.message });
  }
}
