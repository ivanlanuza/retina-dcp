import prisma from '../../../../lib/prisma';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { formId, userId, answers } = req.body;

    try {
      const submission = await prisma.submissions.create({
        data: {
          formId,
          userId,
          answers: {
            create: answers.map(answer => ({
              answerValue: answer.answerValue,
              questionId: answer.questionId
            }))
          }
        }
      });

      res.status(201).json(submission);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Unable to submit answers." });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
