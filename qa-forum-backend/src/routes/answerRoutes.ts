import { Router } from 'express';
import { getAnswers, createAnswer, likeAnswer, deleteAnswer } from '../controllers/answerController';

const router = Router();

router.get('/question/:questionId', getAnswers);

router.post('/', createAnswer);

router.put('/:id/like', likeAnswer);

router.delete('/:id', deleteAnswer);

export default router; 