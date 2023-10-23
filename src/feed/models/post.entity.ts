import { UserEntity } from "../../auth/models/user.entity";
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity('feed_post')
export class FeedPostEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ default: '' })
    body: string;

    @Column({ name: 'authorId' })
    authorId: number;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @ManyToOne(() => UserEntity, (userEntity) => userEntity.feedPosts)
    @JoinColumn({ name: 'authorId'})
    author: UserEntity;
}