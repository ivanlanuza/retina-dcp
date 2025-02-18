import prisma from "@/lib/prisma";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { userId, date, checkIn, checkOut, location } = req.body;

    if (!userId || !date) {
      return res.status(400).json({ error: "User ID and Date are required" });
    }

    const dtr = await prisma.dTR.create({
      data: {
        userId,
        date: new Date(date),
        checkIn: checkIn ? new Date(checkIn) : null,
        checkOut: checkOut ? new Date(checkOut) : null,
        location: location || null,
      },
    });

    res.status(201).json(dtr);
  } catch (error) {
    res.status(500).json({ error: "Error creating DTR", details: error.message });
  }
}
