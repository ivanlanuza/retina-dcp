import prisma from "@/lib/prisma";

export default async function handler(req, res) {
  if (req.method === "GET") {
    try {
      // Fetch all products from the database
      const products = await prisma.products.findMany();

      // Return the products as a JSON response
      res.status(200).json(products);
    } catch (error) {
      // Handle any errors that occur
      res.status(500).json({ error: "Error fetching products", details: error.message });
    }
  } else {
    // Return a 405 Method Not Allowed error for non-GET requests
    res.status(405).json({ error: "Method not allowed" });
  }
}