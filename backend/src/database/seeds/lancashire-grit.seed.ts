import { DataSource } from 'typeorm';
import { Region } from '../../modules/crags/entities/region.entity';
import { Crag, RockType } from '../../modules/crags/entities/crag.entity';
import { Buttress } from '../../modules/crags/entities/buttress.entity';
import { Route } from '../../modules/routes/entities/route.entity';
import { findOrCreateRegion, upsertCrag, upsertButtress, upsertRoute, tradRoute, sportRoute } from './seed-helpers';

export async function seedLancashireGrit(ds: DataSource) {
  const regionRepo = ds.getRepository(Region);
  const cragRepo   = ds.getRepository(Crag);
  const buttRepo   = ds.getRepository(Buttress);
  const routeRepo  = ds.getRepository(Route);

  const region = await findOrCreateRegion(regionRepo, { name: 'Lancashire', country: 'England' });

  async function c(name: string, lat: number, lng: number, rock: RockType, desc: string, approach: string, parking: string, region: any) {
    return upsertCrag(cragRepo, { name, latitude: lat, longitude: lng, rockType: rock, description: desc, approach, parkingInfo: parking, region, regionId: region.id });
  }
  async function b(name: string, crag: Crag, order = 1) { return upsertButtress(buttRepo, { name, crag, cragId: crag.id, sortOrder: order }); }
  async function r(data: Partial<Route>) { return upsertRoute(routeRepo, data); }

  // ── Wilton Quarry ──────────────────────────────────────────────────────────
  const wilton = await c('Wilton Quarry', 53.6117, -2.4375, RockType.SANDSTONE,
    'The biggest and best of the Wilton quarries above Horwich on the West Pennine Moors — a series of sandstone quarries offering some of the finest gritstone-equivalent climbing in Lancashire. The Main Quarry has walls up to 20m with classic routes from HS to E3. The rock is compact and featured sandstone with good friction when dry. A superb venue and an important part of Lancashire climbing heritage.',
    'From Horwich, follow the road up to Rivington then the track to the quarries. Wilton One is signposted from the road — 15 min walk.',
    'Roadside parking on the Lever Park Avenue near the quarry entrance or at Rivington car park (free).', region);
  const wiltonMain   = await b('Main Wall', wilton, 1);
  const wiltonLeft   = await b('Left Buttress', wilton, 2);
  const wiltonAretes = await b('Arête Section', wilton, 3);

  for (const route of [
    tradRoute('Wilton Classic',    'E1',  '5b', wiltonMain,   { height: 18, description: 'The signature route of Wilton Quarry — a sustained E1 taking the main wall on compact Lancashire sandstone. Well protected and varied.' }),
    tradRoute('Pebbled Arête',     'HVS', '5a', wiltonAretes, { height: 16, description: 'A fine arête route on embedded pebble sandstone — technical and exposed with good gear in the crack to the right.' }),
    tradRoute('Main Wall',         'VS',  '4c', wiltonMain,   { height: 16, description: 'Takes the centre of the main wall — a classic Lancashire VS on compact sandstone with excellent friction.' }),
    tradRoute('Direct Route',      'E2',  '5c', wiltonMain,   { height: 18, description: 'A harder direct line up the main wall — sustained face climbing with bold moves between good gear.' }),
    tradRoute('Wilton Wall',       'E3',  '6a', wiltonMain,   { height: 18, description: 'The hardest and most serious route on the main wall — technical and powerful on compact sandstone with limited protection.' }),
    tradRoute('Sandstone Crack',   'HS',  '4b', wiltonLeft,   { height: 14, description: 'A pleasant crack route on the left buttress — a classic hand-jamming line on well-featured Lancashire sandstone.' }),
    tradRoute('Left Arête',        'HVS', '5b', wiltonLeft,   { height: 14, description: 'Takes the left buttress arête — technical and exposed with fine views over the West Pennine Moors.' }),
  ]) await r({ ...route, buttressId: route.buttress.id });

  // ── Brownstones ────────────────────────────────────────────────────────────
  const brownstones = await c('Brownstones', 53.6035, -2.4380, RockType.SANDSTONE,
    'A popular sandstone outcrop on the West Pennine Moors near Horwich — compact and characterful gritstone-like rock with classic routes from HS to E2. The crag is one of the most visited in Lancashire, particularly popular with Bolton and Wigan climbers. Quick to dry and easily accessible from the M61 corridor.',
    'From Horwich station or town centre, follow the footpath up onto the West Pennine Moors. Brownstones is visible on the moorland edge — 20 min walk.',
    'Roadside parking on Chorley Old Road above Horwich (free) or at the Winter Hill car park.', region);
  const brownstonesMain  = await b('Main Buttress', brownstones, 1);
  const brownstonesRight = await b('Right Section', brownstones, 2);

  for (const route of [
    tradRoute('Great Slab',           'HVS', '5a', brownstonesMain,  { height: 14, description: 'The most celebrated route at Brownstones — a superb friction slab on compact moorland sandstone. Technical and elegant.' }),
    tradRoute('Brown\'s Crack',       'VS',  '4c', brownstonesMain,  { height: 12, description: 'The original classic — a well-protected crack splitting the main buttress. Excellent jams and bridging on rough sandstone.' }),
    tradRoute('Short Arête',          'E1',  '5b', brownstonesRight, { height: 10, description: 'A short but technical arête problem on the right section — fine footwork required on the compact sandstone edge.' }),
    tradRoute('Brownstones Classic',  'HS',  '4a', brownstonesMain,  { height: 12, description: 'The easiest classic of the crag — a pleasant route up the main buttress on featured sandstone. An excellent introduction to Lancashire gritstone.' }),
  ]) await r({ ...route, buttressId: route.buttress.id });

  // ── Trowbarrow Quarry ──────────────────────────────────────────────────────
  const trowbarrow = await c('Trowbarrow Quarry', 54.1133, -2.7567, RockType.LIMESTONE,
    'A superb limestone sport climbing quarry in the Arnside & Silverdale AONB south of Carnforth — one of the finest sport venues in the North of England. The vertical to slightly overhanging limestone walls have routes from 6a to 8a on compact, featured rock. Trowbarrow hosted some of the earliest sport climbing development in Lancashire and remains a benchmark venue. Sheltered and quick to dry.',
    'From Silverdale village, follow the lane towards Trowbarrow. The quarry entrance is signed — 5 min walk from the road.',
    'Roadside parking near the quarry entrance off the Silverdale road (free). Silverdale railway station 15 min walk.', region);
  const trowMain   = await b('Main Wall', trowbarrow, 1);
  const trowRight  = await b('Right Wing', trowbarrow, 2);
  const trowSector = await b('Central Sector', trowbarrow, 3);

  for (const route of [
    sportRoute('Trowbarrow Classic',  '7a',  trowMain,   { height: 18, description: 'The benchmark route of Trowbarrow — a sustained 7a on compact limestone that has tested generations of Lancashire sport climbers.' }),
    sportRoute('Orangutan',           '7c',  trowMain,   { height: 20, description: 'The hardest classic of Trowbarrow — powerful and sustained on the steepest part of the main wall. A serious undertaking on compact North Lancashire limestone.' }),
    sportRoute('Trowbarrow Direct',   '7b+', trowMain,   { height: 20, description: 'A direct variation up the main wall — uncompromising technical climbing on excellent limestone.' }),
    sportRoute('Star Wars',           '6c',  trowSector, { height: 16, description: 'A popular mid-grade route on the central sector — sustained face climbing on well-featured limestone with good bolt protection.' }),
    sportRoute('Quickdraw',           '6b',  trowRight,  { height: 14, description: 'An accessible route on the right wing — a good introduction to Trowbarrow limestone with plenty of holds and reasonable bolt spacing.' }),
    sportRoute('Trowbarrow Sport',    '7b',  trowSector, { height: 18, description: 'A fine route on the central sector — technical and sustained on compact limestone with a crux sequence near the top.' }),
  ]) await r({ ...route, buttressId: route.buttress.id });

  // ── Anglezarke Quarry ──────────────────────────────────────────────────────
  const anglezarke = await c('Anglezarke Quarry', 53.6250, -2.5840, RockType.SANDSTONE,
    'A sandstone quarry on the Anglezarke Moor section of the West Pennine Moors above Chorley. Routes from S to E2 on compact gritstone-like sandstone with fine views over the Yarrow reservoir and Lancashire plain. Less frequented than the Wilton quarries but with worthwhile routes in a pleasant moorland setting. The quarry is often used for beginners and intermediate climbing courses.',
    'From the Anglezarke reservoir car park, follow the moorland track north to the quarry — 20 min.',
    'Anglezarke Reservoir car park off the Anglezarke road near Chorley (free, managed by United Utilities).', region);
  const anglezarkeMain  = await b('Main Wall', anglezarke, 1);
  const anglezarkeLeft  = await b('Left Buttress', anglezarke, 2);

  for (const route of [
    tradRoute('Anglezarke Wall',  'HVS', '5a', anglezarkeMain, { height: 14, description: 'The best route at Anglezarke — a sustained face route on compact moorland sandstone with good friction and natural gear.' }),
    tradRoute('Main Crack',       'VS',  '4c', anglezarkeMain, { height: 12, description: 'The central crack line — well protected hand jams on rough sandstone with good holds throughout.' }),
    tradRoute('Arête Route',      'E1',  '5b', anglezarkeLeft, { height: 12, description: 'A technical arête on the left buttress — bold and exposed on the edge of the sandstone quarry wall.' }),
    tradRoute('Quarry Classic',   'HS',  '4a', anglezarkeMain, { height: 10, description: 'An accessible moderate on the main wall — pleasant climbing on featured sandstone with good holds and protection.' }),
  ]) await r({ ...route, buttressId: route.buttress.id });

  // ── Rivington Pike ─────────────────────────────────────────────────────────
  const rivingtonPike = await c('Rivington Pike', 53.6200, -2.5700, RockType.SANDSTONE,
    'A small but characterful sandstone outcrop below Rivington Pike tower on the West Pennine Moors — the famous landmark hill above Bolton. Short routes from S to HVS on rough moorland sandstone with fine views to the Lancashire plain. Primarily of interest to local climbers from Bolton and Chorley. Quick to reach from the town and popular on weekday evenings.',
    'From Rivington village and the Great Barn, follow the path up to the Pike. The outcrops are on the south and east slopes below the tower — 25 min.',
    'Rivington Hall Barn car park (free) or Horwich end of the moor road. Public transport from Horwich.', region);
  const rivingtonMain  = await b('Pike Buttress', rivingtonPike, 1);
  const rivingtonLower = await b('Lower Outcrop', rivingtonPike, 2);

  for (const route of [
    tradRoute('Rivington Crack',   'VS',  '4c', rivingtonMain,  { height: 10, description: 'The classic of Rivington Pike — a well-protected crack on rough moorland sandstone below the famous tower.' }),
    tradRoute('Pike Arête',        'HVS', '5a', rivingtonMain,  { height: 10, description: 'Takes the exposed arête of the main buttress — technical and committing with fine views over Bolton and the Lancashire plain.' }),
    tradRoute('Lower Buttress',    'S',   '4a', rivingtonLower, { height: 8,  description: 'A pleasant lower route on the outcrop below the Pike — good holds on rough sandstone and a popular beginner route.' }),
  ]) await r({ ...route, buttressId: route.buttress.id });

  console.log('  ✓ Lancashire: Wilton Quarry, Brownstones, Trowbarrow Quarry, Anglezarke Quarry, Rivington Pike');
}
