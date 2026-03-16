import path from "path";
import fs from "fs";
import express from "express";
import multer from "multer";
import { fileURLToPath } from "url";
import { authenticate, authorizeAdmin } from "../middlewares/authMiddleware.js";

const router = express.Router();
const routesDirectory = path.dirname(fileURLToPath(import.meta.url));
const uploadDirectory = path.join(routesDirectory, "..", "uploads");
const allowedExtensions = new Set([".jpg", ".jpeg", ".png", ".webp"]);
const allowedMimeTypes = new Set(["image/jpeg", "image/png", "image/webp"]);

fs.mkdirSync(uploadDirectory, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDirectory);
  },

  filename: (req, file, cb) => {
    const extname = path.extname(file.originalname).toLowerCase();
    cb(null, `${file.fieldname}-${Date.now()}${extname}`);
  },
});

const fileFilter = (req, file, cb) => {
  const extname = path.extname(file.originalname).toLowerCase();
  const mimetype = file.mimetype;

  if (allowedExtensions.has(extname) && allowedMimeTypes.has(mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Only JPEG, PNG, and WEBP images are allowed"), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 2 * 1024 * 1024,
  },
});
const uploadSingleImage = upload.single("image");

router.post("/", authenticate, authorizeAdmin, (req, res) => {
  uploadSingleImage(req, res, (err) => {
    if (err) {
      if (err instanceof multer.MulterError && err.code === "LIMIT_FILE_SIZE") {
        return res.status(400).json({
          message: "Image must be 2MB or smaller",
        });
      }

      return res.status(400).json({ message: err.message });
    } else if (req.file) {
      res.status(200).json({
        message: "Image uploaded successfully",
        image: `/uploads/${path.basename(req.file.path)}`,
      });
    } else {
      res.status(400).json({ message: "No image file provided" });
    }
  });
});

export default router;
