import { SystemResponse } from "@/utils/backend/response";
import { validateToken } from "@/utils/backend/middleware";
import prisma from "@/lib/prisma";

const response = new SystemResponse();

export default async function handler(req, res) {
  const isTokenValid = await validateToken(req, res);
  if (!isTokenValid) return;

  if (req.method !== "DELETE") {
    return response.getFailedResponse(res, 405, { message: "Method not allowed" });
  }

  try {
    const { id } = req.body;

    if (!id) {
      return response.getFailedResponse(res, 400, { message: "Brand ID is required" });
    }

    await prisma.brands.update({
      where: { id: parseInt(id) },
      data: { isdeleted: true },
    });

    return response.getSuccessResponse(res, 200, { message: "Brand deleted successfully" });
  } catch (error) {
    return response.getFailedResponse(res, 500, { message: "Error deleting brand", error: error.message });
  }
}
