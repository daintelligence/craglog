import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
  Index,
} from 'typeorm';
import { Region } from './region.entity';
import { Buttress } from './buttress.entity';

export enum RockType {
  GRITSTONE = 'gritstone',
  LIMESTONE = 'limestone',
  GRANITE = 'granite',
  SANDSTONE = 'sandstone',
  BASALT = 'basalt',
  QUARTZITE = 'quartzite',
  OTHER = 'other',
}

@Entity('crags')
export class Crag {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 150 })
  name: string;

  @Column({ nullable: true, length: 1000 })
  description: string;

  @Column({ type: 'decimal', precision: 10, scale: 7, nullable: true })
  @Index()
  latitude: number;

  @Column({ type: 'decimal', precision: 10, scale: 7, nullable: true })
  @Index()
  longitude: number;

  @Column({ nullable: true, length: 200 })
  approach: string;

  @Column({ nullable: true, length: 100 })
  parkingInfo: string;

  @Column({ type: 'enum', enum: RockType, default: RockType.OTHER })
  rockType: RockType;

  @Column({ default: true })
  isActive: boolean;

  @Column({ nullable: true, length: 200 })
  imageUrl: string;

  @Column({ nullable: true, length: 100 })
  osmRef: string;

  @ManyToOne(() => Region, (region) => region.crags, { nullable: true, eager: false })
  @JoinColumn({ name: 'region_id' })
  region: Region;

  @Column({ nullable: true })
  regionId: string;

  @OneToMany(() => Buttress, (buttress) => buttress.crag, { cascade: true })
  buttresses: Buttress[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
