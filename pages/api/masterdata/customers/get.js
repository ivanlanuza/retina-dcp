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
      const customer = await prisma.customers.findUnique({
        where: { id: parseInt(id) },
        include: {
          account: true,
          Locations: true
        }
      });

      if (!customer) {
        return response.getFailedResponse(res, 404, { message: "Customer not found" });
      }

      return response.getSuccessResponse(res, 200, customer);
    }

    const customers = await prisma.customers.findMany({
      where: { isdeleted: false }
    });

    return response.getSuccessResponse(res, 200, customers);
  } catch (error) {
    return response.getFailedResponse(res, 500, { message: "Error fetching customers", error: error.message });
  }
}
