import { Router } from "express";
import {
  createBooking,
  getMyBookings,
  updateBookingStatus,
  submitFeedback,
} from "../controllers/booking.controller.js";

const router = Router();

router.route("/create").post(createBooking);
router.route("/my-bookings").get(getMyBookings);
router.route("/update-status").post(updateBookingStatus);
router.route("/submit-feedback").post(submitFeedback);

export default router;