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
      const subclassData = await prisma.subclasses.findUnique({
        where: { id: parseInt(id) },
        include: {
          account: true,
          category: true,
          subcategory: true,
          class: true,
          Products: true,
        },
      });

      if (!subclassData) {
        return response.getFailedResponse(res, 404, { message: "Subclass not found" });
      }

      return response.getSuccessResponse(res, 200, subclassData);
    }

    const subclasses = await prisma.subclasses.findMany({
      where: { isdeleted: false },
    });

    return response.getSuccessResponse(res, 200, subclasses);
  } catch (error) {
    return response.getFailedResponse(res, 500, { message: "Error fetching subclasses", error: error.message });
  }
}