import { DataSource } from 'typeorm';
import { Region } from '../../modules/crags/entities/region.entity';
import { Crag, RockType } from '../../modules/crags/entities/crag.entity';
import { Buttress } from '../../modules/crags/entities/buttress.entity';
import { Route, ClimbingType, GradeSystem, GRADE_DIFFICULTY } from '../../modules/routes/entities/route.entity';
import { findOrCreateRegion, upsertCrag, upsertButtress, upsertRoute } from './seed-helpers';

export async function seedUKCrags(ds: DataSource) {
  const regionRepo  = ds.getRepository(Region);
  const cragRepo    = ds.getRepository(Crag);
  const buttRepo    = ds.getRepository(Buttress);
  const routeRepo   = ds.getRepository(Route);

  // Regions — findOrCreate so re-runs are safe
  const peak        = await findOrCreateRegion(regionRepo, { name: 'Peak District',  country: 'England', description: 'The Peak District — UK climbing heartland. Gritstone edges and limestone dales.' });
  const lake        = await findOrCreateRegion(regionRepo, { name: 'Lake District',  country: 'England', description: 'Lakeland fells and crags. Classic trad climbing on rhyolite, granite and slate.' });
  const yorkshire   = await findOrCreateRegion(regionRepo, { name: 'Yorkshire Dales', country: 'England', description: 'Yorkshire limestone sport and trad classics.' });
  const northWales  = await findOrCreateRegion(regionRepo, { name: 'North Wales',    country: 'Wales',   description: 'Snowdonia. World-class trad climbing on rhyolite, slate and quartzite.' });
  const pembroke    = await findOrCreateRegion(regionRepo, { name: 'Pembroke',       country: 'Wales',   description: 'South Wales sea cliffs. Premium limestone sport climbing.' });

  // ─── STANAGE EDGE ─────────────────────────────────────────────────────────
  const stanage = await upsertCrag(cragRepo, {
    name: 'Stanage Edge', region: peak, regionId: peak.id,
    description: 'The most famous gritstone edge in the world. Over 1,000 routes from Diff to E7. Essential Peak District destination.',
    latitude: 53.3664, longitude: -1.6458, rockType: RockType.GRITSTONE,
    approach: '20 min walk from Hooks Car park (SK 2376 8268). Head north along the edge.',
    parkingInfo: 'Hooks Car (pay & display) or limited roadside on Long Causeway.',
  });

  const popular = await upsertButtress(buttRepo, { name: 'Popular End',     crag: stanage, cragId: stanage.id, sortOrder: 1 });
  const highNeb = await upsertButtress(buttRepo, { name: 'High Neb',        crag: stanage, cragId: stanage.id, sortOrder: 2 });
  const north   = await upsertButtress(buttRepo, { name: 'North Buttress',  crag: stanage, cragId: stanage.id, sortOrder: 3 });

  for (const r of [
    { name: 'Flying Buttress Direct', climbingType: ClimbingType.TRAD, gradeSystem: GradeSystem.UK_TRAD, grade: 'HS',  technicalGrade: '4b', gradeDifficulty: GRADE_DIFFICULTY['HS'],  heightMetres: 12, pitches: 1, buttress: popular, sortOrder: 1, description: 'The classic Stanage HS. A solid crack up the obvious buttress.' },
    { name: "Goliath's Groove",        climbingType: ClimbingType.TRAD, gradeSystem: GradeSystem.UK_TRAD, grade: 'VS',  technicalGrade: '4c', gradeDifficulty: GRADE_DIFFICULTY['VS'],  heightMetres: 15, pitches: 1, buttress: popular, sortOrder: 2, description: 'A wide crack with a tricky layback start.' },
    { name: 'The Right Unconquerable', climbingType: ClimbingType.TRAD, gradeSystem: GradeSystem.UK_TRAD, grade: 'HVS', technicalGrade: '5a', gradeDifficulty: GRADE_DIFFICULTY['HVS'], heightMetres: 18, pitches: 1, buttress: popular, sortOrder: 3, description: 'One of the finest HVS routes in the country.' },
    { name: 'Quietus',                 climbingType: ClimbingType.TRAD, gradeSystem: GradeSystem.UK_TRAD, grade: 'E1',  technicalGrade: '5b', gradeDifficulty: GRADE_DIFFICULTY['E1'],  heightMetres: 18, pitches: 1, buttress: popular, sortOrder: 4, description: 'Superb sustained crack climbing.' },
    { name: 'Black Hawk Hell Crack',   climbingType: ClimbingType.TRAD, gradeSystem: GradeSystem.UK_TRAD, grade: 'E2',  technicalGrade: '5c', gradeDifficulty: GRADE_DIFFICULTY['E2'],  heightMetres: 16, pitches: 1, buttress: popular, sortOrder: 5, description: 'Pumpy finger crack that eats gear.' },
    { name: 'Inverted V',              climbingType: ClimbingType.TRAD, gradeSystem: GradeSystem.UK_TRAD, grade: 'S',   technicalGrade: '4a', gradeDifficulty: GRADE_DIFFICULTY['S'],   heightMetres: 10, pitches: 1, buttress: highNeb, sortOrder: 1 },
    { name: 'High Neb Buttress',       climbingType: ClimbingType.TRAD, gradeSystem: GradeSystem.UK_TRAD, grade: 'VD',  technicalGrade: '3c', gradeDifficulty: GRADE_DIFFICULTY['VD'],  heightMetres: 14, pitches: 1, buttress: highNeb, sortOrder: 2 },
    { name: 'Stanage Bannister',       climbingType: ClimbingType.TRAD, gradeSystem: GradeSystem.UK_TRAD, grade: 'E3',  technicalGrade: '6a', gradeDifficulty: GRADE_DIFFICULTY['E3'],  heightMetres: 14, pitches: 1, buttress: highNeb, sortOrder: 3 },
    { name: "Count's Buttress",        climbingType: ClimbingType.TRAD, gradeSystem: GradeSystem.UK_TRAD, grade: 'VS',  technicalGrade: '4c', gradeDifficulty: GRADE_DIFFICULTY['VS'],  heightMetres: 12, pitches: 1, buttress: north,   sortOrder: 1 },
    { name: 'Heaven Crack',            climbingType: ClimbingType.TRAD, gradeSystem: GradeSystem.UK_TRAD, grade: 'HVS', technicalGrade: '5a', gradeDifficulty: GRADE_DIFFICULTY['HVS'], heightMetres: 14, pitches: 1, buttress: north,   sortOrder: 2, description: 'Sustained hand crack with perfect jams.' },
  ]) await upsertRoute(routeRepo, { ...r, buttressId: r.buttress.id });

  // ─── FROGGATT EDGE ────────────────────────────────────────────────────────
  const froggatt = await upsertCrag(cragRepo, {
    name: 'Froggatt Edge', region: peak, regionId: peak.id,
    description: 'Atmospheric gritstone edge above the Derwent Valley. Home to Valkyrie.',
    latitude: 53.3105, longitude: -1.6313, rockType: RockType.GRITSTONE,
    approach: '5 min from Hay Wood car park (SK 2455 7683).',
    parkingInfo: 'National Trust Hay Wood car park. Pay & display.',
  });

  const froggattMain = await upsertButtress(buttRepo, { name: 'Main Area', crag: froggatt, cragId: froggatt.id, sortOrder: 1 });

  for (const r of [
    { name: 'Valkyrie',        climbingType: ClimbingType.TRAD, gradeSystem: GradeSystem.UK_TRAD, grade: 'HVS', technicalGrade: '5a', gradeDifficulty: GRADE_DIFFICULTY['HVS'], heightMetres: 12, pitches: 1, buttress: froggattMain, sortOrder: 1, description: 'The most photographed gritstone route in existence.' },
    { name: 'Strapadictomy',   climbingType: ClimbingType.TRAD, gradeSystem: GradeSystem.UK_TRAD, grade: 'E1',  technicalGrade: '5b', gradeDifficulty: GRADE_DIFFICULTY['E1'],  heightMetres: 14, pitches: 1, buttress: froggattMain, sortOrder: 2 },
    { name: 'Downhill Racer',  climbingType: ClimbingType.TRAD, gradeSystem: GradeSystem.UK_TRAD, grade: 'E2',  technicalGrade: '5c', gradeDifficulty: GRADE_DIFFICULTY['E2'],  heightMetres: 16, pitches: 1, buttress: froggattMain, sortOrder: 3 },
    { name: 'Great Slab',      climbingType: ClimbingType.TRAD, gradeSystem: GradeSystem.UK_TRAD, grade: 'VD',  gradeDifficulty: GRADE_DIFFICULTY['VD'],                        heightMetres: 15, pitches: 1, buttress: froggattMain, sortOrder: 4 },
    { name: "Tody's Wall",     climbingType: ClimbingType.TRAD, gradeSystem: GradeSystem.UK_TRAD, grade: 'E3',  technicalGrade: '6a', gradeDifficulty: GRADE_DIFFICULTY['E3'],  heightMetres: 12, pitches: 1, buttress: froggattMain, sortOrder: 5 },
  ]) await upsertRoute(routeRepo, { ...r, buttressId: r.buttress.id });

  // ─── RAVEN TOR ────────────────────────────────────────────────────────────
  const ravenTor = await upsertCrag(cragRepo, {
    name: 'Raven Tor', region: peak, regionId: peak.id,
    description: "The hardest sport crag in the Peak District. Home to Mecca Extension, 8c+.",
    latitude: 53.1827, longitude: -1.7598, rockType: RockType.LIMESTONE,
    approach: "Short walk from Miller's Dale car park.",
    parkingInfo: "Miller's Dale car park (pay & display).",
  });

  const ravenMain = await upsertButtress(buttRepo, { name: 'Main Wall', crag: ravenTor, cragId: ravenTor.id, sortOrder: 1 });

  for (const r of [
    { name: 'Revelations',          climbingType: ClimbingType.SPORT, gradeSystem: GradeSystem.FRENCH, grade: '8b',  gradeDifficulty: GRADE_DIFFICULTY['8b']  ?? 24, heightMetres: 18, pitches: 1, buttress: ravenMain, sortOrder: 1, description: 'A benchmark 8b. Pure power on tiny limestone pockets.' },
    { name: 'Body Machine',         climbingType: ClimbingType.SPORT, gradeSystem: GradeSystem.FRENCH, grade: '8b+', gradeDifficulty: 25,                          heightMetres: 15, pitches: 1, buttress: ravenMain, sortOrder: 2 },
    { name: 'Mecca',                climbingType: ClimbingType.SPORT, gradeSystem: GradeSystem.FRENCH, grade: '7c+', gradeDifficulty: 21,                          heightMetres: 20, pitches: 1, buttress: ravenMain, sortOrder: 3 },
    { name: 'Indecent Exposure',    climbingType: ClimbingType.SPORT, gradeSystem: GradeSystem.FRENCH, grade: '7b',  gradeDifficulty: GRADE_DIFFICULTY['7b']  ?? 18, heightMetres: 18, pitches: 1, buttress: ravenMain, sortOrder: 4 },
    { name: 'Tequila Mockingbird',  climbingType: ClimbingType.SPORT, gradeSystem: GradeSystem.FRENCH, grade: '7a',  gradeDifficulty: GRADE_DIFFICULTY['7a']  ?? 16, heightMetres: 16, pitches: 1, buttress: ravenMain, sortOrder: 5 },
    { name: 'Superdirect',          climbingType: ClimbingType.SPORT, gradeSystem: GradeSystem.FRENCH, grade: '6c',  gradeDifficulty: GRADE_DIFFICULTY['6c']  ?? 14, heightMetres: 15, pitches: 1, buttress: ravenMain, sortOrder: 6 },
  ]) await upsertRoute(routeRepo, { ...r, buttressId: r.buttress.id });

  // ─── MALHAM COVE ──────────────────────────────────────────────────────────
  const malham = await upsertCrag(cragRepo, {
    name: 'Malham Cove', region: yorkshire, regionId: yorkshire.id,
    description: "Yorkshire's iconic limestone amphitheatre. Premier sport climbing venue.",
    latitude: 54.0697, longitude: -2.1579, rockType: RockType.LIMESTONE,
    approach: '15 min walk from Malham village.',
    parkingInfo: 'Malham National Park car park. Pay & display.',
  });

  const malhamCentral = await upsertButtress(buttRepo, { name: 'Central Wall', crag: malham, cragId: malham.id, sortOrder: 1 });
  const malhamLeft    = await upsertButtress(buttRepo, { name: 'Left Wing',    crag: malham, cragId: malham.id, sortOrder: 2 });

  for (const r of [
    { name: 'Wired for Sound',      climbingType: ClimbingType.SPORT, gradeSystem: GradeSystem.FRENCH, grade: '6b',  gradeDifficulty: GRADE_DIFFICULTY['6b']  ?? 12, heightMetres: 25, pitches: 1, buttress: malhamCentral, sortOrder: 1 },
    { name: 'Zoolook',              climbingType: ClimbingType.SPORT, gradeSystem: GradeSystem.FRENCH, grade: '7a',  gradeDifficulty: GRADE_DIFFICULTY['7a']  ?? 16, heightMetres: 28, pitches: 1, buttress: malhamCentral, sortOrder: 2 },
    { name: 'Bat Out of Hell',      climbingType: ClimbingType.SPORT, gradeSystem: GradeSystem.FRENCH, grade: '7b',  gradeDifficulty: GRADE_DIFFICULTY['7b']  ?? 18, heightMetres: 30, pitches: 1, buttress: malhamCentral, sortOrder: 3 },
    { name: 'Masterclass',          climbingType: ClimbingType.SPORT, gradeSystem: GradeSystem.FRENCH, grade: '7c',  gradeDifficulty: GRADE_DIFFICULTY['7c']  ?? 20, heightMetres: 30, pitches: 1, buttress: malhamCentral, sortOrder: 4 },
    { name: 'Raindogs',             climbingType: ClimbingType.SPORT, gradeSystem: GradeSystem.FRENCH, grade: '6a+', gradeDifficulty: GRADE_DIFFICULTY['6a+'] ?? 11, heightMetres: 22, pitches: 1, buttress: malhamLeft,    sortOrder: 1 },
    { name: 'Cave Route Right-Hand',climbingType: ClimbingType.TRAD,  gradeSystem: GradeSystem.UK_TRAD, grade: 'VS', technicalGrade: '4c', gradeDifficulty: GRADE_DIFFICULTY['VS'], heightMetres: 35, pitches: 2, buttress: malhamLeft, sortOrder: 2 },
  ]) await upsertRoute(routeRepo, { ...r, buttressId: r.buttress.id });

  // ─── SCAFELL ──────────────────────────────────────────────────────────────
  const scafell = await upsertCrag(cragRepo, {
    name: 'Scafell Crag', region: lake, regionId: lake.id,
    description: "England's highest crag. Some of the finest mountain trad routes in the country.",
    latitude: 54.4555, longitude: -3.2117, rockType: RockType.GRANITE,
    approach: '2.5hr walk in from Wasdale Head. Serious mountain environment.',
    parkingInfo: 'National Trust car park at Wasdale Head (donations).',
  });

  const scafellEast = await upsertButtress(buttRepo, { name: 'East Buttress',    crag: scafell, cragId: scafell.id, sortOrder: 1 });
  const scafellMain = await upsertButtress(buttRepo, { name: 'Central Buttress', crag: scafell, cragId: scafell.id, sortOrder: 2 });

  for (const r of [
    { name: 'Moss Ghyll Grooves', climbingType: ClimbingType.TRAD, gradeSystem: GradeSystem.UK_TRAD, grade: 'VS',  technicalGrade: '4c', gradeDifficulty: GRADE_DIFFICULTY['VS'],  heightMetres: 120, pitches: 4, buttress: scafellMain, sortOrder: 1 },
    { name: 'Central Buttress',   climbingType: ClimbingType.TRAD, gradeSystem: GradeSystem.UK_TRAD, grade: 'HVS', technicalGrade: '5a', gradeDifficulty: GRADE_DIFFICULTY['HVS'], heightMetres: 150, pitches: 5, buttress: scafellMain, sortOrder: 2 },
    { name: 'Lord of the Flies',  climbingType: ClimbingType.TRAD, gradeSystem: GradeSystem.UK_TRAD, grade: 'E6',  technicalGrade: '6b', gradeDifficulty: GRADE_DIFFICULTY['E6'],  heightMetres:  60, pitches: 2, buttress: scafellEast, sortOrder: 1 },
    { name: 'Trespasser Groove',  climbingType: ClimbingType.TRAD, gradeSystem: GradeSystem.UK_TRAD, grade: 'E2',  technicalGrade: '5b', gradeDifficulty: GRADE_DIFFICULTY['E2'],  heightMetres:  80, pitches: 3, buttress: scafellEast, sortOrder: 2 },
  ]) await upsertRoute(routeRepo, { ...r, buttressId: r.buttress.id });

  // ─── PEMBROKE — ST GOVAN'S ─────────────────────────────────────────────────
  const stGovans = await upsertCrag(cragRepo, {
    name: "St Govan's Head", region: pembroke, regionId: pembroke.id,
    description: 'Spectacular Pembrokeshire sea cliff sport climbing above Atlantic waves.',
    latitude: 51.5980, longitude: -4.9399, rockType: RockType.LIMESTONE,
    approach: "Short walk from St Govan's car park. Take the steps down.",
    parkingInfo: "St Govan's Head car park. Note military firing range hours.",
  });

  const stGovansMain = await upsertButtress(buttRepo, { name: 'Main Cliff', crag: stGovans, cragId: stGovans.id, sortOrder: 1 });

  for (const r of [
    { name: 'The Cad',          climbingType: ClimbingType.SPORT, gradeSystem: GradeSystem.FRENCH,  grade: '7a+', gradeDifficulty: GRADE_DIFFICULTY['7a+'] ?? 17, heightMetres: 25, pitches: 1, buttress: stGovansMain, sortOrder: 1 },
    { name: 'Pleasure Dome',    climbingType: ClimbingType.SPORT, gradeSystem: GradeSystem.FRENCH,  grade: '6c+', gradeDifficulty: GRADE_DIFFICULTY['6c+'] ?? 15, heightMetres: 20, pitches: 1, buttress: stGovansMain, sortOrder: 2 },
    { name: 'Saint and Sinner', climbingType: ClimbingType.SPORT, gradeSystem: GradeSystem.FRENCH,  grade: '6b+', gradeDifficulty: GRADE_DIFFICULTY['6b+'] ?? 13, heightMetres: 18, pitches: 1, buttress: stGovansMain, sortOrder: 3 },
    { name: "Mother Carey's Kitchen", climbingType: ClimbingType.TRAD, gradeSystem: GradeSystem.UK_TRAD, grade: 'E2', technicalGrade: '5b', gradeDifficulty: GRADE_DIFFICULTY['E2'], heightMetres: 25, pitches: 1, buttress: stGovansMain, sortOrder: 4 },
  ]) await upsertRoute(routeRepo, { ...r, buttressId: r.buttress.id });

  // ─── TREMADOG — NORTH WALES ───────────────────────────────────────────────
  const tremadog = await upsertCrag(cragRepo, {
    name: 'Tremadog', region: northWales, regionId: northWales.id,
    description: 'Sheltered North Wales roadside crag. Excellent trad routes on perfect rhyolite.',
    latitude: 52.9266, longitude: -4.1449, rockType: RockType.OTHER,
    approach: 'Short walk from lay-by on A498.',
    parkingInfo: 'Lay-by adjacent to the crag (free).',
  });

  const tremaWall = await upsertButtress(buttRepo, { name: 'Vector Buttress', crag: tremadog, cragId: tremadog.id, sortOrder: 1 });

  for (const r of [
    { name: 'Vector',          climbingType: ClimbingType.TRAD, gradeSystem: GradeSystem.UK_TRAD, grade: 'HVS', technicalGrade: '5a', gradeDifficulty: GRADE_DIFFICULTY['HVS'], heightMetres: 45, pitches: 3, buttress: tremaWall, sortOrder: 1 },
    { name: 'Meshach',         climbingType: ClimbingType.TRAD, gradeSystem: GradeSystem.UK_TRAD, grade: 'E1',  technicalGrade: '5b', gradeDifficulty: GRADE_DIFFICULTY['E1'],  heightMetres: 40, pitches: 2, buttress: tremaWall, sortOrder: 2 },
    { name: 'Plum',            climbingType: ClimbingType.TRAD, gradeSystem: GradeSystem.UK_TRAD, grade: 'E2',  technicalGrade: '5c', gradeDifficulty: GRADE_DIFFICULTY['E2'],  heightMetres: 50, pitches: 3, buttress: tremaWall, sortOrder: 3 },
    { name: 'Christmas Curry', climbingType: ClimbingType.TRAD, gradeSystem: GradeSystem.UK_TRAD, grade: 'VS',  technicalGrade: '4b', gradeDifficulty: GRADE_DIFFICULTY['VS'],  heightMetres: 30, pitches: 2, buttress: tremaWall, sortOrder: 4 },
  ]) await upsertRoute(routeRepo, { ...r, buttressId: r.buttress.id });

  console.log('  ✓ Seeded UK crags: Stanage, Froggatt, Raven Tor, Malham, Scafell, St Govan\'s, Tremadog');
}
