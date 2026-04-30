import { DataSource } from 'typeorm';
import { Region } from '../../modules/crags/entities/region.entity';
import { Crag, RockType } from '../../modules/crags/entities/crag.entity';
import { Buttress } from '../../modules/crags/entities/buttress.entity';
import { Route } from '../../modules/routes/entities/route.entity';
import { findOrCreateRegion, upsertCrag, upsertButtress, upsertRoute, tradRoute } from './seed-helpers';

export async function seedGogarth(ds: DataSource) {
  const regionRepo = ds.getRepository(Region);
  const cragRepo   = ds.getRepository(Crag);
  const buttRepo   = ds.getRepository(Buttress);
  const routeRepo  = ds.getRepository(Route);

  const region = await findOrCreateRegion(regionRepo, { name: 'North Wales', country: 'Wales' });

  async function c(name: string, lat: number, lng: number, rock: RockType, desc: string, approach: string, parking: string, region: any) {
    return upsertCrag(cragRepo, { name, latitude: lat, longitude: lng, rockType: rock, description: desc, approach, parkingInfo: parking, region, regionId: region.id });
  }
  async function b(name: string, crag: Crag, order = 1) { return upsertButtress(buttRepo, { name, crag, cragId: crag.id, sortOrder: order }); }
  async function r(data: Partial<Route>) { return upsertRoute(routeRepo, data); }

  // ── Gogarth Main Cliff ────────────────────────────────────────────────────
  const gogarth = await c('Gogarth Main Cliff', 53.3083, -4.6900, RockType.QUARTZITE,
    'The greatest sea cliff in Britain — a vast sweep of quartzite rising 50–100m from the waves on the north coast of Anglesey. Gogarth is in a league of its own for adventure, seriousness and route quality. A Dream of White Horses traverses the clifftop above crashing Atlantic surf on magnificent quartzite; Red Wall and Positron are among the most coveted hard routes in Wales. All routes require an abseil approach and a marine environment — tidal awareness is essential.',
    'From South Stack car park, follow the footpath along the cliff top to reach the various abseil points. The top of the cliff is reached in 15–20 min. Most routes require abseil approach to the base — check tides carefully before committing.',
    'South Stack RSPB car park (pay & display). The car park is also accessed via the B4545 from Holyhead. Check RSPB access restrictions during nesting season (February–August) — some sections may be closed.', region);
  const gogartheMain    = await b('Main Wall', gogarth, 1);
  const gogartheUpper   = await b('Upper Cliff', gogarth, 2);
  const gogartheRed     = await b('Red Wall Area', gogarth, 3);

  for (const route of [
    tradRoute('A Dream of White Horses', 'E1', '5a', gogartheMain,  { height: 180, pitches: 4, description: 'The most famous sea cliff traverse in Britain — a magnificent airy expedition on perfect quartzite above the churning Atlantic. Takes a natural line across the full width of the main cliff on perfect friction holds. One of the great UK adventures.' }),
    tradRoute('Mammoth',              'E4',  '6a', gogartheMain,  { height: 60,  pitches: 2, description: 'A sustained and serious E4 on the main wall — technical and bold moves on quartzite above the sea. Requires full commitment and careful route-finding.' }),
    tradRoute('Red Wall',             'E5',  '6a', gogartheRed,   { height: 50,  pitches: 2, description: 'The classic Gogarth hard route — a magnificent line up the distinctive red quartzite wall. Technical and serious with serious consequences for a fall. One of the most sought-after E5s in Wales.' }),
    tradRoute('Positron',             'E5',  '6a', gogartheRed,   { height: 55,  pitches: 2, description: 'A bold and technical E5 companion to Red Wall — superb sustained quartzite climbing in a spectacular sea cliff environment. A serious route requiring a full rack and steady nerves.' }),
    tradRoute('The Strand',           'E2',  '5b', gogartheMain,  { height: 65,  pitches: 3, description: 'A fine E2 on the main cliff — sustained and absorbing climbing on excellent quartzite in a dramatic sea setting. Well-protected for the Gogarth experience.' }),
    tradRoute('Citadel',              'E5',  '6a', gogartheUpper, { height: 50,  pitches: 2, description: 'The imposing Citadel line — one of Gogarth\'s hardest and most serious routes. Technical and bold moves on the upper cliff in a committing situation.' }),
    tradRoute('Dinosaur',             'E1',  '5b', gogartheMain,  { height: 55,  pitches: 2, description: 'A fine accessible Gogarth E1 — a popular route taking a natural line on the main cliff with good protection for the sea cliff environment. A great introduction to Gogarth trad.' }),
  ]) await r({ ...route, buttressId: route.buttress.id });

  // ── Gogarth North Stack ───────────────────────────────────────────────────
  const northStack = await c('Gogarth North Stack', 53.3100, -4.6920, RockType.QUARTZITE,
    'The northern section of the Gogarth complex — superb quartzite walls and slabs extending towards the North Stack lighthouse. Wen Slab is one of the most spectacular slab routes in Britain; the north stack walls give routes from VS to E5 on excellent compact rock. A slightly less serious atmosphere than the main cliff but still requiring care with tidal access.',
    'From South Stack car park, follow the cliff top path north to the North Stack area — 25 min walk. The North Stack wall is approached by abseil to the base of the routes.',
    'South Stack RSPB car park (pay & display). Check tidal times and RSPB restrictions before approaching.', region);
  const northStackSlab = await b('Wen Slab', northStack, 1);
  const northStackWall = await b('North Wall', northStack, 2);
  const northStackEast = await b('East Face', northStack, 3);

  for (const route of [
    tradRoute('Wen Slab',             'E1',  '5a', northStackSlab, { height: 60, pitches: 2, description: 'One of the most spectacular slab routes in Britain — a vast inclined quartzite slab falling into the sea. Technical friction climbing on perfect quartzite with a breathtaking position above the Atlantic.' }),
    tradRoute('Hombre',               'E3',  '5c', northStackWall, { height: 45, pitches: 2, description: 'A serious route on the North Wall — technical and sustained moves on compact quartzite. Bold climbing in a grand sea cliff situation.' }),
    tradRoute('Rap Route',            'VS',  '4c', northStackEast, { height: 40, pitches: 2, description: 'The accessible North Stack classic — a good quality VS in a spectacular position. An introduction to the Gogarth experience without the full commitment of the harder routes.' }),
    tradRoute('Spider\'s Web',        'E2',  '5c', northStackWall, { height: 50, pitches: 2, description: 'A fine E2 on the north wall — technical and sustained on good quartzite. Well-protected by Gogarth standards and a popular route at the grade.' }),
    tradRoute('North Stack Wall',     'E3',  '5c', northStackWall, { height: 48, pitches: 2, description: 'A bold route on the main north wall — sustained and committing on compact quartzite. Requires careful gear placement in a sea cliff environment.' }),
  ]) await r({ ...route, buttressId: route.buttress.id });

  // ── South Stack ───────────────────────────────────────────────────────────
  const southStack = await c('South Stack', 53.3050, -4.6970, RockType.QUARTZITE,
    'The southern end of the Gogarth complex, clustered around the South Stack lighthouse — dramatic quartzite walls and ridges above the crashing sea. Parliament House Cave gives some of the most technical climbing at Gogarth. The more accessible ridges and faces give quality routes at every grade. The lighthouse setting is one of the most spectacular in the UK.',
    'From South Stack car park, follow the path down towards the lighthouse. The Parliament House Cave is approached by abseil from the cliff top; the ridge and face routes have easier approaches along the cliff path.',
    'South Stack RSPB car park (pay & display, directly adjacent). Very popular tourist destination — car park can be full. RSPB information centre at the car park.', region);
  const southStackCave  = await b('Parliament House Cave', southStack, 1);
  const southStackRidge = await b('South Ridge', southStack, 2);
  const southStackNorth = await b('North Angle', southStack, 3);

  for (const route of [
    tradRoute('Comes the Dervish',    'E5',  '6b', southStackCave,  { height: 30, pitches: 1, description: 'The cave testpiece — a superbly technical route on the cave walls requiring a powerful and technical approach. Fingery and sustained with a desperate crux on the compact quartzite.' }),
    tradRoute('North Angle',          'VD',  '3c', southStackNorth, { height: 45, pitches: 2, description: 'The classic moderate at South Stack — a well-defined angle route on the north side. Excellent rock in a spectacular lighthouse setting. A fine introduction to Gogarth.' }),
    tradRoute('South Angle',          'D',   '2c', southStackRidge, { height: 40, pitches: 2, description: 'An easy route on the south angle — straightforward but atmospheric climbing above the sea. Often used as an approach or descent route.' }),
    tradRoute('South Ridge',          'S',   '4a', southStackRidge, { height: 50, pitches: 2, description: 'A pleasant route on the south ridge — absorbing climbing above the lighthouse with fine views out to sea. Accessible and well-marked.' }),
    tradRoute('Cave Wall',            'E3',  '5c', southStackCave,  { height: 25, pitches: 1, description: 'A technical route on the cave wall — sustained moves on compact quartzite requiring precise footwork. One of several fine lines in the cave sector.' }),
  ]) await r({ ...route, buttressId: route.buttress.id });

  // ── Castell Helen ─────────────────────────────────────────────────────────
  const castellHelen = await c('Castell Helen', 53.3070, -4.6940, RockType.QUARTZITE,
    'A fine compact quartzite buttress between the North Stack and South Stack areas — excellent rough rock giving quality routes at every grade. Yellow Wall and Sea Wall Traverse are well-regarded classics. The crag offers a slightly less serious atmosphere than the main Gogarth walls with some tide-independent routes at the top of the buttress.',
    'From South Stack car park, follow the cliff path to the Castell Helen area — 20 min walk. Some routes can be reached from above without an abseil approach.',
    'South Stack RSPB car park (pay & display). Check RSPB access restrictions for the nesting season.', region);
  const hellenMain   = await b('Main Face', castellHelen, 1);
  const hellenSea    = await b('Sea Wall', castellHelen, 2);
  const hellenUpper  = await b('Upper Tier', castellHelen, 3);

  for (const route of [
    tradRoute('Yellow Wall',          'E3',  '5c', hellenMain,  { height: 40, pitches: 2, description: 'A superb E3 on the compact yellow quartzite — technical and sustained moves on perfect rough rock. One of the best routes at Castell Helen and well worth seeking out.' }),
    tradRoute('Castell Helen Route',  'VS',  '4c', hellenMain,  { height: 38, pitches: 2, description: 'The classic Castell Helen VS — a fine natural line up the main face on excellent quartzite. Well-protected and absorbing in the sea cliff setting.' }),
    tradRoute('Sea Wall Traverse',    'E1',  '5b', hellenSea,   { height: 45, pitches: 2, description: 'A dramatic traverse along the sea wall — airy and sustained above the waves on rough quartzite. A popular route giving a real sense of the Gogarth atmosphere.' }),
    tradRoute('Upper Tier Crack',     'HS',  '4b', hellenUpper, { height: 25, pitches: 1, description: 'A fine crack on the upper tier — well-protected and quality rock. One of the more accessible routes at Castell Helen.' }),
    tradRoute('Helen Direct',         'E2',  '5b', hellenMain,  { height: 40, pitches: 2, description: 'A direct line on the main face — sustained and technical on compact quartzite. A bold outing rewarding clean footwork.' }),
  ]) await r({ ...route, buttressId: route.buttress.id });

  // ── Holyhead Mountain ─────────────────────────────────────────────────────
  const holyhead = await c('Holyhead Mountain', 53.3160, -4.6950, RockType.QUARTZITE,
    'The highest point on Anglesey — a fine quartzite mountain giving climbing on its north and west faces. More accessible than the sea cliffs below but with good quality rock and a fine mountain atmosphere. Routes here dry quickly and offer an alternative when the sea cliffs are affected by swell or nesting restrictions.',
    'From the South Stack car park, follow the path up the hillside to the summit area — 20 min. Various crags and faces are accessible from the summit plateau.',
    'South Stack RSPB car park (pay & display). Alternatively, park at the RSPB visitor centre and follow the footpath up the mountain.', region);
  const holyheadNorth = await b('North Face', holyhead, 1);
  const holyheadSouth = await b('South Buttress', holyhead, 2);
  const holyheadRidge = await b('West Ridge', holyhead, 3);

  for (const route of [
    tradRoute('North Face',           'E2',  '5b', holyheadNorth, { height: 30, pitches: 2, description: 'A good E2 on the north face — technical and sustained on compact quartzite with the Irish Sea visible beyond. Well-protected with a natural line.' }),
    tradRoute('Holyhead Ordinary Route', 'VD', '3c', holyheadRidge, { height: 35, pitches: 2, description: 'The classic mountain route — a pleasant traverse of the west ridge with fine views across Anglesey and towards Snowdonia. Good quality rock.' }),
    tradRoute('South Buttress',       'HS',  '4a', holyheadSouth, { height: 28, pitches: 1, description: 'A fine route on the south buttress — varied and absorbing climbing on rough quartzite. Less serious than the sea cliff routes below.' }),
    tradRoute('Summit Arête',         'VS',  '4b', holyheadRidge, { height: 25, pitches: 1, description: 'An arête route near the summit — technical and well-positioned with fine views. Good quality quartzite throughout.' }),
    tradRoute('West Ridge Direct',    'S',   '4a', holyheadRidge, { height: 30, pitches: 2, description: 'A pleasant ridge route — sustained scrambling on good rock with a real sense of the Holyhead Mountain character.' }),
  ]) await r({ ...route, buttressId: route.buttress.id });

  console.log('  ✓ Gogarth & Anglesey: Gogarth Main Cliff, North Stack, South Stack, Castell Helen, Holyhead Mountain');
}
