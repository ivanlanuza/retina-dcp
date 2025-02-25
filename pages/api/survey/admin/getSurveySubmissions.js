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
      SELECT 
          SurveySubmissions.id AS 'Submission ID',
          Surveys.id AS 'Survey ID',
          Surveys.title AS 'Survey Title',
          Surveys.description AS 'Survey Description',
          Users.username AS 'Username',
          SurveyQuestions.id AS 'Question ID',
          SurveyQuestions.question AS 'Question',
          COALESCE(
              GROUP_CONCAT(
                  JSON_UNQUOTE(
                      JSON_EXTRACT(choice_item, '$.choice')
                  ) SEPARATOR ', '
              ),
              JSON_UNQUOTE(JSON_EXTRACT(CAST(JSON_UNQUOTE(SurveyAnswers.answerValue) AS JSON), '$[0].answer')), 
              JSON_UNQUOTE(JSON_EXTRACT(CAST(JSON_UNQUOTE(SurveyAnswers.answerValue) AS JSON), '$.answer'))
          ) AS 'Answer'
      FROM SurveyAnswers
      LEFT JOIN Surveys ON Surveys.id = SurveyAnswers.surveyId
      LEFT JOIN SurveySubmissions ON SurveySubmissions.id = SurveyAnswers.submissionId
      LEFT JOIN Users ON Users.id = SurveySubmissions.userId
      LEFT JOIN SurveyQuestions ON SurveyQuestions.id = SurveyAnswers.questionId
      LEFT JOIN JSON_TABLE(
          CAST(JSON_UNQUOTE(SurveyAnswers.answerValue) AS JSON),
          '$[*].answer[*]'
          COLUMNS (
              choice_item JSON PATH '$'
          )
      ) AS choices ON TRUE
      WHERE SurveyAnswers.isdeleted = 0 
        AND SurveyAnswers.accountId = ${accountid}
        AND SurveyAnswers.surveyId = ${parseInt(req.query.surveyid)}
      GROUP BY SurveySubmissions.id, SurveyAnswers.id;`;

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
