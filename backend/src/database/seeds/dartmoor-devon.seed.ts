import { DataSource } from 'typeorm';
import { Region } from '../../modules/crags/entities/region.entity';
import { Crag, RockType } from '../../modules/crags/entities/crag.entity';
import { Buttress } from '../../modules/crags/entities/buttress.entity';
import { Route } from '../../modules/routes/entities/route.entity';
import { findOrCreateRegion, upsertCrag, upsertButtress, upsertRoute, tradRoute } from './seed-helpers';

export async function seedDartmoorDevon(ds: DataSource) {
  const regionRepo = ds.getRepository(Region);
  const cragRepo   = ds.getRepository(Crag);
  const buttRepo   = ds.getRepository(Buttress);
  const routeRepo  = ds.getRepository(Route);

  const dartmoor = await findOrCreateRegion(regionRepo, { name: 'Devon & Dartmoor', country: 'England' });

  async function c(name: string, lat: number, lng: number, rock: RockType, desc: string, approach: string, parking: string, region: any) {
    return upsertCrag(cragRepo, { name, latitude: lat, longitude: lng, rockType: rock, description: desc, approach, parkingInfo: parking, region, regionId: region.id });
  }
  async function b(name: string, crag: Crag, order = 1) { return upsertButtress(buttRepo, { name, crag, cragId: crag.id, sortOrder: order }); }
  async function r(data: Partial<Route>) { return upsertRoute(routeRepo, data); }

  // ── Haytor Rocks ─────────────────────────────────────────────────────────
  const haytor = await c('Haytor Rocks', 50.5739, -3.7544, RockType.GRANITE,
    'The most famous Dartmoor tor — a prominent granite outcrop rising above the moor giving routes from VD to E4 on excellent coarse granite. The South Face, North West Face and Ramp provide varied climbing with outstanding moorland views. One of Britain\'s most popular tors for both climbers and visitors.',
    'The tor is visible from the car park — 5 min walk across open moorland.',
    'Haytor car park (Dartmoor National Park, pay & display). One of the busiest Dartmoor car parks. Arrives early in summer.', dartmoor);
  const haytorSouth = await b('South Face', haytor, 1);
  const haytorNW    = await b('North West Face', haytor, 2);
  const haytorNE    = await b('North East Buttress', haytor, 3);

  for (const route of [
    tradRoute('South Face Route',     'VD',  '3c', haytorSouth, { height: 20, description: 'The classic Haytor route — takes the easiest line on the south face on good coarse granite.' }),
    tradRoute('Haytor Crack',         'VS',  '4c', haytorSouth, { height: 22, description: 'The main crack on the south face — excellent natural gear placements on perfect granite.' }),
    tradRoute('North West Arête',     'HVS', '5a', haytorNW,    { height: 20, description: 'A fine arête route above the moor — technical and exposed with superb Dartmoor views.' }),
    tradRoute('Ramp Route',           'HS',  '4b', haytorSouth, { height: 18, description: 'Takes the main ramp feature — a popular and enjoyable outing on the south face.' }),
    tradRoute('North East Buttress',  'E1',  '5b', haytorNE,    { height: 18, description: 'A bold route on the north east aspect — technical on compact granite.' }),
    tradRoute('Slab Route',           'D',   '2c', haytorSouth, { height: 15, description: 'A pleasant easy outing — friction on gently angled granite slabs.' }),
  ]) await r({ ...route, buttressId: route.buttress.id });

  // ── Bonehill Rocks ────────────────────────────────────────────────────────
  const bonehillRocks = await c('Bonehill Rocks', 50.5812, -3.8128, RockType.GRANITE,
    'A fine scattered group of granite tors near Widecombe-in-the-Moor with routes from VD to E3. Less busy than Haytor but with excellent granite and a pleasant moorland setting. The various tors give a good variety of routes in a compact area.',
    'From Widecombe-in-the-Moor, follow the road north and take the track to Bonehill — 10 min walk from the road.',
    'Bonehill farm roadside parking or Widecombe-in-the-Moor car park (pay & display).', dartmoor);
  const bonehillMain  = await b('Main Tor', bonehillRocks, 1);
  const bonehillLeft  = await b('Left Tor', bonehillRocks, 2);

  for (const route of [
    tradRoute('Bonehill Crack',       'VS',  '4c', bonehillMain, { height: 15, description: 'The main crack route — a good natural line on excellent Dartmoor granite.' }),
    tradRoute('Main Tor Wall',        'HVS', '5a', bonehillMain, { height: 14, description: 'A technical wall route — small holds on compact granite above the moor.' }),
    tradRoute('Left Tor Route',       'HS',  '4b', bonehillLeft, { height: 12, description: 'A pleasant route on the left tor — good holds and a fine moorland aspect.' }),
    tradRoute('Widecombe Wall',       'E2',  '5b', bonehillMain, { height: 14, description: 'A bold route — committing moves on the main tor face.' }),
  ]) await r({ ...route, buttressId: route.buttress.id });

  // ── Hound Tor ─────────────────────────────────────────────────────────────
  const houndTor = await c('Hound Tor', 50.5869, -3.7344, RockType.GRANITE,
    'A dramatic collection of jagged granite tors near Manaton giving routes from VD to E3. The tor gets its name from its canine silhouette on the skyline. The climbing is varied — crack routes, arêtes and slabs on typically rough Dartmoor granite. An atmospheric moorland venue.',
    'From the Hound Tor car park, follow the path directly to the tors — 5 min.',
    'Hound Tor car park (Dartmoor National Park, pay & display). A popular visitor attraction.', dartmoor);
  const houndMain  = await b('Main Tors', houndTor, 1);
  const houndRight = await b('Right Tor', houndTor, 2);

  for (const route of [
    tradRoute('Hound Tor Crack',      'VS',  '4c', houndMain,  { height: 15, description: 'The classic route — takes the obvious crack on the main tors on good rough granite.' }),
    tradRoute('Canine Arête',         'HVS', '5a', houndMain,  { height: 14, description: 'A fine arête — exposed and technical with views over the eastern moor.' }),
    tradRoute('Right Tor Route',      'HS',  '4b', houndRight, { height: 12, description: 'A pleasant moderate on the right tor — good holds and a scenic moorland setting.' }),
    tradRoute('Hound Direct',         'E1',  '5b', houndMain,  { height: 14, description: 'A bold direct route — technical moves on compact granite.' }),
    tradRoute('East Face',            'VD',  '3c', houndRight, { height: 12, description: 'An easy accessible route on the east-facing side — good introduction to Hound Tor.' }),
  ]) await r({ ...route, buttressId: route.buttress.id });

  // ── Vixen Tor ─────────────────────────────────────────────────────────────
  const vixenTor = await c('Vixen Tor', 50.5611, -4.0311, RockType.GRANITE,
    'An impressive isolated granite tor on western Dartmoor rising 30m above the moor — the tallest free-standing granite tor on Dartmoor. Routes from VS to E3 on excellent coarse granite. Access has been intermittent historically — check current status before visiting. When open, it gives some of the best granite climbing on the moor.',
    'From the B3357 near Merrivale, follow the footpath south across the moor to the tor — 20 min. Check access status before visiting.',
    'Layby on the B3357 near Merrivale Bridge (free). Check current land access arrangements.', dartmoor);
  const vixenMain = await b('Main Face', vixenTor, 1);

  for (const route of [
    tradRoute('Vixen Crack',          'VS',  '4c', vixenMain, { height: 28, description: 'The main crack route on the impressive tor — excellent gear on good coarse granite.' }),
    tradRoute('West Face Route',      'HVS', '5a', vixenMain, { height: 30, description: 'Takes the west face — sustained and technical on the tallest Dartmoor tor.' }),
    tradRoute('South Arête',          'E1',  '5b', vixenMain, { height: 28, description: 'A bold arête route — exposed and committing on the remote Dartmoor tor.' }),
    tradRoute('Merrivale Slab',       'S',   '4a', vixenMain, { height: 20, description: 'A pleasant slab route — friction on gently angled granite with moorland views.' }),
  ]) await r({ ...route, buttressId: route.buttress.id });

  // ── Berry Head ────────────────────────────────────────────────────────────
  const berryHead = await c('Berry Head', 50.3971, -3.4826, RockType.LIMESTONE,
    'A dramatic limestone headland near Brixham at the southern tip of Torbay — a National Nature Reserve giving routes from VS to E5 on excellent Devon limestone. The headland rises 60m above the English Channel. Routes on the Main Cliff and South Face give exposed sea cliff climbing with fine views. Home to a large guillemot colony (seasonal access restrictions apply).',
    'From Brixham, follow signs to Berry Head Country Park. From the car park, follow the coastal path to the cliff top — 10 min.',
    'Berry Head Country Park car park, Brixham (pay & display). Café and visitor centre on site.', dartmoor);
  const berryMain  = await b('Main Cliff', berryHead, 1);
  const berrySouth = await b('South Face', berryHead, 2);

  for (const route of [
    tradRoute('Berry Head Crack',     'HVS', '5a', berryMain,  { height: 45, pitches: 2, description: 'The main crack on the headland — sustained Devon limestone climbing above the English Channel.' }),
    tradRoute('Headland Wall',        'VS',  '4c', berryMain,  { height: 40, pitches: 2, description: 'A fine wall route — well positioned above Torbay with views to the Exe estuary.' }),
    tradRoute('South Face Route',     'E2',  '5c', berrySouth, { height: 50, pitches: 2, description: 'A bold route on the south face — technical climbing on compact limestone above the sea.' }),
    tradRoute('Guillemot Wall',       'E1',  '5b', berryMain,  { height: 45, pitches: 2, description: 'A fine E1 on the main cliff — sustained and well protected. Best climbed outside nesting season.' }),
    tradRoute('Brixham Route',        'S',   '4a', berryMain,  { height: 35, pitches: 2, description: 'The most accessible Berry Head route — good holds on the lower-angled sections.' }),
  ]) await r({ ...route, buttressId: route.buttress.id });

  console.log('  ✓ Dartmoor & Devon: Haytor, Bonehill Rocks, Hound Tor, Vixen Tor, Berry Head');
}
