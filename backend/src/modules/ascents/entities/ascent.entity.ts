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

  @Column()
  @Index()
  userId: string;

  @ManyToOne(() => Route, { onDelete: 'CASCADE', eager: false })
  @JoinColumn({ name: 'route_id' })
  route: Route;

  @Column()
  routeId: string;

  @ManyToOne(() => Crag, { onDelete: 'SET NULL', nullable: true, eager: false })
  @JoinColumn({ name: 'crag_id' })
  crag: Crag;

  @Column({ nullable: true })
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

  @Column({ type: 'int', nullable: true, min: 1, max: 5 })
  starRating: number;

  @Column({ default: false })
  isFavourite: boolean;

  @Column({ type: 'int', default: 1 })
  attempts: number;

  @Column({ nullable: true, length: 50 })
  conditions: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
