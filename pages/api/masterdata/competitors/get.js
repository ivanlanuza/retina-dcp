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
      const competitor = await prisma.competitors.findUnique({
        where: { id: parseInt(id) },
        include: {
          account: true, 
          CompetitorBrands: true,
        },
      });

      if (!competitor) {
        return response.getFailedResponse(res, 404, { message: "Competitor not found" });
      }

      return response.getSuccessResponse(res, 200, { competitor });
    }

    const competitors = await prisma.competitors.findMany({
      where: { isdeleted: false },
    });

    return response.getSuccessResponse(res, 200, { competitors });
  } catch (error) {
    return response.getFailedResponse(res, 500, { message: "Error fetching competitors", error: error.message });
  }
}
