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
    const { id, name, description } = req.body;

    if (!id) {
      return response.getFailedResponse(res, 400, { message: "Class ID is required" });
    }

    const updatedClass = await prisma.classes.update({
      where: { id: parseInt(id) },
      data: { name, description },
    });

    return response.getSuccessResponse(res, 200, { updatedClass });
  } catch (error) {
    return response.getFailedResponse(res, 500, { message: "Error updating class", error: error.message });
  }
}