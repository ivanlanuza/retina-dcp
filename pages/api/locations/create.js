import { PrismaClient } from "@prisma/client";
import { validateToken } from "../../../utils/backend/middleware";
import { SystemResponse } from "../../../utils/backend/response";

const prisma = new PrismaClient();
const response = new SystemResponse();

export default async function handler(req, res) {
  const isValid = validateToken(req, res);
  if (!isValid) return;

  if (req.method !== "POST") {
    return response.getFailedResponse(res, 405, { message: "Method Not Allowed" });
  }

  try {
    const { data } = req.body;
    
    // Validate the data array
    if (!Array.isArray(data) || data.length === 0) {
      return response.getFailedResponse(res, 400, { message: "Invalid or empty data array" });
    }

    // Validate the items inside the data array (Uncommented code for validation)
    // for (const item of data) {
    //   if (!item.accountId || !item.name || !item.geocoordinates) {
    //     return response.getFailedResponse(res, 400, { message: "Missing required fields" });
    //   }
    // }

    console.log("PAYLOAD: "+JSON.stringify(req.body))
    console.log("PRISMA:", Object.keys(prisma));
    const locations = data.map(({ account, createdBy, ...rest }) => ({
      ...rest,
      createdAt: new Date(),
      createdById: createdBy || undefined,
    }));

    // Perform the database operation to create the locations
    const result = await prisma.locations.createMany({
      data: locations,
      skipDuplicates: true,
    });
    return response.getSuccessResponse(res, 201, { message: "Location/s added", result });
  } catch (error) {
    console.error("Error adding locations:", error);
    return response.getFailedResponse(res, 500, { message: "Internal Server Error", error: error.message });
  }
}
