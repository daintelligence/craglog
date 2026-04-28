/**
 * OpenBeta UK import — pulls UK leaf areas with actual climb data from
 * api.openbeta.io and upserts them into our schema.
 *
 * Run with:
 *   DATABASE_URL=<url> ts-node -r tsconfig-paths/register src/database/seeds/import-openbeta.ts
 *
 * Safe to re-run — all operations are upserts.
 */
import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { User } from '../../modules/users/entities/user.entity';
import { Region } from '../../modules/crags/entities/region.entity';
import { Crag, RockType } from '../../modules/crags/entities/crag.entity';
import { Buttress } from '../../modules/crags/entities/buttress.entity';
import { Route, ClimbingType, GradeSystem, GRADE_DIFFICULTY } from '../../modules/routes/entities/route.entity';
import { Ascent } from '../../modules/ascents/entities/ascent.entity';
import { UserBadge } from '../../modules/badges/entities/user-badge.entity';
import { findOrCreateRegion, upsertCrag, upsertButtress, upsertRoute } from './seed-helpers';

const OPENBETA_URL = 'https://api.openbeta.io/graphql';

// UK bounding box: lat 49.5–61, lng -8.7–2.0
const UK_BBOX = [-8.7, 49.5, 2.0, 61.0];

async function gql(query: string, variables: Record<string, unknown> = {}): Promise<any> {
  const res = await fetch(OPENBETA_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query, variables }),
  });
  if (!res.ok) throw new Error(`OpenBeta HTTP ${res.status}`);
  const json: any = await res.json();
  if (json.errors?.length) throw new Error(json.errors[0].message);
  return json.data;
}

function mapClimbingType(type: any): ClimbingType {
  if (type?.bouldering) return ClimbingType.BOULDER;
  if (type?.sport)      return ClimbingType.SPORT;
  return ClimbingType.TRAD;
}

function mapGrade(grades: any, climbType: ClimbingType): { grade: string; gradeSystem: GradeSystem; difficulty: number } | null {
  if (climbType === ClimbingType.BOULDER) {
    if (grades?.font) return { grade: grades.font, gradeSystem: GradeSystem.FONT,    difficulty: GRADE_DIFFICULTY[grades.font.toLowerCase()] ?? 0 };
    if (grades?.vscale && grades.vscale !== 'V-easy') return { grade: grades.vscale, gradeSystem: GradeSystem.FONT, difficulty: GRADE_DIFFICULTY[grades.vscale] ?? 0 };
    return null;
  }
  if (climbType === ClimbingType.SPORT && grades?.french) {
    return { grade: grades.french, gradeSystem: GradeSystem.FRENCH, difficulty: GRADE_DIFFICULTY[grades.french] ?? 0 };
  }
  // Trad — OpenBeta uses YDS; we map roughly to UK adjectival where possible
  if (grades?.yds) {
    const ydsToUK: Record<string, string> = {
      '5.4': 'VD', '5.5': 'VD', '5.6': 'S', '5.7': 'HS', '5.8': 'HS',
      '5.9': 'VS', '5.10a': 'HVS', '5.10b': 'HVS', '5.10c': 'E1', '5.10d': 'E1',
      '5.11a': 'E2', '5.11b': 'E2', '5.11c': 'E2', '5.11d': 'E3',
      '5.12a': 'E4', '5.12b': 'E4', '5.12c': 'E5', '5.12d': 'E5',
      '5.13a': 'E6', '5.13b': 'E6', '5.13c': 'E7', '5.13d': 'E7',
    };
    const uk = ydsToUK[grades.yds];
    if (uk) return { grade: uk, gradeSystem: GradeSystem.UK_TRAD, difficulty: GRADE_DIFFICULTY[uk] ?? 0 };
    // Keep as-is if no mapping
    return { grade: grades.yds, gradeSystem: GradeSystem.UK_TRAD, difficulty: 0 };
  }
  return null;
}

// Infer region name from OpenBeta pathTokens
function regionFromPath(pathTokens: string[]): string {
  const path = pathTokens.join('/').toLowerCase();
  if (path.includes('peak district'))    return 'Peak District';
  if (path.includes('lake district'))    return 'Lake District';
  if (path.includes('yorkshire'))        return 'Yorkshire Dales';
  if (path.includes('snowdonia') || path.includes('eryri')) return 'Snowdonia';
  if (path.includes('llanberis'))        return 'North Wales';
  if (path.includes('north wales'))      return 'North Wales';
  if (path.includes('pembroke'))         return 'Pembrokeshire';
  if (path.includes('scotland'))         return 'Scottish Highlands';
  if (path.includes('cornwall'))         return 'Cornwall';
  if (path.includes('devon'))            return 'Devon Coast';
  if (path.includes('sandstone'))        return 'Kent Sandstone';
  if (path.includes('northumberland'))   return 'Northumberland';
  if (path.includes('gower'))            return 'Gower Peninsula';
  if (path.includes('wales'))            return 'Mid-Wales';
  if (path.includes('england'))          return 'South East';
  return 'United Kingdom';
}

