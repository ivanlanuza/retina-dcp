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
      const brands = await prisma.brands.findMany({
        include: {
          account: true, // Fetch associated account details
          CompetitorBrands: true, // Fetch associated competitor brands
          Products: true, // Fetch associated products
        },
        where: {
          accountid: accountid, // Filter by account ID
          isdeleted: false, // Exclude soft-deleted records
        },
      });

      res.status(200).json(brands);
    } catch (error) {
      console.error(error);
      return response.getFailedResponse(res, 500, {
        message: "Error retrieving brands",
        error: error.message,
      });
    }
  } else {
    return response.getFailedResponse(res, 405, {
      message: "Method Not Allowed",
    });
  }
}
