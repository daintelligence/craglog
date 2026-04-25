import {
  Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn,
  ManyToOne, JoinColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Route } from '../../routes/entities/route.entity';

export type ProjectPriority = 'high' | 'medium' | 'low';

@Entity('projects')
export class Project {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'user_id' })
  userId: string;

  @Column({ name: 'route_id' })
  routeId: string;

  @Column({ type: 'varchar', default: 'medium' })
  priority: ProjectPriority;

  @Column({ type: 'text', nullable: true })
  notes: string | null;

  @Column({ default: 0 })
  attempts: number;

  @Column({ name: 'last_attempted', type: 'date', nullable: true })
  lastAttempted: string | null;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => Route, { onDelete: 'CASCADE', eager: true })
  @JoinColumn({ name: 'route_id' })
  route: Route;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
