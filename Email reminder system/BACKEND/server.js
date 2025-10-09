const express = require('express');
const mongoose = require('mongoose');
const nodemailer = require('nodemailer');
const cron = require('node-cron');
const dotenv = require('dotenv');
const cors = require('cors');
const Reminder = require('./models/Reminder');

dotenv.config();
const app = express();
app.use(express.json());
app.use(cors());

// MongoDB connection
mongoose.connect('mongodb://localhost:27017/emailReminder', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log('✅ MongoDB connected'))
  .catch(err => console.log(err));

// Email transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// Create reminder
app.post('/api/reminders', async (req, res) => {
  try {
    const reminder = new Reminder(req.body);
    await reminder.save();
    res.status(201).json({ message: 'Reminder Created' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get all reminders
app.get('/api/reminders', async (req, res) => {
  const reminders = await Reminder.find();
  res.json(reminders);
});

// Update reminder
app.put('/api/reminders/:id', async (req, res) => {
  await Reminder.findByIdAndUpdate(req.params.id, req.body);
  res.json({ message: 'Reminder Updated' });
});

// Delete reminder
app.delete('/api/reminders/:id', async (req, res) => {
  await Reminder.findByIdAndDelete(req.params.id);
  res.json({ message: 'Reminder Deleted' });
});

// CRON job (every minute)
cron.schedule('* * * * *', async () => {
  const now = new Date();
  const reminders = await Reminder.find({ sent: false, dateTime: { $lte: now } });
  for (const reminder of reminders) {
    try {
      await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: reminder.email,
        subject: `Reminder: ${reminder.title}`,
        text: reminder.message
      });
      reminder.sent = true;
      await reminder.save();
      console.log(`📧 Email sent to ${reminder.email}`);
    } catch (err) {
      console.log('Email Error:', err.message);
    }
  }
});

app.listen(5000, () => console.log('🚀 Server running on port 5000'));
