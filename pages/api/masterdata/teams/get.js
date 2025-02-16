import prisma from "@/lib/prisma";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { id } = req.query;

    if (id) {
      const team = await prisma.teams.findUnique({
        where: { id: parseInt(id) },
        include: {
            account: true,
            Users: true
        }
      });

      if (!team) {
        return res.status(404).json({ error: "Team not found" });
      }

      return res.status(200).json(team);
    }

    const teams = await prisma.teams.findMany({
      where: { isdeleted: false },
    });

    res.status(200).json(teams);
  } catch (error) {
    res.status(500).json({ error: "Error fetching teams", details: error.message });
  }
}
