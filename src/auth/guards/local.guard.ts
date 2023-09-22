import { ExecutionContext, Injectable } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";


// Check if auth log in is success, otherwise deny the access!
@Injectable()
export class LocalAuthGuard extends AuthGuard('local') {
    async canActivate(context: ExecutionContext) {                          //Execute before route handler, @override!
        const result = await super.canActivate(context) as boolean;         //Check if local strategy config sucess
        const request = context.switchToHttp().getRequest();                // Req object, used for log in    
        await super.logIn(request);                                         //Log in!
        return result;
    }
}