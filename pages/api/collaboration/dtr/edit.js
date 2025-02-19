import { SystemResponse } from "@/utils/backend/response";
import { validateToken } from "@/utils/backend/middleware";
import prisma from "@/lib/prisma";

const response = new SystemResponse();

export default async function handler(req, res) {
  const isTokenValid = await validateToken(req, res);
  if (!isTokenValid) return;

  if (req.method !== "PUT") {
    return response.getFailedResponse(res, 405, { message: "Method not allowed" });
  }

  try {
    const { id, checkIn, checkOut, location } = req.body;

    if (!id) {
      return response.getFailedResponse(res, 400, { message: "DTR ID is required" });
    }

    const dtr = await prisma.dTR.update({
      where: { id: parseInt(id) },
      data: {
        checkIn: checkIn ? new Date(checkIn) : undefined,
        checkOut: checkOut ? new Date(checkOut) : undefined,
        location: location || undefined,
      },
    });

    return response.getSuccessResponse(res, 200, dtr);
  } catch (error) {
    return response.getFailedResponse(res, 500, { message: "Error updating DTR", error: error.message });
  }
}
