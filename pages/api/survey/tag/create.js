import prisma from '../../../../lib/prisma';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { title, description, frequency, userId, questions, taggedUserIds, taggedLocationIds } = req.body;

    try {
      const survey = await prisma.forms.create({
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
          },
          taggedUsers: {
            connect: taggedUserIds.map(id => ({ id }))
          },
          taggedLocations: {
            connect: taggedLocationIds.map(id => ({ id }))
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