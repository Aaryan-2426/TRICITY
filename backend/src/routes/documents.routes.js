
import { Router } from "express";
import {
  uploadMiddleware,
  uploadMentorDocument,
  getMentorDocuments,
} from "../controllers/document.controller.js";

const router = Router();

router.post(
  "/upload",
  (req, res, next) => {
    uploadMiddleware(req, res, (error) => {
      if (error) {
        const status = error.code === "LIMIT_FILE_SIZE" ? 413 : 400;

        return res.status(status).json({
          message:
            error.code === "LIMIT_FILE_SIZE"
              ? "File size must not exceed 5 MB."
              : error.message,
        });
      }

      next();
    });
  },
  uploadMentorDocument
);
router.get("/:mentorId", getMentorDocuments);
export default router;
