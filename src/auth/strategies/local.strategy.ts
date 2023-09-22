import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy } from "passport-local";
import { User } from "../models/user.interface";
import { AuthService } from "../services/auth.service";
import { Observable, first, firstValueFrom, map } from "rxjs";

// Called-triggered by local.guard.ts, to validate if user exist and credentials are correct when logs in!
@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy, 'local'){
    constructor(
        private authService: AuthService,
    ){
        super({
            usernameField: 'email'
        });
    }

    async validate(email: string, password: string): Promise<User> {
        return await firstValueFrom(this.authService.verifyUser(email, password));
    }
}