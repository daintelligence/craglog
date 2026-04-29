import { DataSource } from 'typeorm';
import { Region } from '../../modules/crags/entities/region.entity';
import { Crag, RockType } from '../../modules/crags/entities/crag.entity';
import { Buttress } from '../../modules/crags/entities/buttress.entity';
import { Route } from '../../modules/routes/entities/route.entity';
import { findOrCreateRegion, upsertCrag, upsertButtress, upsertRoute, tradRoute, sportRoute } from './seed-helpers';

export async function seedHighTorPeakMore(ds: DataSource) {
  const regionRepo = ds.getRepository(Region);
  const cragRepo   = ds.getRepository(Crag);
  const buttRepo   = ds.getRepository(Buttress);
  const routeRepo  = ds.getRepository(Route);

  const peakDistrict = await findOrCreateRegion(regionRepo, { name: 'Peak District', country: 'England' });

  async function c(name: string, lat: number, lng: number, rock: RockType, desc: string, approach: string, parking: string, region: any) {
    return upsertCrag(cragRepo, { name, latitude: lat, longitude: lng, rockType: rock, description: desc, approach, parkingInfo: parking, region, regionId: region.id });
  }
  async function b(name: string, crag: Crag, order = 1) { return upsertButtress(buttRepo, { name, crag, cragId: crag.id, sortOrder: order }); }
  async function r(data: Partial<Route>) { return upsertRoute(routeRepo, data); }

  // ── High Tor ─────────────────────────────────────────────────────────────
  const highTor = await c('High Tor', 53.1380, -1.5495, RockType.LIMESTONE,
    'The most dramatic crag in the Peak District — a 90m limestone face above the River Derwent at Matlock Bath. Routes from VS to E7 on excellent compact limestone with airy exposed positions. Debauchery, Aurora and Castellan are landmark trad routes; the sport wall has excellent routes to 8c. One of the most impressive Peak crags.',
    'From Matlock Bath, walk along the river to below High Tor — 10 min. The main face requires an abseil approach from above.',
    'Matlock Bath station car park or the riverside car parks (pay & display). Tourist area — busy in summer.', peakDistrict);
  const torMain    = await b('Main Face', highTor, 1);
  const torRight   = await b('Right Wall', highTor, 2);
  const torSport   = await b('Sport Wall', highTor, 3);
  const girdleSlab = await b('Girdle Slab', highTor, 4);

  for (const route of [
    tradRoute('Debauchery',           'HVS', '5a', torMain,    { height: 65, pitches: 2, description: 'The great High Tor moderate — a magnificent sustained route up the main face on excellent compact limestone. A Peak classic.' }),
    tradRoute('Aurora',               'E3',  '5c', torMain,    { height: 70, pitches: 2, description: 'A fine E3 — sustained and absorbing on the magnificent main face above the River Derwent.' }),
    tradRoute('Castellan',            'E2',  '5c', torMain,    { height: 65, pitches: 2, description: 'A classic Peak District E2 — serious and sustained on compact limestone.' }),
    tradRoute('Wellington Crack',     'VS',  '4c', torMain,    { height: 55, pitches: 2, description: 'A fine VS on the main face — good natural gear placements and varied climbing.' }),
    tradRoute('Darius',               'E4',  '6a', torRight,   { height: 60, pitches: 2, description: 'A bold route on the right wall — technical and committing above the river.' }),
    tradRoute('The Right Unconquerable','E5', '6b', torRight,   { height: 55, pitches: 2, description: 'A serious and powerful route on the right wall — one of the great Peak hard trad routes.' }),
    tradRoute('Girdle Traverse',      'E1',  '5b', girdleSlab, { height: 80, pitches: 3, description: 'The classic girdle traverse — a long exposed outing across the full width of High Tor.' }),
    sportRoute('High Tor Sport',      '7c',  torSport,   { height: 25, description: 'A well-bolted route on the sport wall — sustained technical climbing above the Derwent.' }),
    sportRoute('Derwent Wall',        '8a',  torSport,   { height: 22, description: 'A hard sport route — powerful and sustained on the bolted section.' }),
    sportRoute('Matlock Sport',       '7a',  torSport,   { height: 22, description: 'A good mid-grade sport route — well positioned with views over the gorge.' }),
  ]) await r({ ...route, buttressId: route.buttress.id });

  // ── Robin Hood's Stride ────────────────────────────────────────────────────
  const robinHoodsStride = await c('Robin Hood\'s Stride', 53.1530, -1.7192, RockType.GRITSTONE,
    'Two prominent gritstone pinnacles on Harthill Moor giving short but quality routes from VS to E3. The Stride is one of the most distinctive Peak gritstone features — the two pillars are visible for miles. Balancing Act and Inaccessible Crack are well-known routes.',
    'From Birchover village, follow the footpath across Harthill Moor to the Stride — 15 min.',
    'Roadside parking near Birchover village, Derbyshire (free).', peakDistrict);
  const strideMain = await b('Main Pinnacles', robinHoodsStride, 1);

  for (const route of [
    tradRoute('Inaccessible Crack',   'VS',  '4c', strideMain, { height: 15, description: 'The classic Stride route — takes the crack between the two pinnacles. A unique and memorable outing.' }),
    tradRoute('Balancing Act',        'HVS', '5a', strideMain, { height: 15, description: 'A technical route on the pinnacle — balance and precision on compact gritstone.' }),
    tradRoute('Moor Route',           'S',   '4a', strideMain, { height: 12, description: 'A pleasant moderate on the moorland gritstone — good holds above the Derbyshire moors.' }),
    tradRoute('Stride Direct',        'E1',  '5b', strideMain, { height: 15, description: 'A bold direct route on the pinnacle — committing moves above a rough landing.' }),
  ]) await r({ ...route, buttressId: route.buttress.id });

  // ── Cratcliffe Tor ────────────────────────────────────────────────────────
  const cratcliffe = await c('Cratcliffe Tor', 53.1558, -1.7225, RockType.GRITSTONE,
    'A fine gritstone outcrop on Harthill Moor adjacent to Robin Hood\'s Stride with routes from VS to E4. The hermit\'s cave at the base adds character. Owl Gully and Suicide Wall are respected routes. A quiet and atmospheric crag.',
    'From Birchover, follow the path to Harthill Moor — 15 min. Often visited with Robin Hood\'s Stride.',
    'Roadside parking near Birchover village (free).', peakDistrict);
  const cratMain = await b('Main Tor', cratcliffe, 1);

  for (const route of [
    tradRoute('Owl Gully',            'VS',  '4c', cratMain, { height: 20, description: 'The classic Cratcliffe route — takes the prominent gully feature on good gritstone.' }),
    tradRoute('Suicide Wall',         'E2',  '5b', cratMain, { height: 18, description: 'A bold wall route — serious and committing on the main face above the hermit\'s cave.' }),
    tradRoute('Hermit\'s Crack',      'S',   '4a', cratMain, { height: 16, description: 'Named after the historical hermit — a pleasant crack route with good gear.' }),
    tradRoute('Cratcliffe Arête',     'HVS', '5a', cratMain, { height: 20, description: 'An exposed arête with views over Harthill Moor and the Peak countryside.' }),
  ]) await r({ ...route, buttressId: route.buttress.id });

  // ── Harborough Rocks ──────────────────────────────────────────────────────
  const harborough = await c('Harborough Rocks', 53.0960, -1.6480, RockType.LIMESTONE,
    'A pleasant limestone outcrop above Brassington in the southern Peak District with routes from VD to E2. A quieter venue with good rock quality and fine views over the Derbyshire countryside. Often used as a mid-week alternative when the major crags are busy.',
    'From Brassington village, follow the footpath north to the rocks — 15 min.',
    'Brassington village roadside (free).', peakDistrict);
  const harboroughMain = await b('Main Face', harborough, 1);

  for (const route of [
    tradRoute('Harborough Crack',     'VS',  '4c', harboroughMain, { height: 18, description: 'The main crack route — a good natural line on compact southern Peak limestone.' }),
    tradRoute('Brassington Wall',     'HVS', '5a', harboroughMain, { height: 15, description: 'A technical wall route — small holds on the compact limestone above the village.' }),
    tradRoute('Southern Route',       'VD',  '3c', harboroughMain, { height: 15, description: 'A pleasant accessible route — good intro to the southern Peak District limestone.' }),
    tradRoute('Harborough Direct',    'E1',  '5b', harboroughMain, { height: 18, description: 'A bold direct route — committing moves on the main face.' }),
  ]) await r({ ...route, buttressId: route.buttress.id });

  // ── Birchen Edge ─────────────────────────────────────────────────────────
  const birchen = await c('Birchen Edge', 53.2838, -1.6063, RockType.GRITSTONE,
    'A fine gritstone edge on the eastern moors above Baslow with routes from VD to E3. The famous Three Ships (Nelson\'s Monument, Victory, Trafalgar, Foudroyant) pinnacles give character to the edge. An excellent moorland venue with wide views over Derbyshire.',
    'From the Robin Hood inn on the A619, follow the footpath up to the edge — 10 min.',
    'Robin Hood inn car park, A619 Baslow (small fee, or roadside layby nearby).', peakDistrict);
  const birchenMain     = await b('Main Edge', birchen, 1);
  const birchenPinnacles = await b('Three Ships', birchen, 2);

  for (const route of [
    tradRoute('Nelson\'s Slab',       'VD',  '3c', birchenMain,      { height: 12, description: 'A classic Birchen moderate — good holds on the east-facing gritstone.' }),
    tradRoute('Three Ships Route',    'HS',  '4b', birchenPinnacles, { height: 14, description: 'A route incorporating the famous ship-named pinnacles — atmospheric and varied.' }),
    tradRoute('Birchen Crack',        'VS',  '4c', birchenMain,      { height: 14, description: 'The main crack route — excellent gear and classic Peak gritstone climbing.' }),
    tradRoute('Mast Route',           'HVS', '5a', birchenPinnacles, { height: 12, description: 'A technical route on the pinnacles — balance and precision required.' }),
    tradRoute('Birchen Wall',         'E1',  '5b', birchenMain,      { height: 14, description: 'A bold wall route on the main edge — committing above moorland scenery.' }),
  ]) await r({ ...route, buttressId: route.buttress.id });

  console.log('  ✓ Peak more: High Tor, Robin Hood\'s Stride, Cratcliffe, Harborough Rocks, Birchen Edge');
}
