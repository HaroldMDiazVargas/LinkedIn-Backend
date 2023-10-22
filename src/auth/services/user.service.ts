import { Injectable } from '@nestjs/common';
import { Observable, from, map, of, switchMap, take } from 'rxjs';
import { User } from '../models/user.interface';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from '../models/user.entity';
import { Repository, UpdateResult } from 'typeorm';
import { FriendRequest, FriendRequestStatus } from '../models/friend-request.interface';
import { FriendRequestEntity } from '../models/friend-request.entity';

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(UserEntity)
        private readonly userRepository: Repository<UserEntity>,
        @InjectRepository(FriendRequestEntity)
        private readonly friendRequestRepository: Repository<FriendRequestEntity>,
    ){}
    
    findUserById(id: number): Observable<User>{
        return from(
            this.userRepository.findOne({
                where:{ id },
                relations: ['feedPosts'],
            })
        ).pipe(
            map((user: User) => {
                delete user.password;
                return user;
            })
        )
    }

    updateUserImageById(id: number, imagePath: string):Observable<UpdateResult> {
        return from(this.userRepository.update(id, { imagePath }));
    }

    findImageNameByUserId(id: number): Observable<string>{
        return from(this.userRepository.findOne({ where: { id } })).pipe(
            map((user: User) => {
                delete user.password;
                return user.imagePath
            })
        )
    }

    hasRequestBeenSentOrReceived(receiverId: number, creator: User) : Observable<boolean>{
        return from(this.friendRequestRepository.findOne({
            where: [
                { 
                    receiver: {                                             //Doesn't accept UserEntity {...}
                        id: receiverId
                    },
                    creator
                },
                {
                    receiver: creator,
                    creator: {
                        id: receiverId
                    }
                }
            ]
        })).pipe(
            switchMap((friendRequest: FriendRequest) => {
                if (!friendRequest)
                    return of(false)
                return of(true)
            })
        )
    }

    sendConnectionRequest(receiverId: number, creator: User): Observable<FriendRequest | { error: string }>{
        if (creator.id === receiverId) return of({ error: 'Can not send request to yourself'});
        
        return this.findUserById(receiverId).pipe(
            switchMap((receiver: User) => {                                      // UserEntity { ... }
                if (!receiver)
                    return of({ error: "The user receiver doesn't exist"})
                return this.hasRequestBeenSentOrReceived(receiverId, creator).pipe(
                    switchMap((hasRequestBeenSentOrReceived: boolean) => {
                        if (hasRequestBeenSentOrReceived)
                            return of({ error: "Friend request already sent "})
                        return from(this.friendRequestRepository.save({
                            creator: creator as User,
                            receiver: receiverId as User,
                            status:'pending'
                        }))
                    })
                )

               
            })
        )
    }

    getFriendRequestStatus(receiverId: number, currentUser: User): Observable<FriendRequestStatus>{
        return this.findUserById(receiverId).pipe(
            switchMap((receiver: User) => {     
                return from(this.friendRequestRepository.findOne({
                    where: [
                        {
                            creator: currentUser,
                            receiver: {
                                id: receiverId
                            }
                        }
                    ]

                }))
             }),
            switchMap((friendRequest: FriendRequest) => {
                return of({ status: friendRequest.status})
            })
            
             )
    }
}
