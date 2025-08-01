import path from 'path';
import express from 'express';
import multer from 'multer';
const router = express.Router();

const storage = multer.diskStorage({
    destination(req, file, cb) {
        cb(null, 'uploads/');
    },
    filename(req, file, cb) {
        cb(null, `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`);
    },
});

const upload = multer({ storage });

router.post('/', upload.single('image'), (req, res) => {
    res.send({
        message: 'Image Uploaded',
        image: `/${req.file.path}`,
    });
});

export default router;