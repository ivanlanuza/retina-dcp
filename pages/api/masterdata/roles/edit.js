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
    const { id, name, updatedById } = req.body;

    if (!id) {
      return response.getFailedResponse(res, 400, { message: "Role ID is required" });
    }

    const role = await prisma.roles.update({
      where: { id: parseInt(id) },
      data: { name, updatedById },
    });

    return response.getSuccessResponse(res, 200, role);
  } catch (error) {
    return response.getFailedResponse(res, 500, { message: "Error updating role", error: error.message });
  }
}