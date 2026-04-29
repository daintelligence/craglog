import { DataSource } from 'typeorm';
import { Region } from '../../modules/crags/entities/region.entity';
import { Crag, RockType } from '../../modules/crags/entities/crag.entity';
import { Buttress } from '../../modules/crags/entities/buttress.entity';
import { Route } from '../../modules/routes/entities/route.entity';
import { findOrCreateRegion, upsertCrag, upsertButtress, upsertRoute, tradRoute } from './seed-helpers';

export async function seedYorkshireGritClassics(ds: DataSource) {
  const regionRepo = ds.getRepository(Region);
  const cragRepo   = ds.getRepository(Crag);
  const buttRepo   = ds.getRepository(Buttress);
  const routeRepo  = ds.getRepository(Route);

  const yorkshire = await findOrCreateRegion(regionRepo, { name: 'Yorkshire', country: 'England' });

  async function c(name: string, lat: number, lng: number, rock: RockType, desc: string, approach: string, parking: string, region: any) {
    return upsertCrag(cragRepo, { name, latitude: lat, longitude: lng, rockType: rock, description: desc, approach, parkingInfo: parking, region, regionId: region.id });
  }
  async function b(name: string, crag: Crag, order = 1) { return upsertButtress(buttRepo, { name, crag, cragId: crag.id, sortOrder: order }); }
  async function r(data: Partial<Route>) { return upsertRoute(routeRepo, data); }

  // ── Brimham Rocks ─────────────────────────────────────────────────────────
  const brimham = await c('Brimham Rocks', 54.0672, -1.6818, RockType.GRITSTONE,
    'A National Trust moorland site of extraordinary geological formations — the gritstone boulders have been shaped by erosion into pillars, pedestals and overhangs giving short but excellent routes from VD to E5. A uniquely scenic venue on the Nidderdale Moors. The Cigar, Dancing Bear and Druids\' Writing Desk are famous formations.',
    'The site is signposted from the B6265 between Pateley Bridge and Ripon. Paths lead from the car park to all sectors — 5 min to nearest crags.',
    'Brimham Rocks National Trust car park (pay & display for non-NT members). Very popular in summer.', yorkshire);
  const brimhamMain  = await b('Brimham Main Group', brimham, 1);
  const brimhamNorth = await b('North Group', brimham, 2);
  const brimhamSouth = await b('South Group', brimham, 3);

  for (const route of [
    tradRoute('The Cigar',            'HVS', '5a', brimhamMain,  { height: 12, description: 'The famous Cigar formation — a short but striking route on the iconic pillar. The definitive Brimham tick.' }),
    tradRoute('Dancing Bear',         'VS',  '4c', brimhamMain,  { height: 15, description: 'Takes the distinctive bear-shaped boulder — good holds on the unusual formation.' }),
    tradRoute('Cubic Block',          'HS',  '4b', brimhamMain,  { height: 12, description: 'A classic easier route — good holds on well-featured Brimham gritstone.' }),
    tradRoute('Druids\' Groove',      'E2',  '5c', brimhamMain,  { height: 14, description: 'A technical groove route on one of the major formations — sustained and pumpy.' }),
    tradRoute('Oyster Groove',        'E1',  '5b', brimhamNorth, { height: 12, description: 'A classic E1 on the north group boulders — good gear and varied moves.' }),
    tradRoute('Moon Crack',           'VS',  '4c', brimhamNorth, { height: 10, description: 'A short but quality crack — excellent gritstone climbing in a memorable setting.' }),
    tradRoute('South Group Wall',     'VD',  '3c', brimhamSouth, { height: 12, description: 'An accessible route on the south group — good introduction to Brimham.' }),
    tradRoute('Twisted Boulder',      'E3',  '5c', brimhamSouth, { height: 10, description: 'A hard route on a dramatically shaped boulder — powerful and technical.' }),
  ]) await r({ ...route, buttressId: route.buttress.id });

  // ── Almscliff Crag ────────────────────────────────────────────────────────
  const almscliff = await c('Almscliff Crag', 53.9712, -1.6000, RockType.GRITSTONE,
    'A compact but excellent gritstone outcrop on the moors above Harrogate with routes from VD to E6. The Great Crack, North Wall and Western Front are world-famous gritstone routes. Famously holds at Almscliff are positive and the rock is excellent quality — but the harder routes are bold and serious. A must-visit Yorkshire gritstone venue.',
    'From the A659 between Harrogate and Otley, turn north at North Rigton. The crag is visible from the road — 5 min walk across the field.',
    'Roadside verge parking near the track to the crag at North Rigton (free). Limited space.', yorkshire);
  const northWall      = await b('North Wall', almscliff, 1);
  const westernFront   = await b('Western Front', almscliff, 2);
  const lowManTower    = await b('Low Man Tower', almscliff, 3);

  for (const route of [
    tradRoute('Great Crack',          'VS',  '4c', northWall,    { height: 15, description: 'The Almscliff classic — a perfect crack route on excellent gritstone. Every visiting climber wants to do this route.' }),
    tradRoute('Western Front',        'E1',  '5b', westernFront, { height: 15, description: 'A Yorkshire gritstone legend — takes the wall above the western face. Sustained and bold with committing moves.' }),
    tradRoute('North Wall Traverse',  'E3',  '5c', northWall,    { height: 12, description: 'A hard traverse of the north wall — technical and pumpy above a rough landing.' }),
    tradRoute('Low Man Route',        'HS',  '4b', lowManTower,  { height: 14, description: 'A classic moderate on the Low Man Tower — good holds and a fine outlook.' }),
    tradRoute('Almscliff Arête',      'HVS', '5a', northWall,    { height: 15, description: 'A fine arête route — good technique required on compact gritstone.' }),
    tradRoute('Crack and Wall',       'S',   '4a', westernFront, { height: 12, description: 'A varied outing combining crack and wall climbing — good introduction to the crag.' }),
    tradRoute('Hard Cheese',          'E4',  '6a', northWall,    { height: 12, description: 'A serious and bold route on the north face — small holds with distant protection.' }),
  ]) await r({ ...route, buttressId: route.buttress.id });

  // ── Caley Crags ───────────────────────────────────────────────────────────
  const caleyCrags = await c('Caley Crags', 53.9237, -1.7040, RockType.GRITSTONE,
    'A fine gritstone crag on the edge of Otley Chevin above the Wharfe valley with routes from VD to E4. Excellent rock quality with good crack routes and technical faces. A popular venue with Leeds and Bradford climbers. The Caley Overhang is a well-known test piece.',
    'From Otley, follow the Chevin Forest Park road to the upper car park. The crags are a 5 min walk through the trees.',
    'Chevin Forest Park car park, Otley (pay & display). Also accessible from the Otley Chevin summit.', yorkshire);
  const caleyMain  = await b('Main Buttress', caleyCrags, 1);
  const caleyRight = await b('Right Buttress', caleyCrags, 2);

  for (const route of [
    tradRoute('Caley Crack',          'VS',  '4c', caleyMain,  { height: 14, description: 'The main crack route — a good sustained outing on excellent gritstone.' }),
    tradRoute('Caley Overhang',       'E3',  '5c', caleyMain,  { height: 10, description: 'The famous Caley test piece — a powerful move through the overhang on excellent holds. A local classic.' }),
    tradRoute('Right Buttress Route', 'HS',  '4b', caleyRight, { height: 12, description: 'A pleasant moderate on the right buttress — good intro to Caley.' }),
    tradRoute('Chevin Wall',          'HVS', '5a', caleyMain,  { height: 12, description: 'A technical wall route above the valley — compact gritstone requiring careful footwork.' }),
    tradRoute('Caley Direct',         'E1',  '5b', caleyMain,  { height: 14, description: 'A direct route up the main buttress — well sustained on good Wharfedale gritstone.' }),
  ]) await r({ ...route, buttressId: route.buttress.id });

  // ── Crookrise ─────────────────────────────────────────────────────────────
  const crookrise = await c('Crookrise', 53.9850, -1.9570, RockType.GRITSTONE,
    'A remote moorland gritstone crag above the Wharfe Valley near Skipton with routes from VS to E4. Less visited than Almscliff but with excellent rock and a wild atmosphere. The views over Wharfedale are superb.',
    'From Embsay village near Skipton, follow the moorland path to the crag — 40 min walk through heather moorland.',
    'Embsay village roadside or the Embsay & Bolton Abbey Steam Railway car park (free).', yorkshire);
  const crookriseMain = await b('Main Edge', crookrise, 1);

  for (const route of [
    tradRoute('Crookrise Crack',      'VS',  '4c', crookriseMain, { height: 14, description: 'The main crack route — a good natural line on classic moorland gritstone.' }),
    tradRoute('Moorland Wall',        'HVS', '5a', crookriseMain, { height: 12, description: 'A fine wall route — technical on compact gritstone with a fine Wharfedale outlook.' }),
    tradRoute('Embsay Arête',         'E2',  '5b', crookriseMain, { height: 14, description: 'A bold arête above the moor — committing moves in a remote setting.' }),
    tradRoute('Remote Crack',         'S',   '4a', crookriseMain, { height: 12, description: 'A pleasant accessible route — good intro to Crookrise with fine views.' }),
  ]) await r({ ...route, buttressId: route.buttress.id });

  // ── Simon's Seat ─────────────────────────────────────────────────────────
  const simonsSeat = await c('Simon\'s Seat', 54.0470, -1.9400, RockType.GRITSTONE,
    'A group of scattered gritstone tors on the summit plateau above the Wharfe Valley near Bolton Abbey — one of the most scenic Yorkshire gritstone venues. Routes from VD to E3 with a bold character and fine views.',
    'From Bolton Abbey, follow the Valley of Desolation path to Simon\'s Seat summit — 1.5 hours.',
    'Bolton Abbey car park (pay & display, Devonshire Estate). Excellent café at the abbey.', yorkshire);
  const simonMain = await b('Main Tor', simonsSeat, 1);
  const simonEast = await b('East Tors', simonsSeat, 2);

  for (const route of [
    tradRoute('Simon\'s Seat Crack',  'VS',  '4c', simonMain, { height: 12, description: 'The main crack on the summit tor — a satisfying route in a fine upland setting.' }),
    tradRoute('Wharfedale Wall',      'HVS', '5a', simonMain, { height: 10, description: 'A technical wall route above the valley — bold on exposed summit gritstone.' }),
    tradRoute('East Tor Route',       'HS',  '4b', simonEast, { height: 10, description: 'A pleasant route on the east tors — good holds and a wonderful panorama.' }),
    tradRoute('Valley View',          'E1',  '5b', simonMain, { height: 12, description: 'A bold route with spectacular views over the Valley of Desolation.' }),
  ]) await r({ ...route, buttressId: route.buttress.id });

  console.log('  ✓ Yorkshire grit classics: Brimham Rocks, Almscliff, Caley Crags, Crookrise, Simon\'s Seat');
}
