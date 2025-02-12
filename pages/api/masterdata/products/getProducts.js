import { SystemResponse } from "../../../../utils/backend/response";
import { validateToken } from "../../../../utils/backend/middleware";
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
      const products = await prisma.products.findMany({
        include: {
          account: true,
          category: true,
          subcategory: true,
          class: true,
          subclass: true,
          brand: true,
          supplier: true,
        },
        where: {
          accountid: accountid,
          isdeleted: false,
        },
      });

      res.status(200).json(products);
    } catch (error) {
      console.error(error);
      return response.getFailedResponse(res, 500, {
        message: "Error retrieving products",
        error: error.message,
      });
    }
  } else {
    return response.getFailedResponse(res, 405, {
      message: "Method Not Allowed",
    });
  }
}
