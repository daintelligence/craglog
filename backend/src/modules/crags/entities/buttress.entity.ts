import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  JoinColumn,
  CreateDateColumn,
} from 'typeorm';
import { Crag } from './crag.entity';
import { Route } from '../../routes/entities/route.entity';

@Entity('buttresses')
export class Buttress {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 150 })
  name: string;

  @Column({ nullable: true, length: 500 })
  description: string;

  @Column({ type: 'int', default: 0 })
  sortOrder: number;

  @ManyToOne(() => Crag, (crag) => crag.buttresses, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'crag_id' })
  crag: Crag;

  @Column({ name: 'crag_id' })
  cragId: string;

  @OneToMany(() => Route, (route) => route.buttress, { cascade: true })
  routes: Route[];

  @CreateDateColumn()
  createdAt: Date;
}
