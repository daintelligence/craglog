import {
  Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';

export enum FeedbackCategory {
  BUG = 'bug',
  IDEA = 'idea',
  PRAISE = 'praise',
  OTHER = 'other',
}

@Entity('feedback')
export class Feedback {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'user_id', nullable: true })
  userId: string | null;

  @Column({ type: 'enum', enum: FeedbackCategory, default: FeedbackCategory.OTHER })
  category: FeedbackCategory;

  @Column({ type: 'text' })
  message: string;

  @Column({ nullable: true, type: 'smallint' })
  rating: number | null;

  @Column({ type: 'varchar', nullable: true })
  context: string | null;

  @Column({ default: false })
  resolved: boolean;

  @ManyToOne(() => User, { onDelete: 'SET NULL', nullable: true })
  @JoinColumn({ name: 'user_id' })
  user: User | null;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
