import { DataSource } from 'typeorm';
import { Region } from '../../modules/crags/entities/region.entity';
import { Crag, RockType } from '../../modules/crags/entities/crag.entity';
import { Buttress } from '../../modules/crags/entities/buttress.entity';
import { Route } from '../../modules/routes/entities/route.entity';
import { findOrCreateRegion, upsertCrag, upsertButtress, upsertRoute, tradRoute, sportRoute } from './seed-helpers';

export async function seedLakeDistrictMore(ds: DataSource) {
  const regionRepo = ds.getRepository(Region);
  const cragRepo   = ds.getRepository(Crag);
  const buttRepo   = ds.getRepository(Buttress);
  const routeRepo  = ds.getRepository(Route);

  const lake = await findOrCreateRegion(regionRepo, { name: 'Lake District', country: 'England' });

  async function c(name: string, lat: number, lng: number, rock: RockType, desc: string, approach: string, parking: string) {
    return upsertCrag(cragRepo, { name, latitude: lat, longitude: lng, rockType: rock, description: desc, approach, parkingInfo: parking, region: lake, regionId: lake.id });
  }
  async function b(name: string, crag: Crag, order = 1) {
    return upsertButtress(buttRepo, { name, crag, cragId: crag.id, sortOrder: order });
  }
  async function r(data: Partial<Route>) { return upsertRoute(routeRepo, data); }

  // ── Grey Crag, Birkness ──────────────────────────────────────────────────
  const greyCrag = await c('Grey Crag', 54.5368, -3.2197, RockType.OTHER,
    'A superb Lakeland crag above Buttermere with an excellent selection of middle-grade trad routes on perfect rhyolite. One of the finest venues in the Western Fells.',
    'Park at Gatesgarth Farm (NY 194 150). Follow the path up Birkness Combe — 45 min.',
    'Gatesgarth Farm car park (honesty box). Limited roadside parking on the B5289.');
  const greyMain  = await b('Harrow Buttress', greyCrag, 1);
  const greyEast  = await b('East Buttress', greyCrag, 2);
  for (const route of [
    tradRoute('Harrow Way',        'VD',  '3c', greyMain,  { height: 35, pitches: 2, description: 'The classic easy route — excellent rock and a wonderful position above Buttermere.' }),
    tradRoute('Oxford and Cambridge Direct', 'VS', '4c', greyMain, { height: 40, pitches: 2, description: 'A Buttermere classic — sustained and varied, ideal for the confident VS leader.' }),
    tradRoute('Rib and Slab',      'HS',  '4b', greyMain,  { height: 38, pitches: 2, description: 'Excellent clean rock with interesting moves throughout.' }),
    tradRoute('Mitre Route',       'HVS', '5a', greyEast,  { height: 45, pitches: 2, description: 'One of the finest HVS routes in the Lakes — bold wall climbing with superb views.' }),
    tradRoute('Fortiter',          'E1',  '5b', greyEast,  { height: 42, pitches: 2, description: 'Technical face climbing on the East Buttress — a Lakeland test piece.' }),
    tradRoute('Slabs West',        'S',   '4a', greyMain,  { height: 30, pitches: 2, description: 'A pleasant introductory route with good holds throughout.' }),
  ]) await r({ ...route, buttressId: route.buttress.id });

  // ── Raven Crag, Thirlmere ────────────────────────────────────────────────
  const ravenThirlmere = await c('Raven Crag, Thirlmere', 54.5546, -3.0555, RockType.OTHER,
    'A big, dark crag of solid rhyolite above Thirlmere. Excellent selection of trad routes from Severe to E4. The crag faces west and stays dry in light rain.',
    'Park in the small lay-by on the A591 at NY 317 183. Follow path through forest — 20 min.',
    'Roadside lay-by on A591, south of Thirlspot (free).');
  const ravenTMain  = await b('Main Wall', ravenThirlmere, 1);
  const ravenTRight = await b('Right Section', ravenThirlmere, 2);
  for (const route of [
    tradRoute('Corvus',          'VD',  '3c', ravenTMain,  { height: 55, pitches: 3, description: 'The popular classic — a magnificent outing on a great crag.' }),
    tradRoute('Raven Traverse',  'VS',  '4c', ravenTMain,  { height: 50, pitches: 2, description: 'A diagonal traverse taking in the best of the main wall.' }),
    tradRoute('Trilogy',         'HVS', '5a', ravenTMain,  { height: 60, pitches: 3, description: 'Three sustained pitches — one of the best routes at this grade in the Lakes.' }),
    tradRoute('Thirlmere Eliminate', 'E1', '5b', ravenTRight, { height: 50, pitches: 2, description: 'Sustained and exposed — takes the cleanest line on the right section.' }),
    tradRoute('Juniper Buttress', 'S',  '4a', ravenTMain,  { height: 45, pitches: 2, description: 'Excellent intro route on good holds — great for building confidence.' }),
    tradRoute('Possie',          'E2',  '5c', ravenTRight, { height: 50, pitches: 2, description: 'Sustained technical climbing — one of the harder routes at Raven Crag.' }),
  ]) await r({ ...route, buttressId: route.buttress.id });

  // ── Chapel Head Scar ─────────────────────────────────────────────────────
  const chapelHead = await c('Chapel Head Scar', 54.3391, -2.8843, RockType.LIMESTONE,
    'An excellent limestone sport crag in the Whitbarrow area. Steep walls and roofs with single-pitch routes from 6a to 8a. The best sport venue in the southern Lake District.',
    'Park near Witherslack church (SD 439 852). Cross fields via footpath — 15 min.',
    'Limited roadside parking near Witherslack (free). Respect local residents.');
  const chapelMain = await b('Main Wall', chapelHead, 1);
  const chapelLeft = await b('Left Wing', chapelHead, 2);
  for (const route of [
    sportRoute('Primal Scream',  '7b',  chapelMain, { height: 18, description: 'The most celebrated route at Chapel Head — steep, sustained, and brilliant.' }),
    sportRoute('Carnage',        '7a+', chapelMain, { height: 15, description: 'Technical wall climbing to a powerful crux. One of the best 7a+s in the North.' }),
    sportRoute('Revelation',     '7c',  chapelMain, { height: 20, description: 'Powerful moves through the main roof — a serious undertaking.' }),
    sportRoute('Resurrection',   '6c+', chapelMain, { height: 16, description: 'Popular warm-up — technical and sustained with a fine finish.' }),
    sportRoute('Baptism',        '6b',  chapelLeft, { height: 14, description: 'The classic intro route to the scar — well protected and enjoyable.' }),
    sportRoute('Purgatory',      '6c',  chapelLeft, { height: 15, description: 'Good moves on good rock — an excellent mid-grade option.' }),
    sportRoute('Original Sin',   '8a',  chapelMain, { height: 20, description: 'The hardest route at Chapel Head — roof sequence requiring full commitment.' }),
  ]) await r({ ...route, buttressId: route.buttress.id });

  // ── Dow Crag ─────────────────────────────────────────────────────────────
  const dowCrag = await c('Dow Crag', 54.3690, -3.1285, RockType.OTHER,
    'One of the great Lakeland crags — a dark, impressive face above Goats Water with five main buttresses giving classics from Moderate to E5. A serious mountain environment.',
    'Park at Walna Scar Road, Coniston (SD 289 974). Walk via Goats Water — 90 min.',
    'Walna Scar road-end car park, Coniston (small fee).');
  const dowA    = await b('A Buttress', dowCrag, 1);
  const dowB    = await b('B Buttress', dowCrag, 2);
  const dowC    = await b('C Buttress', dowCrag, 3);
  for (const route of [
    tradRoute('Ordinary Route',  'M',   '1',  dowB, { height: 120, pitches: 4, description: 'The original classic — easy but atmospheric scramble/climb on superb rock.' }),
    tradRoute('Murray\'s Route', 'VD',  '3c', dowB, { height: 130, pitches: 4, description: 'A magnificent mountaineering route. Long, sustained and superbly situated.' }),
    tradRoute('Eliminate A',     'VS',  '4c', dowA, { height: 140, pitches: 5, description: 'A Dow masterpiece — takes the best line on the finest buttress.' }),
    tradRoute('Giant\'s Crawl',  'HVS', '5a', dowA, { height: 130, pitches: 4, description: 'Bold, sustained climbing on the cleanest rock at Dow — a great route.' }),
    tradRoute('Leopard\'s Crawl','E2',  '5c', dowC, { height: 100, pitches: 3, description: 'Technical and committing — the hardest of the Dow crawl routes.' }),
    tradRoute('Easy Terrace',    'M',   '2',  dowB, { height: 90,  pitches: 3, description: 'A pleasant mountain scramble/walk used as descent.' }),
  ]) await r({ ...route, buttressId: route.buttress.id });

  // ── St Bees Head ─────────────────────────────────────────────────────────
  const stBees = await c('St Bees Head', 54.5120, -3.6270, RockType.SANDSTONE,
    'Red Triassic sandstone sea cliffs on the Cumbrian coast. The most westerly point of England — remote and spectacular. Routes tend to be bold on the soft rock.',
    'Park in St Bees village (NX 969 118). Walk coast path north to the head — 30 min.',
    'St Bees village car park (pay & display). Alternatively roadside near the beach.');
  const stBeesMain = await b('Main Cliff', stBees, 1);
  for (const route of [
    tradRoute('South Stack Arete',  'HS',  '4b', stBeesMain, { height: 25, description: 'The best line on the southern headland — good holds and an airy top.' }),
    tradRoute('Red Pillar',         'VS',  '5a', stBeesMain, { height: 30, description: 'Technical sandstone climbing — requires care on the soft rock.' }),
    tradRoute('Freebird',           'HVS', '5a', stBeesMain, { height: 35, description: 'Bold climbing above the waves — outstanding coastal atmosphere.' }),
    tradRoute('The Cumbrian',       'E1',  '5b', stBeesMain, { height: 30, description: 'The serious test piece at St Bees — bold face climbing on the headland.' }),
  ]) await r({ ...route, buttressId: route.buttress.id });

  // ── Buckbarrow ───────────────────────────────────────────────────────────
  const buckbarrow = await c('Buckbarrow', 54.4212, -3.3612, RockType.GRANITE,
    'A solid granite crag above Wastwater offering excellent trad climbing with good protection. Popular with those based at the Wasdale Head campsite. Dries quickly.',
    'Park at Greendale car park (NY 143 058). 20 min walk up the hillside.',
    'Greendale car park on Nether Wasdale road (free).');
  const buckMain = await b('Central Buttress', buckbarrow, 1);
  const buckNorth = await b('North Buttress', buckbarrow, 2);
  for (const route of [
    tradRoute('Grooved Arête',   'VD',  '3c', buckMain,  { height: 25, description: 'Clean granite arête — a lovely route on perfect rock.' }),
    tradRoute('Resurrection',    'VS',  '4c', buckMain,  { height: 30, description: 'The finest VS at Buckbarrow — takes a great line with varied climbing.' }),
    tradRoute('Iron Curtain',    'HVS', '5a', buckNorth, { height: 28, description: 'Sustained crack climbing on good granite.' }),
    tradRoute('Thieves\' Corner','E1',  '5b', buckNorth, { height: 25, description: 'A technical corner with a fingery crux.' }),
  ]) await r({ ...route, buttressId: route.buttress.id });

  console.log('  ✓ Lake District more: Grey Crag, Raven Crag Thirlmere, Chapel Head Scar, Dow Crag, St Bees Head, Buckbarrow');
}
