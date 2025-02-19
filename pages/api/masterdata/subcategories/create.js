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
    const { name, accountid, categoryid, description } = req.body;

    if (!name || !accountid || !categoryid) {
      return response.getFailedResponse(res, 400, { message: "Name, account ID, and category ID are required" });
    }

    const subcategory = await prisma.subcategories.create({
      data: {
        name,
        accountid,
        categoryid,
        description: description || null,
      },
    });

    return response.getSuccessResponse(res, 201, subcategory);
  } catch (error) {
    return response.getFailedResponse(res, 500, { message: "Error creating subcategory", error: error.message });
  }
}