function countryFromPath(pathTokens: string[]): string {
  const path = pathTokens.join('/').toLowerCase();
  if (path.includes('scotland'))          return 'Scotland';
  if (path.includes('wales'))             return 'Wales';
  if (path.includes('northern ireland'))  return 'Northern Ireland';
  return 'England';
}

async function importArea(
  ds: DataSource,
  area: any,
  regionRepo: any,
  cragRepo: any,
  buttRepo: any,
  routeRepo: any,
): Promise<{ imported: number; skipped: number }> {
  const climbs: any[] = area.climbs ?? [];
  if (!climbs.length) return { imported: 0, skipped: 0 };

  const lat = area.metadata?.lat;
  const lng = area.metadata?.lng;
  // Skip placeholder coordinates (generic UK centre)
  if (!lat || !lng || (Math.abs(lat - 54.0) < 0.1 && Math.abs(lng - (-2.0)) < 0.1)) {
    return { imported: 0, skipped: climbs.length };
  }

  const pathTokens: string[] = area.pathTokens ?? [];
  const regionName = regionFromPath(pathTokens);
  const country    = countryFromPath(pathTokens);

  const region = await findOrCreateRegion(regionRepo, { name: regionName, country });
  const crag   = await upsertCrag(cragRepo, {
    name: area.areaName,
    latitude: lat,
    longitude: lng,
    region, regionId: region.id,
    description: area.content?.description || null,
  });

  const buttress = await upsertButtress(buttRepo, {
    name: 'Main', crag, cragId: crag.id, sortOrder: 1,
  });

  let imported = 0;
  let skipped  = 0;

  for (const climb of climbs) {
    if (!climb.name) { skipped++; continue; }
    const climbType = mapClimbingType(climb.type);
    const gradeInfo = mapGrade(climb.grades, climbType);
    if (!gradeInfo) { skipped++; continue; }

    await upsertRoute(routeRepo, {
      name:           climb.name,
      climbingType:   climbType,
      gradeSystem:    gradeInfo.gradeSystem,
      grade:          gradeInfo.grade,
      gradeDifficulty: gradeInfo.difficulty,
      heightMetres:   climb.length > 0 ? climb.length : undefined,
      pitches:        1,
      description:    climb.content?.description || undefined,
      buttress,
      buttressId:     buttress.id,
      isActive:       true,
    });
    imported++;
  }

  return { imported, skipped };
}

async function run() {
  const ds = new DataSource({
    type: 'postgres',
    url: process.env.DATABASE_URL || 'postgresql://craglog:craglog_secret@localhost:5432/craglog',
    entities: [User, Region, Crag, Buttress, Route, Ascent, UserBadge],
    synchronize: false,
    logging: false,
  });

  await ds.initialize();
  console.log('🌍 Starting OpenBeta UK import...');

  const regionRepo = ds.getRepository(Region);
  const cragRepo   = ds.getRepository(Crag);
  const buttRepo   = ds.getRepository(Buttress);
  const routeRepo  = ds.getRepository(Route);

  // Query UK leaf areas (actual crags, not region containers)
  const query = `
    query UKAreas {
      areas(
        filter: {
          path_tokens: { tokens: ["United Kingdom"], exactMatch: false }
          leaf_status: { isLeaf: true }
        }
        limit: 500
      ) {
        uuid areaName pathTokens
        metadata { lat lng }
        content { description }
        climbs {
          uuid name length
          grades { font vscale french yds }
          type { sport trad bouldering }
          content { description }
        }
      }
    }
  `;

  let areas: any[];
  try {
    const data = await gql(query);
    areas = data?.areas ?? [];
  } catch (err) {
    console.warn('⚠️  OpenBeta query failed:', (err as Error).message);
    console.warn('   Skipping OpenBeta import — data may still be seeded from manual files.');
    await ds.destroy();
    return;
  }

  console.log(`  Found ${areas.length} UK leaf areas from OpenBeta`);

  let totalImported = 0;
  let totalSkipped  = 0;
  let cragsWithData = 0;

  for (const area of areas) {
    const { imported, skipped } = await importArea(ds, area, regionRepo, cragRepo, buttRepo, routeRepo);
    totalImported += imported;
    totalSkipped  += skipped;
    if (imported > 0) {
      cragsWithData++;
      console.log(`    ✓ ${area.areaName}: ${imported} routes imported`);
    }
  }

  console.log(`\n  ✅ OpenBeta import complete`);
  console.log(`     Crags with data: ${cragsWithData} / ${areas.length}`);
  console.log(`     Routes imported: ${totalImported}`);
  console.log(`     Routes skipped (no grade/coord): ${totalSkipped}`);

  await ds.destroy();
}

run().catch((err) => {
  console.error('❌ OpenBeta import failed:', err);
  process.exit(1);
});
