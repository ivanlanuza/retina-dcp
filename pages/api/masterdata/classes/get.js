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
      const classData = await prisma.classes.findUnique({
        where: { id: parseInt(id) },
        include: {
            account: true,
            category: true,
            subcategory: true,
            Subclasses: true,
            Products: true,
        },
      });

      if (!classData) {
        return response.getFailedResponse(res, 404, { message: "Class not found" });
      }

      return response.getSuccessResponse(res, 200, { classData });
    }

    const classes = await prisma.classes.findMany({
      where: { isdeleted: false },
    });

    return response.getSuccessResponse(res, 200, { classes });
  } catch (error) {
    return response.getFailedResponse(res, 500, { message: "Error fetching classes", error: error.message });
  }
}
