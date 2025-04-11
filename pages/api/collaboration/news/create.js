import { SystemResponse } from "@/utils/backend/response";
import { validateToken } from "@/utils/backend/middleware";
import prisma from "@/lib/prisma";

const response = new SystemResponse();

export default async function handler(req, res) {
  const isTokenValid = await validateToken(req, res);
  if (!isTokenValid) return;

  if (req.method !== "POST") {
    return response.getFailedResponse(res, 405, { message: "Method not allowed" });
  }

  try {
    const { accountid, title, subtitle, newsinfo, visibility, ispublished, userIds } = req.body;

    if (!accountid || !title) {
      return response.getFailedResponse(res, 400, { message: "Account ID and title are required" });
    }

    // Create the news entry
    const newNews = await prisma.news.create({
      data: {
        accountid,
        title,
        subtitle: subtitle || null,
        newsinfo: newsinfo || null,
        visibility: visibility || "ALL",
        ispublished: ispublished || false
      },
    });

    // If visibility is LIMITED and userIds are provided, create NewsUsers entries
    if (visibility === "LIMITED" && userIds && userIds.length > 0) {
      await prisma.newsUsers.createMany({
        data: userIds.map(userid => ({
          accountid,
          newsid: newNews.id,
          userid,
          status: "SENT"
        }))
      });
    }

    return response.getSuccessResponse(res, 201, { newNews });
  } catch (error) {
    return response.getFailedResponse(res, 500, { 
      message: "Error creating news", 
      error: error.message 
    });
  }
}