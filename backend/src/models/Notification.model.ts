import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from "typeorm";
import { User } from "./User.model";
import { Post } from "./Post.model";

@Entity()
export class Notification {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User)
  @JoinColumn()
  userToNotify: User;

  @ManyToOne(() => User)
  @JoinColumn()
  userPerformedAction: User;

  @ManyToOne(() => Post)
  @JoinColumn()
  post: Post;

  @Column()
  actionType: "like" | "comment";

  @Column({ default: false })
  read: boolean;

  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  createdAt: Date;
}
