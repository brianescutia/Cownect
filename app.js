const express = require('express');
const path = require('path'); // Built-in Node module
const app = express();
const port = 3000;

// Serve static files like app.js
app.use(express.static('public'));

// Serve the HTML file
app.get('/', (req, res) => {
  res.send('Hello, World!');
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
