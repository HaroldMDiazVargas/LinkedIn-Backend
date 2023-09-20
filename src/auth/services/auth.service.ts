import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { Observable, from, map, switchMap } from 'rxjs';
import { User } from '../models/user.interface';
import { Repository } from 'typeorm';
import { UserEntity } from '../models/user.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(UserEntity)
        private readonly userRepository: Repository<UserEntity>
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

}

