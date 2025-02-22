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
    if (!req.body.userid || !req.body.locations)
      return res.status(400).json({ message: "Required parameter missing" });

    //console.log(req.body.locations);

    const result = {
      locations: req.body.locations
        .filter((item) => item.has_access === "1") // Keep only entries with has_access = "1"
        .map((item) => item.id.toString()), // Convert IDs to strings
    };

    //console.log(result);
    const data = {
      accesslocation: JSON.stringify(result),
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
