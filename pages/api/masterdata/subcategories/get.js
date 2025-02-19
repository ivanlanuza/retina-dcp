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
      const subcategory = await prisma.subcategories.findUnique({
        where: { id: parseInt(id) },
        include: {
          account: true,
          category: true,
          Classes: true,
          Subclasses: true,
          Products: true,
        },
      });

      if (!subcategory) {
        return response.getFailedResponse(res, 404, { message: "Subcategory not found" });
      }

      return response.getSuccessResponse(res, 200, subcategory);
    }

    const subcategories = await prisma.subcategories.findMany({
      where: { isdeleted: false },
    });

    return response.getSuccessResponse(res, 200, subcategories);
  } catch (error) {
    return response.getFailedResponse(res, 500, { message: "Error fetching subcategories", error: error.message });
  }
}