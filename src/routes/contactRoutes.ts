// src/routes/contactRoutes.ts
import { Router } from 'express';
import { createContact } from '../controllers/contactController';

const router = Router();

// POST /api/contacts  → will hit your createContact controller
router.post('/contacts', createContact);

export default router;
