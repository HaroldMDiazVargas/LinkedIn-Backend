import { ForbiddenException, Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { Observable, from, map, switchMap } from 'rxjs';
import { User } from '../models/user.interface';
import { Repository } from 'typeorm';
import { UserEntity } from '../models/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(UserEntity)
        private readonly userRepository: Repository<UserEntity>,
        private jwt: JwtService,
    ){}

    hashPassword(password: string): Observable<string> {
        return from(bcrypt.hash(password, 12));
    }

    registerAccount(user: User): Observable<User>{
        const { firstName, lastName, email, password } = user;
        
        return this.hashPassword(password).pipe(
            switchMap((hashedPassword: string) => {
                return from(this.userRepository.save({
                    firstName,
                    lastName,
                    email,
                    password: hashedPassword
                })).pipe(
                    map((user: User) => {
                        delete user.password;
                        return user;  
                    })
                )
            })
        )

    }

    login(dto: User): Observable<string>{
        return from(this.userRepository.findOne({
            where: {
                email: dto.email
            },
            select: ['id', 'firstName', 'lastName', 'email', 'password', 'role']
        })).pipe(
            switchMap((user: User) => {
                if (!user) throw new ForbiddenException('Credentials incorrect');
                return from(bcrypt.compare(dto.password, user.password)).pipe(
                    map((isValid: boolean) => {
                        if (isValid) {
                            delete user.password;
                            return user;
                        }
                        else throw new ForbiddenException('Credentials incorrect');
                    })
                );
            })
        ).pipe(
            switchMap((user:User) => {
                if (user){
                    return from(this.jwt.signAsync({ user }))
                }
            })
        );
    }

}

