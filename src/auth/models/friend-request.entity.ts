import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { UserEntity } from './user.entity';
import { FriendRequestStatus } from './friend-request.interface';

@Entity('connections')
export class FriendRequestEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    status: FriendRequestStatus;

    @ManyToOne(() => UserEntity, (userEntity) => userEntity.sentFriendRequests)
    creator: UserEntity;

    @ManyToOne(() => UserEntity, (userEntity) => userEntity.receivedFriendRequests)
    receiver: UserEntity;
    
    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
