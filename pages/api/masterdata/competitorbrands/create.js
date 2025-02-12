import prisma from "@/lib/prisma";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { name, accountid, competitorid, competitorlevel, linkedbrandid, description } = req.body;

    if (!name || !accountid || !competitorid || competitorlevel === undefined) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const newCompetitorBrand = await prisma.competitorBrands.create({
      data: {
        name,
        accountid,
        competitorid,
        competitorlevel,
        linkedbrandid: linkedbrandid || null,
        description: description || null,
      },
    });

    res.status(201).json(newCompetitorBrand);
  } catch (error) {
    res.status(500).json({ error: "Error creating competitor brand", details: error.message });
  }
}
