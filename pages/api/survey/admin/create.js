/*
EXPECTED PAYLOAD

*/

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
    if (!req.body.survey || !req.body.questions)
      return res.status(400).json({ message: "Required parameter missing" });

    //add accountid to payload and fix data type of options field
    const allquestions = req.body.questions.map((entry) => ({
      ...entry,
      accountId: accountid,
      options: JSON.stringify(entry.options),
    }));

    //remove id field from payload
    const cleanquestions = allquestions.map(({ id, ...rest }) => rest);

    try {
      await prisma.surveys.create({
        data: {
          title: req.body.survey.title,
          description: req.body.survey.description,
          allowMultiple: req.body.survey.allowMultiple,
          openFrom: req.body.survey.openFrom
            ? new Date(req.body.survey.openFrom)
            : null,
          openUntil: req.body.survey.openUntil
            ? new Date(req.body.survey.openUntil)
            : null,
          status: req.body.survey.status,
          scopeType: req.body.survey.scopeType,
          userId: userid,
          accountId: accountid,
          SurveyQuestions: {
            create: cleanquestions,
          },
        },
      });
      res.status(200).end();
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: "Error creating Survey" });
    }
  }
}
