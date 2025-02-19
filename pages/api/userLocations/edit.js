import prisma from "@/lib/prisma";
import { validateToken } from "@/utils/backend/middleware";
import { SystemResponse } from "@/utils/backend/response";

const response = new SystemResponse();

export default async function handler(req, res) {
  const isTokenValid = validateToken(req, res);
  if (!isTokenValid) return;

  if (req.method !== "PUT") {
    return response.getFailedResponse(res, 405, { message: "Method not allowed" });
  }

  try {
    const { id, userId, locationId, updatedById } = req.body;

    if (!id) {
      return response.getFailedResponse(res, 400, { message: "UserLocation ID is required" });
    }

    const userLocation = await prisma.userLocations.update({
      where: { id },
      data: {
        userId,
        locationId,
        updatedById: updatedById || null,
      },
    });

    return response.getSuccessResponse(res, 200, { userLocation });
  } catch (error) {
    return response.getFailedResponse(res, 500, { message: "Error updating user location", details: error.message });
  }
}
