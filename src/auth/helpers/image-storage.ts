import { Options, diskStorage } from "multer";
import { v4 as uuidv4 } from 'uuid';
import * as fs from 'fs';
import { Observable, from, map, of, switchMap } from "rxjs";
import { FileTypeResult, fromFile } from "file-type";

type validFileExtension = 'png' | 'jpg' | 'jpeg';
type validMimeType = 'image/png' | 'image/jpg' | 'image/jpeg';

const validFileExtensions: validFileExtension[] = ['png', 'jpg', 'jpeg'];
const validMimeTypes: validMimeType[] = ['image/png', 'image/jpg', 'image/jpeg'];

export const saveImageToStorage: Options = {
    storage: diskStorage({
        destination: './images/',
        filename: (req, file, cb) => {
            const fileExtension: string = file.originalname.split('.')[1];
            const fileName: string = uuidv4() +'.'+ fileExtension;
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

export const isFileExtensionSafe = (fullFilePath: string): Observable<boolean> => {
    return from(fromFile(fullFilePath)).pipe(
        switchMap((fileType: FileTypeResult) => {
            if (
                validFileExtensions.includes(fileType?.ext as validFileExtension) && 
                validMimeTypes.includes(fileType?.mime as validMimeType))
                return of(true)
            return of(false)
        })
    )
}

export const removeFile = (fullFilePath: string) : void => {
    try {
        fs.unlinkSync(fullFilePath);
    } catch(e) {
        console.error(e);
    }
}