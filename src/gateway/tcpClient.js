import net from 'net';
import { env } from '../config/env.js';

// Fallback to 5000 if not specified in env
const TCP_PORT = env.TCP_PORT || 5000;
const TCP_HOST = env.TCP_HOST || '127.0.0.1';

/**
 * Opens a raw TCP socket to the monolith server, sends the action and data,
 * waits for the response, and resolves the parsed JSON.
 */
export const sendToTcpServer = (action, payload) => {
  return new Promise((resolve, reject) => {
    const client = new net.Socket();
    let responseData = '';

    client.connect(TCP_PORT, TCP_HOST, () => {
      const request = JSON.stringify({ action, data: payload });
      client.write(request);
      // We don't close the client here. The monolithic server will evaluate,
      // reply, and then close the connection so we know it's done.
    });

    client.on('data', (chunk) => {
      responseData += chunk.toString();
    });

    client.on('end', () => {
      try {
        const parsed = JSON.parse(responseData);
        resolve(parsed);
      } catch (err) {
        console.error('Failed to parse TCP response:', responseData);
        reject(new Error('Failed to parse TCP response from Monolithic Server'));
      }
    });

    client.on('error', (err) => {
      console.error('TCP Client Error:', err);
      reject(err);
    });
  });
};
