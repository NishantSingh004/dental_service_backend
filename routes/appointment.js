import express from 'express'
import nodemailer from 'nodemailer';
import { Appointment } from '../model/appointment.js';
const router = express.Router();

router.post('/', async(req, res) => {
  const {name, phone, email, dob, date, message} = req.body;
  if(!name || !phone || !email || !dob || !date || !message){
    return res.status(400).json({message: "All fields are required"});
  }

  const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ message: "Invalid email format" });
  }

  // Additional validation: Date format check (basic)
  const appointmentDate = new Date(date);
  if (isNaN(appointmentDate.getTime())) {
    return res.status(400).json({ message: "Invalid date format" });
  }

  try {
    // Save appointment to the database
    const appointment = new Appointment({
      name,
      phone,
      email,
      dob,
      date: appointmentDate, // Ensure date is correctly formatted
      message,
    });

    await appointment.save();

    // Configure email transporter
    const transporter = nodemailer.createTransport({
      service: 'Gmail', // You can replace this with another email service if needed
      auth: {
        user: process.env.EMAIL_USER, // Your email address
        pass: process.env.EMAIL_PASS, // Your email password or app-specific password
      },
    });

    // Define email options
    const mailOptions = {
      from: process.env.EMAIL_USER, // Sender's email address
      to: email, // Recipient's email address
      subject: 'Appointment Confirmation with Healthy Teeth Dental Clinic',
      html: `
        <html>
          <body style="font-family: 'Playfair Display', serif; color: #333;">
            <div style="max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px; background-color: #f9f9f9;">
              <img src="https://your-image-url.com/logo.png" alt="Healthy Teeth Dental Clinic" style="display: block; margin: 0 auto; width: 150px; height: auto;" />
              <h2 style="text-align: center; color: #4CAF50;">Appointment Confirmation</h2>
              <p style="font-size: 16px;">Dear <strong>${name}</strong>,</p>
              <p style="font-size: 16px;">Thank you for booking an appointment with <strong>Healthy Teeth Dental Clinic</strong>. We are looking forward to your visit! Here are the details of your appointment:</p>
              <table style="width: 100%; border-collapse: collapse; margin-top: 20px;">
                <tr>
                  <td style="padding: 8px; font-size: 16px; font-weight: bold;">Name:</td>
                  <td style="padding: 8px; font-size: 16px;">${name}</td>
                </tr>
                <tr>
                  <td style="padding: 8px; font-size: 16px; font-weight: bold;">Phone:</td>
                  <td style="padding: 8px; font-size: 16px;">${phone}</td>
                </tr>
                <tr>
                  <td style="padding: 8px; font-size: 16px; font-weight: bold;">Email:</td>
                  <td style="padding: 8px; font-size: 16px;">${email}</td>
                </tr>
                <tr>
                  <td style="padding: 8px; font-size: 16px; font-weight: bold;">Date of Birth:</td>
                  <td style="padding: 8px; font-size: 16px;">${new Date(dob).toLocaleDateString()}</td>
                </tr>
                <tr>
                  <td style="padding: 8px; font-size: 16px; font-weight: bold;">Appointment Date:</td>
                  <td style="padding: 8px; font-size: 16px;">${new Date(date).toLocaleDateString()}</td>
                </tr>
                <tr>
                  <td style="padding: 8px; font-size: 16px; font-weight: bold;">Message:</td>
                  <td style="padding: 8px; font-size: 16px;">${message}</td>
                </tr>
              </table>
              <p style="font-size: 16px; margin-top: 20px;">If you have any questions or need to reschedule, feel free to <a href="mailto:${process.env.EMAIL_USER}" style="color: #4CAF50;">contact us</a>.</p>
              <br />
              <p style="font-size: 16px; text-align: center; color: #888;">Best regards,<br /><strong>Healthy Teeth Dental Clinic</strong></p>
            </div>
          </body>
        </html>
      `,
    };
    ;

    // Send email
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error('Error sending email:', error);
        return res
          .status(500)
          .json({ message: 'Appointment saved, but email not sent.' });
      }
      console.log('Email sent:', info.response);
      res
        .status(201)
        .json({ message: 'Appointment created and email sent successfully.' });
    });
  } catch (err) {
    console.error('Error creating appointment:', err);
    res.status(500).json({ message: 'Server error' });
  }
});



router.get('/', async(req, res)=>{
  try{
    const appointments = await Appointment.find();

    res.json(appointments)
  }catch (err) {
    res.status(500).json({ message: 'Error fetching appointments' });
  }
})


router.get('/patientDetails', async (req, res) => {
  const patientId = req.query.patientId;

  if (!patientId) {
    return res.status(400).json({ message: 'patientId is required' });
  }

  try {
    const patientDetails = await Appointment.findById(patientId); 
    if (!patientDetails) {
      return res.status(404).json({ message: 'Patient not found' });
    }
    res.json(patientDetails);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});



// Delete an appointment by ID
router.delete('/:id', async (req, res) => {
  try {
    const appointmentId = req.params.id;
    await Appointment.findByIdAndDelete(appointmentId);
    res.status(200).json({ message: 'Appointment deleted successfully!' });
  } catch (error) {
    console.error('Error deleting appointment:', error);
    res.status(500).json({ message: 'Failed to delete appointment.' });
  }
});



export default router;