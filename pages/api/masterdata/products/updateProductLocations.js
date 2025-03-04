import prisma from "@/lib/prisma";
import { validateToken } from "@/utils/backend/middleware";
import { jwtDecode } from "jwt-decode";

export default async function handler(req, res) {
  const isTokenValid = validateToken(req, res);
  if (!isTokenValid) return;

  const accountid = parseInt(
    jwtDecode(req.headers.authorization.split(" ")[1]).accountId
  );

  const userid = parseInt(
    jwtDecode(req.headers.authorization.split(" ")[1]).userId
  );

  if (req.method === "PUT") {
    if (!req.body.itemid)
      return res.status(400).json({ message: "Required parameter missing" });

    if (req.body.createlocations.length > 0) {
      //console.log(req.body.createlocations);
      const prismaCreateData = req.body.createlocations.map((item) => ({
        productid: req.body.itemid,
        locationid: parseInt(item.id), // Convert id to an integer
        userid: userid,
        accountid: accountid,
      }));

      //console.log(prismaCreateData);
      try {
        await prisma.productLocations.createMany({
          data: prismaCreateData,
        });
      } catch (error) {
        res.status(500).json({ error: "Error creating entries" });
      }
    }

    if (req.body.updatelocations.length > 0) {
      //console.log(req.body.updatelocations);
      try {
        for (const item of req.body.updatelocations) {
          await prisma.productLocations.updateMany({
            where: {
              productid: parseInt(req.body.itemid),
              locationid: parseInt(item.id),
              isdeleted: false,
            },
            data: {
              isactive: item.is_active === "1" ? true : false,
            },
          });
        }
      } catch (error) {
        res.status(500).json({ error: "Error updating entries" });
      }
    }

    res.status(200).end();
  }
}
