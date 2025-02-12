import prisma from "@/lib/prisma";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { id } = req.query;

    if (id) {
      const customer = await prisma.customers.findUnique({
        where: { id: parseInt(id) },
        include: {
            account: true,
            Locations: true
        }
      });

      if (!customer) {
        return res.status(404).json({ error: "Customer not found" });
      }

      return res.status(200).json(customer);
    }

    const customers = await prisma.customers.findMany({
      where: { isdeleted: false }
    });

    res.status(200).json(customers);
  } catch (error) {
    res.status(500).json({ error: "Error fetching customers", details: error.message });
  }
}
