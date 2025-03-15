import dotenv from 'dotenv';
import http from 'http';
import express, {Application} from 'express';
import path from 'path';
import moment from 'moment';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import apiRoutes from './routes';
import {swaggerSpec, swaggerUi} from './config/openapi';
import {printAllRoutes} from './routes.print';
import {AppDataSource} from "./config/datasource";

// Load .env file
dotenv.config();

// Config ve port ayarları
const env = process.env.NODE_ENV || 'production';
const clientFolderPath = path.join(__dirname, '../dist/client');
const PORT = process.argv[2] || process.env.PORT || 3000;

// Express uygulaması oluştur
const app: Application = express();

// Veritabanına bağlan
AppDataSource.initialize().then(r => console.log('Db Connection initialized'));


// Middleware'lar (öncelikli)
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.json({ limit: '10mb' }));

// API rotaları
app.use('/api', apiRoutes);

// Swagger API dokümantasyonu
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Statik dosyaları sun
app.use(express.static(clientFolderPath));

// Catch-all rota (en son tanımlanmalı)
app.get('*', (req, res) => {
  res.sendFile('index.html', { root: clientFolderPath });
});

// HTTP Server oluştur
const server = http.createServer(app);
server.timeout = 100000;

// Server başlat
server.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}, environment: ${env}`);
  console.log('start date:', moment().subtract(1, 'days').format('YYYYMMDD'));
  console.log('end date:', moment().format('YYYYMMDD'));

  // Tüm rotaları logla (debug için)
  printAllRoutes(app);
});

export default app;

