import { DataSource } from 'typeorm';
import { Region } from '../../modules/crags/entities/region.entity';
import { Crag, RockType } from '../../modules/crags/entities/crag.entity';
import { Buttress } from '../../modules/crags/entities/buttress.entity';
import { Route } from '../../modules/routes/entities/route.entity';
import { findOrCreateRegion, upsertCrag, upsertButtress, upsertRoute, tradRoute } from './seed-helpers';

export async function seedPeakSouthGritstone(ds: DataSource) {
  const regionRepo = ds.getRepository(Region);
  const cragRepo   = ds.getRepository(Crag);
  const buttRepo   = ds.getRepository(Buttress);
  const routeRepo  = ds.getRepository(Route);

  const saddleworth = await findOrCreateRegion(regionRepo, { name: 'Saddleworth & Dark Peak', country: 'England' });
  const peak        = await findOrCreateRegion(regionRepo, { name: 'Peak District', country: 'England' });

  async function c(name: string, lat: number, lng: number, rock: RockType, desc: string, approach: string, parking: string, region: any) {
    return upsertCrag(cragRepo, { name, latitude: lat, longitude: lng, rockType: rock, description: desc, approach, parkingInfo: parking, region, regionId: region.id });
  }
  async function b(name: string, crag: Crag, order = 1) { return upsertButtress(buttRepo, { name, crag, cragId: crag.id, sortOrder: order }); }
  async function r(data: Partial<Route>) { return upsertRoute(routeRepo, data); }

  // ── Laddow Rocks ──────────────────────────────────────────────────────────
  const laddow = await c('Laddow Rocks', 53.5180, -2.0110, RockType.GRITSTONE,
    'A remote gritstone outcrop on Saddleworth Moor with a dramatic moorland atmosphere. Routes from VD to E5 on excellent rough gritstone. A classic "big day out" venue requiring navigation skills — the Pennine Way passes close by.',
    'From Crowden in Longdendale, follow the Pennine Way north to Laddow Rocks — 60 min. Alternatively approach from Greenfield via the Chew Valley — 90 min.',
    'Crowden car park in Longdendale (free). Alternative at Greenfield (A635 layby).', saddleworth);
  const laddowMain  = await b('Main Buttress', laddow, 1);
  const laddowLeft  = await b('Left Wing', laddow, 2);
  for (const route of [
    tradRoute('Bachelor\'s Buttress',  'VD',  '3c', laddowMain, { height: 20, pitches: 2, description: 'The classic easier route — a popular multi-pitch outing in a moorland setting.' }),
    tradRoute('Laddow Crack',          'VS',  '4c', laddowMain, { height: 18, description: 'The obvious crack — sustained and satisfying with good protection.' }),
    tradRoute('Heather Wall',          'S',   '4a', laddowLeft, { height: 15, description: 'A pleasant route on the left wing — steady climbing on rough gritstone.' }),
    tradRoute('Cave Route',            'HS',  '4b', laddowMain, { height: 18, description: 'Takes the cave feature — atmospheric and slightly awkward in the best gritstone tradition.' }),
    tradRoute('Overhang Climb',        'HVS', '5a', laddowMain, { height: 15, description: 'The classic Laddow HVS — takes the prominent overhang on good holds.' }),
    tradRoute('Slab Route',            'D',   '3a', laddowLeft, { height: 12, description: 'An easy angled slab on the left — good for building confidence on gritstone.' }),
    tradRoute('Main Wall',             'E2',  '5c', laddowMain, { height: 18, description: 'Bold face climbing on the main buttress — serious in the moorland setting.' }),
  ]) await r({ ...route, buttressId: route.buttress.id });

  // ── Wimberry Rocks ────────────────────────────────────────────────────────
  const wimberry = await c('Wimberry Rocks', 53.5280, -1.9970, RockType.GRITSTONE,
    'A high moorland gritstone edge above Dovestones Reservoir, giving classic hard routes from VS to E6. A famous destination for harder gritstone — some of the area\'s most serious climbing with unforgiving landings. The crag has a reputation for quality and seriousness.',
    'From the Dovestones Reservoir car park, follow the path up past the reservoir and onto the moor — 40 min.',
    'Dovestones Reservoir car park, Greenfield (pay & display, busy weekends).', saddleworth);
  const wimberryMain = await b('Main Edge', wimberry, 1);
  const wimberrySlab = await b('Slab Area', wimberry, 2);
  for (const route of [
    tradRoute('Overhanging Chimney',   'VS',  '4c', wimberryMain, { height: 12, description: 'The classic moderate — an entertaining chimney with good holds.' }),
    tradRoute('Wimberry Buttress',     'HVS', '5a', wimberryMain, { height: 14, description: 'A quality route taking the main buttress direct — sustained and satisfying.' }),
    tradRoute('Slab Route',            'S',   '4a', wimberrySlab, { height: 10, description: 'A pleasant slab climb on the lower section — technical footwork rewarded.' }),
    tradRoute('Wimberry Wall',         'E3',  '6a', wimberryMain, { height: 12, description: 'Technical wall climbing — small holds and bold moves on the main face.' }),
    tradRoute('The Sloper',            'E4',  '6a', wimberryMain, { height: 10, description: 'A dynamic problem converted to a route — commits to slopers above a bad landing.' }),
    tradRoute('Arête Route',           'E1',  '5b', wimberryMain, { height: 12, description: 'Takes the pronounced arête — exposed and interesting with fine views.' }),
  ]) await r({ ...route, buttressId: route.buttress.id });

  // ── Shining Clough ─────────────────────────────────────────────────────────
  const shiningClough = await c('Shining Clough', 53.4650, -1.9280, RockType.GRITSTONE,
    'A secretive Dark Peak gritstone crag above Longdendale with routes from Severe to E4. Receives less traffic than most Peak crags — the routes have a raw, moorland character. Some of the cleanest gritstone in the southern Dark Peak.',
    'From Woodhead in Longdendale, follow the track and moorland path towards the clough — 45 min.',
    'Woodhead car park, A628 Longdendale (free).', saddleworth);
  const shiningMain = await b('Main Cliff', shiningClough, 1);
  for (const route of [
    tradRoute('Clough Route',          'S',   '4a', shiningMain, { height: 16, description: 'The standard route — straightforward climbing on good rough gritstone.' }),
    tradRoute('Shining Wall',          'VS',  '4c', shiningMain, { height: 15, description: 'Takes the wall direct — technical moves on small holds.' }),
    tradRoute('Dark Peak Crack',       'HVS', '5a', shiningMain, { height: 14, description: 'A quality crack route — the main feature of the cliff.' }),
    tradRoute('Moorland Arête',        'E2',  '5b', shiningMain, { height: 14, description: 'Bold arête climbing in the finest gritstone tradition.' }),
  ]) await r({ ...route, buttressId: route.buttress.id });

  // ── Castle Naze ───────────────────────────────────────────────────────────
  const castleNaze = await c('Castle Naze', 53.3412, -1.9610, RockType.GRITSTONE,
    'A prominent gritstone promontory near Chapel-en-le-Frith with routes from VD to E5. One of the most popular crags in the southern Peak District — quick drying and easily accessible. The view from the top is exceptional.',
    'From Combs village, take the footpath directly to the crag visible on the ridge above — 20 min.',
    'Combs village roadside parking (free, limited). Combs Reservoir car park alternative.', peak);
  const castleNazeMain = await b('Main Tower', castleNaze, 1);
  const castleNazeNorth = await b('North Face', castleNaze, 2);
  for (const route of [
    tradRoute('Broken Crack',          'VD',  '3c', castleNazeMain,  { height: 15, description: 'The easiest route — a good introduction to the crag with solid holds throughout.' }),
    tradRoute('Naze Groove',           'VS',  '4c', castleNazeMain,  { height: 16, description: 'A classic VS — takes the fine groove on the main tower with sustained moves.' }),
    tradRoute('The Crack',             'HVS', '5a', castleNazeMain,  { height: 14, description: 'The prominent crack line — strenuous but well protected.' }),
    tradRoute('North Face Route',      'S',   '4a', castleNazeNorth, { height: 15, description: 'A pleasant route on the north face — steady climbing with some interest.' }),
    tradRoute('Naze Wall',             'E2',  '5b', castleNazeMain,  { height: 14, description: 'Technical face climbing on the steeper sections — committing moves.' }),
    tradRoute('Summit Arête',          'E1',  '5a', castleNazeMain,  { height: 16, description: 'Takes the dramatic arête — exposed and exciting with superb views.' }),
  ]) await r({ ...route, buttressId: route.buttress.id });

  // ── Dovestones Edge ───────────────────────────────────────────────────────
  const dovestones = await c('Dovestones Edge', 53.5230, -1.9890, RockType.GRITSTONE,
    'The main gritstone edge above Dovestones Reservoir with routes from Diff to E4. A classic Saddleworth venue with excellent rough gritstone and great moorland views. Popular with local climbers and well worth exploring.',
    'From Dovestones Reservoir car park, take the path up to the edge — 25 min.',
    'Dovestones Reservoir car park, Greenfield (pay & display).', saddleworth);
  const dovesMain = await b('Main Edge', dovestones, 1);
  for (const route of [
    tradRoute('Central Crack',         'VS',  '4b', dovesMain, { height: 14, description: 'The main crack on the edge — solid and well-protected.' }),
    tradRoute('Edge Route',            'HS',  '4b', dovesMain, { height: 12, description: 'Follows the edge line — good holds and pleasant situations.' }),
    tradRoute('Reservoir Wall',        'E1',  '5b', dovesMain, { height: 13, description: 'Technical wall climbing above the reservoir — bold and committing.' }),
    tradRoute('Greenfield Corner',     'S',   '4a', dovesMain, { height: 12, description: 'A pleasant corner route — good introduction to Dovestones.' }),
    tradRoute('Edge Direct',           'E3',  '5c', dovesMain, { height: 14, description: 'Direct up the main face — serious and sustained.' }),
  ]) await r({ ...route, buttressId: route.buttress.id });

  console.log('  ✓ Peak South Gritstone: Laddow Rocks, Wimberry Rocks, Shining Clough, Castle Naze, Dovestones Edge');
}
