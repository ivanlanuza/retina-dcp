import { SystemResponse } from "@/utils/backend/response";
import { validateToken } from "@/utils/backend/middleware";
import prisma from "@/lib/prisma";

const response = new SystemResponse();

export default async function handler(req, res) {
  const isTokenValid = await validateToken(req, res);
  if (!isTokenValid) return;

  if (req.method !== "GET") {
    return response.getFailedResponse(res, 405, { message: "Method not allowed" });
  }

  try {
    const { id } = req.query;

    if (id) {
      const transactionType = await prisma.transactionType.findUnique({
        where: { id: parseInt(id), isDeleted: false },
        include: {
          account: true,
        }
      });

      if (!transactionType) {
        return response.getFailedResponse(res, 404, { message: "Transaction type not found" });
      }

      return response.getSuccessResponse(res, 200, transactionType);
    }

    const transactionTypes = await prisma.transactionType.findMany({
      where: { isDeleted: false },
      include: {
        account: true
      }
    });

    return response.getSuccessResponse(res, 200, transactionTypes);
  } catch (error) {
    return response.getFailedResponse(res, 500, { 
      message: "Error fetching transaction types", 
      error: error.message 
    });
  }
}