import { SystemResponse } from "@/utils/backend/response";
import { validateToken } from "@/utils/backend/middleware";
import { jwtDecode } from "jwt-decode";
import prisma from "@/lib/prisma";

const response = new SystemResponse();

export default async function handler(req, res) {
  const isTokenValid = await validateToken(req, res);
  if (!isTokenValid) return;

  if (req.method !== "PUT") {
    return response.getFailedResponse(res, 405, { message: "Method not allowed" });
  }

  try {
    const { newsid, status } = req.body;
    const userId = parseInt(
      jwtDecode(req.headers.authorization.split(" ")[1]).userId
    );

    if (!newsid || !status) {
      return response.getFailedResponse(res, 400, { 
        message: "News ID and status are required" 
      });
    }

    if (!["SENT", "OPENED", "READ"].includes(status)) {
      return response.getFailedResponse(res, 400, { 
        message: "Invalid status value" 
      });
    }

    // Find the NewsUsers entry
    const newsUser = await prisma.newsUsers.findFirst({
      where: {
        newsid: parseInt(newsid),
        userid: userId,
        isdeleted: false
      }
    });

    if (!newsUser) {
      return response.getFailedResponse(res, 404, { 
        message: "News not found for this user" 
      });
    }

    // Update the status
    const updatedNewsUser = await prisma.newsUsers.update({
      where: { id: newsUser.id },
      data: { status }
    });

    return response.getSuccessResponse(res, 200, { updatedNewsUser });
  } catch (error) {
    return response.getFailedResponse(res, 500, { 
      message: "Error updating news status", 
      error: error.message 
    });
  }
}