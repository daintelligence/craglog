import { Repository, DataSource } from 'typeorm';
import { Region } from '../../modules/crags/entities/region.entity';
import { Crag } from '../../modules/crags/entities/crag.entity';
import { Buttress } from '../../modules/crags/entities/buttress.entity';
import { Route, GRADE_DIFFICULTY, ClimbingType, GradeSystem } from '../../modules/routes/entities/route.entity';

export async function findOrCreateRegion(
  repo: Repository<Region>,
  data: Partial<Region>,
): Promise<Region> {
  const existing = await repo.findOne({ where: { name: data.name } });
  if (existing) return existing;
  return repo.save(repo.create(data));
}

export async function upsertCrag(
  repo: Repository<Crag>,
  data: Partial<Crag>,
): Promise<Crag> {
  const existing = await repo.findOne({ where: { name: data.name } });
  if (existing) return existing;
  return repo.save(repo.create(data));
}

export async function upsertButtress(
  repo: Repository<Buttress>,
  data: Partial<Buttress>,
): Promise<Buttress> {
  const existing = await repo.findOne({ where: { name: data.name, cragId: data.cragId } });
  if (existing) return existing;
  return repo.save(repo.create(data));
}

export async function upsertRoute(
  repo: Repository<Route>,
  data: Partial<Route>,
): Promise<Route> {
  const existing = await repo.findOne({ where: { name: data.name, buttressId: data.buttressId } });
  if (existing) return existing;
  return repo.save(repo.create(data));
}

// Resolve adjectival grade difficulty, falling back to 0
export function diff(grade: string): number {
  return GRADE_DIFFICULTY[grade.trim()] ?? 0;
}

// Shorthand for a trad route
export function tradRoute(
  name: string,
  grade: string,
  techGrade: string,
  buttress: Buttress,
  opts: { pitches?: number; height?: number; description?: string; sortOrder?: number } = {},
): Partial<Route> {
  return {
    name,
    climbingType: ClimbingType.TRAD,
    gradeSystem: GradeSystem.UK_TRAD,
    grade,
    gradeDifficulty: diff(grade),
    technicalGrade: techGrade,
    pitches: opts.pitches ?? 1,
    heightMetres: opts.height,
    description: opts.description,
    sortOrder: opts.sortOrder ?? 0,
    buttress,
    buttressId: buttress.id,
    isActive: true,
  };
}

// Shorthand for a sport route
export function sportRoute(
  name: string,
  grade: string,
  buttress: Buttress,
  opts: { height?: number; description?: string; sortOrder?: number } = {},
): Partial<Route> {
  return {
    name,
    climbingType: ClimbingType.SPORT,
    gradeSystem: GradeSystem.FRENCH,
    grade,
    gradeDifficulty: diff(grade),
    pitches: 1,
    heightMetres: opts.height,
    description: opts.description,
    sortOrder: opts.sortOrder ?? 0,
    buttress,
    buttressId: buttress.id,
    isActive: true,
  };
}
