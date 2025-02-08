import prisma from '../../../../lib/prisma'; 

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const forms = await prisma.form.findMany({
        include: {
          user: true,
          questions: {
            include: {
              options: true,
            },
          },
          taggedUsers: true,
          taggedLocations: true,
        },
      });

      return res.status(200).json(forms);
    } catch (error) {
      console.error("Error fetching forms:", error);
      return res.status(500).json({ error: "Failed to fetch forms" });
    }
  } else {
    return res.status(405).json({ error: "Method not allowed" });
  }
}
