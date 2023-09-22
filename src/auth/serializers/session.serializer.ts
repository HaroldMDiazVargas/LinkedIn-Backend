import { Injectable } from "@nestjs/common";
import { PassportSerializer } from "@nestjs/passport";
import { User } from "../models/user.interface";


@Injectable()
export class SessionSerializer extends PassportSerializer {
    serializeUser(user: any, done: (err: Error, user: User) => void) {          //Set data to be store in the session after logs in
        done(null, user);     
    }

    deserializeUser(payload: any, done: (err: Error, payload:any) => void) {    //Get user object from session into => valid objet
        done(null, payload)
    }
}