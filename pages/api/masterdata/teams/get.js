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
      const team = await prisma.teams.findUnique({
        where: { id: parseInt(id) },
        include: {
            account: true,
            Users: true
        }
      });

      if (!team) {
        return response.getFailedResponse(res, 404, { message: "Team not found" });
      }

      return response.getSuccessResponse(res, 200, team);
    }

    const teams = await prisma.teams.findMany({
      where: { isdeleted: false },
    });

    return response.getSuccessResponse(res, 200, teams);
  } catch (error) {
    return response.getFailedResponse(res, 500, { message: "Error fetching teams", error: error.message });
  }
}
