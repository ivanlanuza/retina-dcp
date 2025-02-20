import prisma from "@/lib/prisma";
import { validateToken } from "@/utils/backend/middleware";
import { jwtDecode } from "jwt-decode";

export default async function handler(req, res) {
  const isTokenValid = validateToken(req, res);
  if (!isTokenValid) return;

  const accountid = parseInt(
    jwtDecode(req.headers.authorization.split(" ")[1]).accountId
  );

  const userid = parseInt(
    jwtDecode(req.headers.authorization.split(" ")[1]).userId
  );

  if (req.method === "POST") {
    if (!req.body.surveyId)
      return res.status(400).json({ message: "Required parameter missing" });

    try {
      await prisma.surveySubmissions.create({
        data: {
          surveyId: parseInt(req.body.surveyId),
          userId: userid,
          accountId: accountid,
          SurveyAnswers: {
            create: req.body.SurveyAnswers.map((answer) => ({
              answerValue: answer.answerValue,
              surveyId: parseInt(req.body.surveyId),
              questionId: answer.questionId,
              accountId: accountid,
            })),
          },
        },
      });
      res.status(200).end();
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: "Error creating Submission" });
    }
  }
}
