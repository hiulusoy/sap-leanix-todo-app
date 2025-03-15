import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import path from 'path';

// Adjust this path to point to your source TypeScript files.
const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'SAP LeanIX Todo API',
            version: '1.0.0',
            description: 'REST API for managing to-dos',
        },
        servers: [
            {
                url: 'http://localhost:3000/api',
                description: 'Development server',
            },
        ],
        components: {
            schemas: {
                Todo: {
                    type: 'object',
                    properties: {
                        id: {type: 'number'},
                        title: {type: 'string'},
                        completed: {type: 'boolean'},
                    },
                    required: ['title'],
                },
            },
        },
    },
    // Use an absolute path to the source files (adjust as needed)
    apis: [path.join(__dirname, '../../server/modules/**/*.ts')],
};

const swaggerSpec = swaggerJSDoc(options);

// Log the generated spec for debugging

export {swaggerUi, swaggerSpec};
