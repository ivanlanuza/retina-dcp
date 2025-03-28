import { SystemResponse } from "@/utils/backend/response";
import { validateToken } from "@/utils/backend/middleware";
import { jwtDecode } from "jwt-decode";
import prisma from "@/lib/prisma";

const response = new SystemResponse();

export default async function handler(req, res) {
  const isTokenValid = await validateToken(req, res);
  if (!isTokenValid) return;

  const accountId = parseInt(
    jwtDecode(req.headers.authorization.split(" ")[1]).accountId
  );

  if (req.method === "GET") {
    try {
      const transactionTypes = await prisma.transactionType.findMany({
        include: {
          account: true,
        },
        where: {
          accountId: accountId,
          isDeleted: false,
        },
      });

      return response.getSuccessResponse(res, 200, { transactionTypes: transactionTypes } );
    } catch (error) {
      return response.getFailedResponse(res, 500, {
        message: "Error retrieving transaction types",
        error: error.message,
      });
    }
  } else {
    return response.getFailedResponse(res, 405, {
      message: "Method Not Allowed",
    });
  }
}