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
    const { id, name, description, updatedById } = req.body;

    if (!id) {
      return response.getFailedResponse(res, 400, { message: "Transaction type ID is required" });
    }

    const transactionType = await prisma.transactionType.update({
      where: { id: parseInt(id) },
      data: { 
        name, 
        description,
        updatedById: updatedById ? parseInt(updatedById) : null
      },
    });

    return response.getSuccessResponse(res, 200, transactionType);
  } catch (error) {
    return response.getFailedResponse(res, 500, { 
      message: "Error updating transaction type", 
      error: error.message 
    });
  }
}