import prisma from "@/lib/prisma";
import { validateToken } from "@/utils/backend/middleware";
import { SystemResponse } from "@/utils/backend/response";

const response = new SystemResponse();

export default async function handler(req, res) {
  const isTokenValid = validateToken(req, res);
  if (!isTokenValid) return;

  if (req.method !== "POST") {
    return response.getFailedResponse(res, 400, { message: "Method not allowed!"});
  }

  try {
    const { name, accountId, geocoordinates, tags, createdById, customerid } = req.body;

    if (!name || !accountId) {
      return response.getFailedResponse(res, 400, { message: "Name and account ID are required" });
    }

    const location = await prisma.locations.create({
      data: {
        name,
        accountId,
        geocoordinates: geocoordinates || null,
        tags: tags || null,
        createdById: createdById || null,
        customerid: customerid || null,
      },
    });

    return response.getSuccessResponse(res, 200, { location });
  } catch (error) {
    return response.getFailedResponse(res, 500, { message: error.message })
  }
}
