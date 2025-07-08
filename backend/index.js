import express from 'express';
import { connect } from 'mongoose';
import connectDB from './lib/connectDB.js';
import bookRoutes from './routes/book.route.js';
import authorRoutes from './routes/author.route.js'
import cors from "cors"

const app = express();

console.log(process.env.test);

app.use(cors(process.env.CLIENT_URL))

// Middleware untuk parsing JSON
app.use(express.json());

// Gunakan route untuk endpoint /book
app.use('/book', bookRoutes);
app.use('/author', authorRoutes);

app.listen(3000, () => {
    connectDB();
  console.log('Server is running');
});

