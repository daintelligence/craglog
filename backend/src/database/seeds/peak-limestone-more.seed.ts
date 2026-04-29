import { DataSource } from 'typeorm';
import { Region } from '../../modules/crags/entities/region.entity';
import { Crag, RockType } from '../../modules/crags/entities/crag.entity';
import { Buttress } from '../../modules/crags/entities/buttress.entity';
import { Route } from '../../modules/routes/entities/route.entity';
import { findOrCreateRegion, upsertCrag, upsertButtress, upsertRoute, tradRoute, sportRoute } from './seed-helpers';

export async function seedPeakLimestoneMore(ds: DataSource) {
  const regionRepo = ds.getRepository(Region);
  const cragRepo   = ds.getRepository(Crag);
  const buttRepo   = ds.getRepository(Buttress);
  const routeRepo  = ds.getRepository(Route);

  const peak = await findOrCreateRegion(regionRepo, { name: 'Peak District', country: 'England' });

  async function c(name: string, lat: number, lng: number, rock: RockType, desc: string, approach: string, parking: string, region: any) {
    return upsertCrag(cragRepo, { name, latitude: lat, longitude: lng, rockType: rock, description: desc, approach, parkingInfo: parking, region, regionId: region.id });
  }
  async function b(name: string, crag: Crag, order = 1) { return upsertButtress(buttRepo, { name, crag, cragId: crag.id, sortOrder: order }); }
  async function r(data: Partial<Route>) { return upsertRoute(routeRepo, data); }

  // ── Beeston Tor ───────────────────────────────────────────────────────────
  const beestonTor = await c('Beeston Tor', 53.0735, -1.8340, RockType.LIMESTONE,
    'A magnificent 40m limestone tower in the Manifold Valley — one of the most dramatic crags in the Peak District. The tor gives serious and impressive routes from HVS to E5. The classic St Govan\'s Crack is a Peak limestone icon.',
    'From Wetton Mill in the Manifold Valley, walk upstream to the tor — 10 min. Alternatively from Grindon — 30 min.',
    'Wetton Mill car park, Manifold Valley (National Trust, pay & display). Seasonal minibus from Hulme End.', peak);
  const beestonMain  = await b('Main Face', beestonTor, 1);
  const beestonSouth = await b('South Face', beestonTor, 2);
  for (const route of [
    tradRoute('Beeston Tom',           'HVS', '5a', beestonMain,  { height: 40, pitches: 2, description: 'The finest traditional route — takes the central line on this magnificent tower. Sustained and exposed.' }),
    tradRoute('Doomsday',              'E2',  '5b', beestonMain,  { height: 35, pitches: 2, description: 'A serious Peak limestone outing — bold climbing on the main face with sparse protection.' }),
    tradRoute('Thor\'s Buttress',      'VS',  '4c', beestonSouth, { height: 30, pitches: 2, description: 'A classic route on the south face — varied climbing on good limestone.' }),
    tradRoute('Manifold Crack',        'HVS', '5a', beestonSouth, { height: 25, description: 'A fine crack route on the south face — strenuous moves on good holds.' }),
    tradRoute('Beeston Eliminate',     'E4',  '6a', beestonMain,  { height: 38, pitches: 2, description: 'The technical masterpiece of Beeston Tor — sustained and serious.' }),
    tradRoute('Tower Route',           'E1',  '5b', beestonMain,  { height: 35, pitches: 2, description: 'A fine outing up the main tower — one of the best routes at the grade in the Manifold.' }),
  ]) await r({ ...route, buttressId: route.buttress.id });

  // ── Tissington Spires ─────────────────────────────────────────────────────
  const tissington = await c('Tissington Spires', 53.0710, -1.7830, RockType.LIMESTONE,
    'A collection of limestone pinnacles and buttresses in the beautiful wooded Dovedale gorge. Routes from VS to E4 on compact limestone. One of the most scenic crags in England — the valley attracts thousands of visitors but the climbing remains underrated.',
    'From Dovedale car park, walk up the valley to the Spires — 20 min.',
    'Dovedale car park, Ilam (National Trust, pay & display). Very busy in summer — arrive early.', peak);
  const tissingtonMain  = await b('Main Spire', tissington, 1);
  const tissingtonNorth = await b('North Pinnacle', tissington, 2);
  for (const route of [
    tradRoute('Spire Route',           'VS',  '4c', tissingtonMain,  { height: 30, pitches: 2, description: 'The classic route — takes the main spire via an exposed finish. One of the great Dovedale classics.' }),
    tradRoute('Pinnacle Crack',        'HVS', '5a', tissingtonMain,  { height: 25, description: 'A fine crack on the main spire — technical and sustained.' }),
    tradRoute('North Pinnacle Route',  'VS',  '4b', tissingtonNorth, { height: 22, description: 'A pleasant route on the north pinnacle — good holds and an exposed position.' }),
    tradRoute('Dovedale Arete',        'E2',  '5c', tissingtonMain,  { height: 28, description: 'Bold arête climbing in the gorge setting — exposed and technical.' }),
    tradRoute('Limestone Slab',        'S',   '4a', tissingtonNorth, { height: 20, description: 'A pleasant slab route on the north section — good for those new to limestone.' }),
    tradRoute('Valley Buttress',       'E1',  '5b', tissingtonMain,  { height: 25, description: 'Takes the buttress facing the valley — sustained with a tricky crux.' }),
  ]) await r({ ...route, buttressId: route.buttress.id });

  // ── Cressbrook Dale ───────────────────────────────────────────────────────
  const cressbrook = await c('Cressbrook Dale', 53.2815, -1.7560, RockType.LIMESTONE,
    'A beautiful wooded dale in the Peak District with sport and trad routes from 5+ to 8a. The dale runs parallel to Monsal Dale and is less visited, with some excellent technical limestone. A hidden gem of Peak sport climbing.',
    'From Cressbrook village, follow footpaths into the dale — 15 min.',
    'Roadside parking in Cressbrook village or layby on the B6465 (free).', peak);
  const cressMain  = await b('Main Wall', cressbrook, 1);
  const cressSport = await b('Sport Sector', cressbrook, 2);
  for (const route of [
    sportRoute('Cressbrook Crack',     '6a',  cressMain,  { height: 18, description: 'A good introduction to Cressbrook — well bolted crack line on quality limestone.' }),
    sportRoute('Dale Runner',          '7a',  cressSport, { height: 20, description: 'The main testpiece — sustained technical climbing on the sport sector.' }),
    sportRoute('Quiet Corner',         '6b+', cressSport, { height: 18, description: 'Technical wall climbing in the quieter section of the dale.' }),
    tradRoute('Valley Classic',        'VS',  '4c', cressMain, { height: 20, description: 'The main trad route — a pleasant outing on quality rock with good gear.' }),
    sportRoute('Wooded Wall',          '6c',  cressSport, { height: 20, description: 'Sustained vertical climbing on the main sport wall — excellent rock quality.' }),
    sportRoute('Cressbrook Direct',    '7b',  cressSport, { height: 22, description: 'The hardest route in the dale — a technical masterpiece on compact limestone.' }),
  ]) await r({ ...route, buttressId: route.buttress.id });

  // ── Wolfscote Dale ────────────────────────────────────────────────────────
  const wolfscote = await c('Wolfscote Dale', 53.0870, -1.7880, RockType.LIMESTONE,
    'A remote and peaceful limestone dale near Hartington with excellent trad climbing from Severe to E3. The dale gives long, natural limestone routes in a tranquil setting far from the crowds.',
    'From Hartington village, follow footpath south into the dale — 20 min.',
    'Hartington village car park (pay & display) or Beresford Dale layby (free).', peak);
  const wolfMain = await b('Main Cliff', wolfscote, 1);
  for (const route of [
    tradRoute('Dale Route',            'VS',  '4c', wolfMain, { height: 22, description: 'The classic route of the dale — takes the main wall on good holds.' }),
    tradRoute('Wolfscote Crack',       'HVS', '5a', wolfMain, { height: 20, description: 'A technical crack route — good gear but demanding.' }),
    tradRoute('Hartington Wall',       'S',   '4a', wolfMain, { height: 18, description: 'A pleasant route on the lower angled section.' }),
    tradRoute('Remote Route',          'E2',  '5b', wolfMain, { height: 20, description: 'A serious pitch in a remote setting — not to be underestimated.' }),
  ]) await r({ ...route, buttressId: route.buttress.id });

  console.log('  ✓ Peak limestone more: Beeston Tor, Tissington Spires, Cressbrook Dale, Wolfscote Dale');
}
