import prisma from '../../../../lib/prisma';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { title, description, frequency, userId, questions } = req.body;

    try {
      const survey = await prisma.form.create({
        data: {
          title,
          description,
          frequency,
          userId,
          questions: {
            create: questions.map(question => ({
              text: question.text,
              type: question.type,
              isRequired: question.isRequired,
              order: question.order,
              options: {
                create: question.options || []
              }
            }))
          }
        }
      });

      res.status(201).json(survey);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Unable to create survey." });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}