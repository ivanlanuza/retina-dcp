import { validateToken } from "@/utils/backend/middleware";
import { SystemResponse } from "@/utils/backend/response";
import { PrismaClient } from "@prisma/client";
import { jwtDecode } from "jwt-decode";

const prisma = new PrismaClient();
const response = new SystemResponse();

export default async function handler(req, res) {
  const isTokenValid = validateToken(req, res);
  if (!isTokenValid) return;

  const accountid = parseInt(
    jwtDecode(req.headers.authorization.split(" ")[1]).accountId
  );

  if (req.method !== "GET") {
    return response.getFailedResponse(res, 405, {
      message: "Method not allowed",
    });
  }

  try {
    const userlocations = await prisma.$queryRaw`SELECT 
      l.id,
      l.name,
      l.geocoordinates,
      l.tags
    FROM Locations l
    LEFT JOIN Users U 
      ON U.accountId = l.accountId  AND U.id = ${parseInt(req.query.userid)}  
    WHERE l.isdeleted = 0 
      AND l.accountId = ${accountid}
      AND JSON_CONTAINS(U.accesslocation, JSON_QUOTE(CAST(l.id AS CHAR)), '$.locations')  -- Filter only accessible locations
    ORDER BY l.name ASC`;

    //console.log(userlocations);
    return response.getSuccessResponse(res, 200, { userlocations });
  } catch (error) {
    return response.getFailedResponse(res, 500, {
      message: "Error fetching user locations",
      details: error.message,
    });
  }
}

/*import prisma from "@/lib/prisma";
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
*/
