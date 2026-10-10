import Groq from "groq-sdk";
import httpStatus from "http-status";
import { User } from "../models/user.model.js";
import { Booking } from "../models/booking.model.js";

const generateImprovementPlan = async (req, res) => {
  const { token, bookingId } = req.body;

  if (!token || !bookingId) {
    return res.status(httpStatus.BAD_REQUEST).json({
      message: "Token and booking ID are required",
    });
  }

  try {
    // Verify that the requester is a student.
    const student = await User.findOne({
      token,
      role: "student",
    });

    if (!student) {
      return res.status(httpStatus.UNAUTHORIZED).json({
        message: "Please log in as a student",
      });
    }

    // Only allow students to access their own completed bookings.
    const booking = await Booking.findOne({
      _id: bookingId,
      studentUsername: student.username,
      status: "completed",
    });

    if (!booking || !booking.feedback) {
      return res.status(httpStatus.NOT_FOUND).json({
        message: "Completed interview feedback not found",
      });
    }

    if (!process.env.GROQ_API_KEY) {
      return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
        message: "AI service is not configured",
      });
    }

    const groq = new Groq({
      apiKey: process.env.GROQ_API_KEY,
    });

    const completion = await groq.chat.completions.create({
      model: "openai/gpt-oss-20b",
      messages: [
        {
          role: "system",
          content: `
You are MockMate, a supportive interview improvement coach. Create a concise, personalized plan based only on the mentor's feedback.

## 1. Overall Assessment
Give a brief assessment in 2-3 sentences.

## 2. What You Did Well
Give 2-3 bullet points.

## 3. Top Improvement Priorities
Give 3 numbered priorities, each with one practical action.

## 4. Practice Plan for the Next 7 Days
Give a numbered list with one short task per day and an estimated time.

## 5. Goals for Your Next Mock Interview
Give 3 measurable goals.

Rules:
- Use Markdown headings and bullet points.
- Do not use tables.
- Do not include HTML tags.
- Keep the response under 400 words.
- Avoid repeating advice.
- Be encouraging, practical, and specific.
- Never invent achievements or abilities not supported by the feedback.
          `.trim(),
        },
        {
          role: "user",
          content: `
Mentor rating: ${booking.feedback.rating}/5
Strengths: ${booking.feedback.strengths}
Areas to improve: ${booking.feedback.weaknesses}
Mentor suggestions: ${booking.feedback.suggestions}

Create an improvement plan based on this feedback.
          `.trim(),
        },
      ],
      temperature: 0.4,
      max_tokens: 900,
    });

    const plan = completion.choices[0]?.message?.content;

    if (!plan) {
      return res.status(httpStatus.BAD_GATEWAY).json({
        message: "The AI did not return an improvement plan",
      });
    }

    return res.status(httpStatus.OK).json({ plan });
  } catch (error) {
    console.error("Generate improvement plan error:", error);

    return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      message: "Unable to generate an improvement plan right now",
    });
  }
};

export { generateImprovementPlan };