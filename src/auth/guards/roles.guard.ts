import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { Role } from '../models/role.enum';
import { ROLES_KEY } from '../decorator/roles.decorator';
import { User } from '../models/user.interface';

@Injectable()
export class RolesGuard implements CanActivate {
  
  constructor(private reflector: Reflector) {}
  

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [       //Get the Roles set on the Role Decorator!
      context.getHandler(),                               //What is the function name
      context.getClass()                                  //Whaat is the controller name
    ]);

    if (!requiredRoles) return true;

    const { user }:{ user: User } = context.switchToHttp().getRequest();

    return requiredRoles.includes(user?.role);
  }
}
