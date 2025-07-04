import { Router } from 'express';
import {
    getNotes,
    getNote,
    createNote,
    updateNote,
    deleteNote
} from '../controllers/noteController.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();

router.get('/', requireAuth, getNotes);
router.get('/:id', requireAuth, getNote);
router.post('/', requireAuth, createNote);
router.put('/:id', requireAuth, updateNote);
router.delete('/:id', requireAuth, deleteNote);

export default router;
