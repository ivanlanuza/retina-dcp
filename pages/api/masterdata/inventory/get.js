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
    const { locationid } = req.query;

    if (!locationid) {
      return response.getFailedResponse(res, 400, { message: "Missing location ID" });
    }

    const inventory = await prisma.inventoryAdjustments.findMany({
      where: { locationid: Number(locationid) },
      include: { 
        product: true,
        transactionType: true
      }
    });

    if (inventory.length === 0) {
      return response.getFailedResponse(res, 404, { message: "Inventory not found" });
    }

    return response.getSuccessResponse(res, 200, { inventory: inventory });

  } catch (error) {
    console.error("Error fetching inventory:", error);
    return response.getFailedResponse(res, 500, { message: "Error fetching inventory", error: error.message });
  }
}
