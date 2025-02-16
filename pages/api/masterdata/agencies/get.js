import prisma from "@/lib/prisma";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { id } = req.query;

    if (id) {
      const agency = await prisma.agencies.findUnique({
        where: { id: parseInt(id) },
        include: {
            account: true,
            Users: true
        }
      });

      if (!agency) {
        return res.status(404).json({ error: "Agency not found" });
      }

      return res.status(200).json(agency);
    }

    const agencies = await prisma.agencies.findMany({
      where: { isdeleted: false },
    });

    res.status(200).json(agencies);
  } catch (error) {
    res.status(500).json({ error: "Error fetching agencies", details: error.message });
  }
}
