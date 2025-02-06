export class SystemResponse {
    // Static method for success response
    getSuccessResponse(res, statusCode, message) {
      return res.status(statusCode).json({ statusCode, body: { ...message } });
    }
  
    // Static method for failed response
    getFailedResponse(res, statusCode, message) {
      return res.status(statusCode).json({ statusCode, body: { ...message } });
    }
  }
  