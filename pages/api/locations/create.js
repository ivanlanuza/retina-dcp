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
    if (!req.body.name || !req.body.geocoordinates || !req.body.customerid)
      return res.status(400).json({ message: "Required parameter missing" });

    const data = {
      accountId: accountid,
      name: req.body.name,
      geocoordinates: req.body.geocoordinates,
      customerid: parseInt(req.body.customerid),
      tags: req.body.tags,
      updatedAt: new Date(),
    };

    try {
      await prisma.locations.create({
        data: data,
      });
      res.status(200).end();
    } catch (error) {
      res.status(500).json({ error: "Error creating data" });
    }
  }
}
