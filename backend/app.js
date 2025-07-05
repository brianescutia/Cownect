const express = require('express');
const path = require('path');
const app = express();
const port = 3000;

app.use(express.static(path.join(__dirname, '../frontend')));
app.use(express.urlencoded({ extended: true }));

// Dummy user (replace with MongoDB later)
const dummyUser = {
  email: 'user@ucdavis.edu',
  password: 'password123'
};

// Home route
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/index.html'));
});

// Login GET route
app.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/pages/login.html'));
});

// Login POST route
app.post('/login', (req, res) => {
  const { email, password } = req.body;

  if (email === dummyUser.email && password === dummyUser.password) {
    res.redirect('/');
  } else {
    // Redirect back with a query string like ?error=1
    res.redirect('/login?error=1');
  }
});


// Tech Clubs page
app.get('/tech-clubs', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/pages/tech-clubs.html'));
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});


