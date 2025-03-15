import express, { Application, Router } from 'express';
import path from 'path';

export const createTestServer = (routes: Router, basePath: string = '/'): Application => {
    const app = express();
    app.use(express.json());
    app.use(basePath, routes);

    return app;
};

const basePathFormat = (pathToFormat: string): string =>
    pathToFormat.startsWith('/') ? path.normalize(pathToFormat) : `/${pathToFormat}`;
