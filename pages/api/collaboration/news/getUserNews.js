import { SystemResponse } from "@/utils/backend/response";
import { validateToken } from "@/utils/backend/middleware";
import prisma from "@/lib/prisma";
import { jwtDecode } from "jwt-decode";

const response = new SystemResponse();

export default async function handler(req, res) {
  const isTokenValid = await validateToken(req, res);
  if (!isTokenValid) return;

  if (req.method !== "GET") {
    return response.getFailedResponse(res, 405, { message: "Method not allowed" });
  }

  try {
    const tokenUserId = parseInt(
      jwtDecode(req.headers.authorization.split(" ")[1]).userId
    );

    const targetUserId = req.query.id ? parseInt(req.query.id) : tokenUserId;

    const userNews = await prisma.newsUsers.findMany({
      where: {
        userid: targetUserId,
        isdeleted: false,
      },
      include: {
        News: true,
        account: true,
        user: true,
      },
    });

    if (!userNews || userNews.length === 0) {
      return response.getFailedResponse(res, 404, { message: "No news found for this user" });
    }

    return response.getSuccessResponse(res, 200, { userNews: userNews });
  } catch (error) {
    return response.getFailedResponse(res, 500, { 
      message: "Error fetching user news", 
      error: error.message 
    });
  }
}
