import { User } from './user.interface';

export type FriendRequest_Status = 'not-sent' | 'pending' | 'accepted' | 'declined' | 'waiting-for-current-user-response';

export interface FriendRequestStatus {
    status: FriendRequest_Status
}

export interface FriendRequest {
    id?: number;
    status?: FriendRequest_Status;
    creatorId?: number;
    creator?: User;
    receiverId?: number;
    receiver?: User;
    createdAt?: Date;
    updatedAt?: Date;
}