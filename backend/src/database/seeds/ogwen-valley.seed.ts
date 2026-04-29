import { DataSource } from 'typeorm';
import { Region } from '../../modules/crags/entities/region.entity';
import { Crag, RockType } from '../../modules/crags/entities/crag.entity';
import { Buttress } from '../../modules/crags/entities/buttress.entity';
import { Route } from '../../modules/routes/entities/route.entity';
import { findOrCreateRegion, upsertCrag, upsertButtress, upsertRoute, tradRoute } from './seed-helpers';

export async function seedOgwenValley(ds: DataSource) {
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

  // ── Idwal Slabs ───────────────────────────────────────────────────────────
  const idwalSlabs = await c('Idwal Slabs', 53.1132, -3.9913, RockType.OTHER,
    'The classic Welsh beginners\' and intermediate slab — massive sheets of smooth rhyolite above Llyn Idwal give routes from Very Difficult to HVS on perfect friction. The Ordinary Route and Slab Route are among the most-climbed routes in Wales, introducing generations of climbers to the mountains. Tennis Shoe (HS) is a legendary classic.',
    'From the Ogwen Valley car park on the A5, follow the path to Cwm Idwal — 30 min to the base of the slabs.',
    'Ogwen Valley car park on the A5 (Snowdonia National Park, pay & display). Very busy in summer.', snowdonia);
  const idwalMain   = await b('Main Slabs', idwalSlabs, 1);
  const idwalLeft   = await b('Left Branch', idwalSlabs, 2);
  const idwalRight  = await b('Right Branch', idwalSlabs, 3);

  for (const route of [
    tradRoute('Ordinary Route',       'VD',  '3c', idwalMain,  { height: 180, pitches: 4, description: 'The classic Welsh VD — one of the most-climbed routes in Britain. Long sustained slab on perfect rhyolite. An essential introduction to mountain climbing.' }),
    tradRoute('Slab Route',           'VD',  '3c', idwalMain,  { height: 150, pitches: 3, description: 'A companion classic to the Ordinary Route — friction slab climbing on immaculate rhyolite above Cwm Idwal.' }),
    tradRoute('Tennis Shoe',          'HS',  '4b', idwalLeft,  { height: 140, pitches: 3, description: 'The legendary Tennis Shoe — named by the first ascentionists for the footwear required. A delicate and absorbing slab classic.' }),
    tradRoute('Charity',              'VD',  '3c', idwalRight, { height: 120, pitches: 3, description: 'A classic right branch route — sustained slab friction on excellent Idwal rhyolite.' }),
    tradRoute('Original Route',       'D',   '2c', idwalMain,  { height: 150, pitches: 4, description: 'The very first Idwal Slabs route — a magnificent long outing on the huge slab above the cwm.' }),
    tradRoute('Faith',                'S',   '4a', idwalLeft,  { height: 130, pitches: 3, description: 'One of the Three Sisters routes — a good S outing on the left branch of the slabs.' }),
    tradRoute('Hope',                 'HS',  '4b', idwalRight, { height: 120, pitches: 3, description: 'Another of the Idwal trio — sustained slab climbing on the right branch.' }),
    tradRoute('Suicide Wall Route',   'E1',  '5b', idwalLeft,  { height: 100, pitches: 2, description: 'The hardest Idwal Slabs route — a bold outing on the steeper left section.' }),
  ]) await r({ ...route, buttressId: route.buttress.id });

  // ── Milestone Buttress ────────────────────────────────────────────────────
  const milestone = await c('Milestone Buttress', 53.1020, -3.9928, RockType.OTHER,
    'A prominent roadside rhyolite buttress on the south side of Llyn Ogwen — one of the most accessible mountain crags in Snowdonia. Routes from Difficult to E2 on compact rhyolite immediately above the A5 road. The Ordinary Route is a famous beginner\'s classic. Direct Route and Rowan Tree Slabs are popular intermediates.',
    'The crag is visible directly above the A5 between Capel Curig and Bethesda. Park at the lay-by and scramble up in 5 min.',
    'Lay-by on the A5 directly below the crag, Ogwen Valley (free). Limited spaces.', snowdonia);
  const milestoneMain  = await b('Main Buttress', milestone, 1);
  const milestoneRight = await b('Right Section', milestone, 2);

  for (const route of [
    tradRoute('Ordinary Route',       'VD',  '3c', milestoneMain,  { height: 55, pitches: 2, description: 'The classic Milestone VD — a short but excellent roadside classic. Often the first mountain climb for many Welsh beginners.' }),
    tradRoute('Ivy Chimney',          'D',   '2c', milestoneMain,  { height: 50, pitches: 2, description: 'A classic chimney route — takes the vegetated chimney feature on the main buttress.' }),
    tradRoute('Direct Route',         'HS',  '4b', milestoneMain,  { height: 55, pitches: 2, description: 'The intermediate classic — a more direct line requiring positive moves on compact rhyolite.' }),
    tradRoute('Rowan Tree Slabs',     'VS',  '4c', milestoneRight, { height: 45, pitches: 2, description: 'A fine VS on the right section — good holds and varied climbing above the lake.' }),
    tradRoute('Milestone Direct',     'E1',  '5b', milestoneMain,  { height: 50, pitches: 2, description: 'The direct and harder version — bold face climbing on the main buttress above the road.' }),
    tradRoute('North Buttress',       'S',   '4a', milestoneRight, { height: 45, pitches: 2, description: 'A pleasant Severe on the right section — good holds and reliable gear.' }),
  ]) await r({ ...route, buttressId: route.buttress.id });

  // ── Tryfan East Face ──────────────────────────────────────────────────────
  const tryfan = await c('Tryfan East Face', 53.1030, -3.9873, RockType.OTHER,
    'The classic Ogwen mountain — Tryfan\'s prominent east face above Llyn Ogwen gives mountain routes from Difficult to E2. Grooved Arête is one of the most famous VD routes in Wales; the North Ridge is a classic scramble. The twin summit pinnacles (Adam and Eve) are a Snowdonian icon.',
    'From the A5 Ogwen Valley, follow the path up the east ridge of Tryfan — 45–60 min to the base of the main face.',
    'Ogwen Valley car park on the A5 (pay & display). The main Tryfan approach.', snowdonia);
  const tryfanNorthRidge = await b('North Ridge', tryfan, 1);
  const tryfanGrooved    = await b('Grooved Arête Sector', tryfan, 2);
  const tryfanEast       = await b('East Face Walls', tryfan, 3);

  for (const route of [
    tradRoute('Grooved Arête',        'VD',  '3c', tryfanGrooved,    { height: 150, pitches: 4, description: 'One of the most famous routes in Wales — takes the prominent groove up the Tryfan east face. A magnificent sustained outing in a spectacular mountain position.' }),
    tradRoute('North Ridge Direct',   'S',   '4a', tryfanNorthRidge, { height: 200, pitches: 5, description: 'The classic Tryfan scramble/route — follows the north ridge to the twin summit pinnacles. One of Britain\'s great mountain days.' }),
    tradRoute('Belle Vue Bastion',    'VD',  '3c', tryfanEast,       { height: 90,  pitches: 3, description: 'A classic Tryfan moderate on the east face — varied and absorbing with fine mountain situations.' }),
    tradRoute('Munich Climb',         'VD',  '3c', tryfanGrooved,    { height: 100, pitches: 3, description: 'A fine companion to Grooved Arête — takes an adjacent line on excellent rhyolite.' }),
    tradRoute('Gashed Crag',          'VD',  '3c', tryfanEast,       { height: 80,  pitches: 2, description: 'A classic easier outing on the east face — takes the obvious gash feature.' }),
    tradRoute('East Face Route',      'VS',  '4c', tryfanEast,       { height: 100, pitches: 3, description: 'A sustained VS on the east face — well protected and varied climbing in an outstanding position.' }),
  ]) await r({ ...route, buttressId: route.buttress.id });

  // ── Gribin Facet ──────────────────────────────────────────────────────────
  const gribin = await c('Gribin Facet', 53.1062, -3.9950, RockType.OTHER,
    'A clean rhyolite buttress above the Gribin Ridge between Cwm Idwal and Cwm Bochlwyd with routes from VD to E2. A less visited but excellent crag with compact rock and fine mountain scenery. The crag dries quickly and offers sheltered climbing when the bigger crags are wet.',
    'From Ogwen car park, follow the path to Cwm Idwal then ascend to the Gribin Ridge — 45 min.',
    'Ogwen Valley car park on the A5 (pay & display).', snowdonia);
  const gribinMain = await b('Main Face', gribin, 1);

  for (const route of [
    tradRoute('Gribin Route',         'VD',  '3c', gribinMain, { height: 60,  pitches: 2, description: 'The classic Gribin Facet route — a fine outing on compact rhyolite above Cwm Bochlwyd.' }),
    tradRoute('Facet Wall',           'VS',  '4c', gribinMain, { height: 55,  pitches: 2, description: 'Takes the main wall of the facet — sustained on compact rock with good gear.' }),
    tradRoute('Bochlwyd Arête',       'HVS', '5a', gribinMain, { height: 50,  pitches: 2, description: 'A fine arête above the cwm — exposed and technical with Tryfan as backdrop.' }),
    tradRoute('Gribin Direct',        'E1',  '5b', gribinMain, { height: 55,  pitches: 2, description: 'A bold direct line — committing moves on the compact rhyolite face.' }),
  ]) await r({ ...route, buttressId: route.buttress.id });

  console.log('  ✓ Ogwen Valley: Idwal Slabs, Milestone Buttress, Tryfan East Face, Gribin Facet');
}
