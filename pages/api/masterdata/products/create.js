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
    const { 
      name, accountid, description, categoryid, subcategoryid, 
      classid, subclassid, brandid, supplierid 
    } = req.body;

    if (!name || !accountid) {
      return response.getFailedResponse(res, 400, { message: "Name and Account ID are required" });
    }

    const newProduct = await prisma.products.create({
      data: {
        name,
        accountid,
        description: description || null,
        categoryid: categoryid || null,
        subcategoryid: subcategoryid || null,
        classid: classid || null,
        subclassid: subclassid || null,
        brandid: brandid || null,
        supplierid: supplierid || null,
      },
    });

    return response.getSuccessResponse(res, 201, newProduct);
  } catch (error) {
    return response.getFailedResponse(res, 500, { message: "Error creating product", error: error.message });
  }
}
