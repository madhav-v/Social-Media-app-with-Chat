import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  OneToMany,
  ManyToMany,
  JoinTable,
} from "typeorm";
import { User } from "./User.model";
import { Comment } from "./Comment.model";

@Entity()
export class Post {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  content: string;

  @Column("simple-array", { nullable: true })
  media: string;

  @ManyToOne(() => User)
  @JoinColumn()
  user: User;

  @ManyToMany(() => User, { cascade: true })
  @JoinTable()
  likes: User[];

  @OneToMany(() => Comment, (comment) => comment.post)
  comments: Comment[];
}
