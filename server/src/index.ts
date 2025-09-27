import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import morgan from 'morgan';
import mongoose, { ConnectOptions } from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { ErrorRequestHandler } from 'express';
import { MulterError } from 'multer';
import studentsRouter from './routes/students';
import teachersRouter from './routes/teachers';
import staffRouter from './routes/staff';
import applicantsRouter from './routes/applicants';
import authRouter, { requireAdmin } from './routes/auth';
import adminRouter from './routes/admin';
import announcementsRouter from './routes/announcements';
import testimonialsRouter from './routes/testimonials';
import jobsRouter from './routes/jobs';
import universitiesRouter from './routes/universities';
import servicesRouter from './routes/services';
import contactRouter from './routes/contact';
import applicationsRouter from './routes/applications';

// Load environment variables
dotenv.config();

// Initialize Express
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

// Static files
app.use('/uploads', express.static(path.resolve('uploads')));

// Database connection
const port = process.env.PORT || 4001;
const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/edujobs';

// Health check endpoint
app.get('/api/health', (_req: Request, res: Response) => {
  res.json({ 
    ok: true, 
    service: 'edujobs-server',
    timestamp: new Date().toISOString()
  });
});

// API Routes
app.use('/api/auth', authRouter);
app.use('/api/students', studentsRouter);
app.use('/api/teachers', teachersRouter);
app.use('/api/staff', staffRouter);
app.use('/api/applicants', applicantsRouter);
app.use('/api/announcements', announcementsRouter);
app.use('/api/testimonials', testimonialsRouter);
app.use('/api/jobs', jobsRouter);
app.use('/api/universities', universitiesRouter);
app.use('/api/services', servicesRouter);
app.use('/api/contact', contactRouter);
app.use('/api/applications', applicationsRouter);

// Protected admin routes
app.use('/api/admin', requireAdmin, adminRouter);

// Error handling middleware
const errorHandler: ErrorRequestHandler = (err: Error, _req: Request, res: Response, _next: NextFunction) => {
  console.error('Error:', err);
  
  if (err instanceof MulterError) {
    return res.status(400).json({ 
      success: false,
      message: `Upload error: ${err.message}`
    });
  }

  const status = (err as any).status || 500;
  const message = err.message || 'Internal Server Error';
  
  res.status(status).json({ 
    success: false,
    message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
};

app.use(errorHandler);

// Connect to MongoDB and start server
async function startServer() {
  try {
    await connectWithRetry();
    
    app.listen(port, () => {
      console.log(`[server] Server is running on http://localhost:${port}`);
      console.log(`[server] Environment: ${process.env.NODE_ENV || 'development'}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

// Database connection with retry logic
async function connectWithRetry(retries = 5, delayMs = 2000): Promise<void> {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const options: ConnectOptions = {
        // Remove deprecated options
      };
      
      await mongoose.connect(mongoUri, options);
      console.log('[mongo] Successfully connected to MongoDB');
      return;
    } catch (error) {
      const isLastAttempt = attempt === retries;
      const errorMessage = error instanceof Error ? error.message : String(error);
      
      console.error(
        `[mongo] Connection attempt ${attempt}/${retries} failed: ${errorMessage}`
      );
      
      if (isLastAttempt) {
        throw new Error(`Failed to connect to MongoDB after ${retries} attempts`);
      }
      
      console.log(`[mongo] Retrying in ${delayMs / 1000} seconds...`);
      await new Promise(resolve => setTimeout(resolve, delayMs));
    }
  }
}

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason: Error | any, promise: Promise<any>) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  // Consider restarting the server in production
  // process.exit(1);
});

// Start the server
startServer().catch(error => {
  console.error('Fatal error during server startup:', error);
  process.exit(1);
});

export default app;