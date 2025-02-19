import { SystemResponse } from "@/utils/backend/response";
import { validateToken } from "@/utils/backend/middleware";
import prisma from "@/lib/prisma";

const response = new SystemResponse();

export default async function handler(req, res) {
  const isTokenValid = await validateToken(req, res);
  if (!isTokenValid) return;

  if (req.method !== "POST") {
    return response.getFailedResponse(res, 405, { message: "Method not allowed" });
  }

  try {
    const { userId, date, checkIn, checkOut, location } = req.body;

    if (!userId || !date) {
      return response.getFailedResponse(res, 400, { message: "User ID and Date are required" });
    }

    const dtr = await prisma.dTR.create({
      data: {
        userId,
        date: new Date(date),
        checkIn: checkIn ? new Date(checkIn) : null,
        checkOut: checkOut ? new Date(checkOut) : null,
        location: location || null,
      },
    });

    return response.getSuccessResponse(res, 201, dtr);
  } catch (error) {
    return response.getFailedResponse(res, 500, { message: "Error creating DTR", error: error.message });
  }
}
