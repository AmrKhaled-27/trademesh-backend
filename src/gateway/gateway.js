import 'dotenv/config';
import { env } from '../config/env.js'; // MUST be imported immediately after dotenv
import express from 'express';
import cors from 'cors';
import swaggerUi from 'swagger-ui-express';
import authRoutes from '../modules/auth/auth.routes.js';
import userRoutes from '../modules/user/user.routes.js';
import apiKeyRoutes from '../modules/api-key/apiKey.routes.js';
import { responseInterceptor } from './middlewares/responseInterceptor.js';
import { errorHandler } from './middlewares/errorHandler.js';
import { swaggerDocument } from './docs/swagger.js';
import { verifyApiKey } from './middlewares/apiKey.middleware.js';
const app = express();
const PORT = env.PORT;

app.use(cors());
app.use(express.json());
app.use(responseInterceptor);

app.get('/api/test-api-key', verifyApiKey, (req, res) => {
  res.json({
    success: true,
    message: 'API key works',
    user: req.user,
  });
});

// OpenAPI/Swagger UI Documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Main entry point for modules
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/api-keys', apiKeyRoutes);
// General catch for unknown routes (404)
app.use((req, res, next) => {
  res.status(404).json({ success: false, message: 'Route not found' });
});

// Global Exception Handler must be the last middleware
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
