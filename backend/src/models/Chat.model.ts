import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToMany,
  ManyToOne,
  JoinColumn,
  OneToOne,
  JoinTable,
} from "typeorm";
import { User } from "./User.model";
import { Message } from "./Message.model";

@Entity()
export class Chat {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  chatName: string;

  @Column({ default: false })
  isGroupChat: boolean;

  @ManyToMany(() => User)
  @JoinTable()
  users: User[];

  @OneToOne(() => User)
  @JoinColumn()
  groupAdmin: User;

  @ManyToOne(() => Message)
  // @JoinColumn({ name: "latestMessageId" })
  latestMessage: Message;
}
