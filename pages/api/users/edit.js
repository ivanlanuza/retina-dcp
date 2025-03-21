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
    if (!req.body.username || !req.body.role)
      return res.status(400).json({ message: "Required parameter missing" });

    const data = {
      username: req.body.username,
      firstname: req.body.firstname,
      lastname: req.body.lastname,
      status: req.body.status,
      roleId: parseInt(req.body.role),
      tags: req.body.tags,
      agencyid: parseInt(req.body.agency),
      teamid: parseInt(req.body.team),
    };

    try {
      await prisma.users.update({
        data: data,
        where: {
          id: parseInt(req.body.userid),
          accountId: parseInt(accountid),
        },
      });
      res.status(200).end();
    } catch (error) {
      res.status(500).json({ error: "Error editing user" });
    }
  }
}
