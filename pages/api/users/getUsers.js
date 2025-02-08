import { SystemResponse } from "../../../utils/backend/response";
import { validateToken } from "../../../utils/backend/middleware";
import { PrismaClient } from "@prisma/client";
import { jwtDecode } from "jwt-decode";

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
      const users = await prisma.users.findMany({
        include: {
          account: true,
          role: true,
        },
        where: {
          accountId: accountid,
        },
      });
      return response.getSuccessResponse(res, 200, { users: users });
    } catch (error) {
      console.error(error);
      return response.getFailedResponse(res, 500, {
        message: "Error retrieving users",
        error: error.message,
      });
    }
  } else {
    return response.getFailedResponse(res, 405, {
      message: "Method Not Allowed",
    });
  }
}
