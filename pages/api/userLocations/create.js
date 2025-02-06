import { PrismaClient } from '@prisma/client';
import { validateToken } from "../../../utils/backend/middleware";
import { SystemResponse } from "../../../utils/backend/response";

const prisma = new PrismaClient();
const response = new SystemResponse();

export default async function handler(req, res) {
  const isTokenValid = validateToken(req, res);
  if (!isTokenValid) return;

  if (req.method !== 'POST') {
    return response.getFailedResponse(res, 405, { error: 'Method Not Allowed' });
  }

  if (!req.body || !req.body.userLocations) {
    return response.getFailedResponse(res, 400, { error: 'Invalid payload, userLocations array is required' });
  }

  try {
    const { userLocations } = req.body;

    if (!Array.isArray(userLocations)) {
      return response.getFailedResponse(res, 400, { error: 'userLocations must be an array' });
    }

    const createdRecords = await prisma.userLocations.createMany({
      data: userLocations,
      skipDuplicates: true,
    });

    return response.getSuccessResponse(res, 201, { message: 'User/s locations added', count: createdRecords.count });
  } catch (error) {
    console.error("Error adding user locations:", error);
    return response.getFailedResponse(res, 500, { error: 'Internal Server Error' });
  }
}
