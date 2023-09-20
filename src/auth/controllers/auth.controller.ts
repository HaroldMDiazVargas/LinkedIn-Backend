import { Body, Controller, Post } from '@nestjs/common';
import { User } from '../models/user.interface';
import { Observable, map } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Controller('auth')
export class AuthController {
    constructor(
        private authService: AuthService
    ){}

    @Post('register')
    registerAccount(@Body() user: User):Observable<User>{
        return this.authService.registerAccount(user);
    }

    @Post('login')
    login(@Body() user: User):Observable<{ access_token: string}>{
        return this.authService
            .login(user)
            .pipe(map((jwt: string) => {
                return { access_token: jwt }
        }));
    }
    
}
