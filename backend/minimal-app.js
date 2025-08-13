// STEP 1: Create a minimal app.js to test
// Save this as backend/minimal-app.js and test it:

const express = require('express');
const path = require('path');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// Basic middleware only
app.use(express.static(path.join(__dirname, '../frontend')));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Add routes one by one and test after each addition:

// Test 1: Basic routes only
console.log('✅ Testing basic routes...');
app.get('/', (req, res) => res.send('Home page'));
app.get('/login', (req, res) => res.send('Login page'));
app.get('/signup', (req, res) => res.send('Signup page'));

// Test 2: Add API routes (no parameters)
console.log('✅ Testing API routes...');
app.get('/api/user', (req, res) => res.json({ message: 'User API' }));
app.get('/api/clubs', (req, res) => res.json({ message: 'Clubs API' }));
app.get('/api/events', (req, res) => res.json({ message: 'Events API' }));

// Test 3: Add simple parameter routes
console.log('✅ Testing parameter routes...');
app.get('/club/:id', (req, res) => res.send(`Club ${req.params.id}`));
app.get('/api/clubs/:id', (req, res) => res.json({ clubId: req.params.id }));

// Test 4: Add complex parameter routes (these might be the problem)
console.log('✅ Testing complex parameter routes...');
app.get('/api/events/date/:date', (req, res) => res.json({ date: req.params.date }));
app.get('/api/events/calendar/:year/:month', (req, res) => {
    res.json({ year: req.params.year, month: req.params.month });
});

// Test 5: Add wildcard routes (often problematic)
console.log('✅ Testing wildcard routes...');
app.use('/assets', express.static(path.join(__dirname, '../frontend/assets')));

// Start server
app.listen(port, () => {
    console.log(`✅ Minimal server running on port ${port}`);
    console.log('If this works, the problem is in your full app.js file');
});