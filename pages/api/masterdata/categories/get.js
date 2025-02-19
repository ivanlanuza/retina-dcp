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
      const category = await prisma.categories.findUnique({
        where: { id: parseInt(id) },
        include: {
          account: true,
          Subcategories: true,
          Classes: true,
          Subclasses: true,
          Products: true,
        },
      });

      if (!category) {
        return response.getFailedResponse(res, 404, { message: "Category not found" });
      }

      return response.getSuccessResponse(res, 200, category);
    }

    const categories = await prisma.categories.findMany({
      where: { isdeleted: false },
    });

    return response.getSuccessResponse(res, 200, categories);
  } catch (error) {
    return response.getFailedResponse(res, 500, { message: "Error fetching categories", error: error.message });
  }
}
