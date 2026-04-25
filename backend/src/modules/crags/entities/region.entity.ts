import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  OneToMany,
} from 'typeorm';
import { Crag } from './crag.entity';

@Entity('regions')
export class Region {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true, length: 100 })
  name: string;

  @Column({ nullable: true, length: 500 })
  description: string;

  @Column({ length: 50, nullable: true })
  country: string;

  @OneToMany(() => Crag, (crag) => crag.region)
  crags: Crag[];

  @CreateDateColumn()
  createdAt: Date;
}
