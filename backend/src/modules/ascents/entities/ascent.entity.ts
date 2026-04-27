import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Route } from '../../routes/entities/route.entity';
import { Crag } from '../../crags/entities/crag.entity';

export enum AscentType {
  ONSIGHT = 'onsight',
  FLASH = 'flash',
  REDPOINT = 'redpoint',
  PINKPOINT = 'pinkpoint',
  REPEAT = 'repeat',
  DOG = 'dog',
  SECOND = 'second',
  ABSEIL = 'abseil',
  SOLO = 'solo',
}

@Entity('ascents')
export class Ascent {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE', eager: false })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ name: 'user_id' })
  @Index()
  userId: string;

  @ManyToOne(() => Route, { onDelete: 'CASCADE', eager: false, nullable: true })
  @JoinColumn({ name: 'route_id' })
  route: Route | null;

  @Column({ name: 'route_id', nullable: true })
  routeId: string | null;

  @ManyToOne(() => Crag, { onDelete: 'SET NULL', nullable: true, eager: false })
  @JoinColumn({ name: 'crag_id' })
  crag: Crag;

  @Column({ name: 'crag_id', nullable: true })
  @Index()
  cragId: string;

  @Column({ type: 'enum', enum: AscentType, default: AscentType.REDPOINT })
  ascentType: AscentType;

  @Column({ type: 'date' })
  @Index()
  date: string;

  @Column({ nullable: true, length: 2000 })
  notes: string;

  @Column({ nullable: true, length: 200 })
  partner: string;

  @Column({ type: 'int', nullable: true })
  starRating: number;

  @Column({ default: false })
  isFavourite: boolean;

  @Column({ type: 'int', default: 1 })
  attempts: number;

  @Column({ nullable: true, length: 50 })
  conditions: string;

  // Gym / free-form ascents (no route record)
  @Column({ name: 'free_grade', nullable: true, length: 20 })
  freeGrade: string | null;

  @Column({ name: 'gym_style', nullable: true, length: 20 })
  gymStyle: string | null;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
