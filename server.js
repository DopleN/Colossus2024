import express from 'express';
import mongoose from 'mongoose';
import session from 'express-session';
import adminRoutes from './routes/admin_routes.js';
import apiRoutes from './apis/api_routes.js';
import userRoutes from './routes/user_routes.js';
import dotenv from 'dotenv';

const app = express();
dotenv.config();

// Middleware Setup
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public_assets')); // Changed from 'assets' to 'public_assets'
app.use(session({
  secret: 'mySecretKey2024', // Renamed session secret for variety
  resave: false,
  saveUninitialized: true,
  cookie: {
    secure: false, // Consider setting to true in production with HTTPS
    httpOnly: true,
    maxAge: 1000 * 60 * 60 * 24 * 7, // 1 week
  }
}));

// Route Setup
app.use('/admin', adminRoutes);
app.use('/api/v1', apiRoutes);
app.use('/', userRoutes);

// 404 Handler
app.use((req, res) => res.status(404).redirect('/not-found'));

// View Engine Setup
app.set('view engine', 'ejs');

// Server and DB Connection
const SERVER_PORT = process.env.PORT || 3000;
const MAX_RETRIES = 3;

// Database connection logic with retry mechanism
const connectToDatabase = async (retryCount = MAX_RETRIES) => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Connected to the database');
  } catch (err) {
    console.error('Failed to connect to the database:', err);
    if (retryCount > 0) {
      console.log(`Retrying... Attempts remaining: ${retryCount}`);
      setTimeout(() => connectToDatabase(retryCount - 1), 5000); // Retry after 5 seconds
    } else {
      console.error('Max retries reached. Could not connect to the database.');
      process.exit(1); // Exit the process if DB connection fails after retries
    }
  }
};

// Start the server after successful DB connection
connectToDatabase().then(() => {
  app.listen(SERVER_PORT, () => {
    console.log(`Server is running on http://localhost:${SERVER_PORT}`);
  });
});
