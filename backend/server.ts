import express from 'express';
import nodemailer from 'nodemailer';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Create reusable transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_APP_PASSWORD // Use App Password for Gmail
  }
});

// Collaboration invite endpoint
app.post('/api/email/collaboration-invite', async (req, res) => {
  const { email, projectName, invitedBy, inviteLink } = req.body;
  
  try {
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Invitation to Collaborate on a Problem',
      html: `
        <h1>You've been invited to collaborate!</h1>
        <p>${invitedBy} has invited you to collaborate on ${projectName}.</p>
        <p>Click the button below to join:</p>
        <a href="${inviteLink}" 
           style="background-color: #4CAF50; color: white; padding: 10px 20px; 
                  text-align: center; text-decoration: none; display: inline-block;
                  border-radius: 4px;">
          Accept Invitation
        </a>
      `
    });
    
    res.json({ success: true, message: 'Invitation sent successfully' });
  } catch (error) {
    console.error('Email error:', error);
    res.status(500).json({ success: false, message: 'Failed to send invitation' });
  }
});

// Assignment notification endpoint
app.post('/api/email/assignment-notification', async (req, res) => {
  const { to, subject, content, subtaskInfo } = req.body;
  
  try {
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to,
      subject,
      html: `
        <h2>${subject}</h2>
        <p>${content}</p>
        <h3>Task Details:</h3>
        <p><strong>Title:</strong> ${subtaskInfo.title}</p>
        <p><strong>Description:</strong> ${subtaskInfo.description}</p>
      `
    });
    
    res.json({ success: true, message: 'Notification sent successfully' });
  } catch (error) {
    console.error('Email error:', error);
    res.status(500).json({ success: false, message: 'Failed to send notification' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});