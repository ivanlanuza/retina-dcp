import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET;

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { username, password } = req.body;

  try {
    // Find user with account details
    const user = await prisma.users.findUnique({
      where: { username },
      include: {
        account: true,
        role: true,
      },
    });

    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Compare passwords
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Create JWT token
    const token = jwt.sign(
      { userId: user.id, accountId: user.accountId },
      JWT_SECRET,
      { expiresIn: "1d" }
    );

    // Remove sensitive data before sending response
    const { password: _, ...userWithoutPassword } = user;

    res.status(200).json({
      token,
      user: userWithoutPassword,
      account: user.account,
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}
