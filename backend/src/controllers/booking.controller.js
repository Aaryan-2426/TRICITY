import httpStatus from "http-status";
import { Booking } from "../models/booking.model.js";
import { User } from "../models/user.model.js";

const createBooking = async (req, res) => {
  const { token, mentorUsername, date, time } = req.body;
  const selectedDateTime = new Date(`${date}T${time}`);
  const now = new Date();

  if (Number.isNaN(selectedDateTime.getTime()) || selectedDateTime <= now) {
    return res.status(httpStatus.BAD_REQUEST).json({
      message: "Please select a valid future date and time",
    });
  }

  if (!token || !mentorUsername || !date || !time) {
    return res.status(httpStatus.BAD_REQUEST).json({
      message: "Token, mentor, date and time are required",
    });
  }

  try {
    const student = await User.findOne({ token, role: "student" });

    if (!student) {
      return res.status(httpStatus.UNAUTHORIZED).json({
        message: "Please log in as a student",
      });
    }

    const mentor = await User.findOne({
      username: mentorUsername,
      role: "mentor",
    });

    if (!mentor) {
      return res.status(httpStatus.NOT_FOUND).json({
        message: "Mentor not found",
      });
    }
    const existingBooking = await Booking.findOne({
      studentUsername: student.username,
      mentorUsername: mentor.username,
      date,
      time,
      status: { $in: ["pending", "confirmed"] },
    });

    if (existingBooking) {
      return res.status(httpStatus.CONFLICT).json({
        message:
          "You already have a booking with this mentor at that date and time",
      });
    }

    const booking = await Booking.create({
      studentUsername: student.username,
      mentorUsername: mentor.username,
      mentorName: mentor.name,
      date,
      time,
      fee: mentor.price,
      status: "pending",
    });

    return res.status(httpStatus.CREATED).json({
      message: "Booking request submitted successfully",
      booking,
    });
  } catch (error) {
    console.error("Create booking error:", error);
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      message: "Unable to create booking",
    });
  }
};

const getMyBookings = async (req, res) => {
  const { token } = req.query;

  if (!token) {
    return res.status(httpStatus.UNAUTHORIZED).json({
      message: "Authentication token is required",
    });
  }

  try {
    const user = await User.findOne({ token });

    if (!user) {
      return res.status(httpStatus.UNAUTHORIZED).json({
        message: "Invalid token",
      });
    }

    let filter;

    if (user.role === "student") {
      filter = { studentUsername: user.username };
    } else {
      filter = { mentorUsername: user.username };
    }

    const bookings = await Booking.find(filter).sort({ createdAt: -1 });

    return res.status(httpStatus.OK).json(bookings);
  } catch (error) {
    console.error("Get bookings error:", error);
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      message: "Unable to fetch bookings",
    });
  }
};

const updateBookingStatus = async (req, res) => {
  const { token, bookingId, status } = req.body;

  if (!token || !bookingId || !status) {
    return res.status(httpStatus.BAD_REQUEST).json({
      message: "Token, booking ID and status are required",
    });
  }

  if (!["confirmed", "cancelled"].includes(status)) {
    return res.status(httpStatus.BAD_REQUEST).json({
      message: "Invalid booking status",
    });
  }

  try {
    const mentor = await User.findOne({ token, role: "mentor" });

    if (!mentor) {
      return res.status(httpStatus.UNAUTHORIZED).json({
        message: "Please log in as a mentor",
      });
    }

    const booking = await Booking.findOne({
      _id: bookingId,
      mentorUsername: mentor.username,
      status: "pending",
    });

    if (!booking) {
      return res.status(httpStatus.NOT_FOUND).json({
        message: "Pending booking not found for this mentor",
      });
    }

    booking.status = status;
    await booking.save();

    return res.status(httpStatus.OK).json({
      message: `Booking ${status} successfully`,
      booking,
    });
  } catch (error) {
    console.error("Update booking status error:", error);

    if (error.name === "CastError") {
      return res.status(httpStatus.BAD_REQUEST).json({
        message: "Invalid booking ID",
      });
    }

    return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      message: "Unable to update booking status",
    });
  }
};

const submitFeedback = async (req, res) => {
  const { token, bookingId, rating, strengths, weaknesses, suggestions } =
    req.body;

  if (
    !token ||
    !bookingId ||
    !rating ||
    !strengths?.trim() ||
    !weaknesses?.trim() ||
    !suggestions?.trim()
  ) {
    return res.status(httpStatus.BAD_REQUEST).json({
      message: "Please provide all feedback fields",
    });
  }

  if (
    !Number.isInteger(Number(rating)) ||
    Number(rating) < 1 ||
    Number(rating) > 5
  ) {
    return res.status(httpStatus.BAD_REQUEST).json({
      message: "Rating must be a whole number from 1 to 5",
    });
  }

  try {
    const mentor = await User.findOne({ token, role: "mentor" });

    if (!mentor) {
      return res.status(httpStatus.UNAUTHORIZED).json({
        message: "Please log in as a mentor",
      });
    }
    const existingBooking = await Booking.findOne({
      studentUsername: student.username,
      mentorUsername: mentor.username,
      date,
      time,
      status: { $in: ["pending", "confirmed"] },
    });

    if (existingBooking) {
      return res.status(httpStatus.CONFLICT).json({
        message:
          "You already have a booking with this mentor at that date and time",
      });
    }

    const booking = await Booking.findOne({
      _id: bookingId,
      mentorUsername: mentor.username,
      status: "confirmed",
    });

    if (!booking) {
      return res.status(httpStatus.NOT_FOUND).json({
        message: "Confirmed booking not found",
      });
    }

    booking.feedback = {
      rating: Number(rating),
      strengths: strengths.trim(),
      weaknesses: weaknesses.trim(),
      suggestions: suggestions.trim(),
      submittedAt: new Date(),
    };

    booking.status = "completed";
    await booking.save();

    return res.status(httpStatus.OK).json({
      message: "Feedback submitted successfully",
      booking,
    });
  } catch (error) {
    console.error("Submit feedback error:", error);

    if (error.name === "CastError") {
      return res.status(httpStatus.BAD_REQUEST).json({
        message: "Invalid booking ID",
      });
    }

    return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      message: "Unable to submit feedback",
    });
  }
};

export { createBooking, getMyBookings, updateBookingStatus, submitFeedback };
