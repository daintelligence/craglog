import { DataSource } from 'typeorm';
import { Region } from '../../modules/crags/entities/region.entity';
import { Crag, RockType } from '../../modules/crags/entities/crag.entity';
import { Buttress } from '../../modules/crags/entities/buttress.entity';
import { Route } from '../../modules/routes/entities/route.entity';
import { findOrCreateRegion, upsertCrag, upsertButtress, upsertRoute, tradRoute, sportRoute } from './seed-helpers';

export async function seedMalhamExpanded(ds: DataSource) {
  const regionRepo = ds.getRepository(Region);
  const cragRepo   = ds.getRepository(Crag);
  const buttRepo   = ds.getRepository(Buttress);
  const routeRepo  = ds.getRepository(Route);

  const yorkshireDales = await findOrCreateRegion(regionRepo, { name: 'Yorkshire Dales', country: 'England' });

  async function c(name: string, lat: number, lng: number, rock: RockType, desc: string, approach: string, parking: string, region: any) {
    return upsertCrag(cragRepo, { name, latitude: lat, longitude: lng, rockType: rock, description: desc, approach, parkingInfo: parking, region, regionId: region.id });
  }
  async function b(name: string, crag: Crag, order = 1) { return upsertButtress(buttRepo, { name, crag, cragId: crag.id, sortOrder: order }); }
  async function r(data: Partial<Route>) { return upsertRoute(routeRepo, data); }

  // ── Malham Cove (expanded sport routes) ──────────────────────────────────
  const malham = await c('Malham Cove', 54.0715, -2.1588, RockType.LIMESTONE,
    'Britain\'s most spectacular inland limestone crag — a 70m curved amphitheatre rising 80m above Malhamdale. The sport routes on the main face range from 6b to 8b+ on impeccable tufa-streaked limestone. The approach through the dale is one of the finest in the UK. A truly iconic Yorkshire climbing venue.',
    'From Malham village, follow the footpath north through the valley — 20 min to the base of the crag.',
    'Malham National Park car park (pay & display). Extremely popular with tourists — arrive early. Café in the village.', yorkshireDales);
  const mainFace   = await b('Main Face Sport', malham, 10);
  const rightWing  = await b('Right Wing', malham, 11);
  const leftWing   = await b('Left Wing', malham, 12);
  const centralWall = await b('Central Wall', malham, 13);

  for (const route of [
    sportRoute('Big Bang',           '7b+', mainFace,    { height: 30, description: 'The Malham classic — takes the magnificent tufa columns on the central face. A pilgrimage route for any sport climber in the UK.' }),
    sportRoute('Zoolook',            '7c',  mainFace,    { height: 30, description: 'A superb Malham route — sustained climbing on the striped tufa-covered limestone. One of the best 7c routes in Britain.' }),
    sportRoute('Face Route',         '8a',  centralWall, { height: 35, description: 'A hard sustained route on the central wall — technical and powerful above the valley.' }),
    sportRoute('Direct Route',       '7a+', mainFace,    { height: 28, description: 'The most accessible of the quality Malham routes — sustained but positive on tufa-streaked limestone.' }),
    sportRoute('Left Wall Sport',    '6c',  leftWing,    { height: 25, description: 'A fine route on the left wing — good holds and a varied sequence on excellent limestone.' }),
    sportRoute('Right Wing Route',   '7b',  rightWing,   { height: 25, description: 'A sustained route on the right wing — fingery and technical with good rests.' }),
    sportRoute('Malham Classic',     '6b',  leftWing,    { height: 22, description: 'The most accessible Malham sport route — well bolted and popular. A fine introduction to the crag.' }),
    sportRoute('Tufa Route',         '7c+', mainFace,    { height: 32, description: 'Takes the prominent tufa feature — natural holds on the dramatic limestone curtains.' }),
    sportRoute('Central Sport',      '7a',  centralWall, { height: 30, description: 'A popular route on the central wall — sustained with a technical crux mid-height.' }),
    sportRoute('Yorkshire Beast',    '8b+', centralWall, { height: 35, description: 'The Malham testpiece — one of the hardest routes in the Yorkshire Dales. Powerful and sustained on the steepest section.' }),
    sportRoute('Cove Wall',          '6c+', mainFace,    { height: 25, description: 'A well-bolted route on good holds — a popular tick for visiting climbers.' }),
    sportRoute('Amphitheatre',       '7b',  rightWing,   { height: 28, description: 'Takes the amphitheatre shape of the right wing — sustained and well positioned.' }),
    tradRoute('Cove Classic',        'HVS', '5a', leftWing, { height: 25, description: 'One of the few trad routes on the cove — takes a natural line on the left side.' }),
    tradRoute('Malham Trad',         'E2',  '5c', leftWing, { height: 22, description: 'A traditional route on the less-bolted section — bold face climbing on compact limestone.' }),
  ]) await r({ ...route, buttressId: route.buttress.id });

  // ── Gordale Scar additional sport routes ──────────────────────────────────
  const gordale = await c('Gordale Scar', 54.0678, -2.1167, RockType.LIMESTONE,
    'One of the most dramatic natural amphitheatres in Britain — a spectacular gorge with overhanging limestone walls. Previously seeded with trad routes; this adds the bolted sport lines that make Gordale world-class for hard sport climbing.',
    'From Malham village, follow the lane east for 1.5 km to the gorge entrance — 20 min walk.',
    'Malham National Park car park (pay & display).', yorkshireDales);
  const gordaleSport  = await b('Sport Sector', gordale, 10);
  const gordaleStreet = await b('Easy Street', gordale, 11);

  for (const route of [
    sportRoute('Lycra Lout',         '7c',  gordaleSport,  { height: 30, description: 'The famous Gordale sport route — steep and powerful on the gorge walls.' }),
    sportRoute('Gordale Sport',      '7a',  gordaleSport,  { height: 25, description: 'A well-bolted route through the gorge atmosphere — sustained crimping.' }),
    sportRoute('Scar Route',         '6c',  gordaleStreet, { height: 22, description: 'A popular sport route — well positioned in the extraordinary gorge setting.' }),
    sportRoute('Power Gorge',        '8a',  gordaleSport,  { height: 28, description: 'A hard sport route on the steepest gorge walls — powerful moves through the overhangs.' }),
    sportRoute('Easy Street',        '6b',  gordaleStreet, { height: 20, description: 'The most accessible sport route in the gorge — good holds and well bolted.' }),
  ]) await r({ ...route, buttressId: route.buttress.id });

  // ── Attermire Scar extended (sport routes) ────────────────────────────────
  const attermire = await c('Attermire Scar', 54.1082, -2.2298, RockType.LIMESTONE,
    'A fine Dales limestone scar above Settle with both trad and sport routes. Previously seeded with trad; this adds the developed sport lines on the steeper sections.',
    'From Settle, take the road to Stockdale Lane and follow the path to the scar — 30 min.',
    'Settle town centre parking (pay & display) or roadside near the approach path.', yorkshireDales);
  const attermireSport = await b('Sport Wall', attermire, 10);

  for (const route of [
    sportRoute('Attermire Sport',    '7a',  attermireSport, { height: 20, description: 'A sport route on the developed section — sustained technical climbing on Dales limestone.' }),
    sportRoute('Settle Route',       '6b+', attermireSport, { height: 18, description: 'A popular bolted route — well positioned with views over Ribblesdale.' }),
    sportRoute('Dales Sport',        '7b',  attermireSport, { height: 20, description: 'A harder bolted route on the steeper section — crimpy and technical.' }),
  ]) await r({ ...route, buttressId: route.buttress.id });

  console.log('  ✓ Malham expanded: Malham Cove sport, Gordale sport, Attermire sport');
}
