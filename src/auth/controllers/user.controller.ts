import { Body, Controller, Get, Param, Put, Req, Res, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { UserService } from '../services/user.service';
import { UpdateResult } from 'typeorm';
import { Observable, of, take, switchMap, map } from 'rxjs';
import { AuthenticatedGuard } from '../guards';
import { FileInterceptor } from '@nestjs/platform-express';
import { isFileExtensionSafe, removeFile, saveImageToStorage } from '../helpers/image-storage';
import { join } from 'path';

@UseGuards(AuthenticatedGuard)
@Controller('user')
export class UserController {
    constructor(
        private userService: UserService
    ){}

    @Put('image/:id')
    @UseInterceptors(FileInterceptor('file', saveImageToStorage))
    uploadUserImage(
        @Param('id') id: number, @UploadedFile() file: Express.Multer.File, @Req() req): 
        Observable<UpdateResult | { error: string}> {
            const fileName = file?.filename;
            if (!fileName)
                return of({
                    error: 'File must be a png, jpg or jpeg'
            })
            const fullImagePath = join(process.cwd(), 'images' + '/' + fileName);
            return isFileExtensionSafe(fullImagePath).pipe(
                switchMap((isFileLegit: boolean) => {
                    if (isFileLegit){
                        const userId = req.user.id;
                        return this.userService.updateUserImageById(userId, fileName)
                    }
                    removeFile(fullImagePath)
                    return of({
                        error: 'File content does not match extension!'
                    })
                })
            );
            
    }

    @Get('image/')
    findImage(@Req() req, @Res() res) : Observable<object>{
        const userId = req.user.id;
        return this.userService.findImageNameByUserId(userId).pipe(
            switchMap((imageName: string) => {
                return of(res.sendFile(imageName, { root: './images'}))
            })
        )
    }

    @Get('image-name/')
    findImageName(@Req() req) : Observable<{imageName: string}>{
        const userId = req.user.id;
        return this.userService.findImageNameByUserId(userId).pipe(
            switchMap((imageName: string) => {
                return of({ imageName })
            })
        )
    }
}
