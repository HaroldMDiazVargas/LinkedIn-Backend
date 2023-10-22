import { User } from './user.interface';

export type FriendRequest_Status = 'pending' | 'accepted' | 'declined';

export interface FriendRequestStatus {
    status: FriendRequest_Status
}

export interface FriendRequest {
    id?: number;
    status?: FriendRequest_Status;
    creator?: User;
    receiver?: User;
    createdAt?: Date;
    updatedAt?: Date;
}