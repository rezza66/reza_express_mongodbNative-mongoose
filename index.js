import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import path from 'path';
import { connectDB } from './config/database.js';
import productRoutesV1 from './routes/v1/productRoutes.js';
import productRoutesV2 from './routes/v2/productRoutes.js';

dotenv.config();

const app = express();
app.use(cors());
const port = process.env.PORT

app.use(express.urlencoded({extended: true}));
app.use(express.json());

connectDB();
app.use('/uploads', express.static(path.join(path.resolve(), 'uploads')));

app.use('/api/v1/products', productRoutesV1);
app.use('/api/v2/products', productRoutesV2);

app.listen(port, ()=> {
    console.log('Server up and running on port', port);
})

