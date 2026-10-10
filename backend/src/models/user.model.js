import mongoose, { Schema } from "mongoose";

const userScheme = new Schema({
  name: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ["student", "mentor"],
    default: "student",
    required: true,
  },
  title: { type: String, default: "" },
  company: { type: String, default: "" },
  skills: { type: String, default: "" },
  price: { type: Number, default: 0 },
  token: { type: String },
  documents: [
    {
      name: {
        type: String,
        required: true,
      },
      url: {
        type: String,
        required: true,
      },
      publicId: {
        type: String,
        required: true,
      },
      uploadedAt: {
        type: Date,
        default: Date.now,
      },
    },
  ],
});

const User = mongoose.model("User", userScheme);

export { User };
