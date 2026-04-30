import { DataSource } from 'typeorm';
import { Region } from '../../modules/crags/entities/region.entity';
import { Crag, RockType } from '../../modules/crags/entities/crag.entity';
import { Buttress } from '../../modules/crags/entities/buttress.entity';
import { Route } from '../../modules/routes/entities/route.entity';
import { findOrCreateRegion, upsertCrag, upsertButtress, upsertRoute, tradRoute } from './seed-helpers';

export async function seedScafellGimmer(ds: DataSource) {
  const regionRepo = ds.getRepository(Region);
  const cragRepo   = ds.getRepository(Crag);
  const buttRepo   = ds.getRepository(Buttress);
  const routeRepo  = ds.getRepository(Route);

  const region = await findOrCreateRegion(regionRepo, { name: 'Lake District', country: 'England' });

  async function c(name: string, lat: number, lng: number, rock: RockType, desc: string, approach: string, parking: string, region: any) {
    return upsertCrag(cragRepo, { name, latitude: lat, longitude: lng, rockType: rock, description: desc, approach, parkingInfo: parking, region, regionId: region.id });
  }
  async function b(name: string, crag: Crag, order = 1) { return upsertButtress(buttRepo, { name, crag, cragId: crag.id, sortOrder: order }); }
  async function r(data: Partial<Route>) { return upsertRoute(routeRepo, data); }

  // ── Scafell Crag ──────────────────────────────────────────────────────────
  const scafell = await c('Scafell Crag', 54.4643, -3.2121, RockType.GRANITE,
    'England\'s most revered mountain crag — the great north face of England\'s highest peak, rising above the lonely Hollow Stones. Routes here carry historic weight: Botterill\'s Slab (1903) was among the first VS in Britain; Central Buttress (1914) was at one time the hardest route in the world. The crag demands respect — routes are long, the rock can be lichenous and the mountain environment is serious. An essential Lake District pilgrimage for any committed climber.',
    'From Wasdale Head, follow the path up Brown Tongue and into Hollow Stones below the crag — a 1.5 to 2 hour approach. Alternatively approach from Eskdale via Cam Spout — a longer but equally fine outing. The crag sits on the northwest face above 800m.',
    'Wasdale Head National Trust car park (pay & display, often full at weekends). Arrive early on popular days. The Wasdale Head Inn provides food and accommodation.', region);
  const scafellPinnacle = await b('Scafell Pinnacle', scafell, 1);
  const scafellCentral  = await b('Central Buttress', scafell, 2);
  const scafellDeep     = await b('Deep Ghyll Area', scafell, 3);

  for (const route of [
    tradRoute('Moss Ghyll',           'VS',  '4b', scafellPinnacle, { height: 120, pitches: 4, description: 'The 1892 classic — a great mountaineering route taking the famous ghyll line on the Pinnacle area. O.G. Jones\'s great discovery. Historical and absorbing multi-pitch climbing in a grand mountain setting.' }),
    tradRoute('Botterill\'s Slab',    'VS',  '4c', scafellPinnacle, { height: 100, pitches: 3, description: 'Fred Botterill\'s 1903 masterpiece — one of the most significant ascents in British climbing history. A superb sustained slab on compact Lakeland rock in a grand mountain position.' }),
    tradRoute('Scafell Pinnacle',     'HS',  '4b', scafellPinnacle, { height: 90,  pitches: 3, description: 'A classic route on the Pinnacle — varied and absorbing mountaineering on superb Scafell rhyolite. A fine introduction to the higher grades of Lakeland climbing.' }),
    tradRoute('Central Buttress',     'E1',  '5b', scafellCentral,  { height: 130, pitches: 4, description: 'The legendary 1914 first ascent by Siegfried Herford — for a decade the hardest route in the world. Takes the great central line of the crag. A multi-pitch masterpiece on rhyolite in the finest mountain setting in England.' }),
    tradRoute('Keswick Brothers',     'VS',  '4c', scafellCentral,  { height: 110, pitches: 3, description: 'A fine mountaineering route on the central section — sustained and engaging with a real mountain character. Named after the early Lakeland climbing pioneers.' }),
    tradRoute('Pisgah Buttress',      'VD',  '3c', scafellDeep,     { height: 80,  pitches: 3, description: 'The classic Scafell moderate — a pleasant mountaineering route in a spectacular setting. One of the best Very Difficults in the Lake District.' }),
    tradRoute('Deep Ghyll Arête',     'S',   '4a', scafellDeep,     { height: 70,  pitches: 2, description: 'A classic severe on the Deep Ghyll area — sustained and absorbing climbing above the ghyll in a magnificent mountain environment.' }),
  ]) await r({ ...route, buttressId: route.buttress.id });

  // ── Scafell East Buttress ─────────────────────────────────────────────────
  const scafellEast = await c('Scafell East Buttress', 54.4640, -3.2100, RockType.GRANITE,
    'The steeper and more modern companion to the main Scafell Crag — the East Buttress offers harder routes on excellent compact rhyolite. Yellow Slab and Morning Wall represent some of the finest high-mountain climbing in England. Approached from Hollow Stones with the routes right of the main Scafell face.',
    'Approach as for Scafell Crag — from Wasdale Head via Brown Tongue and Hollow Stones (1.5–2 hours). The East Buttress is the steep wall to the right of the main crag.',
    'Wasdale Head National Trust car park (pay & display). Shared approach with the main Scafell Crag routes.', region);
  const eastMain   = await b('Main Face', scafellEast, 1);
  const eastSlab   = await b('Yellow Slab Area', scafellEast, 2);
  const eastGroove = await b('Groove Sector', scafellEast, 3);

  for (const route of [
    tradRoute('Leverage',             'E2',  '5b', eastMain,   { height: 100, pitches: 3, description: 'A fine East Buttress E2 — sustained and absorbing climbing on compact rhyolite high on Scafell. Excellent rock with reliable protection for the grade.' }),
    tradRoute('Yellow Slab',          'E3',  '5c', eastSlab,   { height: 90,  pitches: 3, description: 'One of the Lake District\'s great E3s — a magnificent sustained slab route on perfect compact rock. Technical and delicate moves requiring precise footwork in a serious mountain situation.' }),
    tradRoute('Morning Wall',         'E4',  '6a', eastMain,   { height: 100, pitches: 3, description: 'The East Buttress testpiece — a bold and serious route on the main wall requiring absolute commitment. One of the hardest and most respected routes in Lakeland.' }),
    tradRoute('East Buttress Eliminate', 'E2', '5b', eastMain, { height: 95,  pitches: 3, description: 'A sustained E2 eliminate line — varied and absorbing climbing on the east face. Excellent quality rock and reliable gear for the mountain situation.' }),
    tradRoute('Mickledore Grooves',   'VS',  '4c', eastGroove, { height: 80,  pitches: 3, description: 'A classic VS on the groove system — sustained bridging and layback climbing in fine mountain positions. One of the great moderate routes on the East Buttress.' }),
  ]) await r({ ...route, buttressId: route.buttress.id });

  // ── Gimmer Crag ───────────────────────────────────────────────────────────
  const gimmer = await c('Gimmer Crag', 54.4530, -3.0670, RockType.GRANITE,
    'The finest mountain crag in Langdale and one of the best crags in England — a magnificent clean sweep of Lakeland rhyolite on the flank of Loft Crag above Great Langdale. Gimmer Crack is one of the great VS pitches in Britain; Kipling Groove is a world-famous HVS. The crag dries quickly, has excellent sound rock, and routes cover every grade from VD to E5 with exceptional quality throughout.',
    'From the ODG or Stickle Tarn car park at the head of Great Langdale, follow the path steeply up towards Loft Crag — 45–60 min to the base of the crag. The approach is steep but well-worn.',
    'National Trust car parks at the head of Great Langdale (pay & display). The ODG (Old Dungeon Ghyll) and NDG (New Dungeon Ghyll) car parks are both convenient. Often full at summer weekends.', region);
  const gimmerSouth = await b('South-East Face', gimmer, 1);
  const gimmerNW    = await b('North-West Face', gimmer, 2);
  const gimmerB     = await b('B & C Buttress', gimmer, 3);

  for (const route of [
    tradRoute('Gimmer Crack',         'VS',  '4c', gimmerSouth, { height: 55, pitches: 2, description: 'One of the great VS pitches in Britain — a superb sustained crack on excellent Gimmer rhyolite. The definitive lakeland VS and a rite of passage for any serious UK climber.' }),
    tradRoute('Ash Tree Slabs',       'VD',  '3c', gimmerSouth, { height: 50, pitches: 2, description: 'The classic Gimmer moderate — a fine slab route on perfect sound rhyolite. Well-protected and delightful in a magnificent mountain setting above Langdale.' }),
    tradRoute('Kipling Groove',       'HVS', '5a', gimmerNW,    { height: 60, pitches: 2, description: 'The world-famous Gimmer HVS — Kipling Groove takes the great groove line on the north-west face in superb style. "If you can keep your head when all about you are losing theirs — you\'ll be a Kipling Groove leader."' }),
    tradRoute('D Route',              'VD',  '3c', gimmerNW,    { height: 45, pitches: 2, description: 'A classic Gimmer moderate on the north-west face — a well-marked route with a natural line on sound rock. Often used as an introduction to Gimmer.' }),
    tradRoute('Hiatus',               'VS',  '4c', gimmerNW,    { height: 50, pitches: 2, description: 'A fine VS on the north-west face — sustained and varied climbing with the characteristic Gimmer quality of rock and position.' }),
    tradRoute('Gimmer String',        'VS',  '4c', gimmerSouth, { height: 55, pitches: 3, description: 'A sustained VS string of pitches up the south-east face — taking several classic variations to give an absorbing outing. A superb mountaineering day out.' }),
    tradRoute('North-West Arête',     'VD',  '3c', gimmerNW,    { height: 45, pitches: 2, description: 'A classic arête route — the natural line on the edge of the north-west face. Fine positions with views down Great Langdale.' }),
  ]) await r({ ...route, buttressId: route.buttress.id });

  // ── Raven Crag Langdale ───────────────────────────────────────────────────
  const ravenLangdale = await c('Raven Crag Langdale', 54.4450, -3.0870, RockType.GRANITE,
    'The most prominent crag in Great Langdale — a large north-facing buttress of sound rhyolite rising above the valley floor. Middlefell Buttress is one of the most popular VD routes in the Lake District. Lower than Gimmer and drying less quickly, but offering accessible and quality climbing with a mountain atmosphere.',
    'From the Langdale car parks at the head of the valley, follow the path up towards the crag — 20–30 min. Middlefell Buttress starts at the foot of the main cliff.',
    'National Trust car parks at the head of Great Langdale (pay & display). Old Dungeon Ghyll or Stickle Tarn car parks. Very popular at weekends.', region);
  const ravenMain   = await b('Main Buttress', ravenLangdale, 1);
  const ravenLeft   = await b('Left Wall', ravenLangdale, 2);
  const ravenScramble = await b('Scramble Area', ravenLangdale, 3);

  for (const route of [
    tradRoute('Middlefell Buttress',  'VD',  '3c', ravenMain,      { height: 75, pitches: 3, description: 'One of the most popular routes in the Lake District — a magnificent VD up the main buttress in a grand valley setting. Excellent rock, natural line, good protection. A Langdale classic for all abilities.' }),
    tradRoute('Bilberry Buttress',    'S',   '4a', ravenMain,      { height: 60, pitches: 2, description: 'A pleasant route on the main buttress — varied climbing on sound rhyolite above the bilberry terraces. A fine companion to Middlefell.' }),
    tradRoute('Jack\'s Rake',         'VD',  '3c', ravenScramble,  { height: 90, pitches: 1, description: 'The famous Langdale via ferrata-style rake — a classic scrambling route crossing the face of Pavey Ark on a natural terrace. Not technically a rock climb but one of the great Lakeland expeditions.' }),
    tradRoute('Plaque Route',         'VS',  '4b', ravenLeft,      { height: 55, pitches: 2, description: 'A fine VS on the left wall — sustained and absorbing climbing on good Langdale rhyolite. Takes the natural line left of the main buttress.' }),
    tradRoute('Holly Tree Traverse',  'HS',  '4b', ravenMain,      { height: 65, pitches: 2, description: 'A traversing route across the main face — varied and interesting climbing linking natural features. A popular outing in the valley.' }),
  ]) await r({ ...route, buttressId: route.buttress.id });

  // ── White Ghyll Crag ──────────────────────────────────────────────────────
  const whiteGhyll = await c('White Ghyll Crag', 54.4500, -3.0750, RockType.GRANITE,
    'A fine compact crag in a steep ghyll above Great Langdale — excellent rough rhyolite on a series of slabs and walls. White Ghyll Wall is a superbly positioned VS; Slip Knot and Haste Not provide fine E1 and HVS outings. The ghyll setting adds atmosphere and the crag dries well in good conditions.',
    'From the Langdale car parks, follow the path up the White Ghyll to the base of the crag — 30–40 min. The approach follows the ghyll stream in a pleasant enclosed valley.',
    'National Trust car parks at the head of Great Langdale (pay & display). Park at Stickle Tarn or ODG car parks and follow the White Ghyll approach.', region);
  const whiteGhyllSlab  = await b('Main Slab', whiteGhyll, 1);
  const whiteGhyllWall  = await b('Upper Wall', whiteGhyll, 2);
  const whiteGhyllRight = await b('Right Edge', whiteGhyll, 3);

  for (const route of [
    tradRoute('White Ghyll Wall',     'VS',  '4b', whiteGhyllSlab,  { height: 45, pitches: 2, description: 'The classic White Ghyll VS — a superb sustained route on perfect rough rhyolite. Excellent friction and natural line in a fine ghyll setting. One of the best VSs in Langdale.' }),
    tradRoute('Slip Knot',            'E1',  '5a', whiteGhyllWall,  { height: 40, pitches: 2, description: 'A fine E1 on the upper wall — technical and sustained moves on compact rhyolite above good runners. A well-regarded route for those stepping up from VS.' }),
    tradRoute('Haste Not',            'HVS', '5a', whiteGhyllWall,  { height: 42, pitches: 2, description: 'A well-known White Ghyll classic — sustained HVS climbing on the upper wall. Technical moves requiring good footwork above reliable gear.' }),
    tradRoute('White Ghyll Slabs Eliminate', 'HVS', '5a', whiteGhyllSlab, { height: 45, pitches: 2, description: 'A technical eliminate on the main slab — harder and more direct than the classic slab route. Requires precise friction and balance.' }),
    tradRoute('Gwynne\'s Chimney',    'VD',  '3c', whiteGhyllRight, { height: 35, pitches: 1, description: 'The accessible route at White Ghyll — a fine chimney taking the natural weakness on the right side. Well protected and enjoyable in the ghyll setting.' }),
  ]) await r({ ...route, buttressId: route.buttress.id });

  console.log('  ✓ Scafell & Gimmer: Scafell Crag, Scafell East Buttress, Gimmer Crag, Raven Crag Langdale, White Ghyll Crag');
}
