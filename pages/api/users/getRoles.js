import { SystemResponse } from "../../../utils/backend/response";
import { validateToken } from "../../../utils/backend/middleware";
import { PrismaClient } from "@prisma/client";
import { jwtDecode } from "jwt-decode";
import { IRIPPLE_ADMIN_NAME } from "../../../lib/data";

const prisma = new PrismaClient();
const response = new SystemResponse();

export default async function handler(req, res) {
  const isTokenValid = validateToken(req, res);
  if (!isTokenValid) return;

  const accountid = jwtDecode(
    req.headers.authorization.split(" ")[1]
  ).accountId;

  if (req.method === "GET") {
    try {
      const roles = await prisma.roles.findMany({
        where: {
          accountId: parseInt(accountid),
          name: {
            not: IRIPPLE_ADMIN_NAME,
          },
          isdeleted: false,
        },
      });
      res.status(200).json(roles);
      return;
      //return response.getSuccessResponse(res, 200, { roles: roles });
    } catch (error) {
      console.error(error);
      return response.getFailedResponse(res, 500, {
        message: "Error retrieving roles",
        error: error.message,
      });
    }
  } else {
    return response.getFailedResponse(res, 405, {
      message: "Method Not Allowed",
    });
  }
}
