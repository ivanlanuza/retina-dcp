import prisma from "@/lib/prisma";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { id, userId, date } = req.query;

    if (id) {
      const dtr = await prisma.dTR.findUnique({
        where: { id: parseInt(id) },
        include: { user: true },
      });

      if (!dtr) {
        return res.status(404).json({ error: "DTR not found" });
      }

      return res.status(200).json(dtr);
    }

    const whereCondition = {};
    if (userId) whereCondition.userId = parseInt(userId);
    if (date) whereCondition.date = new Date(date);

    const dtrs = await prisma.dTR.findMany({
      where: whereCondition,
      include: { user: true },
    });

    res.status(200).json(dtrs);
  } catch (error) {
    res.status(500).json({ error: "Error fetching DTRs", details: error.message });
  }
}
