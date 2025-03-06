import { 
    checkPayload, 
    processRecords
} from "@/utils/backend/helper/products";
import { SystemResponse } from "@/utils/backend/response";
import { PrismaClient } from "@prisma/client";
import { jwtDecode } from "jwt-decode";
import { validateToken } from "@/utils/backend/middleware";

const prisma = new PrismaClient();
const response = new SystemResponse();

export default async function handler(req, res) {
    const isTokenValid = validateToken(req, res);
    if (!isTokenValid) return;

    const token = jwtDecode(req.headers.authorization.split(" ")[1]);
    const payload = {
        token: {
            accountId: token.accountId,
            userId: token.userId,
        },
        adjustments: {
            ...req.body
        }
    }

    if (req.method !== "POST") {
        return response.getFailedResponse(res, 405, { error: "Method not allowed" });
    }

    try {
        const validatePayload = await checkPayload(payload);
        if (validatePayload.error) {
            return response.getFailedResponse(res, 400, { error: validatePayload.error });
        }

        const updateRecords = await processRecords(payload);
        if (updateRecords.error) {
            return response.getFailedResponse(res, 400, { error: updateRecords.error });
        }

        return response.getSuccessResponse(res, 200, { message: "Inventory and product locations added/updated successfully." });

    } catch (e) {
        console.error("Transaction Error:", e);
        return response.getFailedResponse(res, 500, { error: e.message });
    }
}
