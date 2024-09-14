const express = require('express');
const cors = require('cors'); // Import CORS
const dotenv = require('dotenv');
const app = express();
const authRoutes = require('./src/routes/authRoutes');
const linkRoutes = require('./src/routes/linkRoutes');
const { notFound, errorHandler } = require('./src/middleware/errorHandler');

// Load environment variables from .env file
dotenv.config();

// Enable CORS for all routes
app.use(cors()); // Use CORS middleware

// Middleware to parse JSON bodies
app.use(express.json());

// Use routes
app.use('/api/auth', authRoutes);
app.use('/api/links', linkRoutes);

// Error handling middleware
app.use(notFound);
app.use(errorHandler);

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
