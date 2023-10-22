import { User } from './user.interface';

export type FriendRequestStatus = 'pending' | 'accepted' | 'declined';

export interface FriendRequest {
    id?: number;
    status?: FriendRequestStatus;
    creator?: User;
    receiver?: User;
    createdAt?: Date;
    updatedAt?: Date;
}