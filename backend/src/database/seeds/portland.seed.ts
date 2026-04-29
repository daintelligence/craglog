import { DataSource } from 'typeorm';
import { Region } from '../../modules/crags/entities/region.entity';
import { Crag, RockType } from '../../modules/crags/entities/crag.entity';
import { Buttress } from '../../modules/crags/entities/buttress.entity';
import { Route } from '../../modules/routes/entities/route.entity';
import { findOrCreateRegion, upsertCrag, upsertButtress, upsertRoute, tradRoute, sportRoute } from './seed-helpers';

export async function seedPortland(ds: DataSource) {
  const regionRepo = ds.getRepository(Region);
  const cragRepo   = ds.getRepository(Crag);
  const buttRepo   = ds.getRepository(Buttress);
  const routeRepo  = ds.getRepository(Route);

  const portland = await findOrCreateRegion(regionRepo, { name: 'Portland', country: 'England' });

  async function c(name: string, lat: number, lng: number, rock: RockType, desc: string, approach: string, parking: string, region: any) {
    return upsertCrag(cragRepo, { name, latitude: lat, longitude: lng, rockType: rock, description: desc, approach, parkingInfo: parking, region, regionId: region.id });
  }
  async function b(name: string, crag: Crag, order = 1) { return upsertButtress(buttRepo, { name, crag, cragId: crag.id, sortOrder: order }); }
  async function r(data: Partial<Route>) { return upsertRoute(routeRepo, data); }

  // ── Blacknor (North & South) ──────────────────────────────────────────────
  const blacknor = await c('Blacknor', 50.5452, -2.4658, RockType.LIMESTONE,
    'The main Portland sport venue — a 150m-long west-facing wall of Portland limestone giving routes from 5+ to 8b. Blacknor North has the famous upper ledge system; Blacknor South has more sustained sport routes. Quick to dry and catches the afternoon sun. Some of the best bolted limestone climbing on the south coast.',
    'From the main Portland road (A354), turn west at Weston. Follow signs to Blacknor — 5 min walk from the road.',
    'Roadside parking near Weston village on Portland, or the layby on the west side road (free).', portland);
  const blacknorNorth  = await b('Blacknor North', blacknor, 1);
  const blacknorSouth  = await b('Blacknor South', blacknor, 2);
  const blacknorUpper  = await b('Upper Ledge Wall', blacknor, 3);

  for (const route of [
    sportRoute('West Side Story',    '7b',  blacknorNorth, { height: 20, description: 'The Portland classic at the grade — sustained crimping on immaculate Portland stone. A must-do for any sport climber visiting the island.' }),
    sportRoute('Blacknor Classic',   '7a',  blacknorNorth, { height: 18, description: 'A popular route on good holds — sustained but with rests. Excellent introduction to Blacknor.' }),
    sportRoute('North Wall',         '6c',  blacknorNorth, { height: 18, description: 'A well-bolted route on the north section — positive holds and varied movement.' }),
    sportRoute('Blacknor Direct',    '7c',  blacknorNorth, { height: 20, description: 'Direct up the main face — technical crimping with a hard move through the crux.' }),
    sportRoute('South Pillar',       '7b+', blacknorSouth, { height: 22, description: 'Takes the prominent pillar feature — sustained on pocketed limestone.' }),
    sportRoute('South Wall',         '6b+', blacknorSouth, { height: 20, description: 'A classic mid-grade route on Blacknor South — well positioned above the sea.' }),
    sportRoute('Portland Eliminate', '8a',  blacknorSouth, { height: 20, description: 'A hard technical route on the south section — precise footwork and small crimps.' }),
    sportRoute('Upper Ledge Route',  '6c+', blacknorUpper, { height: 15, description: 'A shorter route on the upper ledge wall — good warm-up for harder objectives.' }),
    tradRoute('Blacknor Trad',       'E2',  '5c', blacknorNorth, { height: 20, description: 'One of the few traditional routes here — bold face climbing on Portland limestone.' }),
  ]) await r({ ...route, buttressId: route.buttress.id });

  // ── The Cuttings ─────────────────────────────────────────────────────────
  const cuttings = await c('The Cuttings', 50.5580, -2.4450, RockType.LIMESTONE,
    'Portland\'s most accessible sport venue — an old quarry cutting gives a sheltered wall with routes from 6a to 8c+. The Cuttings is ideal in bad weather and dries fast. A good range of grades makes it popular with everyone from beginners to elite climbers. Tim Healy\'s contributions put the crag firmly on the map.',
    'From Easton on Portland, follow the minor road south — the cuttings are visible from the road. 2 min walk.',
    'Roadside parking at the cuttings entrance, Easton, Portland (free).', portland);
  const cuttingsMain  = await b('Main Wall', cuttings, 1);
  const cuttingsRight = await b('Right Sector', cuttings, 2);
  const cuttingsLeft  = await b('Left Sector', cuttings, 3);

  for (const route of [
    sportRoute('Cuttings Classic',   '7a',  cuttingsMain,  { height: 18, description: 'The introductory classic — a well-bolted route on good Portland stone. The first route most visitors do here.' }),
    sportRoute('Portland Stone',     '6b',  cuttingsMain,  { height: 16, description: 'A popular mid-grade route — positive holds on the main wall. Good for warming up.' }),
    sportRoute('Right Sector Route', '7b',  cuttingsRight, { height: 18, description: 'A sustained route on the right sector — technical moves on compact stone.' }),
    sportRoute('Healy\'s Route',     '8a',  cuttingsRight, { height: 20, description: 'Named after Tim Healy — a powerful testpiece on the right sector. Technical and sustained.' }),
    sportRoute('Left Sector Sport',  '6c',  cuttingsLeft,  { height: 16, description: 'A well-bolted route on the left sector — sustained with a technical crux.' }),
    sportRoute('Easton Wall',        '7c',  cuttingsMain,  { height: 18, description: 'A technical face route on the main wall — small holds and precise footwork required.' }),
    sportRoute('Cutting Edge',       '8b',  cuttingsRight, { height: 20, description: 'A very hard route at the Cuttings — powerful climbing on the steepest section.' }),
    sportRoute('Beginner\'s Route',  '5+',  cuttingsLeft,  { height: 15, description: 'The easiest route — well bolted and accessible. Perfect introduction to Portland.' }),
  ]) await r({ ...route, buttressId: route.buttress.id });

  // ── White Hole ────────────────────────────────────────────────────────────
  const whiteHole = await c('White Hole', 50.5600, -2.4500, RockType.LIMESTONE,
    'A concentrated hard sport wall on Portland with routes from 7b to 9a. One of the venues that established Portland\'s reputation for world-class hard sport climbing. The white limestone is of exceptional quality — compact, featured and sustained. Serious sport climbers make pilgrimages here.',
    'From Easton, follow the footpath west along the cliff top to White Hole — 10 min.',
    'Easton village parking, Portland (free or pay & display on seafront).', portland);
  const whiteHoleMain = await b('Main Wall', whiteHole, 1);

  for (const route of [
    sportRoute('White Hole Classic', '7c',  whiteHoleMain, { height: 20, description: 'The accessible White Hole route — sustained technical climbing on perfect Portland limestone.' }),
    sportRoute('Pure Power',         '8b+', whiteHoleMain, { height: 22, description: 'A ferociously powerful route — one of Portland\'s hardest. Sustained and relentless.' }),
    sportRoute('White Wall',         '8a',  whiteHoleMain, { height: 20, description: 'A technical hard route on the white limestone — precise footwork essential.' }),
    sportRoute('Portland Project',   '9a',  whiteHoleMain, { height: 22, description: 'The hardest route on Portland — world-class sport climbing at the frontier of the possible.' }),
    sportRoute('Hard Entry',         '7b+', whiteHoleMain, { height: 18, description: 'A powerful route — short but intense above the white-coloured wall.' }),
  ]) await r({ ...route, buttressId: route.buttress.id });

  // ── Cave Hole ─────────────────────────────────────────────────────────────
  const caveHole = await c('Cave Hole', 50.5162, -2.4592, RockType.LIMESTONE,
    'A dramatic collapsed sea cave near Portland Bill with a unique and atmospheric ambience. Routes from 6b to 8a on the cave walls and roof. Access is via abseil and some routes require tidal timing. One of the most unusual climbing experiences on the south coast.',
    'From Portland Bill car park, follow the coastal path east to Cave Hole — 15 min. Access via abseil — check tides before descending.',
    'Portland Bill car park (pay & display, RSPB/Lighthouse area).', portland);
  const caveMain  = await b('Cave Wall', caveHole, 1);
  const caveRoof  = await b('Cave Roof', caveHole, 2);

  for (const route of [
    sportRoute('Cave Route',         '7a',  caveMain,  { height: 18, description: 'The main cave wall route — atmospheric climbing in the collapsed sea cave.' }),
    sportRoute('Roof Route',         '7c',  caveRoof,  { height: 12, description: 'Takes the cave roof — powerful and sustained on the overhanging ceiling.' }),
    sportRoute('Bill Wall',          '6b+', caveMain,  { height: 16, description: 'A route on the cave walls with views of Portland Bill lighthouse.' }),
    sportRoute('Tidal Groove',       '7b',  caveMain,  { height: 18, description: 'A sustained groove route in the cave — requires careful tidal timing.' }),
  ]) await r({ ...route, buttressId: route.buttress.id });

  // ── Cheyne Weares ─────────────────────────────────────────────────────────
  const cheyneWeares = await c('Cheyne Weares', 50.5538, -2.4395, RockType.LIMESTONE,
    'A large open quarry face on the eastern side of Portland giving a wide range of sport routes from 6a to 8b+. Less exposed than the west-coast venues and sheltered from the prevailing wind. A good option when Blacknor is too busy or when the wind is from the west.',
    'From the A354, follow the eastern coast road south and take the track to the quarry face — 5 min.',
    'Parking area near the quarry, eastern Portland (free).', portland);
  const cheyneMain  = await b('Main Face', cheyneWeares, 1);
  const cheyneLower = await b('Lower Wall', cheyneWeares, 2);

  for (const route of [
    sportRoute('Cheyne Classic',     '6c',  cheyneMain,  { height: 20, description: 'The classic Cheyne Weares route — well bolted and sustained on good Portland stone.' }),
    sportRoute('Quarry Wall',        '7a',  cheyneMain,  { height: 22, description: 'A fine route on the main quarry face — technical and varied.' }),
    sportRoute('Lower Wall Route',   '6a',  cheyneLower, { height: 16, description: 'A more accessible route on the lower wall — good for beginners and improvers.' }),
    sportRoute('Cheyne Direct',      '7c',  cheyneMain,  { height: 20, description: 'A direct line on the main face — powerful and sustained.' }),
    sportRoute('East Portland',      '6b',  cheyneLower, { height: 18, description: 'A popular mid-grade route — well positioned on the eastern face.' }),
    sportRoute('Hard Weares',        '8a',  cheyneMain,  { height: 20, description: 'A hard route on the main face — technical cruxes on compact limestone.' }),
  ]) await r({ ...route, buttressId: route.buttress.id });

  // ── Subliminal ────────────────────────────────────────────────────────────
  const subliminal = await c('Subliminal', 50.5490, -2.4610, RockType.LIMESTONE,
    'A fine west-facing sport wall on Portland with routes from 7a+ to 8c. The climbing is typically sustained on pocketed and featured Portland stone with excellent friction. A quieter alternative to Blacknor with similarly high quality routes.',
    'From the west side road on Portland, follow the footpath to the cliff top — 8 min walk.',
    'West side road layby, Portland (free).', portland);
  const subliminalMain = await b('Main Wall', subliminal, 1);

  for (const route of [
    sportRoute('Subliminal Route',   '7b',  subliminalMain, { height: 20, description: 'The accessible classic here — sustained on pocketed limestone with fine sea views.' }),
    sportRoute('Pure Subliminal',    '8a+', subliminalMain, { height: 20, description: 'A hard route on the wall — powerful and technical above the west side.' }),
    sportRoute('West Side Wall',     '7c',  subliminalMain, { height: 18, description: 'A sustained route — technical moves on the pocketed limestone face.' }),
    sportRoute('Subliminal Direct',  '8c',  subliminalMain, { height: 20, description: 'The hardest route at Subliminal — a world-class sport challenge on Portland stone.' }),
  ]) await r({ ...route, buttressId: route.buttress.id });

  console.log('  ✓ Portland: Blacknor, The Cuttings, White Hole, Cave Hole, Cheyne Weares, Subliminal');
}
