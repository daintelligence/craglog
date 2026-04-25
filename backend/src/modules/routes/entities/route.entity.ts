import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';
import { Buttress } from '../../crags/entities/buttress.entity';

export enum ClimbingType {
  SPORT = 'sport',
  TRAD = 'trad',
  MIXED = 'mixed',
  BOULDER = 'boulder',
  ALPINE = 'alpine',
  DWS = 'dws',
}

export enum GradeSystem {
  UK_TRAD = 'uk_trad',      // E1 4c, HVS 5a, etc. — stored as "E1 4c"
  FRENCH = 'french',         // 6a, 6b+, 7c, etc.
  FONT = 'font',             // Bouldering: 5, 6A, 7B+, etc.
  EWBANK = 'ewbank',         // Australian numeric
  YDS = 'yds',              // US: 5.10a, 5.12b, etc.
}

// Numeric difficulty for cross-system comparison and sorting (UK Trad anchored)
export const GRADE_DIFFICULTY: Record<string, number> = {
  // UK Trad adjectival
  M: 1, D: 2, VD: 3, HVD: 4, MVS: 5, S: 6, MS: 7, HS: 8, MHS: 9,
  VS: 10, HVS: 11, E1: 12, E2: 14, E3: 16, E4: 18, E5: 20,
  E6: 22, E7: 24, E8: 26, E9: 28,
  // French sport
  '3': 1, '4': 3, '4+': 4, '5': 5, '5+': 6,
  '6a': 10, '6a+': 11, '6b': 12, '6b+': 13, '6c': 14, '6c+': 15,
  '7a': 16, '7a+': 17, '7b': 18, '7b+': 19, '7c': 20, '7c+': 21,
  '8a': 22, '8a+': 23, '8b': 24, '8b+': 25, '8c': 26, '8c+': 27,
  '9a': 28, '9a+': 29, '9b': 30, '9b+': 31, '9c': 32,
};

@Entity('routes')
export class Route {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 200 })
  @Index()
  name: string;

  @Column({ nullable: true, length: 2000 })
  description: string;

  @Column({ type: 'enum', enum: ClimbingType, default: ClimbingType.TRAD })
  climbingType: ClimbingType;

  @Column({ type: 'enum', enum: GradeSystem, default: GradeSystem.UK_TRAD })
  gradeSystem: GradeSystem;

  @Column({ length: 20 })
  grade: string;

  @Column({ type: 'int', default: 0 })
  gradeDifficulty: number;

  @Column({ nullable: true, length: 20 })
  technicalGrade: string;

  @Column({ nullable: true, type: 'int' })
  pitches: number;

  @Column({ nullable: true, type: 'int' })
  heightMetres: number;

  @Column({ nullable: true, length: 500 })
  protection: string;

  @Column({ default: true })
  isActive: boolean;

  @Column({ type: 'int', default: 0 })
  sortOrder: number;

  @ManyToOne(() => Buttress, (buttress) => buttress.routes, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'buttress_id' })
  buttress: Buttress;

  @Column()
  buttressId: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
