import { SystemResponse } from "@/utils/backend/response";
import { validateToken } from "@/utils/backend/middleware";
import prisma from "@/lib/prisma";

const response = new SystemResponse();

export default async function handler(req, res) {
  const isTokenValid = await validateToken(req, res);
  if (!isTokenValid) return;

  if (req.method !== "POST") {
    return response.getFailedResponse(res, 405, { message: "Method not allowed" });
  }

  try {
    const { name, accountid, competitorid, competitorlevel, linkedbrandid, description } = req.body;

    if (!name || !accountid || !competitorid || competitorlevel === undefined) {
      return response.getFailedResponse(res, 400, { message: "Missing required fields" });
    }

    const newCompetitorBrand = await prisma.competitorBrands.create({
      data: {
        name,
        accountid,
        competitorid,
        competitorlevel,
        linkedbrandid: linkedbrandid || null,
        description: description || null,
      },
    });

    return response.getSuccessResponse(res, 201, { newCompetitorBrand });
  } catch (error) {
    return response.getFailedResponse(res, 500, { message: "Error creating competitor brand", error: error.message });
  }
}
