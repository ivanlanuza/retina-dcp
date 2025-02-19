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
    const userLocations = await prisma.userLocations.findMany({
      where: { isdeleted: false },
      include: {
        user: true,
        location: true,
      },
    });

    return response.getSuccessResponse(res, 200, { userLocations });
  } catch (error) {
    return response.getFailedResponse(res, 500, { message: "Error fetching user locations", details: error.message });
  }
}
