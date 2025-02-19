import prisma from "@/lib/prisma";
import { validateToken } from "@/utils/backend/middleware";
import { SystemResponse } from "@/utils/backend/response";

const response = new SystemResponse();

export default async function handler(req, res) {
  const isTokenValid = validateToken(req, res);
  if (!isTokenValid) return;

  if (req.method !== "GET") {
    return response.getFailedResponse(res, 405, { message: "Method not allowed" });
  }

  try {
    const { id } = req.query;

    if (id) {
      const agency = await prisma.agencies.findUnique({
        where: { id: parseInt(id) },
        include: {
          account: true,
          Users: true,
        },
      });

      if (!agency) {
        return response.getFailedResponse(res, 404, { message: "Agency not found" });
      }

      return response.getSuccessResponse(res, 200, { agency });
    }

    const agencies = await prisma.agencies.findMany({
      where: { isdeleted: false },
    });

    return response.getSuccessResponse(res, 200, { agencies });
  } catch (error) {
    return response.getFailedResponse(res, 500, { message: "Error fetching agencies", details: error.message });
  }
}
