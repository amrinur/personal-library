import { Schema } from "mongoose";
import mongoose from "mongoose";
import Author from "./author.model.js"; // Import model Author

const bookSchema = new Schema({
  title: { type: String, required: true },
  author: {
    type: Schema.Types.ObjectId, // hapus type: String
    ref: "Author",
    required: true,
  },
  year: { type: String, required: true },
  genre: { type: String, required: true },
  pages: { type: String, required: true },
  status: { type: String, enum: ["read", "plan", "readed"], default: "plan" },
  image: { type: String},
  favorite: {type: Boolean, default: false},
});

export default mongoose.model("Book", bookSchema);

