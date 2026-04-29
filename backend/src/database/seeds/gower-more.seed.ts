import { DataSource } from 'typeorm';
import { Region } from '../../modules/crags/entities/region.entity';
import { Crag, RockType } from '../../modules/crags/entities/crag.entity';
import { Buttress } from '../../modules/crags/entities/buttress.entity';
import { Route } from '../../modules/routes/entities/route.entity';
import { findOrCreateRegion, upsertCrag, upsertButtress, upsertRoute, tradRoute } from './seed-helpers';

export async function seedGowerMore(ds: DataSource) {
  const regionRepo = ds.getRepository(Region);
  const cragRepo   = ds.getRepository(Crag);
  const buttRepo   = ds.getRepository(Buttress);
  const routeRepo  = ds.getRepository(Route);

  const gower = await findOrCreateRegion(regionRepo, { name: 'Gower Peninsula', country: 'Wales' });

  async function c(name: string, lat: number, lng: number, rock: RockType, desc: string, approach: string, parking: string, region: any) {
    return upsertCrag(cragRepo, { name, latitude: lat, longitude: lng, rockType: rock, description: desc, approach, parkingInfo: parking, region, regionId: region.id });
  }
  async function b(name: string, crag: Crag, order = 1) { return upsertButtress(buttRepo, { name, crag, cragId: crag.id, sortOrder: order }); }
  async function r(data: Partial<Route>) { return upsertRoute(routeRepo, data); }

  // ── Fall Bay ──────────────────────────────────────────────────────────────
  const fallBay = await c('Fall Bay', 51.5530, -4.2455, RockType.LIMESTONE,
    'A secluded south Gower bay with routes from VS to E4 on excellent limestone. The bay is only accessible on foot and has a wonderfully remote feel for a venue so close to Swansea. The routes are generally well-protected cracks and walls.',
    'From Rhossili car park, follow the coastal path east to Fall Bay — 30 min. No road access to the bay itself.',
    'Rhossili National Trust car park (pay & display). Very busy in summer.', gower);
  const fallMain  = await b('Main Wall', fallBay, 1);
  const fallRight = await b('Right Zawn', fallBay, 2);
  for (const route of [
    tradRoute('Fall Bay Crack',        'VS',  '4c', fallMain,  { height: 22, description: 'The main crack route — takes the obvious line on good Gower limestone.' }),
    tradRoute('Bay Wall',              'HVS', '5a', fallMain,  { height: 20, description: 'A fine wall route — sustained on compact limestone.' }),
    tradRoute('Secluded Route',        'HS',  '4b', fallMain,  { height: 18, description: 'A pleasant route in the secluded bay setting — good holds.' }),
    tradRoute('Zawn Route',            'E2',  '5c', fallRight, { height: 20, description: 'Technical climbing in the right zawn — committing and serious.' }),
    tradRoute('Bay Direct',            'E1',  '5b', fallMain,  { height: 22, description: 'A direct route up the main wall — well protected.' }),
  ]) await r({ ...route, buttressId: route.buttress.id });

  // ── Boiler Slab ───────────────────────────────────────────────────────────
  const boilerSlab = await c('Boiler Slab', 51.5662, -4.2140, RockType.LIMESTONE,
    'A classic Gower slab and wall venue near Overton with routes from HS to E3 on good quality limestone. The slab is a popular intermediate climbing destination — friction routes on clean rock with fine coastal views.',
    'From Overton village, take the footpath to the coastal path — 15 min to the crag.',
    'Overton village roadside parking (free, limited) or Port Eynon car park (pay & display).', gower);
  const boilerMain  = await b('Main Slab', boilerSlab, 1);
  const boilerRight = await b('Right Wall', boilerSlab, 2);
  for (const route of [
    tradRoute('Boiler Crack',          'HS',  '4b', boilerMain,  { height: 18, description: 'The main crack route — a good intro to the slab area with solid gear.' }),
    tradRoute('Slab Route',            'VS',  '4b', boilerMain,  { height: 18, description: 'A pleasant slab route — friction and balance on compact limestone.' }),
    tradRoute('Right Wall',            'HVS', '5a', boilerRight, { height: 15, description: 'Technical wall climbing on the right side — small holds.' }),
    tradRoute('Boiler Direct',         'E1',  '5b', boilerMain,  { height: 18, description: 'A more direct line up the main slab — requires precise footwork.' }),
  ]) await r({ ...route, buttressId: route.buttress.id });

  // ── Three Cliffs Bay ──────────────────────────────────────────────────────
  const threeCliffs = await c('Three Cliffs Bay', 51.5698, -4.0955, RockType.LIMESTONE,
    'One of the most scenic bays in Wales — the three limestone cliffs give accessible routes from VD to E2 with stunning views. Not a major climbing venue, but the setting is unforgettable and the routes enjoyable. A great introduction to outdoor climbing.',
    'From Southgate or Pennard, follow footpaths down to the bay — 20-30 min. The bay itself is pedestrian only.',
    'Southgate car park or Pennard village roadside (free).', gower);
  const threeMain = await b('Main Cliff', threeCliffs, 1);
  for (const route of [
    tradRoute('Three Cliffs Crack',    'VS',  '4c', threeMain, { height: 20, description: 'Takes the main crack on the central cliff — good limestone in a spectacular setting.' }),
    tradRoute('Bay Route',             'VD',  '3c', threeMain, { height: 18, description: 'The standard route — accessible and enjoyable with outstanding views.' }),
    tradRoute('Cliff Top',             'HVS', '5a', threeMain, { height: 20, description: 'A harder route up the main cliff — technical and exposed.' }),
    tradRoute('Pennard Wall',          'E1',  '5b', threeMain, { height: 18, description: 'A bolder route requiring commitment — good climbing in the stunning bay.' }),
  ]) await r({ ...route, buttressId: route.buttress.id });

  // ── Lewes Castle Rocks ────────────────────────────────────────────────────
  const lewesCastle = await c('Lewes Castle Rocks', 51.5455, -4.1580, RockType.LIMESTONE,
    'A series of limestone buttresses near Port Eynon with routes from VS to E4 in a less-visited corner of Gower. The rock is typical Gower limestone — compact and well-featured. A good escape from the crowds at the more popular Gower venues.',
    'From Port Eynon, follow the coastal path west towards Overton — 20 min to the rocks.',
    'Port Eynon car park (pay & display) on the seafront.', gower);
  const lewesMain  = await b('Main Buttress', lewesCastle, 1);
  const lewesRight = await b('Right Wing', lewesCastle, 2);
  for (const route of [
    tradRoute('Castle Crack',          'VS',  '4c', lewesMain,  { height: 22, description: 'A good crack route on the main buttress — natural gear and varied moves.' }),
    tradRoute('Lewes Wall',            'HVS', '5a', lewesMain,  { height: 20, description: 'Takes the wall above the crack — technical and sustained.' }),
    tradRoute('Right Wing Route',      'E2',  '5b', lewesRight, { height: 18, description: 'A bold route on the right wing — small holds requiring precise technique.' }),
    tradRoute('Gower Classic',         'S',   '4a', lewesMain,  { height: 20, description: 'A pleasant outing on good Gower limestone — a nice day out from the main venues.' }),
    tradRoute('Port Eynon Route',      'E1',  '5b', lewesMain,  { height: 20, description: 'A fine route with views over Port Eynon Bay.' }),
  ]) await r({ ...route, buttressId: route.buttress.id });

  // ── Paviland Cave Cliff ────────────────────────────────────────────────────
  const paviland = await c('Paviland Cave Cliff', 51.5450, -4.2840, RockType.LIMESTONE,
    'A dramatic south Gower sea cliff around the famous Paviland Cave with routes from VS to E5. Historical significance — the cave contained the Red Lady of Paviland (30,000 year old bones). The climbing is serious with some of the most committing routes on the peninsula.',
    'From Pilton Green near Rhossili, follow the coastal path west to the cliff. Tidal access in places — check tides. 40 min.',
    'Pilton Green layby or Rhossili National Trust car park (pay & display).', gower);
  const pavilandMain  = await b('Cave Buttress', paviland, 1);
  const pavilandRight = await b('East Cliff', paviland, 2);
  for (const route of [
    tradRoute('Paviland Groove',       'HVS', '5a', pavilandMain,  { height: 35, pitches: 2, description: 'The classic Paviland route — takes the main groove above the cave. Sustained and exposed.' }),
    tradRoute('Cave Crack',            'VS',  '4c', pavilandMain,  { height: 30, description: 'A fine crack route above the archaeological cave — atmospheric and well-protected.' }),
    tradRoute('East Cliff Route',      'E2',  '5c', pavilandRight, { height: 30, description: 'Technical face climbing on the east cliff — a modern classic.' }),
    tradRoute('Paviland Wall',         'E4',  '6a', pavilandMain,  { height: 32, description: 'The hardest route — serious bold climbing on the main buttress.' }),
    tradRoute('Historical Route',      'HS',  '4b', pavilandMain,  { height: 28, description: 'A more accessible route above the famous cave — fine positions.' }),
  ]) await r({ ...route, buttressId: route.buttress.id });

  console.log('  ✓ Gower more: Fall Bay, Boiler Slab, Three Cliffs Bay, Lewes Castle Rocks, Paviland Cave Cliff');
}
