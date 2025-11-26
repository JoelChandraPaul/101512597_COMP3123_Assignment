import express from 'express';
import connectDB from './config/db.js';
import userRoutes from './routes/userRoutes.js';
import employeeRoutes from './routes/employeeRoutes.js';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();
connectDB();

const app = express();
app.use(cors());
app.use(express.json());

app.use('/uploads', express.static('uploads'));
app.use('/api/v1/user', userRoutes);
app.use('/api/v1/emp', employeeRoutes);

app.listen(5000, () => console.log("Server running on 5000"));
