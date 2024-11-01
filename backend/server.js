const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const path = require('path');
const guidesRoutes = require('./src/routes/guides');
const assistantRoutes = require('./src/routes/assistant');
const communityRoutes = require('./src/routes/community');
const userRoutes = require('./src/routes/user');


dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Serve static files
app.use('/symbols', express.static(path.join(__dirname, 'src', 'symbols')));
const fs = require('fs');
if (!fs.existsSync('uploads')) {
    fs.mkdirSync('uploads');
}
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/guides', guidesRoutes);
app.use('/api/assistant', assistantRoutes);
app.use('/api/community', communityRoutes);
app.use('/api/user', userRoutes);

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('MongoDB connected'))
  .catch((err) => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('Gracefully shutting down...');
  await mongoose.connection.close();
  process.exit(0);
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Centralized error handling middleware
app.use((err, req, res, next) => {
  console.error('Express error:', err);
  res.status(500).json({ error: 'Something went wrong. Please try again later.', details: err.message });
});
