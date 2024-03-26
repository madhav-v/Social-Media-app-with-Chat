import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToMany,
  ManyToOne,
  JoinColumn,
} from "typeorm";
import { User } from "./User.model";
import { Message } from "./Message.model";

@Entity()
export class Chat {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  chatName: string;

  @ManyToMany(() => User)
  @JoinColumn()
  users: User[];

  @ManyToOne(() => Message, { nullable: true })
  @JoinColumn()
  latestMessage: Message;
}
