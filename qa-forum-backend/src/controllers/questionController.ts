import { Request, Response } from 'express';
import connection from '../config/database';
import { ResultSetHeader, RowDataPacket } from 'mysql2';

interface Question extends RowDataPacket {
  id: number;
  title: string;
  description: string;
  tags: string | null;
  created_at: Date;
}

export const getQuestions = async (req: Request, res: Response): Promise<void> => {
  try {
    console.log('Attempting to fetch questions from database...');
    const [rows] = await connection.execute<Question[]>('SELECT * FROM questions ORDER BY created_at DESC');
    console.log('Successfully fetched questions:', rows.length);
    res.json(rows);
  } catch (error) {
    console.error('Error fetching questions:', error);
    if (error instanceof Error) {
      console.error('Error details:', error.message, error.stack);
      res.status(500).json({ 
        message: 'Error fetching questions',
        error: error.message 
      });
    } else {
      res.status(500).json({ message: 'Error fetching questions' });
    }
  }
};

export const getQuestion = async (req: Request, res: Response): Promise<void> => {
  try {
    const [rows] = await connection.query<Question[]>('SELECT * FROM questions WHERE id = ?', [req.params.id]);
    if (rows.length === 0) {
      res.status(404).json({ message: 'Question not found' });
      return;
    }
    res.json(rows[0]);
  } catch (error) {
    console.error('Error fetching question:', error);
    res.status(500).json({ message: 'Error fetching question' });
  }
};

export const createQuestion = async (req: Request, res: Response): Promise<void> => {
  const { title, description, tags } = req.body;

  if (!title || !description) {
    res.status(400).json({ message: 'Title and description are required' });
    return;
  }

  try {
    const [result] = await connection.query<ResultSetHeader>(
      'INSERT INTO questions (title, description, tags) VALUES (?, ?, ?)',
      [title, description, tags]
    );
    res.status(201).json({ 
      id: result.insertId, 
      title, 
      description, 
      tags 
    });
  } catch (error) {
    console.error('Error creating question:', error);
    res.status(500).json({ message: 'Error creating question' });
  }
}; 