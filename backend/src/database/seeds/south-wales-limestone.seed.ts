import { DataSource } from 'typeorm';
import { Region } from '../../modules/crags/entities/region.entity';
import { Crag, RockType } from '../../modules/crags/entities/crag.entity';
import { Buttress } from '../../modules/crags/entities/buttress.entity';
import { Route } from '../../modules/routes/entities/route.entity';
import { findOrCreateRegion, upsertCrag, upsertButtress, upsertRoute, tradRoute, sportRoute } from './seed-helpers';

export async function seedSouthWalesLimestone(ds: DataSource) {
  const regionRepo = ds.getRepository(Region);
  const cragRepo   = ds.getRepository(Crag);
  const buttRepo   = ds.getRepository(Buttress);
  const routeRepo  = ds.getRepository(Route);

  const glamorgan   = await findOrCreateRegion(regionRepo, { name: 'Vale of Glamorgan', country: 'Wales' });
  const brecknock   = await findOrCreateRegion(regionRepo, { name: 'Brecon Beacons', country: 'Wales' });
  const southWales  = await findOrCreateRegion(regionRepo, { name: 'South Wales', country: 'Wales' });

  async function c(name: string, lat: number, lng: number, rock: RockType, desc: string, approach: string, parking: string, region: any) {
    return upsertCrag(cragRepo, { name, latitude: lat, longitude: lng, rockType: rock, description: desc, approach, parkingInfo: parking, region, regionId: region.id });
  }
  async function b(name: string, crag: Crag, order = 1) { return upsertButtress(buttRepo, { name, crag, cragId: crag.id, sortOrder: order }); }
  async function r(data: Partial<Route>) { return upsertRoute(routeRepo, data); }

  // ── Craig y Ogof, Ogmore ──────────────────────────────────────────────────
  const craigYOgof = await c('Craig y Ogof', 51.4987, -3.6372, RockType.LIMESTONE,
    'An impressive limestone sea cliff at Ogmore-by-Sea with routes from VS to E5. The main face gives some of the finest accessible trad climbing in South Wales. Excellent rock quality and varied route styles — cracks, walls and overhangs all feature.',
    'From Ogmore-by-Sea village, follow the coastal path south to the crag — 15 min.',
    'Ogmore-by-Sea car park on the seafront (pay & display in season).', glamorgan);
  const ogofMain  = await b('Main Face', craigYOgof, 1);
  const ogofRight = await b('Right Buttress', craigYOgof, 2);
  for (const route of [
    tradRoute('Ogof Crack',            'VS',  '4c', ogofMain,  { height: 25, description: 'The classic crack route — takes the main feature in fine style on good limestone.' }),
    tradRoute('Sea Face',              'HVS', '5a', ogofMain,  { height: 28, description: 'A fine wall route on the main face — sustained on compact limestone.' }),
    tradRoute('Cave Route',            'S',   '4a', ogofMain,  { height: 22, description: 'An atmospheric outing through the cave feature — accessible and enjoyable.' }),
    tradRoute('Right Buttress Route',  'E2',  '5c', ogofRight, { height: 22, description: 'Technical face climbing on the right buttress — small holds on compact rock.' }),
    tradRoute('Glamorgan Wall',        'E3',  '5c', ogofMain,  { height: 25, description: 'Bold wall climbing on the main face — one of the best hard routes in the area.' }),
    tradRoute('South Face',            'HS',  '4b', ogofRight, { height: 20, description: 'A pleasant route on the south side — good holds and reliable gear.' }),
  ]) await r({ ...route, buttressId: route.buttress.id });

  // ── Witches Point ─────────────────────────────────────────────────────────
  const witchesPoint = await c('Witches Point', 51.3890, -3.4150, RockType.LIMESTONE,
    'A dramatic limestone headland at Rhoose Point with routes from VS to E4. One of the most distinctive crags in South Wales — the rock has an unusual orange tint. Good quality climbing close to Cardiff with a wild coastal atmosphere.',
    'From Rhoose village, follow the coastal path east to the point — 25 min.',
    'Rhoose village car park (free) or roadside near the coastal path access.', glamorgan);
  const witchMain = await b('Main Headland', witchesPoint, 1);
  for (const route of [
    tradRoute('Witch\'s Brew',         'VS',  '4c', witchMain, { height: 22, description: 'The classic Witches Point route — takes the main headland on surprisingly good limestone.' }),
    tradRoute('Rhoose Wall',           'HVS', '5a', witchMain, { height: 20, description: 'A fine wall route on the orange limestone — technical and committing.' }),
    tradRoute('Point Route',           'HS',  '4b', witchMain, { height: 18, description: 'A pleasant outing on the headland — good holds and scenic sea views.' }),
    tradRoute('Orange Wall',           'E2',  '5b', witchMain, { height: 20, description: 'Takes the distinctive orange wall — technical face climbing.' }),
  ]) await r({ ...route, buttressId: route.buttress.id });

  // ── Morlais Quarries ──────────────────────────────────────────────────────
  const morlais = await c('Morlais Quarries', 51.7805, -3.3622, RockType.LIMESTONE,
    'A classic South Wales limestone quarry near Merthyr Tydfil giving sport and trad routes from 5+ to 8a. The rock is well-developed with bolted sport routes alongside traditional lines. A popular local venue with a wide range of grades.',
    'From Merthyr Tydfil, follow signs to Morlais Castle then continue to the quarries — 10 min from town.',
    'Track-side parking near the quarry entrance, Morlais (free).', brecknock);
  const morlaisMain  = await b('Main Quarry', morlais, 1);
  const morlaisSport = await b('Sport Wall', morlais, 2);
  for (const route of [
    sportRoute('Quarry Wall',          '6b',  morlaisMain,  { height: 18, description: 'A good introductory sport route — well bolted with positive holds.' }),
    sportRoute('Merthyr Mover',        '7a',  morlaisSport, { height: 20, description: 'The main testpiece — sustained technical climbing on compact limestone.' }),
    sportRoute('Morlais Direct',       '6c+', morlaisSport, { height: 18, description: 'A popular sport route — crimps and technical footwork throughout.' }),
    tradRoute('Quarry Classic',        'VS',  '4c', morlaisMain, { height: 20, description: 'A good traditional route on the quarry wall — solid rock and natural gear placements.' }),
    sportRoute('Bolted Wall',          '7b',  morlaisSport, { height: 20, description: 'The hardest bolted route — powerful and sustained.' }),
    sportRoute('Castle View',          '6a',  morlaisMain,  { height: 18, description: 'A pleasant easier route with views of Morlais Castle — good intro to the venue.' }),
  ]) await r({ ...route, buttressId: route.buttress.id });

  // ── Llangattock Escarpment ────────────────────────────────────────────────
  const llangattock = await c('Llangattock Escarpment', 51.8490, -3.2160, RockType.LIMESTONE,
    'A long limestone escarpment above the Usk Valley near Crickhowell with routes from VD to E3. An under-explored venue with good rock and fine views over the Brecon Beacons. The crag is south-facing and catches plenty of sun.',
    'From Crickhowell town, follow the road to Llangattock village then footpath up to the escarpment — 30 min.',
    'Crickhowell town car park (pay & display) or roadside near Llangattock village (free).', brecknock);
  const llangMain = await b('Main Escarpment', llangattock, 1);
  for (const route of [
    tradRoute('Escarpment Route',      'VS',  '4c', llangMain, { height: 25, description: 'The main route — takes the best section of the escarpment on good limestone.' }),
    tradRoute('Usk Valley View',       'S',   '4a', llangMain, { height: 20, description: 'A pleasant route with fine views over the Usk Valley and Brecon Beacons.' }),
    tradRoute('Llangattock Wall',      'HVS', '5a', llangMain, { height: 22, description: 'Technical wall climbing on the steeper central section.' }),
    tradRoute('Beacon View',           'E1',  '5b', llangMain, { height: 22, description: 'A bold route with a committing crux above the valley.' }),
  ]) await r({ ...route, buttressId: route.buttress.id });

  // ── Dinas Rock ────────────────────────────────────────────────────────────
  const dinasRock = await c('Dinas Rock', 51.7628, -3.6290, RockType.LIMESTONE,
    'A dramatic limestone buttress above the Vale of Neath with routes from VS to E5. The rock towers 70m above the Mellte river — one of the most impressive crags in the South Wales valleys. Serious routes in a spectacular setting.',
    'From Pontneddfechan, follow the riverside path to Dinas Rock — 15 min walk.',
    'Pontneddfechan car park (free) near the Angel Inn.', southWales);
  const dinasMain  = await b('Main Face', dinasRock, 1);
  const dinasRight = await b('Right Buttress', dinasRock, 2);
  for (const route of [
    tradRoute('Neath Valley Wall',     'VS',  '4c', dinasMain,  { height: 50, pitches: 2, description: 'The classic two-pitch route on the main face — varied climbing on excellent limestone.' }),
    tradRoute('Dinas Direct',          'HVS', '5a', dinasMain,  { height: 60, pitches: 3, description: 'The direct line up the main face — sustained and impressive.' }),
    tradRoute('River Buttress',        'E2',  '5c', dinasRight, { height: 45, pitches: 2, description: 'Technical climbing above the river — committing and exposed.' }),
    tradRoute('Mellte Route',          'E4',  '6a', dinasMain,  { height: 55, pitches: 2, description: 'The hardest route on Dinas Rock — sustained technical climbing on compact limestone.' }),
  ]) await r({ ...route, buttressId: route.buttress.id });

  console.log('  ✓ South Wales limestone: Craig y Ogof, Witches Point, Morlais Quarries, Llangattock Escarpment, Dinas Rock');
}
