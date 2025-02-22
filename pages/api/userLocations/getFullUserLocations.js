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
      CAST(IF(JSON_CONTAINS(U.accesslocation, JSON_QUOTE(CAST(l.id AS CHAR)), '$.locations'), 1, 0) AS CHAR) AS has_access
      FROM Locations l
      LEFT JOIN Users U 
        ON U.accountId = l.accountId  -- Ensure relevant account
        AND U.id = ${parseInt(req.query.userid)}  -- Move user filter here
      WHERE l.isdeleted = 0 
        AND l.accountId = ${accountid}
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
