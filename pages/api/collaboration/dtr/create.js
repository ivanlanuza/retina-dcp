import { SystemResponse } from "@/utils/backend/response";
import { validateToken } from "@/utils/backend/middleware";
import { jwtDecode } from "jwt-decode";
import prisma from "@/lib/prisma";

const response = new SystemResponse();

export default async function handler(req, res) {
  const isTokenValid = validateToken(req, res);
  if (!isTokenValid) return;

  const accountId = parseInt(
    jwtDecode(req.headers.authorization.split(" ")[1]).accountId
  );

  if (req.method !== "POST") {
    return response.getFailedResponse(res, 405, {
      message: "Method not allowed",
    });
  }

  try {
    const { userId, date, checkIn, checkOut, locationId } = req.body;

    if (!userId || !date) {
      return response.getFailedResponse(res, 400, {
        message: "User ID and Date are required",
      });
    }

    const dtr = await prisma.dTR.create({
      data: {
        userId,
        date: new Date(date),
        checkIn: checkIn ? new Date(checkIn) : null,
        checkOut: checkOut ? new Date(checkOut) : null,
        locationid: locationId || null,
        accountId: accountId,
      },
    });

    return response.getSuccessResponse(res, 201, dtr);
  } catch (error) {
    return response.getFailedResponse(res, 500, {
      message: "Error creating DTR",
      error: error.message,
    });
  }
}
