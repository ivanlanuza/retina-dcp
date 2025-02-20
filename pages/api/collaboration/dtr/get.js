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
    const { id, userId, date } = req.query;

    if (id) {
      const dtr = await prisma.dTR.findUnique({
        where: { id: parseInt(id) },
        include: { 
            user: true,
            account: true
        },
      });

      if (!dtr) {
        return response.getFailedResponse(res, 404, { message: "DTR not found" });
      }

      return response.getSuccessResponse(res, 200, dtr);
    }

    const whereCondition = {};
    if (userId) whereCondition.userId = parseInt(userId);
    if (date) whereCondition.date = new Date(date);

    const dtrs = await prisma.dTR.findMany({
      where: whereCondition,
      include: { user: true },
    });

    return response.getSuccessResponse(res, 200, dtrs);
  } catch (error) {
    return response.getFailedResponse(res, 500, { message: "Error fetching DTRs", error: error.message });
  }
}
