import prisma from "@/lib/prisma";
import { validateToken } from "@/utils/backend/middleware";
import { jwtDecode } from "jwt-decode";
import bcrypt from "bcrypt";

export default async function handler(req, res) {
  const isTokenValid = validateToken(req, res);
  if (!isTokenValid) return;

  const accountid = parseInt(
    jwtDecode(req.headers.authorization.split(" ")[1]).accountId
  );

  if (req.method === "POST") {
    if (!req.body.name || !req.body.description)
      return res.status(400).json({ message: "Required parameter missing" });

    const data = {
      accountid: accountid,
      name: req.body.name,
      description: req.body.description,
      barcode: req.body.barcode,
      externalcode: req.body.externalcode,
      photo: req.body.photo,
      categoryid: parseInt(req.body.categoryid),
      subcategoryid: parseInt(req.body.subcategoryid),
      classid: parseInt(req.body.classid),
      subclassid: parseInt(req.body.subclassid),
      brandid: parseInt(req.body.brandid),
      supplierid: parseInt(req.body.supplierid),
      tags: req.body.tags,
      updatedAt: new Date(),
    };

    try {
      await prisma.products.create({
        data: data,
      });
      res.status(200).end();
    } catch (error) {
      res.status(500).json({ error: "Error creating data" });
    }
  }
}
