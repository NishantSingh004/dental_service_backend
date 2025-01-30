import express from "express";
import { Doctor } from "../model/doctors.js";

const router = express.Router()

router.post('/', async(req, res)=>{
  const {name, phone, email, role} = req.body;

  if (!name || !phone || !email || !role) {
    return res.status(401).json({ message: "All fields are required" });
  }

  const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ message: "Invalid email format" });
  }

   try {
    const doctor = new Doctor({
      name, phone, email, role
    })
    await doctor.save()
    return res.status(201).json({message: "doc added succesfully"})
   } catch (error) {
    res.status(500).json({ message: 'Server error' });
   }


})

router.get('/', async(req, res) => {
  try {
    const doctors = await Doctor.find()
    res.json(doctors)
  } catch (error) {
    res.status(500).json({message: 'Error fetching doctors'})
  }
})


router.get('/docname', async(req, res) => {
  const email = req.query.email;

  if (!email) {
    return res.status(400).json({ message: 'Email is required' });
  }

 
  try {
    // Fetch the doctor from the database using Mongoose
    const doctor = await Doctor.findOne({ email: email });

    if (doctor) {
      res.json({ name: doctor.name, id: doctor._id });
      
    } else {
      res.status(404).json({ message: 'Doctor not found' });
    }
  } catch (error) {
    console.error('Error fetching doctor:', error);
    res.status(500).json({ message: 'Server error' });
  }
})

router.delete('/:id', async (req, res) => {
  try {
    const doctorId = req.params.id;
    await Doctor.findByIdAndDelete(doctorId);
    res.status(200).json({ message: 'Appointment deleted successfully!' });
  } catch (error) {
    console.error('Error deleting appointment:', error);
    res.status(500).json({ message: 'Failed to delete appointment.' });
  }
});
export default router;