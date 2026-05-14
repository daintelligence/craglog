import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
  Unique,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';

export type AwardStatus = 'in_progress' | 'completed';

@Entity('user_awards')
@Unique(['userId', 'awardType'])
export class UserAward {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE', eager: false })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ name: 'user_id' })
  @Index()
  userId: string;

  @Column({ name: 'award_type', length: 20 })
  awardType: string;

  @Column({ type: 'jsonb', default: {} })
  skills: Record<string, boolean>;

  @Column({ length: 20, default: 'in_progress' })
  status: AwardStatus;

  @Column({ name: 'completed_at', nullable: true, type: 'timestamptz' })
  completedAt: Date | null;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
