const express = require('express');
const path = require('path');
const app = express();
const port = 3000;

// Serve static assets
app.use('/assets', express.static(path.join(__dirname, '../frontend/assets')));
app.use('/scripts', express.static(path.join(__dirname, '../frontend/scripts')));
app.use('/styles', express.static(path.join(__dirname, '../frontend/styles')));

// Route to login page
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/pages/login.html'));
});

// Route to home page
app.get('/home', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/pages/index.html'));
});

// Route to tech clubs
app.get('/tech-clubs', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/pages/tech-clubs.html'));
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});

