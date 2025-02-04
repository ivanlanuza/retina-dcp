// utils/auth.js
export const protectAPI = (handler) => async (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Not authorized" });
  }

  console.log("Token:", token);
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await prisma.users.findUnique({
      where: { id: decoded.userId },
      //include: { account: true },
    });
    return handler(req, res);
  } catch (error) {
    console.error("Auth error:", error);
    return res.status(401).json({ message: "Not authorized" });
  }
};
