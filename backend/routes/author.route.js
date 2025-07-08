import express from 'express';
import { createAuthor, deleteAuthor, getAuthor, getAuthors } from '../controllers/author.controller.js';

const router = express.Router();

router.get("/", getAuthors)
router.get("/:id", getAuthor);
router.post("/", createAuthor);
router.delete("/:id", deleteAuthor);

export default router;
