import {
  Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, Index,
} from 'typeorm';

@Entity('kudos')
@Index(['giverId', 'ascentId'], { unique: true })
export class Kudos {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'giver_id' })
  giverId: string;

  @Column({ name: 'ascent_id' })
  ascentId: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
