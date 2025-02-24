import { SystemResponse } from "@/utils/backend/response";
import { validateToken } from "@/utils/backend/middleware";
import prisma from "@/lib/prisma";
import { jwtDecode } from "jwt-decode";

const response = new SystemResponse();

export default async function handler(req, res) {
  const isTokenValid = validateToken(req, res);
  if (!isTokenValid) return;

  const accountId = parseInt(
    jwtDecode(req.headers.authorization.split(" ")[1]).accountId
  );

  if (req.method !== "PUT") {
    return response.getFailedResponse(res, 405, {
      message: "Method not allowed",
    });
  }

  try {
    const { id, checkOut, locationId } = req.body;

    if (!id) {
      return response.getFailedResponse(res, 400, {
        message: "DTR ID is required",
      });
    }

    const dtr = await prisma.dTR.update({
      where: { id: parseInt(id), locationid: parseInt(locationId) },
      data: {
        checkOut: checkOut ? new Date(checkOut) : undefined,
      },
    });

    return response.getSuccessResponse(res, 200, dtr);
  } catch (error) {
    return response.getFailedResponse(res, 500, {
      message: "Error updating DTR",
      error: error.message,
    });
  }
}
