require('dotenv').config();

const express = require('express');
const cors = require('cors');
const passport = require('passport');

const environment = process.env.NODE_ENV || 'development';

const authGuard = require('./middleware/authGuard');

const indexRouter = require('./routes/index');
const authRouter = require('./routes/auth');
const adminRouter = require('./routes/admin');
const userRouter = require('./routes/user');

const app = express();

// Body parser middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// CORS middleware with proper configuration
const corsOptions = {
  origin: process.env.CORS_ORIGIN || '*',
  credentials: true,
  optionsSuccessStatus: 200,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Origin', 'X-Requested-With', 'Content-Type', 'Accept', 'Authorization']
};
app.use(cors(corsOptions));

// Initialize Passport
app.use(passport.initialize());

// Routes
app.use('/', indexRouter);
app.use('/auth', authRouter);
app.use('/admin', authGuard.jwt('admin'), adminRouter);
app.use('/user', authGuard.jwt('user'), userRouter);

// Swagger documentation (development only)
if (environment === 'development') {
  const swaggerUi = require('swagger-ui-express');
  const swaggerJsdoc = require('swagger-jsdoc');

  const swaggerOptions = {
    definition: {
      openapi: '3.0.0',
      info: {
        title: 'Express JWT API',
        version: '2.0.0',
        description: 'Express JWT + Knex + Objection + MySQL - Modern Implementation',
        contact: {
          name: 'API Support'
        }
      },
      servers: [
        {
          url: `http://localhost:${process.env.PORT || 3000}`,
          description: 'Development server'
        }
      ],
      components: {
        securitySchemes: {
          bearerAuth: {
            type: 'http',
            scheme: 'bearer',
            bearerFormat: 'JWT',
            description: 'Enter JWT token in the format: Bearer {token}'
          }
        }
      },
      security: [
        {
          bearerAuth: []
        }
      ]
    },
    apis: ['./server/routes/**/*.js', './models/**/*.js']
  };

  const swaggerSpec = swaggerJsdoc(swaggerOptions);
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
}

// Global error handler
app.use((err, req, res, next) => {
  console.error('Error:', err.stack);

  res.status(err.status || 500).json({
    error: {
      message: err.message || 'Internal server error',
      ...(environment === 'development' && { stack: err.stack })
    }
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    error: 'Not found',
    path: req.url
  });
});

// Server startup
const PORT = process.env.PORT || 3000;
const server = app.listen(PORT, () => {
  console.log(`Server is running on port: ${PORT}`);
  console.log(`Environment: ${environment}`);

  if (environment === 'development') {
    console.log(`Swagger UI: http://localhost:${PORT}/api-docs`);
  }
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM signal received: closing HTTP server');
  server.close(() => {
    console.log('HTTP server closed');
    process.exit(0);
  });
});

module.exports = app;
