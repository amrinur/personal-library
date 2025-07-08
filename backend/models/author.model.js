import { Schema } from "mongoose";
import mongoose from "mongoose";

const authorSchema = new Schema({
  author: { type: String, required: true },
});

export default mongoose.model("Author", authorSchema);
