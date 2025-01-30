import express from 'express';
import nodemailer from 'nodemailer';
import { Contact } from '../model/contact.js';

const router = express.Router();

router.post('/', async (req, res) => {
  console.log('Received data:', req.body);
  const { name, email, phone, subject, message } = req.body;

  if (!name || !email || !phone || !subject || !message) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  try {
    // Save the contact details to the database
    const contact = new Contact({
      name,
      email,
      phone,
      subject,
      message,
    });

    await contact.save();

    // Send an email to the clinic
    const transporter = nodemailer.createTransport({
      service: 'gmail', // Use your email provider
      auth: {
        user: process.env.EMAIL_USER, // Your email address
        pass: process.env.EMAIL_PASS, // Your email password or app-specific password
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER, // Sender email
      to: 'healthyteethdental50@gmail.com', // Clinic's email address
      subject: `New Contact Form Submission: ${subject}`,
      text: `You have received a new message from your contact form:
        - Name: ${name}
        - Email: ${email}
        - Phone: ${phone}
        - Subject: ${subject}
        - Message: ${message}`,
      html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
          <h2 style="color: #4CAF50;">New Contact Form Submission</h2>
          <p>You have received a new message from your contact form:</p>
          <table style="width: 100%; border-collapse: collapse; margin-top: 10px;">
            <tr>
              <td style="padding: 8px; border: 1px solid #ddd;"><strong>Name:</strong></td>
              <td style="padding: 8px; border: 1px solid #ddd;">${name}</td>
            </tr>
            <tr>
              <td style="padding: 8px; border: 1px solid #ddd;"><strong>Email:</strong></td>
              <td style="padding: 8px; border: 1px solid #ddd;">${email}</td>
            </tr>
            <tr>
              <td style="padding: 8px; border: 1px solid #ddd;"><strong>Phone:</strong></td>
              <td style="padding: 8px; border: 1px solid #ddd;">${phone}</td>
            </tr>
            <tr>
              <td style="padding: 8px; border: 1px solid #ddd;"><strong>Subject:</strong></td>
              <td style="padding: 8px; border: 1px solid #ddd;">${subject}</td>
            </tr>
            <tr>
              <td style="padding: 8px; border: 1px solid #ddd;"><strong>Message:</strong></td>
              <td style="padding: 8px; border: 1px solid #ddd;">${message}</td>
            </tr>
          </table>
          <p style="margin-top: 20px;">Best regards,<br><strong>${name}</strong></p>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);

    res.status(201).json({ message: 'Successful! Email sent to the clinic.' });
  } catch (err) {
    console.error('Error handling contact form submission:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
