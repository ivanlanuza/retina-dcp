import { PrismaClient } from "@prisma/client";
import { validateToken } from "../../../utils/backend/middleware";
import { SystemResponse } from "../../../utils/backend/response";

const prisma = new PrismaClient();
const response = new SystemResponse();

export default async function handler(req, res) {
  const isTokenValid = validateToken(req, res);
  if (!isTokenValid) return;

  if (req.method !== "GET") {
    return response.getFailedResponse(res, 405, { error: "Method Not Allowed" });
  }

  try {

    console.log("PRISMA:", Object.keys(prisma));
    const locations = await prisma.locations.findMany({
      include: {
        account: true,
        createdBy: true,
        // updatedBy: true,
        // userLocations: true
      },
    });
    return response.getSuccessResponse(res, 200, { locations: locations} );
  } catch (error) {
    console.error("Error fetching locations:", error);
    return response.getFailedResponse(res, 500, { error: "Internal Server Error" });
  }
}
