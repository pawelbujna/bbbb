const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;

const fileSchema = new mongoose.Schema({
  url: String,
  key: String,
});

const articleSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      required: true,
      max: 32,
    },
    slug: {
      type: String,
      lowercase: true,
      unique: true,
      index: true,
    },
    files: [fileSchema],
    content: {
      type: {},
      min: 20,
      max: 2000000,
    },
    postedBy: {
      type: ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Article", articleSchema);
