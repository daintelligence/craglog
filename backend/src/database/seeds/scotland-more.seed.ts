import { DataSource } from 'typeorm';
import { Region } from '../../modules/crags/entities/region.entity';
import { Crag, RockType } from '../../modules/crags/entities/crag.entity';
import { Buttress } from '../../modules/crags/entities/buttress.entity';
import { Route } from '../../modules/routes/entities/route.entity';
import { findOrCreateRegion, upsertCrag, upsertButtress, upsertRoute, tradRoute, sportRoute, boulderRoute } from './seed-helpers';

export async function seedScotlandMore(ds: DataSource) {
  const regionRepo = ds.getRepository(Region);
  const cragRepo   = ds.getRepository(Crag);
  const buttRepo   = ds.getRepository(Buttress);
  const routeRepo  = ds.getRepository(Route);

  const highlands   = await findOrCreateRegion(regionRepo, { name: 'Scottish Highlands', country: 'Scotland' });
  const central     = await findOrCreateRegion(regionRepo, { name: 'Central Scotland',   country: 'Scotland' });
  const argyll      = await findOrCreateRegion(regionRepo, { name: 'Argyll',             country: 'Scotland' });
  const wester      = await findOrCreateRegion(regionRepo, { name: 'Wester Ross',        country: 'Scotland' });

  async function c(name: string, lat: number, lng: number, rock: RockType, desc: string, approach: string, parking: string, region: any) {
    return upsertCrag(cragRepo, { name, latitude: lat, longitude: lng, rockType: rock, description: desc, approach, parkingInfo: parking, region, regionId: region.id });
  }
  async function b(name: string, crag: Crag, order = 1) { return upsertButtress(buttRepo, { name, crag, cragId: crag.id, sortOrder: order }); }
  async function r(data: Partial<Route>) { return upsertRoute(routeRepo, data); }

  // ── Reiff Sea Cliffs ─────────────────────────────────────────────────────
  const reiff = await c('Reiff', 58.0530, -5.2205, RockType.SANDSTONE,
    'Remote Torridonian sandstone sea stacks and slabs on the Coigach Peninsula. Unique, colourful rock with routes from Severe to E5. A magical and atmospheric venue.',
    'Drive to Reiff village via Achiltibuie road. Follow coastal path to the crags.',
    'Small parking area at Reiff village end (NG 968 143). Limited — come early.', wester);
  const reiffStacks  = await b('The Pinnacles', reiff, 1);
  const reiffSlabs   = await b('Pink Slabs', reiff, 2);
  const reiffNorth   = await b('North Wall', reiff, 3);
  for (const route of [
    tradRoute('Sandstone Cowboy',   'HS',  '4b', reiffSlabs,  { height: 20, description: 'Brilliant slab climbing on perfect pink sandstone — the ideal intro to Reiff.' }),
    tradRoute('The Pale Rider',     'VS',  '4c', reiffSlabs,  { height: 22, description: 'Sustained slab climbing with delicate footwork and great atmosphere.' }),
    tradRoute('Pink Floyd',         'HVS', '5a', reiffNorth,  { height: 25, description: 'One of the finest routes at Reiff — takes the obvious line on the north wall.' }),
    tradRoute('Sea Dancer',         'E1',  '5b', reiffNorth,  { height: 28, description: 'Bold coastal climbing above crashing waves — stunning position.' }),
    tradRoute('Stack Attack',       'E2',  '5c', reiffStacks, { height: 20, description: 'Exciting pinnacle climbing with a dramatic exposed summit.' }),
    tradRoute('Stack Sandwich',     'VS',  '4b', reiffStacks, { height: 15, description: 'A pleasant route on the most accessible of the Reiff stacks.' }),
  ]) await r({ ...route, buttressId: route.buttress.id });

  // ── Diabaig ──────────────────────────────────────────────────────────────
  const diabaig = await c('Diabaig', 57.5760, -5.6510, RockType.GRANITE,
    'Remote Lewisian gneiss crags above Loch Torridon. Excellent technical climbing in a stunning mountain setting. Routes from Severe to E5 on perfect grey rock.',
    'Drive to Lower Diabaig village (NC 800 597). Walk to crags above the village — 30 min.',
    'Village parking at Lower Diabaig (limited — free). Road is single track.', wester);
  const diabMain = await b('Main Crag', diabaig, 1);
  const diabRight = await b('Right Wing', diabaig, 2);
  for (const route of [
    tradRoute('Torridonian Rough', 'VD',  '3c', diabMain,  { height: 30, description: 'Classic intro to Diabaig gneiss — excellent rock and atmosphere.' }),
    tradRoute('Grey Wall',         'VS',  '4c', diabMain,  { height: 35, pitches: 2, description: 'Takes the cleanest section of the main wall — varied and sustained.' }),
    tradRoute('Great Wall',        'HVS', '5a', diabMain,  { height: 40, pitches: 2, description: 'The best route at Diabaig — a magnificent climb on immaculate gneiss.' }),
    tradRoute('Torridon Traverse', 'E2',  '5c', diabRight, { height: 35, pitches: 2, description: 'Technical and exposed — a serious test piece in a remote setting.' }),
    tradRoute('Loch Side Wall',    'S',   '4a', diabMain,  { height: 25, description: 'Easy but atmospheric — with views down Loch Torridon.' }),
  ]) await r({ ...route, buttressId: route.buttress.id });

  // ── Etive Slabs (Beinn Trilleachan) ──────────────────────────────────────
  const etiveSlabs = await c('Beinn Trilleachan Slabs', 56.6190, -5.0560, RockType.GRANITE,
    'The longest granite slabs in Britain — up to 300m of near-featureless friction climbing above Loch Etive. Notoriously bold; small wires in thin cracks. An experience unlike any other.',
    'Park near Loch Etive pier (NN 136 459). Walk up steep hillside — 45 min to base of slabs.',
    'Small car park near Loch Etive jetty (free). Can also park roadside on B845.', argyll);
  const etiveMain  = await b('Central Slabs', etiveSlabs, 1);
  const etiveLeft  = await b('Left Slabs', etiveSlabs, 2);
  for (const route of [
    tradRoute('Spartan Slab',        'VS',  '4c', etiveMain, { height: 300, pitches: 8, description: 'The classic Etive route — eight pitches of bold friction slab in a magnificent setting. One of the great Scottish routes.' }),
    tradRoute('Swastika',            'HVS', '5a', etiveMain, { height: 270, pitches: 7, description: 'The companion to Spartan Slab — slightly harder, equally memorable.' }),
    tradRoute('Hammer',              'E1',  '5b', etiveMain, { height: 250, pitches: 6, description: 'The technical test piece of the central slabs — demanding friction at altitude.' }),
    tradRoute('Agony',               'E2',  '5c', etiveLeft, { height: 200, pitches: 5, description: 'Lives up to its name in damp conditions — superb in the dry.' }),
    tradRoute('Long Wait',           'S',   '4a', etiveLeft, { height: 120, pitches: 3, description: 'The easiest route on the Etive Slabs — still serious for the grade.' }),
  ]) await r({ ...route, buttressId: route.buttress.id });

  // ── Dumbarton Rock (extended routes) ──────────────────────────────────────
  const dumbarton = await upsertCrag(cragRepo, { name: 'Dumbarton Rock', regionId: central.id });
  const dumbMain = await upsertButtress(buttRepo, { name: 'Main Wall', crag: dumbarton, cragId: dumbarton.id, sortOrder: 1 });
  for (const route of [
    sportRoute('Requiem',        '8c',  dumbMain, { height: 12, description: 'Dave MacLeod\'s landmark 8c — one of the hardest routes in Britain. Tiny edges and powerful moves on a steep wall above the Clyde.' }),
    sportRoute('Rhapsody',       '9a',  dumbMain, { height: 12, description: 'MacLeod\'s world-class 9a — the hardest route in Scotland. An extraordinary link-up through Requiem and beyond.' }),
    sportRoute('The Ideology',   '8b+', dumbMain, { height: 14, description: 'Technical and sustained on perfect basalt — excellent climbing at a world-class venue.' }),
    sportRoute('Birth of a Legend','8a', dumbMain, { height: 15, description: 'A landmark Scottish sport route — long and sustained at a venue with a special atmosphere.' }),
    sportRoute('Crying Game',    '7c+', dumbMain, { height: 12, description: 'Accessible by Dumbarton standards — excellent technical climbing on the basalt.' }),
    sportRoute('Chemin de Fer',  '7a',  dumbMain, { height: 14, description: 'Classic intro to Dumbarton — sustained but manageable for the stronger sport climber.' }),
  ]) await r({ ...route, buttressId: route.buttress.id });

  // ── Glenmore Boulders (Cairngorms) ───────────────────────────────────────
  const glenmore = await c('Glenmore Boulders', 57.1660, -3.6950, RockType.GRANITE,
    'An excellent collection of granite boulders in the Glenmore Forest near Aviemore. Good variety of problems from Font 3 to Font 8a+ on perfect rough granite.',
    'Park at Glenmore Lodge visitor centre (NH 987 097). 10 min walk into forest.',
    'Glenmore Lodge car park (small charge). Alternatively Glenmore Forest car park.', highlands);
  const glenmoreMain = await b('Main Boulders', glenmore, 1);
  const { ClimbingType, GradeSystem } = await import('../../modules/routes/entities/route.entity');
  for (const route of [
    boulderRoute('Sloper Traverse', '5',  glenmoreMain, { height: 3, description: 'Classic low traverse — great for warming up on the granite.' }),
    boulderRoute('Crimson Dyno',    '6B', glenmoreMain, { height: 4, description: 'The most popular highball — a powerful sequence on a clean granite face.' }),
    boulderRoute('Forest Slab',     '5+', glenmoreMain, { height: 4, description: 'Friction slab problem on rough Cairngorm granite — excellent footwork training.' }),
    boulderRoute('Pine Arête',      '6C', glenmoreMain, { height: 4, description: 'Technical arête with a committing top-out in the forest setting.' }),
    boulderRoute('The Circuit',     '7A', glenmoreMain, { height: 4, description: 'The area classic — sustained powerful problem on good holds.' }),
  ]) await r({ ...route, buttressId: route.buttress.id });

  // ── Carn Dearg Mor (Ben Nevis area) ─────────────────────────────────────
  const carnDearg = await c('Carn Dearg Buttress', 56.7971, -5.0040, RockType.GRANITE,
    'The great buttress on Ben Nevis — massive, serious, and spectacular. Routes up to 350m on steep sustained rock. A true Scottish mountaineering objective.',
    'From Ben Nevis car park, ascend the tourist path then traverse into Coire na Ciste — 2.5hr.',
    'Ben Nevis Visitor Centre car park, Fort William (pay & display).', highlands);
  const carnMain = await b('Main Buttress', carnDearg, 1);
  for (const route of [
    tradRoute('Centurion',        'E1', '5b', carnMain, { height: 350, pitches: 10, description: 'One of the great Nevis climbs — a sustained mountaineering route of the highest quality.' }),
    tradRoute('The Bullroar',     'E2', '5c', carnMain, { height: 300, pitches: 8, description: 'Technical face climbing at altitude — a serious and magnificent undertaking.' }),
    tradRoute('Carn Dearg Buttress Route', 'HVS', '5a', carnMain, { height: 300, pitches: 9, description: 'The classic route up the great buttress — varied and exposed.' }),
  ]) await r({ ...route, buttressId: route.buttress.id });

  console.log('  ✓ Scotland more: Reiff, Diabaig, Etive Slabs, Dumbarton extended, Glenmore Boulders, Carn Dearg');
}
