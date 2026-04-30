import { DataSource } from 'typeorm';
import { Region } from '../../modules/crags/entities/region.entity';
import { Crag, RockType } from '../../modules/crags/entities/crag.entity';
import { Buttress } from '../../modules/crags/entities/buttress.entity';
import { Route } from '../../modules/routes/entities/route.entity';
import { findOrCreateRegion, upsertCrag, upsertButtress, upsertRoute, tradRoute } from './seed-helpers';

export async function seedFroggattCurbar(ds: DataSource) {
  const regionRepo = ds.getRepository(Region);
  const cragRepo   = ds.getRepository(Crag);
  const buttRepo   = ds.getRepository(Buttress);
  const routeRepo  = ds.getRepository(Route);

  const region = await findOrCreateRegion(regionRepo, { name: 'Peak District', country: 'England' });

  async function c(name: string, lat: number, lng: number, rock: RockType, desc: string, approach: string, parking: string, region: any) {
    return upsertCrag(cragRepo, { name, latitude: lat, longitude: lng, rockType: rock, description: desc, approach, parkingInfo: parking, region, regionId: region.id });
  }
  async function b(name: string, crag: Crag, order = 1) { return upsertButtress(buttRepo, { name, crag, cragId: crag.id, sortOrder: order }); }
  async function r(data: Partial<Route>) { return upsertRoute(routeRepo, data); }

  // ── Froggatt Edge ─────────────────────────────────────────────────────────
  const froggatt = await c('Froggatt Edge', 53.3033, -1.6208, RockType.GRITSTONE,
    'One of the most popular and accessible gritstone edges in the Peak District — a long continuous edge of fine-grained gritstone above the Derwent Valley. Valkyrie is perhaps the most climbed route in the Peak, while the slab and wall routes cover every grade with consistent quality. The edge faces west and dries quickly after rain, making it a year-round destination.',
    'From the car park on the B6054 above Froggatt village, follow the path north along the top of the moor for 5 minutes to reach the edge. The crag is visible from the road.',
    'Hay Wood National Trust car park on the B6054 (free, National Trust members). Popular weekends — arrive early. Café at the village.', region);
  const froggattSlab  = await b('Slab Area', froggatt, 1);
  const froggattWall  = await b('Main Wall', froggatt, 2);
  const froggattRight = await b('Right Sector', froggatt, 3);

  for (const route of [
    tradRoute('Valkyrie',             'E1',  '5b', froggattSlab,  { height: 15, description: 'The most famous route at Froggatt — a magnificent exposed arête on perfect gritstone. Sustained and technical with a thrilling finish on the top of the edge. One of the most sought-after routes in the Peak.' }),
    tradRoute('Brown\'s Eliminate',   'E2',  '5c', froggattSlab,  { height: 15, description: 'A harder companion to Valkyrie — technical and sustained moves on the slab in a fine position. Excellent gritstone friction climbing.' }),
    tradRoute('Great Slab',           'VD',  '3c', froggattSlab,  { height: 12, description: 'The classic introductory route at Froggatt — a fine slab on good gritstone holds. A perfect first gritstone route in a magnificent setting above the valley.' }),
    tradRoute('Strapadictomy',        'HVS', '5a', froggattWall,  { height: 14, description: 'A well-known Froggatt classic on the main wall — sustained and technical moves on compact gritstone. A fine test at the grade.' }),
    tradRoute('Obituary Grooves',     'E3',  '5c', froggattWall,  { height: 14, description: 'A serious E3 — bold moves on the wall with gear that requires careful placement. One of the committing routes on the main Froggatt wall.' }),
    tradRoute('Eye Contact',          'E5',  '6b', froggattWall,  { height: 14, description: 'The Froggatt testpiece — a fingery and powerful E5 on the main wall. Desperate moves on small holds demand maximum friction and commitment.' }),
    tradRoute('Downhill Racer',       'E4',  '6a', froggattRight, { height: 13, description: 'A sustained E4 on the right sector — technical and pumpy moves on gritstone. Requires good footwork and nerve.' }),
    tradRoute('The Asp',              'E2',  '5c', froggattRight, { height: 12, description: 'A fine E2 on the right section — technical wall moves on compact gritstone above good runners. A popular tick for those at the grade.' }),
  ]) await r({ ...route, buttressId: route.buttress.id });

  // ── Curbar Edge ───────────────────────────────────────────────────────────
  const curbar = await c('Curbar Edge', 53.2975, -1.6180, RockType.GRITSTONE,
    'Curbar Edge is the harder neighbour to Froggatt — a bold and serious edge giving routes that punch above their grade. The rock is slightly rougher and more featured than Froggatt, and the routes require commitment and good gritstone technique. Penal Servitude and Profit of Doom are among the most serious outings on the gritstone edges; The File and Elder Crack are Peak classics.',
    'From Curbar village, follow the lane up to the edge. Alternatively approach from the Curbar Gap car park on the B6001 at the top of the edge — 5 min walk to the main buttresses.',
    'Curbar Gap car park (National Trust, pay & display at weekends). Free parking available further along the road. Can be very busy on summer weekends.', region);
  const curbarLeft   = await b('Left Sector', curbar, 1);
  const curbarMain   = await b('Main Wall', curbar, 2);
  const curbarRight  = await b('Right Section', curbar, 3);

  for (const route of [
    tradRoute('The File',             'E1',  '5b', curbarLeft,  { height: 14, description: 'The great Curbar classic — a magnificent sustained E1 up the fine crack and wall. One of the best routes on the edge and a rite of passage for Peak climbers.' }),
    tradRoute('Elder Crack',          'E2',  '5c', curbarLeft,  { height: 13, description: 'A sustained crack and wall route — technical and pumpy with good gear. One of the harder routes at Curbar requiring positive footwork.' }),
    tradRoute('Penal Servitude',      'E4',  '6b', curbarMain,  { height: 14, description: 'One of the most serious routes at Curbar — bold and technical with hard moves above limited gear. A committing challenge that rewards good gritstone climbers.' }),
    tradRoute('Profit of Doom',       'E4',  '6a', curbarMain,  { height: 14, description: 'A bold and serious E4 — sustained moves on the main wall with the distinct feel of a Curbar testpiece. Requires mental strength as much as physical.' }),
    tradRoute('Ulysses or Bust',      'HVS', '5a', curbarRight, { height: 13, description: 'A well-loved Curbar HVS — sustained and absorbing climbing in a great position. The slightly bold nature adds to the character.' }),
    tradRoute('Right Eliminate',      'E2',  '5c', curbarRight, { height: 12, description: 'A fine eliminate route on the right section — technical moves on compact gritstone. A good introduction to the harder routes at Curbar.' }),
    tradRoute('Blurter',              'HVS', '5a', curbarLeft,  { height: 13, description: 'A quality HVS — sustained and interesting moves on good gritstone with reliable gear. A popular route for those stepping up to the harder Curbar classics.' }),
  ]) await r({ ...route, buttressId: route.buttress.id });

  // ── Baslow Edge ───────────────────────────────────────────────────────────
  const baslow = await c('Baslow Edge', 53.2920, -1.6250, RockType.GRITSTONE,
    'The southernmost of the classic eastern gritstone edges — a pleasant and lower-angled edge giving accessible routes across the lower grades. Eagle\'s Nest Arête is a famous landmark and a classic at any grade. A fine destination for developing gritstone technique away from the crowds of Froggatt and Curbar.',
    'From Baslow village, follow the footpath up onto the moor east of the village. The edge is visible on the skyline — 15 min walk. Alternatively approach from the top via the Birchen Edge path.',
    'Roadside parking in Baslow village (limited, free) or the Robin Hood car park on the A619. Several approach options available.', region);
  const baslowArete = await b('Eagle\'s Nest Area', baslow, 1);
  const baslowWall  = await b('Main Wall', baslow, 2);
  const baslowRight = await b('Right End', baslow, 3);

  for (const route of [
    tradRoute('Eagle\'s Nest Arête',  'VD',  '3c', baslowArete, { height: 10, description: 'The famous Baslow landmark — an elegant arête on perfect gritstone giving one of the most photogenic routes in the Peak. Straightforward but memorable climbing.' }),
    tradRoute('Tody\'s Wall',         'HVS', '5a', baslowWall,  { height: 10, description: 'A fine HVS on the main wall — sustained and technical moves on compact gritstone. A well-regarded route at the grade with reliable gear.' }),
    tradRoute('Boc Route',            'VS',  '4c', baslowWall,  { height: 10, description: 'A quality VS — sustained face and wall climbing on good gritstone. A natural line giving absorbing and enjoyable climbing.' }),
    tradRoute('Needle\'s Eye Crack',  'HS',  '4b', baslowArete, { height: 9,  description: 'A fine crack route on the arête area — well-protected jamming and layback on classic gritstone. A good companion to Eagle\'s Nest.' }),
    tradRoute('South Buttress Route', 'S',   '4a', baslowRight, { height: 9,  description: 'An accessible route on the right end — good holds and natural line on rough gritstone. A pleasant introduction to Baslow Edge.' }),
  ]) await r({ ...route, buttressId: route.buttress.id });

  // ── Gardom's Edge ─────────────────────────────────────────────────────────
  const gardoms = await c('Gardom\'s Edge', 53.2855, -1.5970, RockType.GRITSTONE,
    'A quieter gritstone edge south of the main Froggatt/Curbar complex — rough-textured gritstone on a pleasant moorland setting with wide views. Gardom\'s Arête is an exceptional E3 and one of the better routes on the eastern gritstone. Less visited than the main edges, offering a more relaxed atmosphere and a good quality selection of routes.',
    'From the A621 between Baslow and Owler Bar, follow the bridleway east onto Gardom\'s Moor. The edge is reached in 15–20 min from roadside parking.',
    'Roadside parking on the A621 near the Gardom\'s Edge footpath sign (free, limited). The approach crosses open moorland.', region);
  const gardomsArete = await b('Arête Sector', gardoms, 1);
  const gardomsMain  = await b('Main Face', gardoms, 2);
  const gardomsSlab  = await b('Slab Area', gardoms, 3);

  for (const route of [
    tradRoute('Gardom\'s Arête',      'E3',  '5c', gardomsArete, { height: 12, description: 'The centrepiece of Gardom\'s Edge — a superb technical arête route on perfect rough gritstone. Sustained and exposed with a bold feel. One of the best E3s on the eastern edges.' }),
    tradRoute('Easy Slab',            'VD',  '3c', gardomsSlab,  { height: 9,  description: 'The accessible route at Gardom\'s — a pleasant slab on rough gritstone in a fine moorland setting. Good friction holds throughout.' }),
    tradRoute('Flying Buttress Route', 'HVS', '5a', gardomsMain, { height: 11, description: 'A fine HVS up the buttress feature — sustained and varied with a good natural line. Technical moves on compact gritstone.' }),
    tradRoute('Gardom\'s Crack',      'VS',  '4c', gardomsMain,  { height: 11, description: 'A quality VS crack route — well-protected jamming and bridging on good rough gritstone. A typical eastern edges classic.' }),
    tradRoute('Slab Eliminate',       'E1',  '5b', gardomsSlab,  { height: 9,  description: 'A harder slab eliminate — technical friction moves on compact gritstone above limited gear. A rewarding challenge on the slab.' }),
  ]) await r({ ...route, buttressId: route.buttress.id });

  console.log('  ✓ Froggatt & Curbar: Froggatt Edge, Curbar Edge, Baslow Edge, Gardom\'s Edge');
}
