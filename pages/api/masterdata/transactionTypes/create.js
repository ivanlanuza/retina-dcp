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
    const { name, accountId, description, createdById } = req.body;

    if (!name || !accountId) {
      return response.getFailedResponse(res, 400, { 
        message: "Name and account ID are required" 
      });
    }

    const transactionType = await prisma.transactionType.create({
      data: {
        name,
        accountId: parseInt(accountId),
        description: description || null,
        createdById: createdById ? parseInt(createdById) : null
      },
    });

    return response.getSuccessResponse(res, 201, transactionType);
  } catch (error) {
    return response.getFailedResponse(res, 500, { 
      message: "Error creating transaction type", 
      error: error.message 
    });
  }
}