import { DataSource } from 'typeorm';
import { Region } from '../../modules/crags/entities/region.entity';
import { Crag, RockType } from '../../modules/crags/entities/crag.entity';
import { Buttress } from '../../modules/crags/entities/buttress.entity';
import { Route } from '../../modules/routes/entities/route.entity';
import { findOrCreateRegion, upsertCrag, upsertButtress, upsertRoute, tradRoute, sportRoute } from './seed-helpers';

export async function seedScotlandEast(ds: DataSource) {
  const regionRepo = ds.getRepository(Region);
  const cragRepo   = ds.getRepository(Crag);
  const buttRepo   = ds.getRepository(Buttress);
  const routeRepo  = ds.getRepository(Route);

  const perthshire = await findOrCreateRegion(regionRepo, { name: 'Perthshire', country: 'Scotland' });
  const ardgour    = await findOrCreateRegion(regionRepo, { name: 'Ardgour & Ardnamurchan', country: 'Scotland' });
  const cairngorms = await findOrCreateRegion(regionRepo, { name: 'Cairngorms', country: 'Scotland' });

  async function c(name: string, lat: number, lng: number, rock: RockType, desc: string, approach: string, parking: string, region: any) {
    return upsertCrag(cragRepo, { name, latitude: lat, longitude: lng, rockType: rock, description: desc, approach, parkingInfo: parking, region, regionId: region.id });
  }
  async function b(name: string, crag: Crag, order = 1) { return upsertButtress(buttRepo, { name, crag, cragId: crag.id, sortOrder: order }); }
  async function r(data: Partial<Route>) { return upsertRoute(routeRepo, data); }

  // ── Craig a' Barns, Dunkeld ────────────────────────────────────────────────
  const craigABarns = await c('Craig a\' Barns', 56.5664, -3.5862, RockType.OTHER,
    'A classic Perthshire schist crag in a beautiful woodland setting above the River Tay near Dunkeld. Routes from VD to E6 on excellent rough schist — some of the best rock in Scotland. The crag catches the sun and dries quickly. Coffin Corner and Sidewinder are iconic.',
    'From the Dunkeld town centre, follow the river path north to Craig a\' Barns — 20 min walk.',
    'Dunkeld town centre car park (pay & display) or layby on the A9 near Inver.', perthshire);
  const barnsMain   = await b('Upper Cave Crag', craigABarns, 1);
  const barnsLower  = await b('Lower Cave Crag', craigABarns, 2);
  const barnsSport  = await b('Sport Wall', craigABarns, 3);
  for (const route of [
    tradRoute('Coffin Corner',         'VS',  '4c', barnsMain,  { height: 35, description: 'The most popular route on the crag — a superb corner line on immaculate schist. A Scottish classic.' }),
    tradRoute('Sidewinder',            'E2',  '5c', barnsMain,  { height: 30, description: 'One of the great Scottish sport-trad routes — technical wall climbing on perfect rock.' }),
    tradRoute('Weem\'s World',         'HVS', '5a', barnsLower, { height: 25, description: 'A fine route on the lower crag — sustained and technical on good schist.' }),
    tradRoute('Flakes Route',          'VD',  '3c', barnsLower, { height: 20, description: 'The classic easier route — a pleasant outing on well-featured rock.' }),
    tradRoute('Cave Route',            'VS',  '4c', barnsMain,  { height: 30, description: 'Takes the cave feature — atmospheric and varied.' }),
    sportRoute('Barns Sport',          '7a',  barnsSport, { height: 20, description: 'A quality sport pitch on the sport wall — technical climbing on excellent schist.' }),
    tradRoute('Rat Race',              'E4',  '6a', barnsMain,  { height: 28, description: 'The crag\'s hardest classic — technical and sustained on the main wall.' }),
  ]) await r({ ...route, buttressId: route.buttress.id });

  // ── Polney Crag, Dunkeld ──────────────────────────────────────────────────
  const polney = await c('Polney Crag', 56.5590, -3.5780, RockType.OTHER,
    'A small but high-quality schist crag in the Dunkeld area — a good half-day venue with routes from VS to E4. The rock is excellent and the setting pleasant. Often combined with Craig a\' Barns for a full day.',
    'From Dunkeld, short approach via forest path — 15 min walk.',
    'Roadside layby south of Dunkeld on the A923 (free).', perthshire);
  const polneyMain = await b('Main Wall', polney, 1);
  for (const route of [
    tradRoute('Polney Wall',           'VS',  '4c', polneyMain, { height: 18, description: 'The main route — good holds and pleasant positions on schist.' }),
    tradRoute('Direct Route',          'HVS', '5a', polneyMain, { height: 18, description: 'Takes the wall more directly — a good challenge at the grade.' }),
    tradRoute('Lower Tier',            'S',   '4a', polneyMain, { height: 15, description: 'A pleasant easier route on the lower section.' }),
    tradRoute('Polney Crack',          'E2',  '5b', polneyMain, { height: 18, description: 'The hardest route — bold climbing on the upper wall.' }),
  ]) await r({ ...route, buttressId: route.buttress.id });

  // ── Garbh Bheinn, Ardgour ─────────────────────────────────────────────────
  const garbhBheinn = await c('Garbh Bheinn', 56.7315, -5.3780, RockType.OTHER,
    'One of the great Scottish mountain crags — a magnificent remote cliff above Loch Linnhe in Ardgour giving routes from VS to E5 on superb rough gneiss. A serious committing venue with routes of alpine character. The approach by boat across Loch Linnhe adds to the adventure.',
    'Cross Loch Linnhe by the Corran Ferry from Onich. Then drive to Clovulin and walk up into Coire an Iubhair — 90 min approach.',
    'Corran Ferry slip road (small ferry fee). Limited parking at Clovulin (free).', ardgour);
  const garbhMain  = await b('Great Ridge', garbhBheinn, 1);
  const garbhRight = await b('South Wall', garbhBheinn, 2);
  for (const route of [
    tradRoute('Great Ridge',           'VS',  '4c', garbhMain,  { height: 250, pitches: 7, description: 'The great classic of Garbh Bheinn — a superb mountaineering route on fine gneiss with tremendous situations.' }),
    tradRoute('Butterknife',           'HVS', '5a', garbhRight, { height: 120, pitches: 4, description: 'One of the finest HVS routes in Scotland — sustained and exposed on the south wall.' }),
    tradRoute('South Wall Route',      'E2',  '5c', garbhRight, { height: 100, pitches: 3, description: 'Technical climbing on the imposing south wall — very serious in a remote setting.' }),
    tradRoute('Scimitar',              'VS',  '4c', garbhMain,  { height: 180, pitches: 5, description: 'A fine mountaineering route following the natural line of the ridge — sustained and exposed.' }),
    tradRoute('Lecher\'s Route',       'E4',  '6a', garbhRight, { height: 90,  pitches: 3, description: 'The modern hard testpiece — technical face climbing on immaculate gneiss.' }),
  ]) await r({ ...route, buttressId: route.buttress.id });

  // ── Creag an Dubh Loch ────────────────────────────────────────────────────
  const creagDubhLoch = await c('Creag an Dubh Loch', 56.9110, -3.1870, RockType.GRANITE,
    'One of Scotland\'s greatest mountain crags — a massive granite cliff above a remote Cairngorms lochan. Routes from HVS to E7 on superb rough granite. A serious day-out requiring fitness and navigation. The Central Gully Wall is world class.',
    'From Spittal of Glenmuick, walk up the glen to Loch Muick then onto the cliff — 3 hour approach.',
    'Spittal of Glenmuick car park, Deeside (Balmoral Estate, small fee).', cairngorms);
  const creagMain = await b('Central Slabs', creagDubhLoch, 1);
  const creagLeft = await b('Left Wing', creagDubhLoch, 2);
  for (const route of [
    tradRoute('Labyrinth Direct',      'HVS', '5a', creagMain, { height: 300, pitches: 8, description: 'The great classic — takes the central slabs by the most direct line. A truly great Scottish outing.' }),
    tradRoute('Blue Max',              'E3',  '5c', creagMain, { height: 200, pitches: 6, description: 'One of the finest hard routes in Scotland — sustained technical climbing on perfect granite.' }),
    tradRoute('Dragonfly',             'E5',  '6b', creagLeft, { height: 180, pitches: 5, description: 'A test of fitness and technique — sustained E5 on the left wing.' }),
    tradRoute('Naked Ape',             'E2',  '5b', creagMain, { height: 250, pitches: 7, description: 'A superb middle-grade route on this great crag — sustained and exposed.' }),
  ]) await r({ ...route, buttressId: route.buttress.id });

  console.log('  ✓ Scotland East: Craig a\' Barns, Polney Crag, Garbh Bheinn, Creag an Dubh Loch');
}
