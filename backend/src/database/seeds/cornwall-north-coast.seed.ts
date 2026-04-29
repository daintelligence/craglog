import { DataSource } from 'typeorm';
import { Region } from '../../modules/crags/entities/region.entity';
import { Crag, RockType } from '../../modules/crags/entities/crag.entity';
import { Buttress } from '../../modules/crags/entities/buttress.entity';
import { Route } from '../../modules/routes/entities/route.entity';
import { findOrCreateRegion, upsertCrag, upsertButtress, upsertRoute, tradRoute } from './seed-helpers';

export async function seedCornwallNorthCoast(ds: DataSource) {
  const regionRepo = ds.getRepository(Region);
  const cragRepo   = ds.getRepository(Crag);
  const buttRepo   = ds.getRepository(Buttress);
  const routeRepo  = ds.getRepository(Route);

  const cornwall = await findOrCreateRegion(regionRepo, { name: 'Cornwall', country: 'England' });

  async function c(name: string, lat: number, lng: number, rock: RockType, desc: string, approach: string, parking: string, region: any) {
    return upsertCrag(cragRepo, { name, latitude: lat, longitude: lng, rockType: rock, description: desc, approach, parkingInfo: parking, region, regionId: region.id });
  }
  async function b(name: string, crag: Crag, order = 1) { return upsertButtress(buttRepo, { name, crag, cragId: crag.id, sortOrder: order }); }
  async function r(data: Partial<Route>) { return upsertRoute(routeRepo, data); }

  // ── Higher Sharpnose Point ────────────────────────────────────────────────
  const higherSharpnose = await c('Higher Sharpnose Point', 50.8943, -4.5560, RockType.OTHER,
    'A spectacular headland of steeply tilted shale and sandstone near Bude giving bold routes from VS to E5. The rock is dramatically layered — tilted almost vertically in places. A wild and atmospheric crag on the north Cornish coast. Kinkyboots is a legendary E4.',
    'From Morwenstow, follow the South West Coast Path south to Higher Sharpnose — 30 min.',
    'Morwenstow car park (National Trust, pay & display) or roadside layby on the clifftop road.', cornwall);
  const sharpnoseMain  = await b('Main Face', higherSharpnose, 1);
  const sharpnoseRight = await b('Right Section', higherSharpnose, 2);
  for (const route of [
    tradRoute('Kinkyboots',            'E4',  '6a', sharpnoseMain,  { height: 35, description: 'The legendary Sharpnose route — technically brilliant climbing on the most dramatic section. A north Cornwall must-do.' }),
    tradRoute('Sharpnose Wall',        'VS',  '4c', sharpnoseMain,  { height: 30, description: 'Takes the main wall above the Atlantic — sustained on surprisingly good holds.' }),
    tradRoute('Headland Crack',        'HVS', '5a', sharpnoseRight, { height: 28, description: 'A fine crack on the right section — strenuous but well protected.' }),
    tradRoute('Atlantic Slab',         'S',   '4a', sharpnoseRight, { height: 25, description: 'A less serious outing on the angled slab — good holds and a dramatic position.' }),
    tradRoute('Tilted Wall',           'E2',  '5b', sharpnoseMain,  { height: 30, description: 'Takes the dramatically tilted main wall — a committing route on adventurous rock.' }),
    tradRoute('North Coast Groove',    'E1',  '5b', sharpnoseMain,  { height: 28, description: 'A fine groove route on the headland — technical and exposed.' }),
  ]) await r({ ...route, buttressId: route.buttress.id });

  // ── The Strangles ─────────────────────────────────────────────────────────
  const strangles = await c('The Strangles', 50.7358, -4.6550, RockType.OTHER,
    'A remote beach and sea cliff near Crackington Haven with routes from VS to E4 on layered shale. A committing venue requiring a beach approach — only accessible at low tide. Wild and atmospheric with a genuine sense of adventure.',
    'From Crackington Haven, follow the South West Coast Path north then descend to the beach at low tide — 45 min. Tidal access — check tide times carefully.',
    'Crackington Haven car park (National Trust, pay & display).', cornwall);
  const stranglesMain = await b('Main Cliff', strangles, 1);
  for (const route of [
    tradRoute('Strangles Crack',       'VS',  '4c', stranglesMain, { height: 30, description: 'The main crack line — a good route on layered shale in a dramatic setting.' }),
    tradRoute('Beach Route',           'HS',  '4b', stranglesMain, { height: 25, description: 'A route from the beach approach — good holds, atmospheric setting.' }),
    tradRoute('Shale Wall',            'E2',  '5b', stranglesMain, { height: 28, description: 'Bold face climbing on the shale wall — requires confidence on unusual rock.' }),
    tradRoute('Remote Crack',          'E1',  '5b', stranglesMain, { height: 25, description: 'A satisfying crack route in a truly remote location.' }),
  ]) await r({ ...route, buttressId: route.buttress.id });

  // ── Gurnard's Head ────────────────────────────────────────────────────────
  const gurnardsHead = await c('Gurnard\'s Head', 50.1835, -5.6102, RockType.GRANITE,
    'A dramatic granite headland on the far west of the Penwith Peninsula with routes from VS to E5. The headland juts into the Atlantic giving a raw, ocean atmosphere. Excellent rough granite with varied climbing — cracks, arêtes and walls.',
    'From the B3306 road near Zennor, follow the footpath to the headland — 15 min walk.',
    'Roadside parking on the B3306 near the Gurnard\'s Head Hotel (free, limited).', cornwall);
  const gurnardsMain  = await b('Main Headland', gurnardsHead, 1);
  const gurnardsNorth = await b('North Face', gurnardsHead, 2);
  for (const route of [
    tradRoute('Headland Arête',        'VS',  '4c', gurnardsMain,  { height: 30, description: 'Takes the dramatic arête of the headland — exposed and fine on rough granite.' }),
    tradRoute('Atlantic Crack',        'HVS', '5a', gurnardsMain,  { height: 28, description: 'A fine crack route on the headland — strenuous and satisfying.' }),
    tradRoute('North Face Route',      'E2',  '5b', gurnardsNorth, { height: 25, description: 'Bold climbing on the north face — serious exposure above the Atlantic.' }),
    tradRoute('Penwith Slab',          'VS',  '4b', gurnardsMain,  { height: 25, description: 'Friction slab climbing on Penwith granite — balance and technique required.' }),
    tradRoute('Gurnard Direct',        'E3',  '5c', gurnardsMain,  { height: 28, description: 'Direct up the main face of the headland — bold and committing.' }),
  ]) await r({ ...route, buttressId: route.buttress.id });

  // ── Kenidjack Cliff ───────────────────────────────────────────────────────
  const kenidjack = await c('Kenidjack Cliff', 50.1343, -5.6755, RockType.GRANITE,
    'A remote granite sea cliff near Cape Cornwall with routes from VS to E4. Excellent coarse granite in a wild Atlantic setting. Less visited than Bosigran but with equally good rock and a sense of real adventure.',
    'From St Just, follow footpaths to Cape Cornwall then north along the coast to Kenidjack — 40 min.',
    'Cape Cornwall car park near St Just (National Trust, pay & display).', cornwall);
  const kenidjackMain = await b('Main Cliff', kenidjack, 1);
  for (const route of [
    tradRoute('Kenidjack Crack',       'VS',  '4c', kenidjackMain, { height: 25, description: 'The main crack route — takes the obvious line on good Penwith granite.' }),
    tradRoute('Cape Route',            'HVS', '5a', kenidjackMain, { height: 25, description: 'A fine route above the Atlantic — sustained and well positioned.' }),
    tradRoute('Kenidjack Direct',      'E2',  '5b', kenidjackMain, { height: 22, description: 'Direct up the main face — technical climbing on compact granite.' }),
    tradRoute('West Face',             'E1',  '5b', kenidjackMain, { height: 22, description: 'Takes the west-facing side — atmospheric and exposed.' }),
    tradRoute('Atlantic Wall',         'S',   '4a', kenidjackMain, { height: 18, description: 'A pleasant accessible route — good intro to the cliff.' }),
  ]) await r({ ...route, buttressId: route.buttress.id });

  // ── Zennor Head ───────────────────────────────────────────────────────────
  const zennorHead = await c('Zennor Head', 50.1895, -5.5682, RockType.GRANITE,
    'A beautiful granite headland between Gurnard\'s Head and St Ives with excellent routes from HS to E4. The rock is classic rough Penwith granite — excellent friction and varied features. A less busy alternative to the famous Penwith crags.',
    'From Zennor village, follow the coast path west to the headland — 20 min.',
    'Zennor village car park (pay & display, small) or roadside on the B3306.', cornwall);
  const zennorMain = await b('Main Headland', zennorHead, 1);
  for (const route of [
    tradRoute('Zennor Crack',          'HVS', '5a', zennorMain, { height: 25, description: 'Takes the main crack line on the headland — a classic Penwith route.' }),
    tradRoute('Head Route',            'HS',  '4b', zennorMain, { height: 22, description: 'The standard route — good holds and an enjoyable situation.' }),
    tradRoute('Penwith Arête',         'E2',  '5c', zennorMain, { height: 25, description: 'A bold arête route on rough granite — requires commitment.' }),
    tradRoute('Granite Slab',          'VS',  '4b', zennorMain, { height: 20, description: 'A pleasant slab on perfect granite — balance and friction.' }),
  ]) await r({ ...route, buttressId: route.buttress.id });

  console.log('  ✓ Cornwall North Coast: Higher Sharpnose, The Strangles, Gurnard\'s Head, Kenidjack Cliff, Zennor Head');
}
