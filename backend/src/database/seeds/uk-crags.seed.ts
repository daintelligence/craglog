import { DataSource } from 'typeorm';
import { Region } from '../../modules/crags/entities/region.entity';
import { Crag, RockType } from '../../modules/crags/entities/crag.entity';
import { Buttress } from '../../modules/crags/entities/buttress.entity';
import { Route, ClimbingType, GradeSystem, GRADE_DIFFICULTY } from '../../modules/routes/entities/route.entity';

export async function seedUKCrags(ds: DataSource) {
  const regionRepo = ds.getRepository(Region);
  const cragRepo = ds.getRepository(Crag);
  const buttressRepo = ds.getRepository(Buttress);
  const routeRepo = ds.getRepository(Route);

  // Regions
  const [peak, lake, yorkshire, north_wales, pembroke] = await regionRepo.save([
    { name: 'Peak District', country: 'UK', description: 'The Peak District — UK climbing heartland. Gritstone edges and limestone dales.' },
    { name: 'Lake District', country: 'UK', description: 'Lakeland fells and crags. Classic trad climbing on rhyolite, granite and slate.' },
    { name: 'Yorkshire Dales', country: 'UK', description: 'Yorkshire limestone sport and trad classics.' },
    { name: 'North Wales', country: 'UK', description: 'Snowdonia. World-class trad climbing on rhyolite, slate and quartzite.' },
    { name: 'Pembroke', country: 'UK', description: 'South Wales sea cliffs. Premium limestone sport climbing.' },
  ]);

  // ─── STANAGE EDGE ─────────────────────────────────────────────────────────
  const stanage = await cragRepo.save({
    name: 'Stanage Edge',
    description: 'The most famous gritstone edge in the world. Over 1,000 routes from Diff to E7. Essential Peak District destination.',
    latitude: 53.3664,
    longitude: -1.6458,
    rockType: RockType.GRITSTONE,
    region: peak,
    approach: '20 min walk from Hooks Car park (SK 2376 8268). Head north along the edge.',
    parkingInfo: 'Hooks Car (pay & display) or limited roadside on Long Causeway.',
  });

  const popular = await buttressRepo.save({ name: 'Popular End', crag: stanage, sortOrder: 1 });
  const highNeb = await buttressRepo.save({ name: 'High Neb', crag: stanage, sortOrder: 2 });
  const north = await buttressRepo.save({ name: 'North Buttress', crag: stanage, sortOrder: 3 });

  await routeRepo.save([
    // Popular End
    { name: 'Flying Buttress Direct', climbingType: ClimbingType.TRAD, gradeSystem: GradeSystem.UK_TRAD, grade: 'HS', technicalGrade: '4b', gradeDifficulty: GRADE_DIFFICULTY['HS'], heightMetres: 12, pitches: 1, buttress: popular, sortOrder: 1, description: 'The classic Stanage HS. A solid crack up the obvious buttress.' },
    { name: 'Goliath\'s Groove', climbingType: ClimbingType.TRAD, gradeSystem: GradeSystem.UK_TRAD, grade: 'VS', technicalGrade: '4c', gradeDifficulty: GRADE_DIFFICULTY['VS'], heightMetres: 15, pitches: 1, buttress: popular, sortOrder: 2, description: 'A wide crack with a tricky layback start. Strenuous but well protected.' },
    { name: 'The Right Unconquerable', climbingType: ClimbingType.TRAD, gradeSystem: GradeSystem.UK_TRAD, grade: 'HVS', technicalGrade: '5a', gradeDifficulty: GRADE_DIFFICULTY['HVS'], heightMetres: 18, pitches: 1, buttress: popular, sortOrder: 3, description: 'One of the finest HVS routes in the country. A long sustained crack.' },
    { name: 'Quietus', climbingType: ClimbingType.TRAD, gradeSystem: GradeSystem.UK_TRAD, grade: 'E1', technicalGrade: '5b', gradeDifficulty: GRADE_DIFFICULTY['E1'], heightMetres: 18, pitches: 1, buttress: popular, sortOrder: 4, description: 'Superb sustained crack climbing in a magnificent position.' },
    { name: 'Black Hawk Hell Crack', climbingType: ClimbingType.TRAD, gradeSystem: GradeSystem.UK_TRAD, grade: 'E2', technicalGrade: '5c', gradeDifficulty: GRADE_DIFFICULTY['E2'], heightMetres: 16, pitches: 1, buttress: popular, sortOrder: 5, description: 'Pumpy finger crack that eats gear. Pure gritstone technique required.' },
    // High Neb
    { name: 'Inverted V', climbingType: ClimbingType.TRAD, gradeSystem: GradeSystem.UK_TRAD, grade: 'S', technicalGrade: '4a', gradeDifficulty: GRADE_DIFFICULTY['S'], heightMetres: 10, pitches: 1, buttress: highNeb, sortOrder: 1, description: 'Looks harder than it is. A great beginner VS-area route.' },
    { name: 'High Neb Buttress', climbingType: ClimbingType.TRAD, gradeSystem: GradeSystem.UK_TRAD, grade: 'VD', technicalGrade: '3c', gradeDifficulty: GRADE_DIFFICULTY['VD'], heightMetres: 14, pitches: 1, buttress: highNeb, sortOrder: 2, description: 'An excellent beginners route on good holds.' },
    { name: 'Stanage Bannister', climbingType: ClimbingType.TRAD, gradeSystem: GradeSystem.UK_TRAD, grade: 'E3', technicalGrade: '6a', gradeDifficulty: GRADE_DIFFICULTY['E3'], heightMetres: 14, pitches: 1, buttress: highNeb, sortOrder: 3, description: 'Technical slab climbing on impeccable gritstone.' },
    // North
    { name: 'Count\'s Buttress', climbingType: ClimbingType.TRAD, gradeSystem: GradeSystem.UK_TRAD, grade: 'VS', technicalGrade: '4c', gradeDifficulty: GRADE_DIFFICULTY['VS'], heightMetres: 12, pitches: 1, buttress: north, sortOrder: 1 },
    { name: 'Heaven Crack', climbingType: ClimbingType.TRAD, gradeSystem: GradeSystem.UK_TRAD, grade: 'HVS', technicalGrade: '5a', gradeDifficulty: GRADE_DIFFICULTY['HVS'], heightMetres: 14, pitches: 1, buttress: north, sortOrder: 2, description: 'Sustained hand crack with perfect jams all the way.' },
  ]);

  // ─── FROGGATT EDGE ────────────────────────────────────────────────────────
  const froggatt = await cragRepo.save({
    name: 'Froggatt Edge',
    description: 'Atmospheric gritstone edge above the Derwent Valley. Home to Valkyrie, one of the most famous gritstone routes.',
    latitude: 53.3105,
    longitude: -1.6313,
    rockType: RockType.GRITSTONE,
    region: peak,
    approach: '5 min from Hay Wood car park (SK 2455 7683).',
    parkingInfo: 'National Trust Hay Wood car park. Pay & display.',
  });

  const froggattMain = await buttressRepo.save({ name: 'Main Area', crag: froggatt, sortOrder: 1 });

  await routeRepo.save([
    { name: 'Valkyrie', climbingType: ClimbingType.TRAD, gradeSystem: GradeSystem.UK_TRAD, grade: 'HVS', technicalGrade: '5a', gradeDifficulty: GRADE_DIFFICULTY['HVS'], heightMetres: 12, pitches: 1, buttress: froggattMain, sortOrder: 1, description: 'The most photographed gritstone route in existence. A flying mantleshelf finish above an undercut roof.' },
    { name: 'Strapadictomy', climbingType: ClimbingType.TRAD, gradeSystem: GradeSystem.UK_TRAD, grade: 'E1', technicalGrade: '5b', gradeDifficulty: GRADE_DIFFICULTY['E1'], heightMetres: 14, pitches: 1, buttress: froggattMain, sortOrder: 2, description: 'Bold and committing. A strenuous start leads to a fingery crux.' },
    { name: 'Downhill Racer', climbingType: ClimbingType.TRAD, gradeSystem: GradeSystem.UK_TRAD, grade: 'E2', technicalGrade: '5c', gradeDifficulty: GRADE_DIFFICULTY['E2'], heightMetres: 16, pitches: 1, buttress: froggattMain, sortOrder: 3 },
    { name: 'Great Slab', climbingType: ClimbingType.TRAD, gradeSystem: GradeSystem.UK_TRAD, grade: 'VD', gradeDifficulty: GRADE_DIFFICULTY['VD'], heightMetres: 15, pitches: 1, buttress: froggattMain, sortOrder: 4, description: 'Classic friction slab — superb.' },
    { name: 'Tody\'s Wall', climbingType: ClimbingType.TRAD, gradeSystem: GradeSystem.UK_TRAD, grade: 'E3', technicalGrade: '6a', gradeDifficulty: GRADE_DIFFICULTY['E3'], heightMetres: 12, pitches: 1, buttress: froggattMain, sortOrder: 5, description: 'Deceptive wall climb on the finest gritstone.' },
  ]);

  // ─── RAVEN TOR ────────────────────────────────────────────────────────────
  const ravenTor = await cragRepo.save({
    name: 'Raven Tor',
    description: 'The hardest sport crag in the Peak District. Steep limestone walls and powerful routes. Home to Mecca Extension, 8c+.',
    latitude: 53.1827,
    longitude: -1.7598,
    rockType: RockType.LIMESTONE,
    region: peak,
    approach: 'Short walk from Miller\'s Dale car park.',
    parkingInfo: 'Miller\'s Dale car park (pay & display).',
  });

  const ravenMain = await buttressRepo.save({ name: 'Main Wall', crag: ravenTor, sortOrder: 1 });

  await routeRepo.save([
    { name: 'Revelations', climbingType: ClimbingType.SPORT, gradeSystem: GradeSystem.FRENCH, grade: '8b', gradeDifficulty: GRADE_DIFFICULTY['8b'] || 24, heightMetres: 18, pitches: 1, buttress: ravenMain, sortOrder: 1, description: 'A benchmark 8b. Pure power on tiny limestone pockets.' },
    { name: 'Body Machine', climbingType: ClimbingType.SPORT, gradeSystem: GradeSystem.FRENCH, grade: '8b+', gradeDifficulty: 25, heightMetres: 15, pitches: 1, buttress: ravenMain, sortOrder: 2 },
    { name: 'Mecca', climbingType: ClimbingType.SPORT, gradeSystem: GradeSystem.FRENCH, grade: '7c+', gradeDifficulty: 21, heightMetres: 20, pitches: 1, buttress: ravenMain, sortOrder: 3, description: 'The parent route — demanding sustained technique.' },
    { name: 'Indecent Exposure', climbingType: ClimbingType.SPORT, gradeSystem: GradeSystem.FRENCH, grade: '7b', gradeDifficulty: GRADE_DIFFICULTY['7b'] || 18, heightMetres: 18, pitches: 1, buttress: ravenMain, sortOrder: 4 },
    { name: 'Tequila Mockingbird', climbingType: ClimbingType.SPORT, gradeSystem: GradeSystem.FRENCH, grade: '7a', gradeDifficulty: GRADE_DIFFICULTY['7a'] || 16, heightMetres: 16, pitches: 1, buttress: ravenMain, sortOrder: 5 },
    { name: 'Superdirect', climbingType: ClimbingType.SPORT, gradeSystem: GradeSystem.FRENCH, grade: '6c', gradeDifficulty: GRADE_DIFFICULTY['6c'] || 14, heightMetres: 15, pitches: 1, buttress: ravenMain, sortOrder: 6 },
  ]);

  // ─── MALHAM COVE ──────────────────────────────────────────────────────────
  const malham = await cragRepo.save({
    name: 'Malham Cove',
    description: 'Yorkshire\'s iconic limestone amphitheatre. Premier sport climbing venue with routes from 5c to 8b+.',
    latitude: 54.0697,
    longitude: -2.1579,
    rockType: RockType.LIMESTONE,
    region: yorkshire,
    approach: '15 min walk from Malham village. Follow signs to the cove.',
    parkingInfo: 'Malham National Park car park. Pay & display.',
  });

  const malhamCentral = await buttressRepo.save({ name: 'Central Wall', crag: malham, sortOrder: 1 });
  const malhamLeft = await buttressRepo.save({ name: 'Left Wing', crag: malham, sortOrder: 2 });

  await routeRepo.save([
    { name: 'Wired for Sound', climbingType: ClimbingType.SPORT, gradeSystem: GradeSystem.FRENCH, grade: '6b', gradeDifficulty: GRADE_DIFFICULTY['6b'] || 12, heightMetres: 25, pitches: 1, buttress: malhamCentral, sortOrder: 1, description: 'A superb intro route at Malham. Sustained and well protected.' },
    { name: 'Zoolook', climbingType: ClimbingType.SPORT, gradeSystem: GradeSystem.FRENCH, grade: '7a', gradeDifficulty: GRADE_DIFFICULTY['7a'] || 16, heightMetres: 28, pitches: 1, buttress: malhamCentral, sortOrder: 2 },
    { name: 'Bat Out of Hell', climbingType: ClimbingType.SPORT, gradeSystem: GradeSystem.FRENCH, grade: '7b', gradeDifficulty: GRADE_DIFFICULTY['7b'] || 18, heightMetres: 30, pitches: 1, buttress: malhamCentral, sortOrder: 3, description: 'Classic mega-route on the main Malham wall.' },
    { name: 'Masterclass', climbingType: ClimbingType.SPORT, gradeSystem: GradeSystem.FRENCH, grade: '7c', gradeDifficulty: GRADE_DIFFICULTY['7c'] || 20, heightMetres: 30, pitches: 1, buttress: malhamCentral, sortOrder: 4 },
    { name: 'Raindogs', climbingType: ClimbingType.SPORT, gradeSystem: GradeSystem.FRENCH, grade: '6a+', gradeDifficulty: GRADE_DIFFICULTY['6a+'] || 11, heightMetres: 22, pitches: 1, buttress: malhamLeft, sortOrder: 1 },
    { name: 'Cave Route Right-Hand', climbingType: ClimbingType.TRAD, gradeSystem: GradeSystem.UK_TRAD, grade: 'VS', technicalGrade: '4c', gradeDifficulty: GRADE_DIFFICULTY['VS'], heightMetres: 35, pitches: 2, buttress: malhamLeft, sortOrder: 2, description: 'Classic multi-pitch trad line. Good protection throughout.' },
  ]);

  // ─── SCAFELL ──────────────────────────────────────────────────────────────
  const scafell = await cragRepo.save({
    name: 'Scafell Crag',
    description: 'England\'s highest crag — a Lakeland masterpiece. Some of the finest mountain trad routes in the country.',
    latitude: 54.4555,
    longitude: -3.2117,
    rockType: RockType.GRANITE,
    region: lake,
    approach: '2.5hr walk in from Wasdale Head. Serious mountain environment — go prepared.',
    parkingInfo: 'National Trust car park at Wasdale Head (donations).',
  });

  const scafellEast = await buttressRepo.save({ name: 'East Buttress', crag: scafell, sortOrder: 1 });
  const scafellMain = await buttressRepo.save({ name: 'Central Buttress', crag: scafell, sortOrder: 2 });

  await routeRepo.save([
    { name: 'Moss Ghyll Grooves', climbingType: ClimbingType.TRAD, gradeSystem: GradeSystem.UK_TRAD, grade: 'VS', technicalGrade: '4c', gradeDifficulty: GRADE_DIFFICULTY['VS'], heightMetres: 120, pitches: 4, buttress: scafellMain, sortOrder: 1, description: 'A superb classic. Four pitches on excellent rock at 800m above sea level.' },
    { name: 'Central Buttress', climbingType: ClimbingType.TRAD, gradeSystem: GradeSystem.UK_TRAD, grade: 'HVS', technicalGrade: '5a', gradeDifficulty: GRADE_DIFFICULTY['HVS'], heightMetres: 150, pitches: 5, buttress: scafellMain, sortOrder: 2, description: 'The great classic of Lakeland — sustained technical climbing on the biggest buttress.' },
    { name: 'Lord of the Flies', climbingType: ClimbingType.TRAD, gradeSystem: GradeSystem.UK_TRAD, grade: 'E6', technicalGrade: '6b', gradeDifficulty: GRADE_DIFFICULTY['E6'], heightMetres: 60, pitches: 2, buttress: scafellEast, sortOrder: 1 },
    { name: 'Trespasser Groove', climbingType: ClimbingType.TRAD, gradeSystem: GradeSystem.UK_TRAD, grade: 'E2', technicalGrade: '5b', gradeDifficulty: GRADE_DIFFICULTY['E2'], heightMetres: 80, pitches: 3, buttress: scafellEast, sortOrder: 2 },
  ]);

  // ─── PEMBROKE — ST GOVAN'S ─────────────────────────────────────────────────
  const stGovans = await cragRepo.save({
    name: 'St Govan\'s Head',
    description: 'Spectacular Pembrokeshire sea cliff sport climbing. Steep limestone walls above crashing Atlantic waves.',
    latitude: 51.5980,
    longitude: -4.9399,
    rockType: RockType.LIMESTONE,
    region: pembroke,
    approach: 'Short walk from St Govan\'s car park. Take the steps down.',
    parkingInfo: 'St Govan\'s Head car park. Note military firing range hours.',
  });

  const stGovansMain = await buttressRepo.save({ name: 'Main Cliff', crag: stGovans, sortOrder: 1 });

  await routeRepo.save([
    { name: 'The Cad', climbingType: ClimbingType.SPORT, gradeSystem: GradeSystem.FRENCH, grade: '7a+', gradeDifficulty: GRADE_DIFFICULTY['7a+'] || 17, heightMetres: 25, pitches: 1, buttress: stGovansMain, sortOrder: 1, description: 'A Pembrokeshire classic — powerful and technical on immaculate limestone.' },
    { name: 'Pleasure Dome', climbingType: ClimbingType.SPORT, gradeSystem: GradeSystem.FRENCH, grade: '6c+', gradeDifficulty: GRADE_DIFFICULTY['6c+'] || 15, heightMetres: 20, pitches: 1, buttress: stGovansMain, sortOrder: 2 },
    { name: 'Saint and Sinner', climbingType: ClimbingType.SPORT, gradeSystem: GradeSystem.FRENCH, grade: '6b+', gradeDifficulty: GRADE_DIFFICULTY['6b+'] || 13, heightMetres: 18, pitches: 1, buttress: stGovansMain, sortOrder: 3 },
    { name: 'Mother Carey\'s Kitchen', climbingType: ClimbingType.TRAD, gradeSystem: GradeSystem.UK_TRAD, grade: 'E2', technicalGrade: '5b', gradeDifficulty: GRADE_DIFFICULTY['E2'], heightMetres: 25, pitches: 1, buttress: stGovansMain, sortOrder: 4, description: 'Sustained sea cliff trad. Tidal — check times before committing.' },
  ]);

  // ─── TREMADOG — NORTH WALES ───────────────────────────────────────────────
  const tremadog = await cragRepo.save({
    name: 'Tremadog',
    description: 'Sheltered North Wales roadside crag. Excellent trad routes on perfect rhyolite. Dries quickly after rain.',
    latitude: 52.9266,
    longitude: -4.1449,
    rockType: RockType.OTHER,
    region: north_wales,
    approach: '5 min walk from the lay-by on the A498.',
    parkingInfo: 'Lay-by adjacent to the crag (free).',
  });

  const tremaWall = await buttressRepo.save({ name: 'Vector Buttress', crag: tremadog, sortOrder: 1 });

  await routeRepo.save([
    { name: 'Vector', climbingType: ClimbingType.TRAD, gradeSystem: GradeSystem.UK_TRAD, grade: 'HVS', technicalGrade: '5a', gradeDifficulty: GRADE_DIFFICULTY['HVS'], heightMetres: 45, pitches: 3, buttress: tremaWall, sortOrder: 1, description: 'The definitive Tremadog route. Three superb pitches — endlessly repeated.' },
    { name: 'Meshach', climbingType: ClimbingType.TRAD, gradeSystem: GradeSystem.UK_TRAD, grade: 'E1', technicalGrade: '5b', gradeDifficulty: GRADE_DIFFICULTY['E1'], heightMetres: 40, pitches: 2, buttress: tremaWall, sortOrder: 2 },
    { name: 'Plum', climbingType: ClimbingType.TRAD, gradeSystem: GradeSystem.UK_TRAD, grade: 'E2', technicalGrade: '5c', gradeDifficulty: GRADE_DIFFICULTY['E2'], heightMetres: 50, pitches: 3, buttress: tremaWall, sortOrder: 3, description: 'A bold and technical adventure up Tremadog\'s main buttress.' },
    { name: 'Christmas Curry', climbingType: ClimbingType.TRAD, gradeSystem: GradeSystem.UK_TRAD, grade: 'VS', technicalGrade: '4b', gradeDifficulty: GRADE_DIFFICULTY['VS'], heightMetres: 30, pitches: 2, buttress: tremaWall, sortOrder: 4 },
  ]);

  console.log('  ✓ Seeded UK crags: Stanage, Froggatt, Raven Tor, Malham, Scafell, St Govan\'s, Tremadog');
}
