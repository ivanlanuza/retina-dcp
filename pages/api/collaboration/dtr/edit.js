import prisma from "@/lib/prisma";

export default async function handler(req, res) {
  if (req.method !== "PUT") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { id, checkIn, checkOut, location } = req.body;

    if (!id) {
      return res.status(400).json({ error: "DTR ID is required" });
    }

    const dtr = await prisma.dTR.update({
      where: { id: parseInt(id) },
      data: {
        checkIn: checkIn ? new Date(checkIn) : undefined,
        checkOut: checkOut ? new Date(checkOut) : undefined,
        location: location || undefined,
      },
    });

    res.status(200).json(dtr);
  } catch (error) {
    res.status(500).json({ error: "Error updating DTR", details: error.message });
  }
}
