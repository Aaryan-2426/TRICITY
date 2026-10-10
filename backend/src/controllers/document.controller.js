import "dotenv/config";
import { v2 as cloudinary } from "cloudinary";
import multer from "multer";
import { User } from "../models/user.model.js";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});
cloudinary.api
  .ping()
  .then((result) => {
    console.log("Cloudinary API test:", result);
  })
  .catch((error) => {
    console.error("Cloudinary API test failed:", {
      message: error.message,
      http_code: error.http_code,
    });
  });
console.log("Cloudinary configuration:", {
  cloudNamePresent: Boolean(process.env.CLOUDINARY_CLOUD_NAME),
  apiKeyPresent: Boolean(process.env.CLOUDINARY_API_KEY),
  apiSecretPresent: Boolean(process.env.CLOUDINARY_API_SECRET),
});

const storage = multer.memoryStorage();

const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
  fileFilter: (req, file, callback) => {
    const allowedTypes = ["application/pdf", "image/jpeg", "image/png"];

    if (allowedTypes.includes(file.mimetype)) {
      callback(null, true);
    } else {
      callback(new Error("Only PDF, JPG, and PNG files are allowed."));
    }
  },
});

const uploadMiddleware = upload.single("document");

const uploadMentorDocument = async (req, res) => {
  try {
    const { token } = req.body;

    if (!token) {
      return res.status(401).json({
        message: "Please log in as a mentor.",
      });
    }

    const mentor = await User.findOne({
      token,
      role: "mentor",
    });

    if (!mentor) {
      return res.status(403).json({
        message: "Only logged-in mentors can upload documents.",
      });
    }

    if (!req.file) {
      return res.status(400).json({
        message: "Please select a document.",
      });
    }

    const base64 = req.file.buffer.toString("base64");
    const dataUri = `data:${req.file.mimetype};base64,${base64}`;

    const result = await cloudinary.uploader.upload(dataUri, {
      folder: "mockmate/mentor-documents",
      resource_type: "auto",
      use_filename: true,
      unique_filename: true,
    });

    const document = {
      name: req.file.originalname,
      url: result.secure_url,
      publicId: result.public_id,
      uploadedAt: new Date(),
    };

    mentor.documents.push(document);
    await mentor.save();

    return res.status(201).json({
      message: "Document uploaded successfully.",
      document,
    });
  } catch (error) {
    console.error("Mentor document upload error:", {
      message: error.message,
      http_code: error.http_code,
      name: error.name,
      details: error.error,
    });
    return res.status(500).json({
      message: "Unable to upload document.",
    });
  }
};
const getMentorDocuments = async (req, res) => {
  try {
    const mentor = await User.findOne({
      _id: req.params.mentorId,
      role: "mentor",
    }).select("name title company documents");

    if (!mentor) {
      return res.status(404).json({
        message: "Mentor not found.",
      });
    }

    return res.status(200).json({
      mentor,
    });
  } catch (error) {
    console.error("Get mentor documents error:", error);

    return res.status(500).json({
      message: "Unable to retrieve mentor documents.",
    });
  }
};

export { uploadMiddleware, uploadMentorDocument, getMentorDocuments };
