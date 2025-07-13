const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User'); // Import the User model

dotenv.config();

const app = express();
const port = 3000;

// Middleware
app.use(express.static(path.join(__dirname, '../frontend')));
app.use(express.urlencoded({ extended: true }));

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('Connected to MongoDB Atlas'))
  .catch(err => console.error('MongoDB connection error:', err));

// Routes
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/index.html'));
});

app.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/pages/login.html'));
});

app.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (user && user.password === password) {
      res.redirect('/');
    } else {
      res.redirect('/login?error=1');
    }
  } catch (err) {
    console.error('Login error:', err);
    res.redirect('/login?error=1');
  }
});

app.get('/tech-clubs', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/pages/tech-clubs.html'));
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
