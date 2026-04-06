export const authPaths = {
  '/api/auth/signup': {
    post: {
      tags: ['Auth'],
      summary: 'Register a new user',
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              type: 'object',
              required: ['name', 'email', 'password'],
              properties: {
                name: { type: 'string', example: 'John Doe' },
                email: { type: 'string', format: 'email', example: 'john@example.com' },
                password: { type: 'string', format: 'password', example: 'strongpassword123' },
              },
            },
          },
        },
      },
      responses: {
        201: {
          description: 'User registered successfully, OTP sent',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  data: {
                    type: 'object',
                    properties: {
                      message: { type: 'string' },
                      tempToken: {
                        type: 'string',
                        description: 'Temporary token for OTP verification',
                      },
                    },
                  },
                },
              },
            },
          },
        },
        400: {
          description: 'Validation Error or User Exists',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/ValidationErrorResponse' },
              examples: {
                validationError: {
                  summary: 'Invalid signup payload',
                  value: {
                    success: false,
                    message: 'Validation failed.',
                    errors: {
                      email: 'Invalid email address',
                      password: 'Password must be at least 6 characters',
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
  },
  '/api/auth/login': {
    post: {
      tags: ['Auth'],
      summary: 'Login an existing user',
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              type: 'object',
              required: ['email', 'password'],
              properties: {
                email: { type: 'string', format: 'email', example: 'john@example.com' },
                password: { type: 'string', format: 'password', example: 'strongpassword123' },
              },
            },
          },
        },
      },
      responses: {
        200: {
          description: 'Local credentials verified, OTP sent',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  data: {
                    type: 'object',
                    properties: {
                      message: { type: 'string' },
                      tempToken: {
                        type: 'string',
                        description: 'Temporary token for OTP verification',
                      },
                    },
                  },
                },
              },
            },
          },
        },
        401: {
          description: 'Invalid credentials',
          content: {
            'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } },
          },
        },
        400: {
          description: 'Validation Error',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/ValidationErrorResponse' },
              examples: {
                validationError: {
                  summary: 'Invalid login payload',
                  value: {
                    success: false,
                    message: 'Validation failed.',
                    errors: {
                      email: 'Invalid email address',
                      password: 'Password is required',
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
  },
  '/api/auth/verify-2fa': {
    post: {
      tags: ['Auth'],
      summary: 'Verify OTP and get JWT',
      description:
        'Use the temporary token from signup/login in Authorization header as Bearer <tempToken>.',
      security: [{ bearerAuth: [] }],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              type: 'object',
              required: ['otp'],
              properties: {
                otp: { type: 'string', example: '123456' },
              },
            },
          },
        },
      },
      responses: {
        200: {
          description: 'OTP verified successfully',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  data: {
                    type: 'object',
                    properties: {
                      message: { type: 'string', example: '2FA Verification successful' },
                      token: { type: 'string', example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' },
                    },
                  },
                },
              },
            },
          },
        },
        400: {
          description: 'Invalid or Expired OTP',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/ErrorResponse' },
            },
          },
        },
      },
    },
  },
  '/api/auth/resend-otp': {
    post: {
      tags: ['Auth'],
      summary: 'Resend OTP to existing user',
      description:
        'Use the temporary token from signup/login in Authorization header as Bearer <tempToken>.',
      security: [{ bearerAuth: [] }],
      responses: {
        200: {
          description: 'OTP resent successfully',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  data: {
                    type: 'object',
                    properties: {
                      message: { type: 'string' },
                      tempToken: {
                        type: 'string',
                        description: 'Temporary token for OTP verification',
                      },
                    },
                  },
                },
              },
            },
          },
        },
        401: {
          description: 'Invalid or expired temporary token',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/ErrorResponse' },
            },
          },
        },
        400: {
          description: 'Bad request',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/ErrorResponse' },
            },
          },
        },
      },
    },
  },
};
