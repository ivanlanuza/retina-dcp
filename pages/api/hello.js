import { protectAPI } from "@/utils/auth";

export default protectAPI(async (req, res) => {
  // Your protected route logic
  res.status(200).json({
    message: "Protected data",
    user: req.user,
  });
});
