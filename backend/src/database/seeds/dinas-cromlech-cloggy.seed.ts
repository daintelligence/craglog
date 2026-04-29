import { DataSource } from 'typeorm';
import { Region } from '../../modules/crags/entities/region.entity';
import { Crag, RockType } from '../../modules/crags/entities/crag.entity';
import { Buttress } from '../../modules/crags/entities/buttress.entity';
import { Route } from '../../modules/routes/entities/route.entity';
import { findOrCreateRegion, upsertCrag, upsertButtress, upsertRoute, tradRoute } from './seed-helpers';

export async function seedDinasCromlechCloggy(ds: DataSource) {
  const regionRepo = ds.getRepository(Region);
  const cragRepo   = ds.getRepository(Crag);
  const buttRepo   = ds.getRepository(Buttress);
  const routeRepo  = ds.getRepository(Route);

  const snowdonia = await findOrCreateRegion(regionRepo, { name: 'Snowdonia', country: 'Wales' });

  async function c(name: string, lat: number, lng: number, rock: RockType, desc: string, approach: string, parking: string, region: any) {
    return upsertCrag(cragRepo, { name, latitude: lat, longitude: lng, rockType: rock, description: desc, approach, parkingInfo: parking, region, regionId: region.id });
  }
  async function b(name: string, crag: Crag, order = 1) { return upsertButtress(buttRepo, { name, crag, cragId: crag.id, sortOrder: order }); }
  async function r(data: Partial<Route>) { return upsertRoute(routeRepo, data); }

  // ── Dinas Cromlech ────────────────────────────────────────────────────────
  const dinasCromlech = await c('Dinas Cromlech', 53.1173, -4.0320, RockType.OTHER,
    'The most famous crag in the Llanberis Pass — a horseshoe-shaped rhyolite cliff giving some of the most iconic routes in British climbing. Cemetery Gates (E1), Left Wall (E2) and Right Wall (E5) are world-famous. Joe Brown and Don Whillans established many of the classic routes here in the 1950s. A must-visit for any serious British climber.',
    'From Llanberis, follow the A4086 up the Pass. Park at the Cromlech Boulders lay-by — 10 min walk up to the crag.',
    'Cromlech Boulders lay-by on the A4086, Llanberis Pass (free, limited). Can be very busy. Arrive early.', snowdonia);
  const cemeteryWall  = await b('Cemetery Gates Wall', dinasCromlech, 1);
  const leftWall      = await b('Left Wall', dinasCromlech, 2);
  const rightWall     = await b('Right Wall', dinasCromlech, 3);
  const centralWall   = await b('Central Wall', dinasCromlech, 4);

  for (const route of [
    tradRoute('Cemetery Gates',       'E1',  '5b', cemeteryWall, { height: 40, pitches: 2, description: 'The legendary Brown-Whillans classic — one of the most famous routes in Welsh climbing. Takes the left arête with bold moves on excellent rhyolite. A rite of passage.' }),
    tradRoute('Ivy Sepulchre',        'E2',  '5c', cemeteryWall, { height: 38, pitches: 2, description: 'A companion to Cemetery Gates — bold face climbing requiring good footwork on compact rhyolite.' }),
    tradRoute('Left Wall',            'E2',  '5c', leftWall,     { height: 45, pitches: 2, description: 'The great Left Wall route — a sustained and intimidating classic up the smooth left wall. One of Wales\'s most celebrated E2s.' }),
    tradRoute('Cenotaph Corner',      'E1',  '5c', leftWall,     { height: 40, pitches: 2, description: 'One of the most famous corner routes in British climbing — takes the great open corner on the left side. A masterpiece of natural line.' }),
    tradRoute('Right Wall',           'E5',  '6a', rightWall,    { height: 40, pitches: 2, description: 'The great Right Wall testpiece — one of the most sought-after E5s in Wales. Bold and technical on the stunning right wall.' }),
    tradRoute('Memory Lane',          'E4',  '6a', rightWall,    { height: 38, pitches: 2, description: 'A serious route on the right wall — bold and committing moves on compact rhyolite.' }),
    tradRoute('Flying Buttress',      'HS',  '4b', centralWall,  { height: 30, pitches: 2, description: 'The classic moderate at Dinas Cromlech — a well-used outing for those building up to the harder routes.' }),
    tradRoute('Sabre Cut',            'VS',  '4c', centralWall,  { height: 35, pitches: 2, description: 'A fine VS on the central section — good holds and reliable gear in a magnificent setting.' }),
  ]) await r({ ...route, buttressId: route.buttress.id });

  // ── Clogwyn du'r Arddu (Cloggy) ───────────────────────────────────────────
  const cloggy = await c('Clogwyn du\'r Arddu', 53.0698, -4.0425, RockType.OTHER,
    'The most serious and respected crag in Wales — Cloggy\'s dark west and east buttresses rise above Llyn du\'r Arddu on the flanks of Snowdon. Routes from VS to E6 on superb compact rhyolite. The Great Wall (E4), Silhouette (E5) and Master\'s Wall (E7) represent some of the most significant ascents in British climbing history.',
    'From Llanberis, follow the Snowdon Pyg Track or Miners\' Track for 1.5 hours then traverse below the summit to reach the crag. Alternatively approach directly from the Snowdon Ranger path.',
    'Llanberis village car parks (pay & display) or Snowdon Ranger car park. 1.5–2 hour approach on all routes.', snowdonia);
  const westButtress  = await b('West Buttress', cloggy, 1);
  const eastButtress  = await b('East Buttress', cloggy, 2);
  const farEast       = await b('Far East Buttress', cloggy, 3);
  const blackCliff    = await b('Black Cliff', cloggy, 4);

  for (const route of [
    tradRoute('Great Wall',           'E4',  '6a', westButtress, { height: 90,  pitches: 3, description: 'Pete Crew\'s legendary Cloggy masterpiece — one of the most significant routes in British climbing history. Sustained and serious on the west buttress.' }),
    tradRoute('Bow-Shaped Slab',      'VS',  '4c', westButtress, { height: 120, pitches: 3, description: 'The classic Cloggy VS — a fine and sustained route on the great west buttress. Often the first serious route done here.' }),
    tradRoute('Longlands',            'D',   '2c', westButtress, { height: 100, pitches: 3, description: 'The easiest way up the buttress — a fine moderate route on Cloggy by any standard.' }),
    tradRoute('East Buttress Crack',  'HVS', '5a', eastButtress, { height: 110, pitches: 3, description: 'The classic East Buttress route — takes the main crack feature in fine style on compact rhyolite.' }),
    tradRoute('Suicide Wall',         'E2',  '5b', eastButtress, { height: 100, pitches: 2, description: 'A serious and imposing route on the East Buttress — bold climbing above Llyn du\'r Arddu.' }),
    tradRoute('Pinnacle Arête',       'VD',  '3c', eastButtress, { height: 90,  pitches: 2, description: 'A classic moderate — takes the pinnacle arête feature in a superb mountain position.' }),
    tradRoute('Far East Buttress Route', 'E1','5b', farEast,     { height: 80,  pitches: 2, description: 'A fine route on the less-visited far east section — good rock and a more remote feel.' }),
    tradRoute('Black Cliff Direct',   'E3',  '5c', blackCliff,   { height: 70,  pitches: 2, description: 'A bold direct route on the Black Cliff sector — serious and committing.' }),
  ]) await r({ ...route, buttressId: route.buttress.id });

  // ── Dinas Mot ─────────────────────────────────────────────────────────────
  const dinasMot = await c('Dinas Mot', 53.1178, -4.0268, RockType.OTHER,
    'A prominent rhyolite buttress visible from the A4086 at the entrance to the Llanberis Pass. Good routes from S to E4 with a fine mountaineering character. The Nose and Direct Route are classic VS outings. Quicker to dry than the bigger crags and offers sheltered climbing in poor weather.',
    'From the lay-by on the A4086 just inside the Pass, follow the path up the hillside — 15 min to the base of the crag.',
    'Lay-by on the A4086 just above Nant Peris village (free).', snowdonia);
  const motNose   = await b('The Nose', dinasMot, 1);
  const motRight  = await b('Right Wing', dinasMot, 2);

  for (const route of [
    tradRoute('The Nose',             'VS',  '4c', motNose,  { height: 60, pitches: 2, description: 'The great Dinas Mot classic — a fine sustained route up the prominent nose feature. Well protected and absorbing.' }),
    tradRoute('Direct Route',         'VS',  '4c', motNose,  { height: 55, pitches: 2, description: 'A more direct line — varied climbing on compact rhyolite above the Pass.' }),
    tradRoute('Diagonal',             'S',   '4a', motRight, { height: 50, pitches: 2, description: 'A classic moderate line — takes a diagonal traverse across the right wing on good holds.' }),
    tradRoute('Mot Crack',            'HVS', '5a', motNose,  { height: 55, pitches: 2, description: 'A sustained crack route — well protected and absorbing climbing.' }),
    tradRoute('Right Wing Arête',     'E2',  '5b', motRight, { height: 45, pitches: 2, description: 'A bold arête on the right section — exposed and committing.' }),
  ]) await r({ ...route, buttressId: route.buttress.id });

  // ── Carreg Wastad ─────────────────────────────────────────────────────────
  const carregWastad = await c('Carreg Wastad', 53.1162, -4.0298, RockType.OTHER,
    'A compact rhyolite crag directly above the Llanberis Pass road giving short but quality routes from HS to E3. A perfect warm-up or alternative when the bigger Pass crags are busy or wet. Fallen Block Crack and Overlapping Wall are Pass classics.',
    'Directly above the A4086 in the Llanberis Pass — visible from the road. 5 min scramble up from the lay-by.',
    'Pass of Llanberis roadside lay-bys on the A4086 (free). Often combined with Dinas Cromlech or Dinas Mot.', snowdonia);
  const wastedMain = await b('Main Face', carregWastad, 1);

  for (const route of [
    tradRoute('Fallen Block Crack',   'VS',  '4c', wastedMain, { height: 25, description: 'The Pass classic — a perfectly-positioned crack route giving excellent climbing on compact rhyolite.' }),
    tradRoute('Overlapping Wall',     'HVS', '5a', wastedMain, { height: 22, description: 'Takes the overlap feature — sustained technical climbing on the main face.' }),
    tradRoute('Wastad Arête',         'HS',  '4b', wastedMain, { height: 20, description: 'A fine arête route — balance and technique on good rock above the Pass road.' }),
    tradRoute('Top Pitch',            'E1',  '5b', wastedMain, { height: 18, description: 'The bold top section — small holds requiring commitment on compact rhyolite.' }),
  ]) await r({ ...route, buttressId: route.buttress.id });

  console.log('  ✓ Dinas Cromlech, Clogwyn du\'r Arddu, Dinas Mot, Carreg Wastad');
}
