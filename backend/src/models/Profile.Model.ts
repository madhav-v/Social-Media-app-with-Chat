import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  JoinColumn,
} from "typeorm";
import { User } from "./User.model";

@Entity()
export class Profile {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  bio: string;

  @Column({ nullable: true })
  profilePic: string;

  @Column({ nullable: true })
  coverPic: string;

  @OneToOne(() => User)
  @JoinColumn()
  user: User;
}
