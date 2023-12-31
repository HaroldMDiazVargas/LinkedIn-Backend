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
                    receiverId: receiverId,                                           //Doesn't accept UserEntity {...}
                    creator
                },
                {
                    receiver: creator,
                    creatorId: receiverId
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
                            creatorId: creator.id,
                            receiverId: receiverId,
                            status:'pending'
                        }))
                    })
                )

               
            })
        )
    }

    getFriendRequestStatus(receiverId: number, currentUser: User): Observable<FriendRequest>{
        if (receiverId === currentUser.id)
            return of({ status: 'accepted'})
        return this.findUserById(receiverId).pipe(
            switchMap((receiver: User) => {    
                return from(this.friendRequestRepository.findOne({
                    relations: ['creator', 'receiver'],
                    where: [
                        {
                            creatorId: currentUser.id,
                            receiverId
                        },
                        {
                            creatorId: receiverId,
                            receiverId: currentUser.id
                        }
                    ]

                }))
             }),
            switchMap((friendRequest: FriendRequest) => {
                if ((friendRequest?.receiverId === currentUser.id) && friendRequest?.status === 'pending') {
                    return of({ id:friendRequest.id, status: 'waiting-for-current-user-response'} as FriendRequestStatus)
                }
                return of({  id: friendRequest?.id, status: friendRequest?.status || 'not-sent'})
            })
            
             )
    }

    findFriendRequestById(id: number): Observable<FriendRequest>{
        return from(
            this.friendRequestRepository.findOne({
                relations:['receiver'],
                where:{ id }
            })
        )
    }

    respondToFriendRequest(friendRequestId: number, statusResponse: FriendRequestStatus, receiverId: number) : Observable<FriendRequestStatus | { error: string }>{
        return from(this.findFriendRequestById(friendRequestId)).pipe(
            switchMap((friendRequest: FriendRequest) => {
                if (!friendRequest)
                    return of({ error: "The friend request doesn't exist"})
                if (friendRequest.receiver.id !== receiverId)
                    return of({ error: "Don't have permissions"})
                if (friendRequest.status !== 'pending')
                    return of({ error: "The request was already responded"})
                return from(this.friendRequestRepository.update(friendRequestId, {
                    status: statusResponse.status
                })).pipe(
                    switchMap(() => {
                        return of(statusResponse)
                    })
                )
            })
        )

    }

    getUserFriendRequests(receiver: User): Observable<FriendRequest[]>{
        return from(this.friendRequestRepository.find({
            relations: ['creator'],
            where: {
                receiver,
                status: 'pending'
            }
        }))
    }
}
