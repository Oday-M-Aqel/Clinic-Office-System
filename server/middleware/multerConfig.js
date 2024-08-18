import multer, { diskStorage } from 'multer';
import { join, extname as _extname } from 'path';
import { existsSync, mkdirSync } from 'fs';

const ensureDirExists = (dir) => {
    if (!existsSync(dir)) {
        mkdirSync(dir, { recursive: true });
    }
};

const storage0 = diskStorage({
    destination: (req, file, cb) => {
        const uploadPath = join(__dirname, '../../my-react-app/src/assets/uploads/carForRent');
        ensureDirExists(uploadPath);
        cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});

const uploadRentCarImage0 = multer({
    storage: storage0,
    limits: { fileSize: 5 * 1024 * 1024 },
    fileFilter: (req, file, cb) => {
        const ext = _extname(file.originalname);
        if (ext !== '.jpg' && ext !== '.jpeg' && ext !== '.png') {
            return cb(new Error('Only images are allowed'), false);
        }
        cb(null, true);
    }
}).single('carImage');


const storage1 = diskStorage({
    destination: (req, file, cb) => {
        const uploadPath = join(__dirname, '../../my-react-app/src/assets/uploads/avatars');
        ensureDirExists(uploadPath);
        cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});

const uploadUserAvatar = multer({
    storage: storage1,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB limit
    fileFilter: (req, file, cb) => {
        const filetypes = /jpeg|jpg|png/;
        const mimetype = filetypes.test(file.mimetype);
        const extname = filetypes.test(_extname(file.originalname).toLowerCase());

        if (mimetype && extname) {
            return cb(null, true);
        }
        cb(new Error('File upload only supports the following filetypes - ' + filetypes));
    }
}).single('avatar');


export default { uploadUserAvatar, uploadRentCarImage0 };
