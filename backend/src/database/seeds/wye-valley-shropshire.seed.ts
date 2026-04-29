import { DataSource } from 'typeorm';
import { Region } from '../../modules/crags/entities/region.entity';
import { Crag, RockType } from '../../modules/crags/entities/crag.entity';
import { Buttress } from '../../modules/crags/entities/buttress.entity';
import { Route } from '../../modules/routes/entities/route.entity';
import { findOrCreateRegion, upsertCrag, upsertButtress, upsertRoute, tradRoute, sportRoute } from './seed-helpers';

export async function seedWyeValleyShropshire(ds: DataSource) {
  const regionRepo = ds.getRepository(Region);
  const cragRepo   = ds.getRepository(Crag);
  const buttRepo   = ds.getRepository(Buttress);
  const routeRepo  = ds.getRepository(Route);

  const wyeValley  = await findOrCreateRegion(regionRepo, { name: 'Wye Valley', country: 'England' });
  const shropshire = await findOrCreateRegion(regionRepo, { name: 'Shropshire', country: 'England' });

  async function c(name: string, lat: number, lng: number, rock: RockType, desc: string, approach: string, parking: string, region: any) {
    return upsertCrag(cragRepo, { name, latitude: lat, longitude: lng, rockType: rock, description: desc, approach, parkingInfo: parking, region, regionId: region.id });
  }
  async function b(name: string, crag: Crag, order = 1) { return upsertButtress(buttRepo, { name, crag, cragId: crag.id, sortOrder: order }); }
  async function r(data: Partial<Route>) { return upsertRoute(routeRepo, data); }

  // ── Wintour's Leap ────────────────────────────────────────────────────────
  const wintours = await c('Wintour\'s Leap', 51.6710, -2.6620, RockType.LIMESTONE,
    'A magnificent 80m limestone cliff above the River Wye at Chepstow giving routes from HS to E5. One of the finest crags in the Wye Valley — the rock is excellent and the positions above the river are atmospheric. Suspend (E3) and Suspension (E4) are legendary routes. Seasonal nesting restrictions apply to certain sections.',
    'From Chepstow, follow the B4228 north along the west bank of the Wye. Parking is below the cliff — 5 min walk.',
    'Lay-by on the B4228 near Wintour\'s Leap (free). The cliff is visible from the road.', wyeValley);
  const wintourMain  = await b('Main Cliff', wintours, 1);
  const wintourRight = await b('Right Buttress', wintours, 2);
  const wintourLeft  = await b('Left Section', wintours, 3);

  for (const route of [
    tradRoute('Suspend',              'E3',  '5c', wintourMain,  { height: 60, pitches: 2, description: 'The great Wintour\'s Leap classic — a sustained route on the main cliff above the River Wye. One of the best E3s in South Wales/Wye Valley.' }),
    tradRoute('Suspension',          'E4',  '6a', wintourMain,  { height: 65, pitches: 2, description: 'The harder companion — bold and technical above the river. A serious and impressive route.' }),
    tradRoute('Main Cliff Route',     'HVS', '5a', wintourMain,  { height: 55, pitches: 2, description: 'A fine HVS on the main cliff — sustained and well positioned above the Wye.' }),
    tradRoute('Right Buttress Route', 'VS',  '4c', wintourRight, { height: 45, pitches: 2, description: 'A good VS on the right buttress — natural gear and varied climbing.' }),
    tradRoute('Wye Wall',             'S',   '4a', wintourLeft,  { height: 40, description: 'A pleasant route on the left section — accessible and enjoyable above the river.' }),
    tradRoute('Leap Route',           'E1',  '5b', wintourRight, { height: 50, pitches: 2, description: 'A sustained route on the right buttress — well protected on good Wye Valley limestone.' }),
    tradRoute('River View',           'HS',  '4b', wintourLeft,  { height: 40, description: 'A pleasant moderate with fine views of the Wye — good holds and reliable gear.' }),
  ]) await r({ ...route, buttressId: route.buttress.id });

  // ── Symonds Yat ───────────────────────────────────────────────────────────
  const symondsYat = await c('Symonds Yat', 51.8435, -2.6422, RockType.LIMESTONE,
    'A popular limestone crag above the gorge at Symonds Yat in the Forest of Dean with routes from VD to E4. The routes face south and dry quickly. A good range of grades and short approaches make this popular with beginners and intermediates. Peregrine falcons nest here — check seasonal closures.',
    'From Symonds Yat village, follow the path to the cliff top — 10 min. Routes accessed from above by abseil or from below by scramble.',
    'Symonds Yat East or West car park (pay & display). Café in the village.', wyeValley);
  const symondsMain = await b('Main Face', symondsYat, 1);
  const symondsSport = await b('Sport Wall', symondsYat, 2);

  for (const route of [
    tradRoute('Symonds Crack',        'VS',  '4c', symondsMain,  { height: 30, description: 'The classic Symonds Yat route — a good crack on south-facing limestone above the famous gorge.' }),
    tradRoute('Yat Wall',             'HVS', '5a', symondsMain,  { height: 28, description: 'A fine wall route — technical on compact Wye Valley limestone.' }),
    tradRoute('Dean Route',           'S',   '4a', symondsMain,  { height: 25, description: 'A pleasant moderate — good holds and an enjoyable outlook over the gorge.' }),
    sportRoute('Yat Sport',           '6c',  symondsSport, { height: 22, description: 'A bolted route on the sport wall — well developed with good limestone.' }),
    sportRoute('Gorge Wall',          '7a',  symondsSport, { height: 22, description: 'A sustained sport route — technical crimping on compact limestone.' }),
    tradRoute('Symonds Direct',       'E2',  '5c', symondsMain,  { height: 30, description: 'A bold direct route — technical face climbing above the Forest of Dean.' }),
  ]) await r({ ...route, buttressId: route.buttress.id });

  // ── Nesscliff ─────────────────────────────────────────────────────────────
  const nesscliff = await c('Nesscliff', 52.8355, -2.9382, RockType.SANDSTONE,
    'A distinctive red sandstone crag on a wooded hill near Shrewsbury giving routes from VS to E4 on soft but grippy sandstone. A popular Shropshire venue — the rock has a unique character and the routes require a delicate touch. Wild Humphrey Kynaston\'s cave is a historical feature at the crag.',
    'From Nesscliff village on the A5, follow the footpath up through the woods to the crag — 10 min.',
    'Nesscliff village roadside or the small car park off the A5 (free).', shropshire);
  const nesscliffMain = await b('Main Cliff', nesscliff, 1);
  const nesscliffRight = await b('Right Buttress', nesscliff, 2);

  for (const route of [
    tradRoute('Kynaston\'s Crack',    'VS',  '4c', nesscliffMain,  { height: 20, description: 'The classic Nesscliff route — named after the historical outlaw. Takes the main crack on distinctive red sandstone.' }),
    tradRoute('Sandstone Wall',       'HVS', '5a', nesscliffMain,  { height: 18, description: 'A technical route on the soft sandstone — requires careful footwork and delicate moves.' }),
    tradRoute('Shropshire Route',     'S',   '4a', nesscliffRight, { height: 16, description: 'A pleasant accessible route — good introduction to Shropshire sandstone.' }),
    tradRoute('Nesscliff Direct',     'E2',  '5b', nesscliffMain,  { height: 20, description: 'A bold route on the main cliff — serious on the softer sandstone.' }),
    tradRoute('Wooded Wall',          'HS',  '4b', nesscliffRight, { height: 16, description: 'A route in the wooded setting — good character above the Shropshire plain.' }),
  ]) await r({ ...route, buttressId: route.buttress.id });

  // ── Pontesford Rocks ──────────────────────────────────────────────────────
  const pontesford = await c('Pontesford Rocks', 52.6245, -2.9120, RockType.OTHER,
    'A fine quartzite crag on the Stiperstones ridge in south Shropshire giving routes from VD to E3 on excellent rock. The Pontesford Eagle is a local landmark. The setting on the Shropshire Hills AONB is outstanding.',
    'From Pontesbury village, follow the path up to the Stiperstones ridge — 30 min.',
    'Pontesbury village roadside or the Stiperstones NNR car park on the ridge road (free).', shropshire);
  const pontesfordMain = await b('Main Rocks', pontesford, 1);

  for (const route of [
    tradRoute('Eagle Crack',          'VS',  '4c', pontesfordMain, { height: 18, description: 'The classic Pontesford route — takes the crack near the Eagle feature on excellent quartzite.' }),
    tradRoute('Stiperstones Wall',    'HVS', '5a', pontesfordMain, { height: 16, description: 'A fine wall route — technical on compact quartzite above the Shropshire Hills.' }),
    tradRoute('Ridge Route',          'VD',  '3c', pontesfordMain, { height: 15, description: 'A pleasant moderate on the ridge — good holds and wide views.' }),
    tradRoute('Quartzite Arête',      'E1',  '5b', pontesfordMain, { height: 18, description: 'A bold arête above the AONB — exposed and technical.' }),
  ]) await r({ ...route, buttressId: route.buttress.id });

  // ── The Breiddens ─────────────────────────────────────────────────────────
  const breiddens = await c('Breidden Hill', 52.7310, -3.0978, RockType.OTHER,
    'A volcanic outcrop on the prominent Breidden Hills on the Welsh border giving routes from HS to E3. The views from the crag across the Severn Valley and Welsh borders are exceptional. An unusual rock type — dark dolerite — gives distinctive climbing.',
    'From Welshpool, follow the minor road to the Breiddens and park near the hill — 20 min walk to the crag.',
    'Roadside near Criggion village on the Breidden road (free).', shropshire);
  const breiddensMain = await b('Main Crag', breiddens, 1);

  for (const route of [
    tradRoute('Breidden Route',       'HS',  '4b', breiddensMain, { height: 25, description: 'A route on the dark volcanic rock — unusual holds on compact dolerite above the Severn Valley.' }),
    tradRoute('Welsh Border Crack',   'VS',  '4c', breiddensMain, { height: 22, description: 'A crack route on the distinctive dark rock — natural gear on compact dolerite.' }),
    tradRoute('Severn View',          'HVS', '5a', breiddensMain, { height: 25, description: 'A technical route with exceptional views — the Severn Valley spreads below.' }),
  ]) await r({ ...route, buttressId: route.buttress.id });

  console.log('  ✓ Wye Valley & Shropshire: Wintour\'s Leap, Symonds Yat, Nesscliff, Pontesford Rocks, Breidden Hill');
}
