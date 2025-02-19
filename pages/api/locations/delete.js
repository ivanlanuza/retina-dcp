import prisma from "@/lib/prisma";
import { validateToken } from "@/utils/backend/middleware";
import { SystemResponse } from "@/utils/backend/response";

const response = new SystemResponse();

export default async function handler(req, res) {
  const isTokenValid = validateToken(req, res);
  if (!isTokenValid) return;

  if (req.method !== "DELETE") {
    return response.getFailedResponse(res, 405, { message: "Method not allowed" });
  }

  try {
    const { id } = req.body;

    if (!id) {
      return response.getFailedResponse(res, 400, { message: "Location ID is required" });
    }

    const location = await prisma.locations.update({
      where: { id },
      data: { isdeleted: true },
    });

    return response.getSuccessResponse(res, 200, { message: "Location deleted successfully", location });
  } catch (error) {
    return response.getFailedResponse(res, 500, { message: "Error deleting location", details: error.message });
  }
}
