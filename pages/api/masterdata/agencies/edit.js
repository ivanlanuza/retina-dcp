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
    const { id, name, description } = req.body;

    if (!id) {
      return response.getFailedResponse(res, 400, { message: "Agency ID is required" });
    }

    const agency = await prisma.agencies.update({
      where: { id: parseInt(id) },
      data: { name, description },
    });

    return response.getSuccessResponse(res, 200, { agency });
  } catch (error) {
    return response.getFailedResponse(res, 500, { message: "Error updating agency", details: error.message });
  }
}
