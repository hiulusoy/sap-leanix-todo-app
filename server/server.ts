import dotenv from 'dotenv';
import http from 'http';
import express, { Application } from 'express';
import path from 'path';
import moment from 'moment';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import apiRoutes from './routes';
import {AppDataSource} from "./config/datasource";

// .env dosyasını yükle
dotenv.config();

// Config ve port ayarları
const env = process.env.NODE_ENV || 'production';
const clientFolderPath = path.join(__dirname, '../dist/client');
const PORT = process.argv[2] || process.env.PORT || 3000;

// Express uygulaması oluştur
const app: Application = express();

// Veritabanına bağlan
AppDataSource.initialize().then(r => console.log('Db Connection initialized'));

// CORS yapılandırması
app.use(cors());

// Middlewares
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.json({ limit: '10mb' }));

// Statik dosyaları sun
app.use(express.static(clientFolderPath));


// API rotalarını yükle
app.use('/api', apiRoutes);

// Index route
app.get('*', (req, res) => {
  res.sendFile('index.html', { root: clientFolderPath });
});

// Server oluşturma
const server = http.createServer(app);
server.timeout = 100000;

// Server başlatma
server.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}, environment: ${env}`);
  console.log('start date ' + moment().subtract(1, 'days').format('YYYYMMDD').toString());
  console.log('end date ' + moment().format('YYYYMMDD').toString());
});

export default app;
