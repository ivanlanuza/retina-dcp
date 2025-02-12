import prisma from "@/lib/prisma";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { name, accountid, description } = req.body;

    if (!name || !accountid) {
      return res.status(400).json({ error: "Name and account ID are required" });
    }

    const agency = await prisma.agencies.create({
      data: {
        name,
        accountid,
        description: description || null,
      },
    });

    res.status(201).json(agency);
  } catch (error) {
    res.status(500).json({ error: "Error creating agency", details: error.message });
  }
}
