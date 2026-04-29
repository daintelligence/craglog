import { DataSource } from 'typeorm';
import { Region } from '../../modules/crags/entities/region.entity';
import { Crag, RockType } from '../../modules/crags/entities/crag.entity';
import { Buttress } from '../../modules/crags/entities/buttress.entity';
import { Route } from '../../modules/routes/entities/route.entity';
import { findOrCreateRegion, upsertCrag, upsertButtress, upsertRoute, tradRoute } from './seed-helpers';

export async function seedIsleOfMan(ds: DataSource) {
  const regionRepo = ds.getRepository(Region);
  const cragRepo   = ds.getRepository(Crag);
  const buttRepo   = ds.getRepository(Buttress);
  const routeRepo  = ds.getRepository(Route);

  const iom = await findOrCreateRegion(regionRepo, { name: 'Isle of Man', country: 'England' });

  async function c(name: string, lat: number, lng: number, rock: RockType, desc: string, approach: string, parking: string, region: any) {
    return upsertCrag(cragRepo, { name, latitude: lat, longitude: lng, rockType: rock, description: desc, approach, parkingInfo: parking, region, regionId: region.id });
  }
  async function b(name: string, crag: Crag, order = 1) { return upsertButtress(buttRepo, { name, crag, cragId: crag.id, sortOrder: order }); }
  async function r(data: Partial<Route>) { return upsertRoute(routeRepo, data); }

  // ── Spanish Head ──────────────────────────────────────────────────────────
  const spanishHead = await c('Spanish Head', 54.0490, -4.8362, RockType.OTHER,
    'The dramatic southern headland of the Isle of Man — a series of stacks and zawn give routes from HS to E4 on rough Manx rock (greywacke and slate). The stacks are a distinctive feature and some are only accessible at low tide. Wonderful sea views to Ireland, England and Scotland on a clear day.',
    'From Port Erin, follow the coastal path south to Spanish Head — 30 min. Some routes require tidal awareness.',
    'Port Erin seafront car park (pay & display). Spanish Head is a 30 min coastal walk.', iom);
  const spanishMain  = await b('Main Headland', spanishHead, 1);
  const spanishStack = await b('Spanish Head Stack', spanishHead, 2);

  for (const route of [
    tradRoute('Spanish Headland',     'VS',  '4c', spanishMain,  { height: 35, description: 'The main headland route — a fine outing on rough Manx rock above the Irish Sea with views to three countries.' }),
    tradRoute('Stack Route',          'HVS', '5a', spanishStack, { height: 30, description: 'Gains the stack by a tidal abseil — atmospheric and adventurous in the southern Manx sea.' }),
    tradRoute('Southern Route',       'HS',  '4b', spanishMain,  { height: 30, description: 'A pleasant accessible route on the southern headland — good holds on rough Manx greywacke.' }),
    tradRoute('Head Direct',          'E2',  '5b', spanishMain,  { height: 35, description: 'A bold direct route on the headland — technical on compact Manx rock.' }),
    tradRoute('Irish Sea Wall',       'E1',  '5b', spanishMain,  { height: 30, description: 'A fine route with extraordinary multi-country views on a clear day.' }),
  ]) await r({ ...route, buttressId: route.buttress.id });

  // ── Maughold Head ─────────────────────────────────────────────────────────
  const maughold = await c('Maughold Head', 54.2972, -4.3095, RockType.OTHER,
    'A fine sea cliff on the north-eastern tip of the Isle of Man giving routes from VS to E3 on rough Manx rock. The lighthouse adds atmosphere. An excellent venue with varied climbing on genuinely different rock from anything on the mainland. The Isle of Man\'s best all-round climbing venue.',
    'From Ramsey, drive to Maughold village and follow the coastal path to the headland — 20 min.',
    'Maughold village roadside (free). Small and quiet village.', iom);
  const maughdoldMain  = await b('Main Cliff', maughold, 1);
  const maughdoldRight = await b('Right Sector', maughold, 2);

  for (const route of [
    tradRoute('Lighthouse Arête',     'VS',  '4c', maughdoldMain,  { height: 30, description: 'Takes the arête near the Maughold lighthouse — excellent rough Manx rock in a fine position.' }),
    tradRoute('Head Wall',            'HVS', '5a', maughdoldMain,  { height: 28, description: 'A fine wall route on the main headland — technical and well positioned above the sea.' }),
    tradRoute('Right Sector Route',   'S',   '4a', maughdoldRight, { height: 25, description: 'A pleasant accessible route on the right sector — good introduction to Maughold.' }),
    tradRoute('Maughold Direct',      'E2',  '5c', maughdoldMain,  { height: 30, description: 'A bold direct route — technical on compact Manx rock above the northern sea.' }),
    tradRoute('Ramsey Route',         'HS',  '4b', maughdoldRight, { height: 25, description: 'A fine moderate with views over Ramsey Bay — good holds on the right sector.' }),
  ]) await r({ ...route, buttressId: route.buttress.id });

  // ── Port St Mary ──────────────────────────────────────────────────────────
  const portStMary = await c('Port St Mary Cliffs', 54.0726, -4.7367, RockType.OTHER,
    'Sea cliffs on the south Manx coast near Port St Mary giving routes from VS to E3 on compact Manx rock. A pleasant coastal venue combining good climbing with an attractive harbour town nearby. The rock is varied — some sections give excellent friction slab routes.',
    'From Port St Mary harbour, follow the coastal path east to the cliffs — 15 min.',
    'Port St Mary harbour car park (free).', iom);
  const portMain = await b('Main Cliff', portStMary, 1);

  for (const route of [
    tradRoute('Port Route',           'VS',  '4c', portMain, { height: 22, description: 'The main Port St Mary route — a good natural line on compact Manx rock.' }),
    tradRoute('Harbour Wall',         'HVS', '5a', portMain, { height: 20, description: 'A technical wall route above the southern harbour — sustained on compact rock.' }),
    tradRoute('South Manx Slab',      'HS',  '4b', portMain, { height: 20, description: 'A pleasant slab route — friction on smooth Manx rock with sea views.' }),
    tradRoute('St Mary\'s Route',     'E1',  '5b', portMain, { height: 22, description: 'A bold route on the main cliff — committing above the southern Manx sea.' }),
  ]) await r({ ...route, buttressId: route.buttress.id });

  // ── Niarbyl ───────────────────────────────────────────────────────────────
  const niarbyl = await c('Niarbyl', 54.1418, -4.7995, RockType.OTHER,
    'A beautiful and geological significant coastal area on the west of the Isle of Man — the visible fault line at Niarbyl marks the suture of the ancient continents. Sea cliffs give routes from VS to E3 on varied Manx rock above clear Atlantic water. A spectacular setting.',
    'From the car park at Niarbyl Bay on the west coast road, follow the coastal path to the cliffs — 5 min.',
    'Niarbyl Bay car park (Manx National Heritage, small fee in season).', iom);
  const niarbylMain = await b('Niarbyl Cliffs', niarbyl, 1);

  for (const route of [
    tradRoute('Fault Line',           'VS',  '4c', niarbylMain, { height: 25, description: 'Takes a line near the famous geological fault — a unique setting for a climbing route.' }),
    tradRoute('Niarbyl Wall',         'HVS', '5a', niarbylMain, { height: 22, description: 'A fine wall above the Atlantic — varied Manx rock in an exceptional geological setting.' }),
    tradRoute('West Coast Route',     'S',   '4a', niarbylMain, { height: 20, description: 'A pleasant route on the west cliffs — good holds with views to Ireland.' }),
    tradRoute('Continental Drift',    'E2',  '5b', niarbylMain, { height: 25, description: 'A bold route near the ancient fault line — atmospheric and serious.' }),
  ]) await r({ ...route, buttressId: route.buttress.id });

  console.log('  ✓ Isle of Man: Spanish Head, Maughold Head, Port St Mary, Niarbyl');
}
