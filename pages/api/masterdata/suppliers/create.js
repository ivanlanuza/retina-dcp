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
    const { name, accountid, description } = req.body;

    if (!name || !accountid) {
      return response.getFailedResponse(res, 400, { message: "Name and account ID are required" });
    }

    const supplier = await prisma.suppliers.create({
      data: {
        name,
        accountid,
        description: description || null,
      },
    });

    return response.getSuccessResponse(res, 201, supplier);
  } catch (error) {
    return response.getFailedResponse(res, 500, { message: "Error creating supplier", error: error.message });
  }
}
