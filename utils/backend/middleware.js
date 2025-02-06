import jwt from 'jsonwebtoken';
import { SystemResponse } from "../../utils/backend/response";

const response = new SystemResponse();

export const validateToken = (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return response.getFailedResponse(res, 401, { message: 'No token provided' });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    return true;
  } catch (error) {
    return response.getFailedResponse(res, 401, { message: 'Invalid or expired token' });
  }
};
