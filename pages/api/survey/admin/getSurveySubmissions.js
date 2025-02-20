import { validateToken } from "@/utils/backend/middleware";
import { SystemResponse } from "@/utils/backend/response";
import { PrismaClient } from "@prisma/client";
import { jwtDecode } from "jwt-decode";

const prisma = new PrismaClient();
const response = new SystemResponse();

export default async function handler(req, res) {
  const isTokenValid = validateToken(req, res);
  if (!isTokenValid) return;

  const accountid = parseInt(
    jwtDecode(req.headers.authorization.split(" ")[1]).accountId
  );

  if (req.method === "GET") {
    try {
      const surveysubmissions = await prisma.$queryRaw`
      SELECT SurveySubmissions.id'Submission ID', Surveys.id'Survey ID', Surveys.title'Survey Title', 
        Surveys.description'Survey Description', Users.username'Username', SurveyQuestions.id'Question ID', 
        SurveyQuestions.question'Question', 
        JSON_EXTRACT(SurveyAnswers.answerValue,'$[0].answer')'Answer'

         
      FROM SurveyAnswers
      LEFT JOIN Surveys on Surveys.id = SurveyAnswers.surveyId
      LEFT JOIN SurveySubmissions on SurveySubmissions.id = SurveyAnswers.submissionId
      LEFT JOIN Users on Users.id = SurveySubmissions.userId
      LEFT JOIN SurveyQuestions ON SurveyQuestions.id = SurveyAnswers.questionId
      WHERE SurveyAnswers.isdeleted = 0 
        AND SurveyAnswers.accountId = ${accountid} 
        AND SurveyAnswers.surveyId = ${parseInt(req.query.surveyid)}`;

      //console.log(surveysubmissions);
      res.status(200).json(surveysubmissions);
      return;
    } catch (error) {
      console.error(error);
      return response.getFailedResponse(res, 500, {
        message: "Error retrieving submissions",
        error: error.message,
      });
    }
  } else {
    return response.getFailedResponse(res, 405, {
      message: "Method Not Allowed",
    });
  }
}
