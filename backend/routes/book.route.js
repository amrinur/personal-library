import express from 'express';
import Book from '../models/book.model.js';
import { getBooks, getBook, createBook, deleteBook, updateBook } from '../controllers/book.controller.js';


const router = express.Router();

router.get("/", getBooks);
router.get("/:slug", getBook);
router.post("/", createBook);
router.delete("/:id", deleteBook);
router.put("/:id", updateBook); // Route baru untuk update

export default router;
