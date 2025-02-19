import prisma from "@/lib/prisma";
import { validateToken } from "@/utils/backend/middleware";
import { SystemResponse } from "@/utils/backend/response";

const response = new SystemResponse();

export default async function handler(req, res) {
  const isTokenValid = validateToken(req, res);
  if (!isTokenValid) return;

  if (req.method !== "POST") {
    return response.getFailedResponse(res, 405, { message: "Method not allowed" });
  }

  try {
    const { accountId, userId, locationId, createdById } = req.body;

    if (!accountId || !userId || !locationId) {
      return response.getFailedResponse(res, 400, { message: "Account ID, User ID, and Location ID are required" });
    }

    const userLocation = await prisma.userLocations.create({
      data: {
        accountId,
        userId,
        locationId,
        createdById: createdById || null,
      },
    });

    return response.getSuccessResponse(res, 201, { userLocation });
  } catch (error) {
    return response.getFailedResponse(res, 500, { message: "Error creating user location", details: error.message });
  }
}
