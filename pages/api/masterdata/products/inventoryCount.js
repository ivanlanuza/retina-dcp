import { 
    checkPayload, 
    processRecords
} from "@/utils/backend/helper/products";
import { SystemResponse } from "@/utils/backend/response";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const response = new SystemResponse();

export default async function handler(req, res) {
    if (req.method !== "POST") {
        return response.getFailedResponse(res, 405, { error: "Method not allowed" });
    }

    try {
        const validatePayload = await checkPayload(req);
        if (validatePayload.error) {
            return response.getFailedResponse(res, 400, { error: validatePayload.error });
        }

        const updateRecords = await processRecords(req.body);
        if (updateRecords.error) {
            return response.getFailedResponse(res, 400, { error: updateRecords.error });
        }

        return response.getSuccessResponse(res, 200, { message: "Inventory and product locations added/updated successfully." });

    } catch (e) {
        console.error("Transaction Error:", e);
        return response.getFailedResponse(res, 500, { error: e.message });
    }
}
