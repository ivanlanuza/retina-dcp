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
    const { id, name, geocoordinates, tags, updatedById, customerid } = req.body;

    if (!id) {
      return response.getFailedResponse(res, 400, { message: "Location ID is required" });
    }

    const location = await prisma.locations.update({
      where: { id },
      data: {
        name,
        geocoordinates: geocoordinates || null,
        tags: tags || null,
        updatedById: updatedById || null,
        customerid: customerid || null,
      },
    });

    return response.getSuccessResponse(res, 200, { location });
  } catch (error) {
    return response.getFailedResponse(res, 500, { message: "Error updating location", details: error.message });
  }
}
