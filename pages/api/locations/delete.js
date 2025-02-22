import prisma from "@/lib/prisma";
import { validateToken } from "../../../utils/backend/middleware";
import { jwtDecode } from "jwt-decode";

export default async function handler(req, res) {
  const isTokenValid = validateToken(req, res);
  if (!isTokenValid) return;

  const accountid = parseInt(
    jwtDecode(req.headers.authorization.split(" ")[1]).accountId
  );

  if (req.method === "PUT") {
    if (!req.body.id)
      return res.status(400).json({ message: "Required parameter missing" });

    try {
      await prisma.locations.update({
        data: {
          isdeleted: true,
        },
        where: {
          id: parseInt(req.body.id),
          accountId: parseInt(accountid),
        },
      });
      res.status(200).end();
    } catch (error) {
      res.status(500).json({ error: "Error deleting user" });
    }
  }
}
