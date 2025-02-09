import prisma from "@/lib/prisma";
import { validateToken } from "../../../utils/backend/middleware";
import { jwtDecode } from "jwt-decode";
import bcrypt from "bcrypt";

export default async function handler(req, res) {
  const isTokenValid = validateToken(req, res);
  if (!isTokenValid) return;

  const accountid = parseInt(
    jwtDecode(req.headers.authorization.split(" ")[1]).accountId
  );

  if (req.method === "POST") {
    if (!req.body.username || !req.body.password || !req.body.role)
      return res.status(400).json({ message: "Required parameter missing" });

    const data = {
      accountId: accountid,
      username: req.body.username,
      password: await bcrypt.hash(req.body.password, 12),
      status: req.body.status ? "ACTIVE" : "INACTIVE",
      roleId: parseInt(req.body.role),
      tags: req.body.tags,
      updatedAt: new Date(),
    };

    try {
      await prisma.users.create({
        data: data,
      });
      res.status(200).end();
    } catch (error) {
      res.status(500).json({ error: "Error creating user" });
    }
  }
}
