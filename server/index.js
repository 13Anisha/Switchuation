import express from 'express';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import teamRoutes from './routes/teamRoutes.js';
import round1Routes from './routes/round1Routes.js';
import round2Routes from './routes/round2Routes.js';
import round3Routes from './routes/round3Routes.js';
import round4Routes from './routes/round4Routes.js';
import cors from 'cors';
import User from './models/userModel.js';
import nodemailer from 'nodemailer';

import { fileURLToPath } from 'url';
import { dirname, join } from 'path';



dotenv.config();
connectDB();

const app = express();

app.use(cors({
    origin: 'http://localhost:3000',
    methods: 'GET, POST, PUT, DELETE',
    credentials: true,
}));

app.use(express.json());
app.use('/uploads', express.static('uploads'));

// Getting __dirname in ES module
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Serve static files from the 'public/files' directory
app.use('/files', express.static(join(__dirname, 'public/files')));



app.use((req, res, next) => {
    console.log(`Received request: ${req.method} ${req.url}`);
    next();
});

// Nodemailer setup
const transporter = nodemailer.createTransport({
    service: 'gmail', // Use your email service
    auth: {
        user: process.env.EMAIL, // Your email address
        pass: process.env.EMAIL_PASSWORD, // Your email password or app-specific password
    },
});

app.post('/api/users', async (req, res) => {
    const { email } = req.body;

    try {
        let user = await User.findOne({ email });

        if (!user) {
            user = new User({
                email,
                isAdmin: false,
            });
            await user.save();

            // Send confirmation email
            const mailOptions = {
              from: process.env.EMAIL,
              to: email,
              subject: 'Sign-in Confirmation',
              html: `
                  <div style="font-family: Arial, sans-serif; padding: 20px;">
                      <h2 style="color: #4CAF50;">Welcome to Switchuation!</h2>
                      <p>Dear User,</p>
                      <p>Thank you for signing in!</p>
                      <p>We are excited to have you on board. Kindly Proceed with the Team registration on the official Website.</p>
                      <p>Best regards,</p>
                      <p>The Team</p>
                      <hr>
                      <p style="font-size: 12px; color: gray;">This is an automated message. Please do not reply.</p>
                  </div>
              `,
          };

            transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    console.error('Error sending email:', error);
                } else {
                    console.log('Email sent:', info.response);
                }
            });

            res.status(201).json({ message: 'User created successfully' });
        } else {
            res.status(200).json({ message: 'User already exists' });
        }
    } catch (error) {
        console.error('Error storing user in MongoDB:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

app.get('/api/users/:email', async (req, res) => {
    const { email } = req.params;
    console.log('Fetching user with email:', email); // Log the email being fetched

    try {
        const user = await User.findOne({ email });
        if (user) {
            res.json({ email: user.email, isAdmin: user.isAdmin });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});

app.use('/api/teams', teamRoutes);
app.use('/api', round1Routes);
app.use('/api', round2Routes);
app.use('/api', round3Routes);
app.use('/api', round4Routes);

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Something went wrong!' });
});

app.use((req, res, next) => {
    res.status(404).json({ message: 'Route not found' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
