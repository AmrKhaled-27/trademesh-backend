import 'dotenv/config';
import { env } from './config/env.js'; // MUST be imported immediately after dotenv
import express from 'express';
import swaggerUi from 'swagger-ui-express';
import authRoutes from './modules/auth/auth.routes.js';
import { responseInterceptor } from './middlewares/responseInterceptor.js';
import { errorHandler } from './middlewares/errorHandler.js';
import { swaggerDocument } from './docs/swagger.js';

const app = express();
const PORT = env.PORT;

app.use(express.json());
app.use(responseInterceptor);

// OpenAPI/Swagger UI Documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Main entry point for modules
app.use('/api/auth', authRoutes);

// General catch for unknown routes (404)
app.use((req, res, next) => {
  res.status(404).json({ success: false, message: 'Route not found' });
});

// Global Exception Handler must be the last middleware
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
