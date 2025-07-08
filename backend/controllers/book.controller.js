import Book from "../models/book.model.js"

export const getBooks = async (req, res) => {
    const books = await Book.find().populate('author')
    res.status(200).json(books)
}

export const getBook = async (req, res) => {
    const book = await Book.findOne({slug: req.params.slug}).populate('author')
    res.status(200).json(book)
}

export const createBook = async (req, res) => {
    const newBook = new Book(req.body);     
    const book = await newBook.save();
    const populatedBook = await Book.findById(book._id).populate('author'); 
    res.status(201).json(populatedBook); // response dengan detail author
}

export const deleteBook = async (req, res) => {
    const book = await Book.findByIdAndDelete(req.params.id)
    res.status(200).json("Book Has Been Deleted")
}

//ai generated hehe
export const updateBook = async (req, res) => {
    try {
        const updatedBook = await Book.findByIdAndUpdate(
            req.params.id, 
            req.body, 
            { new: true }
        ).populate('author');
        
        if (!updatedBook) {
            return res.status(404).json({ message: "Book not found" });
        }
        
        res.status(200).json(updatedBook);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}