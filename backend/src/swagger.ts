import swaggerUi from 'swagger-ui-express';
import { Express } from 'express';

const swaggerDocument = {
    openapi: '3.0.0',
    info: {
        title: 'EventPass API',
        version: '1.0.0',
        description: 'API for EventPass Ticketing System',
    },
    components: {
        securitySchemes: {
            bearerAuth: {
                type: 'http',
                scheme: 'bearer',
                bearerFormat: 'JWT',
            },
        },
    },
    paths: {
        '/health': {
            get: {
                summary: 'Health Check',
                responses: {
                    200: { description: 'OK' },
                },
            },
        },
        '/auth/register': {
            post: {
                summary: 'Register a new user',
                requestBody: {
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    name: { type: 'string' },
                                    email: { type: 'string' },
                                    password: { type: 'string' },
                                },
                            },
                        },
                    },
                },
                responses: {
                    201: { description: 'Created' },
                },
            },
        },
        '/auth/login': {
            post: {
                summary: 'Login',
                requestBody: {
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    email: { type: 'string' },
                                    password: { type: 'string' },
                                },
                            },
                        },
                    },
                },
                responses: {
                    200: { description: 'OK' },
                },
            },
        },
        '/events': {
            get: {
                summary: 'List events',
                responses: { 200: { description: 'OK' } },
            },
            post: {
                summary: 'Create event (Admin)',
                security: [{ bearerAuth: [] }],
                responses: { 201: { description: 'Created' } },
            },
        },
        '/tickets': {
            post: {
                summary: 'Buy ticket',
                security: [{ bearerAuth: [] }],
                responses: { 201: { description: 'Created' } },
            },
        },
    },
};

export const setupSwagger = (app: Express) => {
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
};
