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
    const { name, accountId, createdById } = req.body;

    if (!name || !accountId) {
      return response.getFailedResponse(res, 400, { message: "Name and account ID are required" });
    }

    const role = await prisma.roles.create({
      data: {
        name,
        accountId,
        createdById: createdById || null,
      },
    });

    return response.getSuccessResponse(res, 201, role);
  } catch (error) {
    return response.getFailedResponse(res, 500, { message: "Error creating role", error: error.message });
  }
}