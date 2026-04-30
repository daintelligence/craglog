import { DataSource } from 'typeorm';
import { Region } from '../../modules/crags/entities/region.entity';
import { Crag, RockType } from '../../modules/crags/entities/crag.entity';
import { Buttress } from '../../modules/crags/entities/buttress.entity';
import { Route } from '../../modules/routes/entities/route.entity';
import { findOrCreateRegion, upsertCrag, upsertButtress, upsertRoute, tradRoute, sportRoute } from './seed-helpers';

export async function seedEastMidlands(ds: DataSource) {
  const regionRepo = ds.getRepository(Region);
  const cragRepo   = ds.getRepository(Crag);
  const buttRepo   = ds.getRepository(Buttress);
  const routeRepo  = ds.getRepository(Route);

  const region = await findOrCreateRegion(regionRepo, { name: 'East Midlands', country: 'England' });

  async function c(name: string, lat: number, lng: number, rock: RockType, desc: string, approach: string, parking: string, region: any) {
    return upsertCrag(cragRepo, { name, latitude: lat, longitude: lng, rockType: rock, description: desc, approach, parkingInfo: parking, region, regionId: region.id });
  }
  async function b(name: string, crag: Crag, order = 1) { return upsertButtress(buttRepo, { name, crag, cragId: crag.id, sortOrder: order }); }
  async function r(data: Partial<Route>) { return upsertRoute(routeRepo, data); }

  // ── Charnwood Forest ───────────────────────────────────────────────────────
  const charnwood = await c('Charnwood Forest', 52.6950, -1.2200, RockType.GRANITE,
    'Ancient Precambrian volcanic outcrops in the heart of Leicestershire — some of the oldest exposed rock in England at over 600 million years old. The Charnwood crags include Beacon Hill, Bradgate Park outcrops, and various small tors of rough, compact rock with routes from VD to E2. A unique geological environment and an important venue for Midlands climbers. The rock is ancient rhyolite and granite with excellent friction.',
    'Multiple access points within the Charnwood Forest area. For Beacon Hill, follow the footpath from Woodhouse Eaves — 15 min. For Bradgate Park outcrops, enter from the main gate at Newton Linford.',
    'Beacon Hill Country Park car park at Woodhouse Eaves (pay & display). Bradgate Park car parks at Newton Linford and Hallgates (pay & display, Bradgate Park Trust).', region);
  const charnwoodMain   = await b('Main Buttress', charnwood, 1);
  const charnwoodSouth  = await b('South Face', charnwood, 2);
  const charnwoodNorth  = await b('North Crag', charnwood, 3);

  for (const route of [
    tradRoute('Charnwood Classic',  'VS',  '4c', charnwoodMain,  { height: 14, description: 'The signature route of the Charnwood Forest crags — a fine line on ancient Precambrian rock. Well protected and technically engaging.' }),
    tradRoute('Main Buttress',      'HVS', '5a', charnwoodMain,  { height: 14, description: 'Takes the main buttress directly — sustained face climbing on excellent ancient volcanic rock with superb friction.' }),
    tradRoute('Granite Crack',      'E1',  '5b', charnwoodMain,  { height: 12, description: 'A technical crack route on the main buttress — well protected jams on the ancient rough rock of the East Midlands.' }),
    tradRoute('Forest Wall',        'VS',  '4b', charnwoodSouth, { height: 12, description: 'A pleasant wall route on the south face — good holds on rough Precambrian volcanic rock in a woodland setting.' }),
    tradRoute('Low Route',          'VD',  '3b', charnwoodSouth, { height: 10, description: 'An accessible moderate on the south face — a pleasant introduction to Charnwood geology on ancient rough rock.' }),
    tradRoute('North Crag Route',   'HS',  '4a', charnwoodNorth, { height: 12, description: 'A fine route on the north crag — varied climbing on rough Precambrian rock with good natural protection.' }),
    tradRoute('Precambrian Wall',   'E2',  '5c', charnwoodMain,  { height: 14, description: 'The hardest route on the main buttress — bold and technical on compact ancient volcanic rock. A serious Leicestershire undertaking.' }),
  ]) await r({ ...route, buttressId: route.buttress.id });

  // ── Creswell Crags ─────────────────────────────────────────────────────────
  const creswell = await c('Creswell Crags', 53.2628, -1.1948, RockType.LIMESTONE,
    'A remarkable limestone gorge on the Nottinghamshire-Derbyshire border — famous worldwide for its Ice Age cave art (the only cave art found in Britain) and surprisingly good sport climbing. The compact Magnesian limestone walls hold routes from 6a to 7b+ on featured vertical to slightly overhanging rock. An extraordinary combination of archaeological heritage and modern sport climbing in a beautiful gorge setting.',
    'Creswell Crags is well signposted from the A60 and B6042. Follow the path along the gorge from the visitor centre — 5 min to the climbing areas.',
    'Creswell Crags Visitor Centre car park off the B6042 between Creswell and Whitwell (pay & display). The visitor centre houses important prehistoric cave art exhibits.', region);
  const creswellCave = await b('Cave Wall', creswell, 1);
  const creswellGorge = await b('Gorge Face', creswell, 2);

  for (const route of [
    sportRoute('Creswell Classic',  '6b',  creswellGorge, { height: 14, description: 'The accessible classic of Creswell Crags — a sustained sport route on compact Magnesian limestone in the famous Ice Age gorge.' }),
    sportRoute('Cave Wall',         '6c',  creswellCave,  { height: 14, description: 'A fine route on the cave wall sector — climbs the limestone beside one of Britain\'s most important prehistoric cave art sites.' }),
    sportRoute('Gorge Route',       '7a',  creswellGorge, { height: 16, description: 'A technical route on the gorge wall — sustained face climbing on compact Magnesian limestone with a serious crux section.' }),
    sportRoute('Creswell Sport',    '7b',  creswellGorge, { height: 16, description: 'The testpiece of Creswell Crags — the hardest commonly climbed route in the gorge, requiring strength and precision on compact limestone.' }),
    sportRoute('Gorge Wall',        '6a+', creswellCave,  { height: 12, description: 'An introductory route in the gorge — accessible and well bolted on the lower walls beside the archaeological caves.' }),
    sportRoute('Easy Creswell',     '5+',  creswellGorge, { height: 10, description: 'The most accessible sport route in the gorge — an excellent introduction to limestone sport climbing in an extraordinary setting.' }),
  ]) await r({ ...route, buttressId: route.buttress.id });

  // ── Rainster Rocks ─────────────────────────────────────────────────────────
  const rainster = await c('Rainster Rocks', 53.0830, -1.6860, RockType.LIMESTONE,
    'A pleasant group of Derbyshire limestone crags near Brassington on the White Peak plateau — natural outcrops rather than quarried rock, giving a more traditional climbing experience. Routes from S to HVS on rough grey limestone with fine views across the White Peak. A peaceful and undervisited venue beloved by local Derbyshire climbers. The natural arches and boulders make this an atmospheric spot.',
    'From Brassington village, follow the footpath east across the White Peak plateau to Rainster Rocks — 20 min walk on good paths.',
    'Brassington village roadside parking (free). Narrow village lanes — please park considerately.', region);
  const rainsterMain = await b('Main Face', rainster, 1);

  for (const route of [
    tradRoute('Rainster Classic',   'VS',  '4c', rainsterMain, { height: 14, description: 'The classic Rainster Rocks route — a fine line on natural Derbyshire limestone with excellent holds and good protection.' }),
    tradRoute('Natural Arch',       'HVS', '5a', rainsterMain, { height: 12, description: 'Takes the line through the remarkable natural arch feature — a unique and atmospheric route on the White Peak plateau.' }),
    tradRoute('Lower Wall',         'S',   '3c', rainsterMain, { height: 12, description: 'An accessible moderate on the main rocks — pleasant climbing on rough natural limestone above the White Peak.' }),
    tradRoute('Rainster Crack',     'E1',  '5b', rainsterMain, { height: 14, description: 'A fine crack route on the main face — technical and well protected on compact Derbyshire limestone.' }),
    tradRoute('Arch Route',         'HS',  '4b', rainsterMain, { height: 12, description: 'Approaches the arch from a different angle — an atmospheric route on the White Peak plateau outcrops.' }),
  ]) await r({ ...route, buttressId: route.buttress.id });

  // ── Whatstandwell ──────────────────────────────────────────────────────────
  const whatstandwell = await c('Whatstandwell', 53.0765, -1.4893, RockType.LIMESTONE,
    'Short but worthwhile limestone outcrops in the Derwent Valley near Whatstandwell — one of several small Derbyshire limestone venues between Matlock Bath and Ambergate. Routes from VS to E2 on compact grey limestone with some sport potential. A pleasant local venue with easy access from the A6 corridor and convenient for Derby and Nottingham climbers wanting a quick after-work session.',
    'From Whatstandwell village on the A6, follow the footpath along the Cromford Canal towpath then up the hillside to the outcrops — 15 min.',
    'Whatstandwell village roadside parking near the canal bridge (free) or the Cromford Canal car park at Ambergate.', region);
  const whatstandMain = await b('River Face', whatstandwell, 1);

  for (const route of [
    tradRoute('Whatstandwell Route', 'E1',  '5b', whatstandMain, { height: 12, description: 'The best route at Whatstandwell — a technical E1 on compact Derbyshire limestone in the Derwent Valley.' }),
    sportRoute('Short Sport',        '6c',  whatstandMain, { height: 10, description: 'A short sport route on the river face — powerful moves on compact limestone with a distinct crux sequence.' }),
    tradRoute('Direct Route',        'VS',  '4c', whatstandMain, { height: 12, description: 'A classic direct line — well protected and sustained on the main limestone face above the Derwent Valley.' }),
    tradRoute('River Face',          'HS',  '4a', whatstandMain, { height: 10, description: 'A pleasant route on the river face — well featured limestone above the Derwent with good holds and natural gear.' }),
  ]) await r({ ...route, buttressId: route.buttress.id });

  // ── Aldwark Quarry ─────────────────────────────────────────────────────────
  const aldwark = await c('Aldwark Quarry', 53.1950, -1.6150, RockType.LIMESTONE,
    'A compact limestone sport quarry in Derbyshire near Grangemill — vertical to slightly overhanging walls on compact grey limestone with routes from 6b to 7b+. A useful addition to the White Peak sport climbing portfolio and popular with local climbers from Derby, Nottingham and Sheffield. The quarry walls are generally sound and well bolted. Sheltered from the wind and quick to dry.',
    'From the A5012 near Grangemill, follow the minor road to Aldwark village then the footpath to the quarry — 10 min.',
    'Roadside parking near Aldwark village on the minor road off the A5012 (free). Narrow road — park in designated areas.', region);
  const aldwarkMain = await b('Main Wall', aldwark, 1);

  for (const route of [
    sportRoute('Aldwark Sport',  '7a',  aldwarkMain, { height: 14, description: 'The crag classic — a sustained 7a on compact Derbyshire limestone that has become a benchmark for White Peak sport climbing.' }),
    sportRoute('Quarry Wall',    '6b',  aldwarkMain, { height: 12, description: 'An accessible route on the main wall — well bolted and sustained on featured limestone. A good introduction to the quarry.' }),
    sportRoute('Top Route',      '7b+', aldwarkMain, { height: 16, description: 'The hardest route at Aldwark — a demanding sequence on the steepest part of the upper section. A serious Derbyshire sport climbing challenge.' }),
    sportRoute('Aldwark Classic','6c',  aldwarkMain, { height: 14, description: 'A fine mid-grade route at the quarry — sustained technical climbing on well-featured limestone. Very popular with local sport climbers.' }),
  ]) await r({ ...route, buttressId: route.buttress.id });

  console.log('  ✓ East Midlands: Charnwood Forest, Creswell Crags, Rainster Rocks, Whatstandwell, Aldwark Quarry');
}
