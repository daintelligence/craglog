import { DataSource } from 'typeorm';
import { Region } from '../../modules/crags/entities/region.entity';
import { Crag, RockType } from '../../modules/crags/entities/crag.entity';
import { Buttress } from '../../modules/crags/entities/buttress.entity';
import { Route } from '../../modules/routes/entities/route.entity';
import { findOrCreateRegion, upsertCrag, upsertButtress, upsertRoute, tradRoute, sportRoute } from './seed-helpers';

export async function seedNorthernIreland(ds: DataSource) {
  const regionRepo = ds.getRepository(Region);
  const cragRepo   = ds.getRepository(Crag);
  const buttRepo   = ds.getRepository(Buttress);
  const routeRepo  = ds.getRepository(Route);

  const antrim = await findOrCreateRegion(regionRepo, { name: 'County Antrim', country: 'Northern Ireland' });
  const down   = await findOrCreateRegion(regionRepo, { name: 'County Down',   country: 'Northern Ireland' });
  const donegal = await findOrCreateRegion(regionRepo, { name: 'County Donegal', country: 'Northern Ireland' });

  async function c(name: string, lat: number, lng: number, rock: RockType, desc: string, approach: string, parking: string, region: any) {
    return upsertCrag(cragRepo, { name, latitude: lat, longitude: lng, rockType: rock, description: desc, approach, parkingInfo: parking, region, regionId: region.id });
  }
  async function b(name: string, crag: Crag, order = 1) { return upsertButtress(buttRepo, { name, crag, cragId: crag.id, sortOrder: order }); }
  async function r(data: Partial<Route>) { return upsertRoute(routeRepo, data); }

  // ── Fair Head ────────────────────────────────────────────────────────────
  const fairHead = await c('Fair Head', 55.2160, -6.1580, RockType.BASALT,
    'One of the most dramatic sea cliffs in the British Isles — 100m columnar basalt columns plunging into the sea, with views to Rathlin Island and the Scottish coast. Serious trad climbing requiring composure.',
    'Park at Fair Head car park near Ballycastle (D145 429). 20 min walk to cliff top.',
    'Fair Head car park, Murlough Bay road (free). Also car park at Murlough Bay below.', antrim);
  const fairMain   = await b('Main Face', fairHead, 1);
  const fairLeft   = await b('Left Section', fairHead, 2);
  const fairRight  = await b('Right Section', fairHead, 3);
  for (const route of [
    tradRoute('Colosseum',         'VS',  '4c', fairMain,  { height: 100, pitches: 4, description: 'The most celebrated Fair Head route — four pitches up the columnar basalt columns. Sustained and spectacular.' }),
    tradRoute('Basalt Pillars',    'HS',  '4b', fairMain,  { height: 90,  pitches: 3, description: 'A classic route following the main pillar system — excellent holds on the columnar basalt.' }),
    tradRoute('Giant\'s Organ',    'HVS', '5a', fairMain,  { height: 95,  pitches: 4, description: 'Takes the central pillar in fine style — one of the best HVS routes in Ireland.' }),
    tradRoute('Ards View',         'E1',  '5b', fairRight, { height: 100, pitches: 3, description: 'Bold face climbing between the pillars — serious and committing.' }),
    tradRoute('Rathlin Crack',     'E2',  '5c', fairLeft,  { height: 80,  pitches: 3, description: 'The hardest of the Fair Head trad lines — technical and sustained.' }),
    tradRoute('Grey Man\'s Path',  'M',   '2',  fairMain,  { height: 40,  pitches: 2, description: 'Easy scramble used as the standard descent from Fair Head — take care on the basalt.' }),
  ]) await r({ ...route, buttressId: route.buttress.id });

  // ── Binnian ──────────────────────────────────────────────────────────────
  const binnian = await c('Binnian', 54.1010, -5.9710, RockType.GRANITE,
    'Excellent granite on the Mourne Mountains — some of the finest trad climbing in Ireland. Perfect coarse Mourne granite giving superb friction and crack routes in a beautiful mountain setting.',
    'Park at Carrick Little car park (J302 249). Walk via Silent Valley or from Annalong — 60 min.',
    'Carrick Little car park off Kilkeel Road (free). Alternative approach from Annalong.', down);
  const binnianMain  = await b('Main Buttress', binnian, 1);
  const binnianNorth = await b('North Tor', binnian, 2);
  for (const route of [
    tradRoute('The Arête',         'HS',  '4b', binnianMain,  { height: 45, pitches: 2, description: 'The classic Mourne route — a beautiful arête on perfect granite.' }),
    tradRoute('Boomerang',         'VS',  '4c', binnianMain,  { height: 50, pitches: 2, description: 'Excellent crack and face climbing — one of the most popular routes in the Mournes.' }),
    tradRoute('Binnian Direct',    'HVS', '5a', binnianMain,  { height: 55, pitches: 3, description: 'Takes the crest of the buttress directly — varied and sustained on perfect granite.' }),
    tradRoute('North Face Route',  'VS',  '4c', binnianNorth, { height: 40, pitches: 2, description: 'Good climbing on the north side — less polished than the main routes.' }),
    tradRoute('Mourne Magic',      'E1',  '5b', binnianMain,  { height: 50, pitches: 2, description: 'Technical face climbing — the hardest of the popular Binnian routes.' }),
  ]) await r({ ...route, buttressId: route.buttress.id });

  // ── Binnian South Tor ─────────────────────────────────────────────────────
  const binnianSouth = await c('Binnian South Tor', 54.0960, -5.9730, RockType.GRANITE,
    'The southern rocks of Binnian giving shorter, more accessible problems and routes. Great for a half day. Excellent granite bouldering and short routes.',
    'Same approach as Binnian — the South Tor is the first section of rock reached from below.',
    'Carrick Little car park (free).', down);
  const binSouthMain = await b('South Face', binnianSouth, 1);
  for (const route of [
    tradRoute('South Tor Crack',  'S',   '4a', binSouthMain, { height: 15, description: 'A classic short crack on perfect Mourne granite — great for warming up.' }),
    tradRoute('Slap Happy',       'VS',  '4c', binSouthMain, { height: 18, description: 'Technical face climbing with fine holds — enjoyable and well protected.' }),
    tradRoute('Mourne Slab',      'HS',  '4b', binSouthMain, { height: 20, description: 'Friction slab climbing on perfect rough granite — beautiful setting.' }),
  ]) await r({ ...route, buttressId: route.buttress.id });

  // ── Malin Head ────────────────────────────────────────────────────────────
  const malinHead = await c('Malin Head', 55.3770, -7.3960, RockType.QUARTZITE,
    'The most northerly point of Ireland — dramatic quartzite sea cliffs with routes from S to E4. A remote and atmospheric venue with outstanding seabird life. Often windy.',
    'Drive to Malin Head village, Inishowen Peninsula. Walk to Band Strand — 20 min.',
    'Car park at Malin Head village (free). Follow road signs to Band Strand.', donegal);
  const malinMain = await b('The Cliffs', malinHead, 1);
  for (const route of [
    tradRoute('Northernmost',    'VS',  '4c', malinMain, { height: 35, description: 'Takes the most northerly line in Ireland — atmospheric and well-positioned above the Atlantic.' }),
    tradRoute('Banba\'s Crown',  'HVS', '5a', malinMain, { height: 40, description: 'Named after the ancient Irish name for Ireland — a serious and committing line.' }),
    tradRoute('Band Strand',     'HS',  '4b', malinMain, { height: 30, description: 'A pleasant route with good holds — the standard introduction to Malin Head climbing.' }),
    tradRoute('Atlantic Wall',   'E2',  '5b', malinMain, { height: 38, description: 'Bold face climbing above the open Atlantic — serious and committing.' }),
  ]) await r({ ...route, buttressId: route.buttress.id });

  console.log('  ✓ Northern Ireland: Fair Head, Binnian, Binnian South Tor, Malin Head');
}
