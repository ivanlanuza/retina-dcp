import { SystemResponse } from "../../../utils/backend/response";
import { validateToken } from "../../../utils/backend/middleware";
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

  if (req.method === "GET") {
    try {
      const locationsoos =
        await prisma.$queryRaw`Select Locations.name, CAST(COUNT(ProductLocations.id) AS CHAR)'count' from ProductLocations
      LEFT JOIN Locations ON Locations.id = ProductLocations.locationid
      WHERE ProductLocations.isdeleted = 0
      AND ProductLocations.isactive = 1
      AND ProductLocations.accountid = ${accountid}
      AND ProductLocations.inventorycount = 0
      GROUP BY Locations.name
      ORDER BY COUNT(ProductLocations.id) DESC, Locations.name
      LIMIT ${parseInt(req.query.limit)}`;

      //console.log(locations);
      res.status(200).json(locationsoos);
      return;
    } catch (error) {
      console.error(error);
      return response.getFailedResponse(res, 500, {
        message: "Error retrieving data",
        error: error.message,
      });
    }
  } else {
    return response.getFailedResponse(res, 405, {
      message: "Method Not Allowed",
    });
  }
}
