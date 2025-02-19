import { SystemResponse } from "@/utils/backend/response";
import { validateToken } from "@/utils/backend/middleware";
import prisma from "@/lib/prisma";

const response = new SystemResponse();

export default async function handler(req, res) {
  const isTokenValid = await validateToken(req, res);
  if (!isTokenValid) return;

  if (req.method !== "GET") {
    return response.getFailedResponse(res, 405, { message: "Method not allowed" });
  }

  try {
    const { id } = req.query;

    if (id) {
      const product = await prisma.products.findUnique({
        where: { id: parseInt(id) },
        include: {
          account: true,
          category: true,
          subcategory: true,
          class: true,
          subclass: true,
          brand: true,
          supplier: true,
        },
      });

      if (!product) {
        return response.getFailedResponse(res, 404, { message: "Product not found" });
      }

      return response.getSuccessResponse(res, 200, product);
    }

    const products = await prisma.products.findMany({
      where: { isdeleted: false },
      include: {
        account: true,
        category: true,
        subcategory: true,
        class: true,
        subclass: true,
        brand: true,
        supplier: true,
      },
    });

    return response.getSuccessResponse(res, 200, products);
  } catch (error) {
    return response.getFailedResponse(res, 500, { message: "Error fetching products", error: error.message });
  }
}
