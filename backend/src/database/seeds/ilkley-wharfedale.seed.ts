import { DataSource } from 'typeorm';
import { Region } from '../../modules/crags/entities/region.entity';
import { Crag, RockType } from '../../modules/crags/entities/crag.entity';
import { Buttress } from '../../modules/crags/entities/buttress.entity';
import { Route } from '../../modules/routes/entities/route.entity';
import { findOrCreateRegion, upsertCrag, upsertButtress, upsertRoute, tradRoute } from './seed-helpers';

export async function seedIlkleyWharfedale(ds: DataSource) {
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

  // ── Cow and Calf Rocks ────────────────────────────────────────────────────
  const cowCalf = await c('Cow and Calf Rocks', 53.9155, -1.8102, RockType.GRITSTONE,
    'The most popular climbing venue in West Yorkshire — the Cow (large buttress) and Calf (separate boulder) above Ilkley give routes from VD to E5 on excellent millstone grit. The crags are immediately accessible from the road and are climbed on year-round. Bradford and Leeds climbers have used these crags for generations.',
    'From Ilkley town centre, walk up through the Moor to the crags — 15 min. Or drive up Wells Road to the upper car park.',
    'Cow and Calf car park, Wells Road, Ilkley (pay & display). Café and pub at the Cow and Calf Hotel.', yorkshire);
  const cowMain    = await b('The Cow', cowCalf, 1);
  const calveMain  = await b('The Calf', cowCalf, 2);
  const cowRight   = await b('Right Section', cowCalf, 3);

  for (const route of [
    tradRoute('Cow Crack',            'VS',  '4c', cowMain,   { height: 20, description: 'The classic Cow and Calf route — a definitive West Yorkshire gritstone outing on excellent millstone grit.' }),
    tradRoute('Calf Route',           'HS',  '4b', calveMain, { height: 12, description: 'The popular calf boulder route — a short but excellent crack on the smaller rock.' }),
    tradRoute('Western Arête',        'HVS', '5a', cowMain,   { height: 18, description: 'A fine arête on the west side of the Cow — technical and exposed with fine Wharfedale views.' }),
    tradRoute('Right Section Crack',  'S',   '4a', cowRight,  { height: 15, description: 'A good accessible route on the right section — well used by beginners and improvers.' }),
    tradRoute('Ilkley Wall',          'E1',  '5b', cowMain,   { height: 20, description: 'A bold wall route — direct above the car park. Good holds but sparse gear.' }),
    tradRoute('Bradford Route',       'VD',  '3c', cowMain,   { height: 16, description: 'A classic moderate — the easiest route on the Cow. Generations of Yorkshire climbers\' first outing.' }),
    tradRoute('Moor Top',             'E3',  '5c', cowRight,  { height: 18, description: 'A hard route on the right section — technical and committing above the moor.' }),
  ]) await r({ ...route, buttressId: route.buttress.id });

  // ── Ilkley Quarry ─────────────────────────────────────────────────────────
  const ilkleyQuarry = await c('Ilkley Quarry', 53.9130, -1.8180, RockType.GRITSTONE,
    'An old quarry immediately adjacent to the Cow and Calf giving excellent shorter sport and trad routes from VD to E5 on quarried gritstone. Sheltered from the wind and quick to dry. A popular training venue and good alternative when the Cow is busy.',
    'Adjacent to the Cow and Calf car park — 2 min walk into the quarry.',
    'Cow and Calf car park, Wells Road, Ilkley (pay & display).', yorkshire);
  const quarryMain  = await b('Main Wall', ilkleyQuarry, 1);
  const quarryRight = await b('Right Wall', ilkleyQuarry, 2);

  for (const route of [
    tradRoute('Quarry Classic',       'HVS', '5a', quarryMain,  { height: 15, description: 'The most popular Ilkley Quarry route — sustained technical climbing on the quarried wall.' }),
    tradRoute('Quarry Crack',         'VS',  '4c', quarryMain,  { height: 14, description: 'A good crack route on natural gritstone — well protected and absorbing.' }),
    tradRoute('Right Wall Route',     'E1',  '5b', quarryRight, { height: 14, description: 'A bold route on the right wall — technical on the quarried face.' }),
    tradRoute('Ilkley Direct',        'E2',  '5c', quarryMain,  { height: 15, description: 'A harder direct line — sustained and committing in the quarry.' }),
  ]) await r({ ...route, buttressId: route.buttress.id });

  // ── Doubler Stones ────────────────────────────────────────────────────────
  const doublerStones = await c('Doubler Stones', 53.9645, -1.9870, RockType.GRITSTONE,
    'A group of large gritstone boulders on Rombalds Moor giving excellent problems and short routes from VD to E4. A peaceful moorland venue with wide views across the Wharfe Valley and Airedale. Much less visited than Ilkley but with superb gritstone quality.',
    'From Addingham village near Ilkley, follow the moorland track north to the stones — 30 min.',
    'Addingham village roadside (free). Alternatively from the Silsden side of the moor.', yorkshire);
  const doublerMain = await b('Main Group', doublerStones, 1);

  for (const route of [
    tradRoute('Doubler Crack',        'VS',  '4c', doublerMain, { height: 10, description: 'The main crack on the largest boulder — excellent gritstone in a remote moorland setting.' }),
    tradRoute('Moor Wall',            'HVS', '5a', doublerMain, { height: 10, description: 'A technical wall route — compact gritstone requiring precise footwork.' }),
    tradRoute('Rombalds Arête',       'S',   '4a', doublerMain, { height: 10, description: 'A pleasant arête — good holds with wide views over Rombalds Moor.' }),
    tradRoute('Doubler Direct',       'E2',  '5b', doublerMain, { height: 10, description: 'A bold direct line — committing moves on the main boulder.' }),
  ]) await r({ ...route, buttressId: route.buttress.id });

  // ── Widdop (Todmorden area) ────────────────────────────────────────────────
  const widdop = await c('Widdop', 53.8162, -2.0815, RockType.GRITSTONE,
    'A remote moorland gritstone edge above the Hebden Bridge valley with routes from VS to E4. One of the more atmospheric South Pennine crags — the moor spreads in every direction and the climbing is bold and traditional. A favourite with Hebden Bridge and Halifax climbers.',
    'From the Widdop reservoir car park above Hebden Bridge, follow the track to the edge — 20 min.',
    'Widdop reservoir car park (free). The road is narrow and often icy in winter.', yorkshire);
  const widdopMain = await b('Main Edge', widdop, 1);

  for (const route of [
    tradRoute('Widdop Wall',          'VS',  '4c', widdopMain, { height: 16, description: 'The main Widdop route — a fine crack and wall combination on excellent moorland grit.' }),
    tradRoute('South Pennine Crack',  'HVS', '5a', widdopMain, { height: 14, description: 'A sustained crack route — well protected in a wild moorland setting.' }),
    tradRoute('Hebden Arête',         'E1',  '5b', widdopMain, { height: 16, description: 'A bold arête — exposed and committing above the Calder Valley.' }),
    tradRoute('Moor Edge Route',      'S',   '4a', widdopMain, { height: 14, description: 'A pleasant moderate on the edge — wide views over the South Pennines.' }),
  ]) await r({ ...route, buttressId: route.buttress.id });

  // ── Brimham Rocks extras ──────────────────────────────────────────────────
  const eastBrimham = await c('Brimham Rocks East', 54.0680, -1.6750, RockType.GRITSTONE,
    'The eastern group of Brimham Rocks formations — quieter than the main National Trust area but with equally distinctive shaped boulders and short routes from VD to E3. The Smartie Tube and related formations give unusual and entertaining climbing.',
    'From the Brimham Rocks National Trust car park, follow the path east to the outer formations — 10 min.',
    'Brimham Rocks National Trust car park (pay & display).', yorkshire);
  const eastMain = await b('East Group', eastBrimham, 1);

  for (const route of [
    tradRoute('Smartie Tube',         'VS',  '4c', eastMain, { height: 10, description: 'The famous tube-shaped formation — a unique Brimham classic.' }),
    tradRoute('East Group Route',     'HS',  '4b', eastMain, { height: 12, description: 'A good route on the eastern formations — less busy than the main area.' }),
    tradRoute('Outer Formation',      'E1',  '5b', eastMain, { height: 10, description: 'A harder route on one of the outer formations — bold on the distinctive gritstone shapes.' }),
  ]) await r({ ...route, buttressId: route.buttress.id });

  console.log('  ✓ Ilkley & Wharfedale: Cow & Calf, Ilkley Quarry, Doubler Stones, Widdop, Brimham East');
}
