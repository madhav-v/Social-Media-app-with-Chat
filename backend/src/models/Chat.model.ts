import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToMany,
  ManyToOne,
  JoinColumn,
  OneToOne,
  JoinTable,
  OneToMany,
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

  @ManyToOne(() => User)
  @JoinColumn()
  groupAdmin: User;

  @OneToMany(() => Message, (message) => message.chat)
  messages: Message[];
}
