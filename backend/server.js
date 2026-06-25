const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Security: IP-based rate limiting to prevent spam submissions (max 5 requests per 15 minutes)
const contactLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5,
  message: {
    success: false,
    message: 'Too many contact submissions from this IP. Please try again after 15 minutes.'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Middleware
app.use(cors({
  origin: '*', // Allow all origins for simplicity in portfolio deployment, or customize for production
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type']
}));
app.use(express.json());

// MongoDB Connection
const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
  console.error('CRITICAL ERROR: MONGO_URI environment variable is missing.');
  process.exit(1);
}

mongoose.connect(MONGO_URI)
  .then(() => console.log('Successfully connected to MongoDB.'))
  .catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });

// Message Schema & Model
const messageSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    maxlength: [100, 'Name cannot exceed 100 characters']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    trim: true,
    lowercase: true,
    match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email address']
  },
  subject: {
    type: String,
    trim: true,
    maxlength: [150, 'Subject cannot exceed 150 characters'],
    default: 'Portfolio Contact Form'
  },
  message: {
    type: String,
    required: [true, 'Message is required'],
    trim: true,
    maxlength: [2000, 'Message cannot exceed 2000 characters']
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Message = mongoose.model('Message', messageSchema);

// API Routes
app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Bhanu Sai Portfolio API - Operational and Secure.',
    endpoints: {
      submitMessage: 'POST /api/messages (Rate Limited)'
    }
  });
});

// POST endpoint for contact form submissions (with rate limiter applied)
app.post('/api/messages', contactLimiter, async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    // Manual server-side validation validation (fail-secure)
    if (!name || !email || !message) {
      return res.status(400).json({
        success: false,
        message: 'Name, email, and message are required fields.'
      });
    }

    if (!/^\S+@\S+\.\S+$/.test(email)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid email address format.'
      });
    }

    const newMessage = new Message({
      name,
      email,
      subject: subject || 'Portfolio Contact Form',
      message
    });

    await newMessage.save();

    console.log(`[Database] Message from ${name} (${email}) saved successfully.`);

    return res.status(201).json({
      success: true,
      message: 'Thank you! Your message has been received and logged securely.'
    });

  } catch (error) {
    console.error('Error saving message to database:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error. Failed to send message.'
    });
  }
});

// Start Server
app.listen(PORT, () => {
  console.log(`Express server is running on port ${PORT}`);
});
