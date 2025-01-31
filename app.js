import express from 'express';
import cookieParser from 'cookie-parser';
import mongoose from 'mongoose';
import cors from 'cors';
import { config } from "dotenv"
import userRoutes from './routes/userRoutes.js';
import authRoutes from './routes/authRoutes.js';
import appointmentRoutes from './routes/appointment.js';
import doctorRoutes from './routes/doctors.js'
import assigndoctorRouter from './routes/assignDoctor.js'
import contactRouter from './routes/contact.js'

const app = express();
app.use(express.json());  
app.use(cookieParser());  
app.use(cors({
  origin: 'http://localhost:4200',
  credentials: true, 
}));


config({
  path: './data/config.env'
})

app.use('/users', userRoutes);
app.use('/auth', authRoutes);
app.use('/appointments', appointmentRoutes);
app.use('/doctors', doctorRoutes);
app.use('/assignDoctor', assigndoctorRouter);
app.use('/contact', contactRouter);

app.get('/', (req, res) => {
  res.send('Hello World');
});

mongoose.connect(process.env.MONGO_URI).then(async () => {
  // const hashedPassword = await bcrypt.hash('adminpassword', 10);
  // const admin = new User({
  //     username: 'Super Admin',
  //     email: 'admin@clinic.com',
  //     password: hashedPassword,
  //     role: 'admin',
  //     isActive: true,
  //     createdAt: new Date(),
  console.log('Connected to MongoDB');
  });
//   await admin.save();
//   console.log('Super Admin created successfully!');
//   process.exit();
// })
// .catch((err) => {
//   console.error('Error creating admin:', err);
//   process.exit(1);
// });

app.listen(process.env.PORT, () => {
  console.log('Server is running on port 3000');
});