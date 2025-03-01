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
    const itemlocations = await prisma.$queryRaw`SELECT 
      CAST(p.id AS CHAR) AS id,
      p.name AS name,
      CAST(CASE 
          WHEN pl.id IS NOT NULL THEN pl.isactive 
          ELSE 0 
        END AS CHAR) AS is_active, -- tagging if product is active or not
      CAST(CASE 
          WHEN pl.id IS NOT NULL THEN 1 
          ELSE 0 
        END AS CHAR) AS has_record, -- tagging if product has a record in the location
        CAST(CASE 
          WHEN pl.id IS NOT NULL THEN pl.isactive 
          ELSE 0 
        END AS CHAR) AS historical_record, -- this tagging lessens the writes to the database in /updateProductLocations
      CAST(COALESCE(pl.inventorycount, 0) AS CHAR) AS inventorycount
      FROM Products p
        LEFT JOIN ProductLocations pl 
        ON p.id = pl.productid
          AND pl.locationid = ${parseInt(
            req.query.itemid
          )}  -- Replace with the given product ID
        AND pl.isdeleted = FALSE
      WHERE p.isdeleted = FALSE
        AND p.accountId = ${accountid}
        ORDER BY p.name ASC`;

    //console.log(itemlocations);
    return response.getSuccessResponse(res, 200, { itemlocations });
  } catch (error) {
    return response.getFailedResponse(res, 500, {
      message: "Error fetching item locations",
      details: error.message,
    });
  }
}
