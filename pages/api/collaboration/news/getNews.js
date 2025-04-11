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
      const news = await prisma.news.findUnique({
        where: { id: parseInt(id) },
        include: {
          account: true,
          NewsUsers: true,
        },
      });

      if (!news) {
        return response.getFailedResponse(res, 404, { message: "News not found" });
      }

      return response.getSuccessResponse(res, 200, { news });
    }

    const newsList = await prisma.news.findMany({
      where: { isdeleted: false },
    });

    return response.getSuccessResponse(res, 200, { newsList });
  } catch (error) {
    return response.getFailedResponse(res, 500, { 
      message: "Error fetching news", 
      error: error.message 
    });
  }
}