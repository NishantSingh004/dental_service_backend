import express from 'express';
import cookieParser from 'cookie-parser';
import mongoose from 'mongoose';
import cors from 'cors';
import { config } from "dotenv";
import userRoutes from './routes/userRoutes.js';
import authRoutes from './routes/authRoutes.js';
import appointmentRoutes from './routes/appointment.js';
import doctorRoutes from './routes/doctors.js';
import assigndoctorRouter from './routes/assignDoctor.js';
import contactRouter from './routes/contact.js';

config({ path: './data/config.env' });

const app = express();

// CORS configuration
const allowedOrigins = ['https://healthy-teeth-dental.netlify.app', 'http://localhost:4200'];

const corsOptions = {
  origin: (origin, callback) => {
    if (allowedOrigins.includes(origin) || !origin) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions));

// Middleware
app.use(express.json());  
app.use(cookieParser());

// Routes
app.use('/users', userRoutes);
app.use('/auth', authRoutes);
app.use('/appointments', appointmentRoutes);
app.use('/doctors', doctorRoutes);
app.use('/assignDoctor', assigndoctorRouter);
app.use('/contact', contactRouter);

app.get('/', (req, res) => {
  res.send('Hello World');
});

// Database Connection
mongoose.connect(process.env.MONGO_URI)
.then(() => {
  console.log('Connected to MongoDB');
})
.catch((err) => {
  console.error('MongoDB connection error:', err);
  process.exit(1);
});

// Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
