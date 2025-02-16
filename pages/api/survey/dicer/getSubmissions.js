import prisma from '../../../../lib/prisma'; 

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const submissions = await prisma.submissions.findMany({
        include: {
          form: true,       
          user: {
            include: {
              role: true,    
            }
          },
          answers: {
            include: {
              question: {
                include: {
                  options: true, 
                }
              }
            }
          },
        },
      });

      const formattedSubmissions = submissions.map(submission => ({
        id: submission.id,
        title: submission.form.title,
        description: submission.form.description,
        frequency: submission.form.frequency,
        userId: submission.user.id,
        user: {
          id: submission.user.id,
          accountId: submission.user.accountId,
          username: submission.user.username,
          password: submission.user.password,
          status: submission.user.status,
          roleId: submission.user.roleId,
          tags: submission.user.tags,
          createdAt: submission.user.createdAt,
          updatedAt: submission.user.updatedAt,
          createdById: submission.user.createdById,
          updatedById: submission.user.updatedById,
        },
        questions: submission.answers.map(answer => ({
          id: answer.question.id,
          text: answer.question.text,
          type: answer.question.type,
          isRequired: answer.question.isRequired,
          order: answer.question.order,
          formId: answer.question.formId,
          options: answer.question.options.map(option => ({
            id: option.id,
            text: option.text,
            order: option.order,
            questionId: option.questionId,
          })),
          answer: {
            id: answer.id,
            answerValue: answer.answerValue,
            submissionId: answer.submissionId,
            questionId: answer.questionId,
          }
        })),
        // taggedUsers: submission.taggedUsers || [],   // Add logic if tagging users is present
        // taggedLocations: submission.taggedLocations || [],  // Add logic if tagging locations is present
      }));

      res.status(200).json(formattedSubmissions);
    } catch (error) {
      res.status(500).json({ error: 'Error fetching submissions' });
    }
  } else {
    res.status(405).json({ error: 'Method Not Allowed' });
  }
}
