import 'dotenv/config';
import net from 'net';
import { env } from '../config/env.js';
import { routes } from './actions.js';

const TCP_PORT = env.TCP_PORT;

const server = net.createServer((socket) => {
  socket.on('data', async (buffer) => {
    try {
      const payloadString = buffer.toString();
      if (!payloadString.trim()) return;

      const { action, data } = JSON.parse(payloadString);

      const handler = routes[action];
      if (!handler) {
        socket.write(
          JSON.stringify({
            statusCode: 404,
            body: { success: false, message: 'Action not found in TCP router' },
          }),
        );
        return socket.end();
      }

      // Execute Controller
      const result = await handler(data);

      // Send successful response
      socket.write(
        JSON.stringify({
          statusCode: result.statusCode || 200,
          body: { success: true, ...result.body },
        }),
      );
    } catch (error) {
      console.error('TCP Server Error:', error);

      // Handle custom AppErrors
      if (error.statusCode) {
        socket.write(
          JSON.stringify({
            statusCode: error.statusCode,
            body: { success: false, message: error.message, errors: error.errors },
          }),
        );
      } else {
        // Unknown Exception
        socket.write(
          JSON.stringify({
            statusCode: 500,
            body: { success: false, message: 'Internal Server TCP Error' },
          }),
        );
      }
    } finally {
      // Because we handle exactly one request per socket right now
      socket.end();
    }
  });

  socket.on('error', (err) => {
    console.error('TCP Socket Error:', err);
  });
});

server.listen(TCP_PORT, () => {
  console.log(`TCP Monolith Server listening on socket port ${TCP_PORT}`);
});
