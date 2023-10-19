import { Options, diskStorage } from "multer";
import { v4 as uuidv4 } from 'uuid';
import fs from 'fs';
import FileType from 'file-type';


type validFileExtension = 'png' | 'jpg' | 'jpeg';
type validMimeType = 'image/png' | 'image/jpg' | 'image/jpeg';

const validFileExtensions: validFileExtension[] = ['png', 'jpg', 'jpeg'];
const validMimeTypes: validMimeType[] = ['image/png', 'image/jpg', 'image/jpeg'];

export const saveImageToStorage: Options = {
    storage: diskStorage({
        destination: './images/',
        filename: (req, file, cb) => {
            const fileExtension: string = file.originalname.split('.')[1];
            const fileName: string = uuidv4() + fileExtension;
            cb(null, fileName);
        },
    }),
    fileFilter: (req, file, cb) => {
        const allowesMimeTypes: validMimeType[] = validMimeTypes;
        allowesMimeTypes.includes(file.mimetype as validMimeType) ? cb(null, true) : cb(null, false);
    },
    limits: {
        fileSize: 800 * 800
    }
}

