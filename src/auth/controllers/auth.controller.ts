import { Body, Controller, Get, Post, Request, UseGuards } from '@nestjs/common';
import { User } from '../models/user.interface';
import { Observable, map } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { AuthenticatedGuard, LocalAuthGuard } from '../guards';

@Controller('auth')
export class AuthController {
    constructor(
        private authService: AuthService
    ){}

    @Post('register')
    registerAccount(@Body() user: User):Observable<User>{
        return this.authService.registerAccount(user);
    }


    @UseGuards(LocalAuthGuard)
    @Post('login')
    login(@Body() user: User, @Request() req): User{
        return req.user;
    }

    @UseGuards(AuthenticatedGuard)
    @Get('profile')
    profile(@Request() req){
        return {
            msg: "U are auth",
            user: req.user
        }
    }

    @Post('logout')
    logout(@Request() req){
        req.session.destroy();
        return {
            msg: 'Session destrouied'
        }
    }

    // @Post('login')
    // login(@Body() user: User):Observable<{ access_token: string}>{
    //     return this.authService
    //         .login(user)
    //         .pipe(map((jwt: string) => {
    //             return { access_token: jwt }
    //     }));
    // }
    
}
