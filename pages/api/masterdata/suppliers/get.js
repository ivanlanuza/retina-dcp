import { SystemResponse } from "@/utils/backend/response";
import { validateToken } from "@/utils/backend/middleware";
import prisma from "@/lib/prisma";

const response = new SystemResponse();

export default async function handler(req, res) {
  const isTokenValid = await validateToken(req, res);
  if (!isTokenValid) return;

  if (req.method !== "GET") {
    return response.getFailedResponse(res, 405, { message: "Method not allowed" });
  }

  try {
    const { id } = req.query;

    if (id) {
      const supplier = await prisma.suppliers.findUnique({
        where: { id: parseInt(id) },
        include: {
            account: true,
            Products: true
        }
      });

      if (!supplier) {
        return response.getFailedResponse(res, 404, { message: "Supplier not found" });
      }

      return response.getSuccessResponse(res, 200, supplier);
    }

    const suppliers = await prisma.suppliers.findMany({
      where: { isdeleted: false },
    });

    return response.getSuccessResponse(res, 200, suppliers);
  } catch (error) {
    return response.getFailedResponse(res, 500, { message: "Error fetching suppliers", error: error.message });
  }
}
