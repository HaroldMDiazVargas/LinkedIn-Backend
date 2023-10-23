import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { UserEntity } from './user.entity';
import { FriendRequest_Status } from './friend-request.interface';

@Entity('connections')
export class FriendRequestEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    status: FriendRequest_Status;


    @Column({ name: 'creatorId' })
    creatorId: number;

    @Column({ name: 'receiverId' })
    receiverId: number;

    @ManyToOne(() => UserEntity, (userEntity) => userEntity.sentFriendRequests)
    @JoinColumn({ name: 'creatorId'})
    creator: UserEntity;

    @ManyToOne(() => UserEntity, (userEntity) => userEntity.receivedFriendRequests)
    @JoinColumn({ name: 'receiverId'})
    receiver: UserEntity;
    
    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
