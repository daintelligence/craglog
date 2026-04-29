import { DataSource } from 'typeorm';
import { Region } from '../../modules/crags/entities/region.entity';
import { Crag, RockType } from '../../modules/crags/entities/crag.entity';
import { Buttress } from '../../modules/crags/entities/buttress.entity';
import { Route } from '../../modules/routes/entities/route.entity';
import { findOrCreateRegion, upsertCrag, upsertButtress, upsertRoute, tradRoute } from './seed-helpers';

export async function seedBenNevisCrags(ds: DataSource) {
  const regionRepo = ds.getRepository(Region);
  const cragRepo   = ds.getRepository(Crag);
  const buttRepo   = ds.getRepository(Buttress);
  const routeRepo  = ds.getRepository(Route);

  const highlands = await findOrCreateRegion(regionRepo, { name: 'Scottish Highlands', country: 'Scotland' });

  async function c(name: string, lat: number, lng: number, rock: RockType, desc: string, approach: string, parking: string, region: any) {
    return upsertCrag(cragRepo, { name, latitude: lat, longitude: lng, rockType: rock, description: desc, approach, parkingInfo: parking, region, regionId: region.id });
  }
  async function b(name: string, crag: Crag, order = 1) { return upsertButtress(buttRepo, { name, crag, cragId: crag.id, sortOrder: order }); }
  async function r(data: Partial<Route>) { return upsertRoute(routeRepo, data); }

  // ── CIC Hut Crags (Ben Nevis North Face) ────────────────────────────────
  const cicCrags = await c('Ben Nevis North Face', 56.8033, -5.0026, RockType.GRANITE,
    'The greatest mountain crag in Britain — the 700m North Face of Ben Nevis holds some of the most serious and committing routes in the UK. Tower Ridge is a legendary mountaineering route. The CIC Hut sits below the face. Routes range from Grade III winter to E5 summer. Essential Highland experience.',
    'From Fort William, drive to the North Face car park at Torlundy. Follow the path to the CIC Hut (2 hours). Routes start above the hut. Full mountain gear required — the crag is at 1100m+.',
    'North Face car park, Torlundy road, Fort William (free). Also accessible via the tourist path from Achintee.', highlands);
  const towerRidge  = await b('Tower Ridge', cicCrags, 1);
  const carnDearg   = await b('Carn Dearg Buttress', cicCrags, 2);
  const observatory = await b('Observatory Buttress', cicCrags, 3);
  const orionFace   = await b('Orion Face', cicCrags, 4);
  const minusOne    = await b('Minus One Buttress', cicCrags, 5);

  for (const route of [
    tradRoute('Tower Ridge',          'VD',  '3c', towerRidge,  { height: 600, pitches: 8, description: 'The great classic of Ben Nevis — a magnificent sustained ridge requiring route-finding and confidence on exposed ground above the North Face.' }),
    tradRoute('Tower Scoop',          'HVS', '5a', towerRidge,  { height: 80,  pitches: 2, description: 'A harder direct variant on Tower Ridge — technical climbing in an impressive mountain setting.' }),
    tradRoute('The Great Tower',      'S',   '4a', towerRidge,  { height: 120, pitches: 3, description: 'Takes the prominent tower on the ridge — exposed and serious in a magnificent position.' }),
    tradRoute('Centurion',            'E3',  '5c', carnDearg,   { height: 200, pitches: 4, description: 'The great Carn Dearg Buttress route — sustained technical climbing on perfect granite up one of Scotland\'s biggest rock faces.' }),
    tradRoute('Route II',             'E1',  '5b', carnDearg,   { height: 180, pitches: 4, description: 'A classic of its grade on Carn Dearg — varied climbing on excellent granite with fine situations.' }),
    tradRoute('Torro',                'E2',  '5c', carnDearg,   { height: 160, pitches: 3, description: 'A magnificent route on the buttress — sustained and well protected on good Scottish granite.' }),
    tradRoute('Rubicon Wall',         'VS',  '5a', carnDearg,   { height: 120, pitches: 3, description: 'An excellent long route on the lower buttress — a wonderful introduction to Ben Nevis rock climbing.' }),
    tradRoute('Stringendo',           'E2',  '5c', observatory, { height: 150, pitches: 3, description: 'The premier route on Observatory Buttress — a sustained and serious mountain rock climb.' }),
    tradRoute('Observatory Buttress Route', 'VS', '4c', observatory, { height: 180, pitches: 4, description: 'The main route on the buttress — varied and satisfying on excellent granite in a spectacular position.' }),
    tradRoute('Orion Direct',         'VS',  '5a', orionFace,   { height: 300, pitches: 5, description: 'The great Orion Face classic — a major undertaking up the most continuous section of the North Face.' }),
    tradRoute('Zero Gully',           'HVS', '5a', orionFace,   { height: 250, pitches: 4, description: 'The summer classic on the Orion Face — a steep sustained route requiring commitment.' }),
    tradRoute('Minus One Direct',     'E2',  '5c', minusOne,    { height: 200, pitches: 4, description: 'The direct line up Minus One Buttress — a serious and sustained mountain rock climb.' }),
  ]) await r({ ...route, buttressId: route.buttress.id });

  // ── Polldubh Crags (Lower Ben Nevis) ─────────────────────────────────────
  const polldubh = await c('Polldubh Crags', 56.8150, -5.0620, RockType.GRANITE,
    'A collection of excellent roadside granite crags in the lower Glen Nevis gorge, giving routes from VD to E5 in a spectacular setting. Far more accessible than the North Face — a 5-minute walk from the road. One of Scotland\'s finest roadside venues with routes for all grades.',
    'From Fort William, drive up Glen Nevis road to the upper car park. Crags are visible from the road — 5 min walk.',
    'Upper Glen Nevis car park (pay & display in season). Lower options on the Glen Nevis road.', highlands);
  const secretAgent = await b('Secret Agent Buttress', polldubh, 1);
  const waterSlide  = await b('Waterslide Slab', polldubh, 2);
  const buachaille  = await b('Buachaille Slab', polldubh, 3);

  for (const route of [
    tradRoute('Secret Agent',         'HVS', '5a', secretAgent, { height: 30, description: 'The classic of the crag — sustained technical climbing on excellent Glen Nevis granite.' }),
    tradRoute('Conspiracy',           'E2',  '5c', secretAgent, { height: 28, description: 'A serious and bold route on the main buttress — requires good technique on compact granite.' }),
    tradRoute('Waterslide Slab',      'VS',  '4b', waterSlide,  { height: 35, description: 'A classic friction route up the slab beside the waterslide — perfect granite, balance and technique.' }),
    tradRoute('Resurrection',         'E1',  '5b', waterSlide,  { height: 35, description: 'A fine direct route up the slab — technical and satisfying on excellent rock.' }),
    tradRoute('Buachaille Slab Route','VD',  '3c', buachaille,  { height: 30, description: 'A pleasant easy route on the lower slab — good introduction to Glen Nevis granite.' }),
    tradRoute('Glen Nevis Wall',      'HS',  '4b', buachaille,  { height: 28, description: 'A popular route on good granite above the gorge — enjoyable climbing in a beautiful setting.' }),
  ]) await r({ ...route, buttressId: route.buttress.id });

  console.log('  ✓ Ben Nevis: North Face (Tower Ridge, Carn Dearg, Observatory, Orion Face), Polldubh Crags');
}
