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

    if (!id) {
      return response.getFailedResponse(res, 400, { message: "UserLocation ID is required" });
    }

    const userLocation = await prisma.userLocations.findUnique({
      where: { id: parseInt(id) },
      include: {
        user: true,
        location: true,
      },
    });

    if (!userLocation) {
      return response.getFailedResponse(res, 404, { message: "UserLocation not found" });
    }

    return response.getSuccessResponse(res, 200, { userLocation });
  } catch (error) {
    return response.getFailedResponse(res, 500, { message: "Error fetching user location", details: error.message });
  }
}
