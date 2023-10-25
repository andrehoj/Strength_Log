const mongoose = require("mongoose");
const { setSchema } = require("./user");

const templateSchema = mongoose.Schema(
  {
    belongsTo: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    templateName: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      unique: true
    },
    templateNotes: { type: String, trim: true, required: false, default: null },
    exercises: [
      {
        exercise: { type: mongoose.Schema.Types.ObjectId, ref: "Exercise" },
        restTime: Number,
        sets: [setSchema],
      },
    ],
  },
  { timeStamps: true }
);

const Template = mongoose.model("Template", templateSchema);

module.exports = { Template };
