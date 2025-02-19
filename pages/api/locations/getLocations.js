import prisma from "@/lib/prisma";
import { validateToken } from "@/utils/backend/middleware";
import { SystemResponse } from "@/utils/backend/response";

const response = new SystemResponse();

export default async function handler(req, res) {
  const isTokenValid = validateToken(req, res);
  if (!isTokenValid) return;

  if (req.method !== "GET") {
    return response.getFailedResponse(res, 405, { message: "Method not allowed" });
  }

  try {
    const { id } = req.query;

    if (id) {
      const location = await prisma.locations.findUnique({
        where: { id: parseInt(id) },
        include: { account: true },
      });

      if (!location) {
        return response.getFailedResponse(res, 404, { message: "Location not found" });
      }

      return response.getSuccessResponse(res, 200, { location });
    }

    const locations = await prisma.locations.findMany({
      where: { isdeleted: false },
    });

    return response.getSuccessResponse(res, 200, { locations });
  } catch (error) {
    return response.getFailedResponse(res, 500, { message: "Error fetching locations", details: error.message });
  }
}
