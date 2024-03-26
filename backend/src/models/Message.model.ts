// message.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from "typeorm";
import { Chat } from "./Chat.model";
import { User } from "./User.model";

@Entity()
export class Message {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Chat, (chat) => chat.latestMessage)
  @JoinColumn()
  chat: Chat;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn()
  sender: User;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn()
  receiver: User;

  @Column()
  content: string;

  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  createdAt: Date;
}
