import httpStatus from "http-status";
import { User } from "../models/user.model.js";
import bcrypt, { hash } from "bcrypt";

import crypto from "crypto";
import { Meeting } from "../models/meeting.model.js";
const login = async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: "Please Provide" });
  }

  try {
    const user = await User.findOne({ username });
    if (!user) {
      return res
        .status(httpStatus.NOT_FOUND)
        .json({ message: "User Not Found" });
    }

    let isPasswordCorrect = await bcrypt.compare(password, user.password);

    if (isPasswordCorrect) {
      let token = crypto.randomBytes(20).toString("hex");

      user.token = token;
      await user.save();
      return res.status(httpStatus.OK).json({
        token: token,
        role: user.role,
        name: user.name,
      });
    } else {
      return res
        .status(httpStatus.UNAUTHORIZED)
        .json({ message: "Invalid Username or password" });
    }
  } catch (e) {
    return res.status(500).json({ message: `Something went wrong ${e}` });
  }
};

const register = async (req, res) => {
  const { name, username, password, role } = req.body;

  if (!name || !username || !password) {
    return res.status(400).json({
      message: "Name, username and password are required",
    });
  }

  const selectedRole = role || "student";

  if (!["student", "mentor"].includes(selectedRole)) {
    return res.status(400).json({
      message: "Role must be student or mentor",
    });
  }

  try {
    const existingUser = await User.findOne({ username });
    console.log(
      "Registration check:",
      username,
      "Existing user:",
      !!existingUser,
    );

    if (existingUser) {
      return res.status(409).json({
        message: "User already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      name,
      username,
      password: hashedPassword,
      role: selectedRole,
    });

    await newUser.save();

    console.log("SAVED USER:", newUser.username);
    console.log("DATABASE:", newUser.db.name);
    console.log("COLLECTION:", newUser.collection.name);

    return res.status(httpStatus.CREATED).json({
      message: "User Registered",
      role: newUser.role,
    });
  } catch (e) {
    console.error("Registration error:", e);
    return res.status(500).json({
      message: "Unable to register user",
    });
  }
};

const getUserHistory = async (req, res) => {
  const { token } = req.query;

  try {
    const user = await User.findOne({ token: token });
    const meetings = await Meeting.find({ user_id: user.username });
    res.json(meetings);
  } catch (e) {
    res.json({ message: `Something went wrong ${e}` });
  }
};

const addToHistory = async (req, res) => {
  const { token, meeting_code } = req.body;

  try {
    const user = await User.findOne({ token: token });

    const newMeeting = new Meeting({
      user_id: user.username,
      meetingCode: meeting_code,
    });

    await newMeeting.save();

    res.status(httpStatus.CREATED).json({ message: "Added code to history" });
  } catch (e) {
    res.json({ message: `Something went wrong ${e}` });
  }
};


const getMentors = async (req, res) => {
  try {
    const mentors = await User.find(
      { role: "mentor" },
      "name username title company skills price"
    );

    return res.status(httpStatus.OK).json(mentors);
  } catch (error) {
    console.error("Get mentors error:", error);
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      message: "Unable to fetch mentors",
    });
  }
};


const updateMentorProfile = async (req, res) => {
  const { token, title, company, skills, price } = req.body;

  if (!token) {
    return res.status(httpStatus.UNAUTHORIZED).json({
      message: "Authentication token is required",
    });
  }

  const parsedPrice = Number(price);

  if (
    !title?.trim() ||
    !company?.trim() ||
    !skills?.trim() ||
    price === undefined ||
    price === null ||
    price === "" ||
    !Number.isFinite(parsedPrice) ||
    parsedPrice < 0
  ) {
    return res.status(httpStatus.BAD_REQUEST).json({
      message: "Enter a title, company, skills, and a valid session fee",
    });
  }

  try {
    const mentor = await User.findOne({ token, role: "mentor" });

    if (!mentor) {
      return res.status(httpStatus.NOT_FOUND).json({
        message: "Mentor not found",
      });
    }

    mentor.title = title.trim();
    mentor.company = company.trim();
    mentor.skills = skills.trim();
    mentor.price = parsedPrice;

    await mentor.save();

    return res.status(httpStatus.OK).json({
      message: "Mentor profile updated successfully",
      mentor: {
        _id: mentor._id,
        name: mentor.name,
        title: mentor.title,
        company: mentor.company,
        skills: mentor.skills,
        price: mentor.price,
      },
    });
  } catch (error) {
    console.error("Update mentor profile error:", error);
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      message: "Unable to update mentor profile",
    });
  }
};

export {
  login,
  register,
  getUserHistory,
  addToHistory,
  getMentors,
  updateMentorProfile,
};

