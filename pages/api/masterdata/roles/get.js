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
      const role = await prisma.roles.findUnique({
        where: { id: parseInt(id) },
        include: {
          account: true,
          users: true,
        },
      });

      if (!role) {
        return response.getFailedResponse(res, 404, { message: "Role not found" });
      }

      return response.getSuccessResponse(res, 200, role);
    }

    const roles = await prisma.roles.findMany({
      where: { isdeleted: false },
    });

    return response.getSuccessResponse(res, 200, roles);
  } catch (error) {
    return response.getFailedResponse(res, 500, { message: "Error fetching roles", error: error.message });
  }
}