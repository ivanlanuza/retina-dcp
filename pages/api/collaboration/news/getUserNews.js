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
      const newsUser = await prisma.newsUsers.findUnique({
        where: { id: parseInt(id) },
        include: {
          News: true,
          account: true,
          user: true,
        },
      });

      if (!newsUser) {
        return response.getFailedResponse(res, 404, { message: "News user not found" });
      }

      return response.getSuccessResponse(res, 200, { userNews: newsUser });
    }

    const newsUsers = await prisma.newsUsers.findMany({
      where: { isdeleted: false },
    });

    return response.getSuccessResponse(res, 200, { newsUsers });
  } catch (error) {
    return response.getFailedResponse(res, 500, { 
      message: "Error fetching news users", 
      error: error.message 
    });
  }
}