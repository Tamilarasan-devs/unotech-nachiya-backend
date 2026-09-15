import express, { Request, Response } from 'express';
import multer from 'multer';
import { v2 as cloudinary } from 'cloudinary';
import streamifier from 'streamifier';
import dotenv from 'dotenv';
import { protect, admin } from '../middlewares/authMiddleware';

dotenv.config();

const router = express.Router();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
});

router.post(
  '/',
  protect as any,
  admin as any,
  upload.array('images', 10),
  async (req: Request, res: Response) => {
    try {
      if (!req.files || (req.files as Express.Multer.File[]).length === 0) {
        res.status(400);
        throw new Error('No files uploaded');
      }

      const files = req.files as Express.Multer.File[];
      const urls: string[] = [];

      const streamUpload = (file: Express.Multer.File) => {
        return new Promise((resolve, reject) => {
          const stream = cloudinary.uploader.upload_stream(
            { folder: 'nachiya-fsd' },
            (error, result) => {
              if (result) resolve(result);
              else reject(error);
            }
          );
          streamifier.createReadStream(file.buffer).pipe(stream);
        });
      };

      for (const file of files) {
        const result: any = await streamUpload(file);
        urls.push(result.secure_url);
      }

      res.status(201).json({
        message: 'Images uploaded successfully',
        urls,
      });
    } catch (error: any) {
      console.error(error);
      res.status(500).json({ message: error.message || 'Image upload failed' });
    }
  }
);

export default router;
