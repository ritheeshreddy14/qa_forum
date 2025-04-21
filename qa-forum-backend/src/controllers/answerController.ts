import { Request, Response } from 'express';
import pool from '../config/database';
import { ResultSetHeader, RowDataPacket } from 'mysql2';

interface Answer extends RowDataPacket {
  id: number;
  question_id: number;
  answer_text: string;
  likes: number;
  created_at: Date;
}

export const getAnswers = async (req: Request, res: Response): Promise<void> => {
  try {
    const [rows] = await pool.query<Answer[]>(
      'SELECT * FROM answers WHERE question_id = ? ORDER BY created_at DESC',
      [req.params.questionId]
    );
    res.json(rows);
  } catch (error) {
    console.error('Error fetching answers:', error);
    res.status(500).json({ message: 'Error fetching answers' });
  }
};

export const createAnswer = async (req: Request, res: Response): Promise<void> => {
  const { question_id, answer_text } = req.body;

  if (!question_id || !answer_text) {
    res.status(400).json({ message: 'Question ID and answer text are required' });
    return;
  }

  try {
    const [result] = await pool.query<ResultSetHeader>(
      'INSERT INTO answers (question_id, answer_text) VALUES (?, ?)',
      [question_id, answer_text]
    );
    res.status(201).json({ 
      id: result.insertId, 
      question_id, 
      answer_text, 
      likes: 0 
    });
  } catch (error) {
    console.error('Error creating answer:', error);
    res.status(500).json({ message: 'Error creating answer' });
  }
};

export const likeAnswer = async (req: Request, res: Response): Promise<void> => {
  try {
    await pool.query(
      'UPDATE answers SET likes = likes + 1 WHERE id = ?',
      [req.params.id]
    );
    res.json({ message: 'Answer liked successfully' });
  } catch (error) {
    console.error('Error liking answer:', error);
    res.status(500).json({ message: 'Error liking answer' });
  }
};

export const deleteAnswer = async (req: Request, res: Response): Promise<void> => {
  try {
    const [result] = await pool.query<ResultSetHeader>('DELETE FROM answers WHERE id = ?', [req.params.id]);
    if (result.affectedRows === 0) {
      res.status(404).json({ message: 'Answer not found' });
      return;
    }
    res.json({ message: 'Answer deleted successfully' });
  } catch (error) {
    console.error('Error deleting answer:', error);
    res.status(500).json({ message: 'Error deleting answer' });
  }
}; 