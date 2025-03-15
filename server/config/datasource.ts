import 'reflect-metadata';
import {DataSource} from 'typeorm';
import * as dotenv from 'dotenv';
import path from "path";

dotenv.config();

// Ensure that all required environment variables are set
if (
    !process.env.DB_HOST ||
    !process.env.DB_PORT ||
    !process.env.DB_USERNAME ||
    !process.env.DB_PASSWORD ||
    !process.env.DB_DATABASE
) {
    throw new Error('Database configuration environment variables are missing.');
}

export const AppDataSource = new DataSource({
    type: 'postgres',
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT, 10),
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    entities: [
        path.join(__dirname, '..', 'modules', '**', '*.entity.{ts,js}')
    ],
    synchronize: process.env.NODE_ENV !== 'production',
    logging: false,
});
