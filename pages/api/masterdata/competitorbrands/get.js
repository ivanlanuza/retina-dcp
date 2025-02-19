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
      const competitorBrand = await prisma.competitorBrands.findUnique({
        where: { id: parseInt(id) },
        include: {
          competitor: true,
          linkedbrand: true,
          account: true,
        },
      });

      if (!competitorBrand) {
        return response.getFailedResponse(res, 404, { message: "Competitor brand not found" });
      }

      return response.getSuccessResponse(res, 200, { competitorBrand });
    }

    const competitorBrands = await prisma.competitorBrands.findMany({
      where: { isdeleted: false },
      include: {
        competitor: true,
        linkedbrand: true,
        account: true,
      },
    });

    return response.getSuccessResponse(res, 200, { competitorBrands });
  } catch (error) {
    return response.getFailedResponse(res, 500, { message: "Error fetching competitor brands", error: error.message });
  }
}
