import mongoose, { Schema } from "mongoose";

const bookingSchema = new Schema(
  {
    studentUsername: {
      type: String,
      required: true,
    },
    mentorUsername: {
      type: String,
      required: true,
    },
    mentorName: {
      type: String,
      required: true,
    },
    date: {
      type: String,
      required: true,
    },
    time: {
      type: String,
      required: true,
    },
    fee: {
      type: Number,
      required: true,
      min: 0,
    },
    status: {
      type: String,
      enum: ["pending", "confirmed", "cancelled", "completed"],
      default: "pending",
    },

    feedback: {
      rating: {
        type: Number,
        min: 1,
        max: 5,
      },
      strengths: {
        type: String,
        default: "",
      },
      weaknesses: {
        type: String,
        default: "",
      },
      suggestions: {
        type: String,
        default: "",
      },
      submittedAt: {
        type: Date,
      },
    },
  },
  { timestamps: true },
);

const Booking = mongoose.model("Booking", bookingSchema);

export { Booking };
