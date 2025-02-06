import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { SystemResponse } from "../../../utils/backend/response";

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET;
const response = new SystemResponse();

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return response.getFailedResponse(res, 405, { message: "Method not allowed" });
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
      return response.getFailedResponse(res, 401, { message: "Invalid credentials" });
    }

    // Compare passwords
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return response.getFailedResponse(res, 401, { message: "Invalid credentials" });
    }

    // Create JWT token
    const token = jwt.sign(
      { userId: user.id, accountId: user.accountId },
      JWT_SECRET,
      { expiresIn: "1d" }
    );

    // Remove sensitive data before sending response
    const { password: _, ...userWithoutPassword } = user;

    // Send success response with token and user data
    return response.getSuccessResponse(res, 200, {
      token,
      user: userWithoutPassword,
      account: user.account,
    });
  } catch (error) {
    console.error("Login error:", error);
    return response.getFailedResponse(res, 500, { message: "Internal server error" });
  }
}
