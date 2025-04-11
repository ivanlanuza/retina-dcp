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
      return response.getFailedResponse(res, 400, { message: "News ID is required" });
    }

    // Soft delete the news and related NewsUsers entries
    await prisma.$transaction([
      prisma.news.update({
        where: { id: parseInt(id) },
        data: { isdeleted: true },
      }),
      prisma.newsUsers.updateMany({
        where: { newsid: parseInt(id) },
        data: { isdeleted: true },
      })
    ]);

    return response.getSuccessResponse(res, 200, { 
      message: "News deleted successfully" 
    });
  } catch (error) {
    return response.getFailedResponse(res, 500, { 
      message: "Error deleting news", 
      error: error.message 
    });
  }
}