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

  @ManyToOne(() => Chat)
  @JoinColumn()
  chat: Chat;

  @ManyToOne(() => User)
  // @JoinColumn()
  sender: User;

  @Column({ nullable: true })
  content: string;

  @Column({ type: "jsonb", nullable: true })
  images: string[];

  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  createdAt: Date;

  // @ManyToOne(() => User)
  // readBy: User[];
}
