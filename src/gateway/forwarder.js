import { sendToTcpServer } from './tcpClient.js';

/**
 * Creates an Express middleware that forwards the request standard fields
 * to the TCP server under the specified action string.
 */
export const forwardAction = (actionString) => {
  return async (req, res, next) => {
    try {
      // Collect all validated and attached fields
      const payload = {
        body: req.validatedBody || req.body,
        query: req.validatedQuery || req.query,
        params: req.validatedParams || req.params,
        headers: req.headers,
        user: req.user, // Attached if 'authenticate' middleware ran
      };

      const response = await sendToTcpServer(actionString, payload);

      // We expect the TCP server to return a structured response natively:
      // { statusCode: 200, body: {...} }
      const statusCode = response.statusCode || 200;

      return res.status(statusCode).json(response.body);
    } catch (err) {
      next(err); // Route errors to standard Express global error handler
    }
  };
};
