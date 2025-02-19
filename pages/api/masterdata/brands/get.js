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
      const brand = await prisma.brands.findUnique({
        where: { id: parseInt(id) },
        include: {
          account: true,
          CompetitorBrands: true,
          Products: true,
        },
      });

      if (!brand) {
        return response.getFailedResponse(res, 404, { message: "Brand not found" });
      }

      return response.getSuccessResponse(res, 200, { brand });
    }

    const brands = await prisma.brands.findMany({
      where: { isdeleted: false },
    });

    return response.getSuccessResponse(res, 200, { brands });
  } catch (error) {
    return response.getFailedResponse(res, 500, { message: "Error fetching brands", error: error.message });
  }
}
