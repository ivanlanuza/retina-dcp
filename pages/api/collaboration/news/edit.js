import { SystemResponse } from "@/utils/backend/response";
import { validateToken } from "@/utils/backend/middleware";
import prisma from "@/lib/prisma";

const response = new SystemResponse();

export default async function handler(req, res) {
  const isTokenValid = await validateToken(req, res);
  if (!isTokenValid) return;

  if (req.method !== "PUT") {
    return response.getFailedResponse(res, 405, { message: "Method not allowed" });
  }

  try {
    const { id, title, subtitle, newsinfo, visibility, ispublished, userIds } = req.body;

    if (!id) {
      return response.getFailedResponse(res, 400, { message: "News ID is required" });
    }

    // First update the news entry
    const updatedNews = await prisma.news.update({
      where: { id: parseInt(id) },
      data: { 
        title,
        subtitle,
        newsinfo,
        visibility,
        ispublished 
      },
    });

    // Handle NewsUsers if visibility is LIMITED
    if (visibility === "LIMITED") {
      // First remove existing NewsUsers entries (soft delete)
      await prisma.newsUsers.updateMany({
        where: { 
          newsid: parseInt(id),
          isdeleted: false
        },
        data: { isdeleted: true }
      });

      // Create new NewsUsers entries if userIds are provided
      if (userIds && userIds.length > 0) {
        const accountid = updatedNews.accountid;
        await prisma.newsUsers.createMany({
          data: userIds.map(userid => ({
            accountid,
            newsid: parseInt(id),
            userid,
            status: "SENT"
          }))
        });
      }
    }

    return response.getSuccessResponse(res, 200, { updatedNews });
  } catch (error) {
    return response.getFailedResponse(res, 500, { 
      message: "Error updating news", 
      error: error.message 
    });
  }
}