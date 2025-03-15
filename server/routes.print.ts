import {Application} from 'express';

export function printAllRoutes(app: Application) {
    const routes: { method: string; path: string }[] = [];

    const traverseRoutes = (stack: any[], prefix = '') => {
        stackLoop:
            for (const layer of stack) {
                if (layer.route && layer.route.path) {
                    const methods = Object.keys(layer.route.methods).join(', ').toUpperCase();
                    routes.push({method: methods, path: prefix + layer.route.path});
                } else if (layer.name === 'router' && layer.handle.stack) {
                    const newPrefix = prefix + (layer.regexp.source
                    );
                    layer.handle.stack.forEach((l: any) => {
                        if (l.route) {
                            const methods = Object.keys(l.route.methods).join(', ').toUpperCase();
                            routes.push({method: methods, path: newPrefix + l.route.path});
                        }
                    });
                }
            }

        console.log('=== Registered Routes ===');
        routes.forEach(route => console.log(`${route.method} ${route.path}`));
        console.log('=========================');
    }
}
