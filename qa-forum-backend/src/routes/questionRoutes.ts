import { Router } from 'express';
import { getQuestions, getQuestion, createQuestion } from '../controllers/questionController';

const router = Router();

// Get all questions
router.get('/', getQuestions);

// Get a specific question
router.get('/:id', getQuestion);

// Create a new question
router.post('/', createQuestion);

export default router; 