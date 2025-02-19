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
    const { name, accountid, categoryid, subcategoryid, classid, description } = req.body;

    if (!name || !accountid || !categoryid || !subcategoryid || !classid) {
      return response.getFailedResponse(res, 400, { message: "Name, account ID, category ID, subcategory ID, and class ID are required" });
    }

    const newSubclass = await prisma.subclasses.create({
      data: {
        name,
        accountid,
        categoryid,
        subcategoryid,
        classid,
        description: description || null,
      },
    });

    return response.getSuccessResponse(res, 201, newSubclass);
  } catch (error) {
    return response.getFailedResponse(res, 500, { message: "Error creating subclass", error: error.message });
  }
}