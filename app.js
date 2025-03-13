const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config();

const { initDB } = require('./db');
const schoolRoutes = require('./routes/schoolRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

initDB().then(() => {
  console.log(' Database initialized');

  app.use('/', schoolRoutes);

  app.get('/', (req, res) => {
    res.send('School Management API is running');
  });

  app.listen(PORT, () => {
    console.log(` Server is running on port ${PORT}`);
  });
}).catch(err => {
  console.error('Failed to initialize database:', err);
  process.exit(1); 
});

module.exports = app;
