import { DataSource } from 'typeorm';
import { Region } from '../../modules/crags/entities/region.entity';
import { Crag, RockType } from '../../modules/crags/entities/crag.entity';
import { Buttress } from '../../modules/crags/entities/buttress.entity';
import { Route } from '../../modules/routes/entities/route.entity';
import { findOrCreateRegion, upsertCrag, upsertButtress, upsertRoute, tradRoute } from './seed-helpers';

export async function seedLakeDistrictHighCrags(ds: DataSource) {
  const regionRepo = ds.getRepository(Region);
  const cragRepo   = ds.getRepository(Crag);
  const buttRepo   = ds.getRepository(Buttress);
  const routeRepo  = ds.getRepository(Route);

  const scafell   = await findOrCreateRegion(regionRepo, { name: 'Scafell & Wasdale', country: 'England' });
  const langdale  = await findOrCreateRegion(regionRepo, { name: 'Langdale', country: 'England' });
  const wasdale   = await findOrCreateRegion(regionRepo, { name: 'Lake District', country: 'England' });

  async function c(name: string, lat: number, lng: number, rock: RockType, desc: string, approach: string, parking: string, region: any) {
    return upsertCrag(cragRepo, { name, latitude: lat, longitude: lng, rockType: rock, description: desc, approach, parkingInfo: parking, region, regionId: region.id });
  }
  async function b(name: string, crag: Crag, order = 1) { return upsertButtress(buttRepo, { name, crag, cragId: crag.id, sortOrder: order }); }
  async function r(data: Partial<Route>) { return upsertRoute(routeRepo, data); }

  // ── Scafell East Buttress ─────────────────────────────────────────────────
  const scafellEast = await c('Scafell East Buttress', 54.4533, -3.2148, RockType.OTHER,
    'The steeper and more serious companion to Scafell Crag — a massive wall of rough Lakeland rhyolite with routes from E1 to E6. Fully remote and high, often winning over Scafell Crag for atmosphere and quality. The Great Eastern Route and Morning Wall are exceptional.',
    'From Wasdale Head via Hollow Stones and Brown Tongue (Scafell approach) — 90 min. Alternatively from Borrowdale via Esk Hause — 2 hours.',
    'Wasdale Head Inn car park (NT, pay & display). National Trust campsite also available.', scafell);
  const eastMain  = await b('Central Wall', scafellEast, 1);
  const eastRight = await b('Right Section', scafellEast, 2);
  for (const route of [
    tradRoute('Morning Wall',          'E2',  '5c', eastMain,  { height: 90,  pitches: 3, description: 'A serious expedition on high mountain rock — takes the great wall with sustained technical climbing.' }),
    tradRoute('Overhanging Wall',      'E4',  '6a', eastMain,  { height: 80,  pitches: 2, description: 'The hardest classic — steep and committing on the central wall. A true test of mountain climbing ability.' }),
    tradRoute('Great Eastern Route',   'E1',  '5b', eastRight, { height: 100, pitches: 4, description: 'The finest route on the buttress — four pitches of sustained mountaineering on excellent rock.' }),
    tradRoute('Mickledore Grooves',    'HVS', '5a', eastRight, { height: 80,  pitches: 3, description: 'Excellent climbing on good rock — sustained and varied with a fine position above Mickledore.' }),
    tradRoute('East Buttress Crack',   'VS',  '4c', eastRight, { height: 70,  pitches: 3, description: 'The easiest major route on the buttress — a fine outing none the less.' }),
  ]) await r({ ...route, buttressId: route.buttress.id });

  // ── Gable Crag ────────────────────────────────────────────────────────────
  const gableCrag = await c('Gable Crag', 54.4818, -3.2190, RockType.OTHER,
    'A high, north-facing crag on Great Gable giving serious mountain climbing from VS to E4. The crag is slow to dry but offers superb rough rhyolite in a truly mountain setting. Engineer\'s Slabs and Raven\'s Groove are the celebrated classics.',
    'From Wasdale Head via Beck Head (the col between Great Gable and Kirk Fell) — 90 min approach with 600m ascent.',
    'Wasdale Head Inn NT car park (pay & display). Approach via Sty Head is an alternative.', wasdale);
  const gableMain  = await b('Main Crag', gableCrag, 1);
  const gableSlabs = await b('Engineer\'s Slabs', gableCrag, 2);
  for (const route of [
    tradRoute('Engineer\'s Slabs',     'VD',  '3c', gableSlabs, { height: 60,  pitches: 3, description: 'The celebrated classic — long, angled slabs on perfect rough rock. One of the great Lake District routes of its grade.' }),
    tradRoute('Raven\'s Groove',       'VS',  '4c', gableMain,  { height: 70,  pitches: 3, description: 'A superb groove route in a dramatic position — sustained on excellent rock.' }),
    tradRoute('Sledgate Ridge',        'HVS', '5a', gableMain,  { height: 65,  pitches: 3, description: 'Takes the ridge line with fine, varied climbing — a mountaineering route of the highest quality.' }),
    tradRoute('Gable Crag Direct',     'E2',  '5c', gableMain,  { height: 60,  pitches: 2, description: 'The modern testpiece — serious mountain E2 in a fully committing situation.' }),
    tradRoute('Oblique Chimney',       'D',   '3a', gableSlabs, { height: 45,  pitches: 2, description: 'An easier outing on the slabs — a good introduction to the crag.' }),
  ]) await r({ ...route, buttressId: route.buttress.id });

  // ── Bowfell Buttress ───────────────────────────────────────────────────────
  const bowfell = await c('Bowfell Buttress', 54.4503, -3.1565, RockType.OTHER,
    'A magnificent mountain buttress on Bowfell giving classic multi-pitch routes from Difficult to E3 on rough Lakeland rock. One of the most rewarding crags in the Lake District — remote, dramatic and with superb rock. The classic route is a Lakeland tick.',
    'From the Old Dungeon Ghyll Hotel, follow the Band onto Bowfell — 90 min to the buttress.',
    'Old Dungeon Ghyll Hotel car park, Great Langdale (NT, pay & display).', langdale);
  const bowfellMain = await b('Main Buttress', bowfell, 1);
  const bowfellLeft = await b('Left Edge', bowfell, 2);
  for (const route of [
    tradRoute('Bowfell Buttress',      'D',   '3b', bowfellMain, { height: 120, pitches: 5, description: 'The great classic — five pitches up this magnificent mountain crag. One of the finest Diffs in the Lake District.' }),
    tradRoute('Sword of Damocles',     'VS',  '4c', bowfellMain, { height: 100, pitches: 4, description: 'A serious mountain route — sustained and committing in a high position.' }),
    tradRoute('Sinister Grooves',      'HVS', '5a', bowfellMain, { height: 90,  pitches: 4, description: 'Takes the groove system on the left side — technical and varied.' }),
    tradRoute('Cambridge Crag',        'HS',  '4b', bowfellLeft, { height: 80,  pitches: 3, description: 'A classic three-pitch route on the left edge — superb positions above Langdale.' }),
    tradRoute('Long Climb',            'VD',  '3c', bowfellMain, { height: 130, pitches: 5, description: 'One of the longest routes on Bowfell — sustained moderate climbing with a magnificent finish.' }),
  ]) await r({ ...route, buttressId: route.buttress.id });

  // ── Kern Knotts ───────────────────────────────────────────────────────────
  const kernKnotts = await c('Kern Knotts', 54.4762, -3.2075, RockType.OTHER,
    'A small but perfectly formed crag on the flanks of Great Gable — home to some of the finest short routes in the Lake District. Kern Knotts Crack is a legendary HVS, one of the most famous routes in England. Quick to reach and quick to dry.',
    'From Sty Head (reached from Wasdale Head in 60 min), Kern Knotts is visible on the right flank of Great Gable — 10 min from Sty Head.',
    'Wasdale Head NT car park (pay & display). Can also approach from Seathwaite in Borrowdale.', wasdale);
  const kernMain  = await b('Main Crag', kernKnotts, 1);
  const kernChimney = await b('Chimney Area', kernKnotts, 2);
  for (const route of [
    tradRoute('Kern Knotts Crack',     'HVS', '5a', kernMain,    { height: 25, description: 'The legendary route — a sustained and exposed crack climb that has been testing climbers since the 1890s. An absolute Lake District classic.' }),
    tradRoute('Kern Knotts Chimney',   'D',   '3a', kernChimney, { height: 20, description: 'The classic easy route — a good chimney giving an intro to this great crag.' }),
    tradRoute('Buttonhook Route',      'VD',  '3c', kernMain,    { height: 22, description: 'An interesting route threading through the features of the crag.' }),
    tradRoute('Innominate Crack',      'VS',  '4c', kernMain,    { height: 20, description: 'A classic VS taking the secondary crack line — almost as good as its famous neighbour.' }),
    tradRoute('Sepulchre',             'E1',  '5b', kernMain,    { height: 18, description: 'A serious pitch taking the bold wall to the left of the main crack.' }),
  ]) await r({ ...route, buttressId: route.buttress.id });

  // ── Raven Crag Walthwaite ─────────────────────────────────────────────────
  const ravenWalthwaite = await c('Raven Crag Walthwaite', 54.4385, -3.0745, RockType.OTHER,
    'A classic Langdale crag on the south side of the valley giving routes from VS to E4 on rough Lakeland rhyolite. Not to be confused with Raven Crag further down the valley — this crag offers more seclusion and some of the valley\'s best VS routes.',
    'From the New Dungeon Ghyll Hotel, take the path towards Side Pike, bearing left to reach the crag — 30 min.',
    'New Dungeon Ghyll Hotel car park, Great Langdale (NT, pay & display).', langdale);
  const ravenWMain = await b('Main Crag', ravenWalthwaite, 1);
  for (const route of [
    tradRoute('Centipede',             'VS',  '4c', ravenWMain, { height: 60, pitches: 3, description: 'The celebrated VS — one of the finest routes of its grade in Langdale. Varied and sustained.' }),
    tradRoute('Razor Crack',           'HVS', '5a', ravenWMain, { height: 55, pitches: 2, description: 'A fine crack route taking the main feature of the crag.' }),
    tradRoute('Triermain Eliminate',   'E2',  '5c', ravenWMain, { height: 50, pitches: 2, description: 'Technical eliminate climbing — very popular and well protected.' }),
    tradRoute('Walthwaite Direct',     'E1',  '5b', ravenWMain, { height: 55, pitches: 2, description: 'Takes the crag more directly — good climbing on good rock.' }),
  ]) await r({ ...route, buttressId: route.buttress.id });

  console.log('  ✓ Lake District high crags: Scafell East Buttress, Gable Crag, Bowfell Buttress, Kern Knotts, Raven Crag Walthwaite');
}
