import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import questionRoutes from './routes/questionRoutes';
import answerRoutes from './routes/answerRoutes';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;


console.log('Environment configuration:', {
  NODE_ENV: process.env.NODE_ENV,
  PORT: port,
  DB_HOST: process.env.DB_HOST,
  DB_NAME: process.env.DB_NAME
});

app.use(cors());
app.use(express.json());


app.get('/', (req, res) => {
  res.json({ message: 'Server is running' });
});


app.use('/api/questions', questionRoutes);
app.use('/api/answers', answerRoutes);


app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Error details:', {
    message: err.message,
    stack: err.stack,
    type: err.name
  });
  res.status(500).json({ 
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

const server = app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
}).on('error', (error: any) => {
  console.error('Failed to start server:', error);
  process.exit(1);
});

process.on('SIGTERM', () => {
  console.log('SIGTERM received. Shutting down gracefully...');
  server.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
}); 