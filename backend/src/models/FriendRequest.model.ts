import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { User } from "./User.model";

@Entity()
export class FriendRequest {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User)
  sender: User;

  @ManyToOne(() => User)
  recipient: User;

  @Column()
  status: "pending" | "accepted" | "declined";

  @Column()
  createdAt: Date;

  @Column()
  updatedAt: Date;
}
