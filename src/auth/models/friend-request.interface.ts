import { FeedPost } from 'src/feed/models/post.interface';
import { Role } from './role.enum';

export type FriendRequestStatus = 'pending' | 'accepted' | 'declined';

export interface User {
    id?: number;
    status?: FriendRequestStatus;
    creator?: User;
    receiver?: User;
    createdAt?: Date;
    updatedAt?: Date;
}