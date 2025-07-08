import Author from "../models/author.model.js"

export const getAuthor = async (req, res) => {
    const author = await Author.findById(req.params.id);
    res.status(200).json(author);
}

export const getAuthors = async (req, res) => {
    const authors = await Author.find();
    res.status(200).json(authors);
}

export const createAuthor = async (req, res) => {
    const newAuthor = new Author(req.body);     
    const author = await newAuthor.save();
    res.status(201).json(author);
}

export const deleteAuthor = async (req, res) => {
    const author = await Author.findByIdAndDelete(req.params.id);
    res.status(200).json("Author Has Been Deleted");
}