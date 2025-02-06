import { PrismaClient } from "@prisma/client";
import { validateToken } from "../../../utils/backend/middleware";
import { SystemResponse } from "../../../utils/backend/response";  

const prisma = new PrismaClient();
const response = new SystemResponse();

export default async function handler(req, res) {
  const isTokenValid = validateToken(req, res);
  if (!isTokenValid) return;

  if (req.method === 'POST') {
    try {
      const { users } = req.body;

      if (!users || !Array.isArray(users) || users.length === 0) {
        return response.getFailedResponse(res, 400, { message: 'Invalid or empty users array' });
      }

      const createdUsers = await prisma.users.createMany({
        data: users,
      });

      return response.getSuccessResponse(res, 201, {
        message: 'User/s created successfully',
        data: createdUsers,
      });

    } catch (error) {
      console.error("Error creating users:", error);
      return response.getFailedResponse(res, 500, {
        message: 'Error creating users',
        error: error.message,
      });
    }
  } else {
    return response.getFailedResponse(res, 405, {
      message: 'Method Not Allowed',
    });
  }
}
