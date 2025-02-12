import prisma from "@/lib/prisma";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { id } = req.query;

    if (id) {
      const classData = await prisma.classes.findUnique({
        where: { id: parseInt(id) },
      });

      if (!classData) {
        return res.status(404).json({ error: "Class not found" });
      }

      return res.status(200).json(classData);
    }

    const classes = await prisma.classes.findMany({
      where: { isdeleted: false },
    });

    res.status(200).json(classes);
  } catch (error) {
    res.status(500).json({ error: "Error fetching classes", details: error.message });
  }
}
