import { DataSource } from 'typeorm';
import { Region } from '../../modules/crags/entities/region.entity';
import { Crag, RockType } from '../../modules/crags/entities/crag.entity';
import { Buttress } from '../../modules/crags/entities/buttress.entity';
import { Route } from '../../modules/routes/entities/route.entity';
import { findOrCreateRegion, upsertCrag, upsertButtress, upsertRoute, tradRoute } from './seed-helpers';

export async function seedGlencoe(ds: DataSource) {
  const regionRepo = ds.getRepository(Region);
  const cragRepo   = ds.getRepository(Crag);
  const buttRepo   = ds.getRepository(Buttress);
  const routeRepo  = ds.getRepository(Route);

  const glencoe = await findOrCreateRegion(regionRepo, { name: 'Glencoe', country: 'Scotland' });

  async function c(name: string, lat: number, lng: number, rock: RockType, desc: string, approach: string, parking: string, region: any) {
    return upsertCrag(cragRepo, { name, latitude: lat, longitude: lng, rockType: rock, description: desc, approach, parkingInfo: parking, region, regionId: region.id });
  }
  async function b(name: string, crag: Crag, order = 1) { return upsertButtress(buttRepo, { name, crag, cragId: crag.id, sortOrder: order }); }
  async function r(data: Partial<Route>) { return upsertRoute(routeRepo, data); }

  // ── Buchaille Etive Mor ───────────────────────────────────────────────────
  const buchaille = await c('Buchaille Etive Mor', 56.6545, 4.9355, RockType.OTHER,
    'Scotland\'s most iconic mountain — the great rhyolite pyramid at the eastern entrance to Glencoe. The main face (Rannoch Wall and surrounding buttresses) gives routes from Difficult to E5. Curved Ridge is a classic hillwalking/scrambling route; Agag\'s Groove and Crowberry Ridge are legendary climbs.',
    'From the A82, park at Altnafeadh (lay-by) and follow the path to the base of the mountain — 45 min to the lower crags.',
    'Altnafeadh lay-by on the A82 near Glencoe village (free). Limited spaces — arrive early in summer.', glencoe);
  const rannochWall   = await b('Rannoch Wall', buchaille, 1);
  const crowberryRidge = await b('Crowberry Ridge', buchaille, 2);
  const northButtress = await b('North Buttress', buchaille, 3);

  for (const route of [
    tradRoute('Agag\'s Groove',       'VD',  '3c', rannochWall,    { height: 150, pitches: 4, description: 'The classic moderate route on Rannoch Wall — a wonderful introduction to Glencoe climbing on excellent rhyolite.' }),
    tradRoute('Whortleberry Wall',    'VS',  '4c', rannochWall,    { height: 120, pitches: 3, description: 'A sustained VS on the main wall — varied and absorbing climbing on the great Buchaille face.' }),
    tradRoute('Crow',                 'E3',  '5c', rannochWall,    { height: 100, pitches: 2, description: 'The magnificent E3 on Rannoch Wall — technical and sustained on superb rock. A Scottish classic.' }),
    tradRoute('Red Slab',             'VS',  '4c', rannochWall,    { height: 90,  pitches: 2, description: 'A fine VS on the red-coloured slab section — good friction on compact rhyolite.' }),
    tradRoute('Curved Ridge',         'D',   '2c', crowberryRidge, { height: 300, pitches: 6, description: 'The classic Buchaille scramble/route — follows the curving ridge in a magnificent mountain position. A Highland must-do.' }),
    tradRoute('Crowberry Ridge Direct','VS',  '4c', crowberryRidge, { height: 200, pitches: 4, description: 'The direct route up the famous ridge — a magnificent sustained outing above Glencoe.' }),
    tradRoute('January Jigsaw',       'E1',  '5b', northButtress,  { height: 120, pitches: 3, description: 'A fine route on the North Buttress — sustained and varied with excellent rock.' }),
  ]) await r({ ...route, buttressId: route.buttress.id });

  // ── Aonach Dubh ───────────────────────────────────────────────────────────
  const aonachDubh = await c('Aonach Dubh', 56.6488, 5.0113, RockType.OTHER,
    'The dramatic west-facing cliffs of Aonach Dubh form the eastern wall of Glencoe above the A82. The crag has a full range of routes from VS to E5 with a distinctly mountaineering character. The approach passes through stunning Glencoe scenery. F-Buttress has some of the finest routes.',
    'From the A82 in Glencoe, park at the Clachaig car park and follow the path up the hillside to the base of the crag — 45–60 min.',
    'Clachaig Inn car park (free for walkers/climbers) or Glencoe village car parks (pay & display in season).', glencoe);
  const fButtress = await b('F Buttress', aonachDubh, 1);
  const eButtress = await b('E Buttress', aonachDubh, 2);
  const westFace  = await b('West Face Lower', aonachDubh, 3);

  for (const route of [
    tradRoute('Ossian\'s Ladder',     'VS',  '4c', fButtress, { height: 90,  pitches: 2, description: 'The classic F Buttress route — an atmospheric and satisfying climb in the heart of Glencoe.' }),
    tradRoute('Hee Haw',              'E3',  '5c', fButtress, { height: 100, pitches: 3, description: 'The great F Buttress test piece — sustained technical climbing on steep rhyolite. A Scottish mountaineering classic.' }),
    tradRoute('The Clearances',       'E4',  '6a', fButtress, { height: 80,  pitches: 2, description: 'A bold and serious route on the main face — powerful moves on compact rock.' }),
    tradRoute('Fingal\'s Pinnacle',   'S',   '4a', eButtress, { height: 60,  pitches: 2, description: 'Takes the distinctive pinnacle feature on E Buttress — fine climbing in an impressive Glencoe setting.' }),
    tradRoute('West Face Route',      'VD',  '3c', westFace,  { height: 70,  pitches: 2, description: 'A pleasant accessible route on the lower west face — good intro to Aonach Dubh.' }),
    tradRoute('Aonach Wall',          'HVS', '5a', eButtress, { height: 80,  pitches: 2, description: 'A fine HVS on E Buttress — well positioned and sustained above the glen.' }),
  ]) await r({ ...route, buttressId: route.buttress.id });

  // ── Church Door Buttress (Bidean nam Bian) ────────────────────────────────
  const churchDoor = await c('Church Door Buttress', 56.6430, 5.0020, RockType.OTHER,
    'A superb buttress high on the flanks of Bidean nam Bian — the highest peak in Argyll. Routes from VS to E3 on good quality rock in a wild and remote setting. The Church Door itself is a natural rock doorway feature. Requires a serious mountain approach.',
    'From Glencoe village, follow the path up the Lost Valley (Coire Gabhail) and continue to the buttress — 2–2.5 hours. Full mountain gear required.',
    'Lost Valley car park on the A82, Glencoe (National Trust for Scotland, pay & display in season).', glencoe);
  const churchMain = await b('Main Buttress', churchDoor, 1);
  const diamondFace = await b('Diamond Face', churchDoor, 2);

  for (const route of [
    tradRoute('Church Door',          'VS',  '4c', churchMain,  { height: 80,  pitches: 2, description: 'The classic route through the famous rock doorway — atmospheric and varied on good Glencoe rock.' }),
    tradRoute('Flake Route',          'HS',  '4b', churchMain,  { height: 70,  pitches: 2, description: 'A pleasant moderate route — takes the flake feature on the main buttress.' }),
    tradRoute('Diamond Face',         'E2',  '5c', diamondFace, { height: 80,  pitches: 2, description: 'Bold technical climbing on the diamond-shaped face — requires commitment at the grade.' }),
    tradRoute('Bidean Wall',          'HVS', '5a', churchMain,  { height: 70,  pitches: 2, description: 'A sustained route above the Lost Valley — excellent rock in an outstanding mountain setting.' }),
  ]) await r({ ...route, buttressId: route.buttress.id });

  // ── Creag a' Bhancair ─────────────────────────────────────────────────────
  const bhancair = await c('Creag a\' Bhancair', 56.6712, 4.9825, RockType.LIMESTONE,
    'A hidden gem in Glencoe — a small limestone crag on the north side of the glen with sport and trad routes from 6a to 8a. The contrast with the surrounding volcanic rock is striking. A popular dry-weather venue when the bigger crags are wet.',
    'From the A82, turn north at Glencoe village and follow minor roads to the cliff — 20 min walk from the road.',
    'Small layby near the approach path on the north Glencoe road (free).', glencoe);
  const bhancairMain = await b('Main Wall', bhancair, 1);

  for (const route of [
    tradRoute('Limestone Wall',       'VS',  '4c', bhancairMain, { height: 18, description: 'A pleasant trad route on the limestone — contrasting character from the volcanic crags nearby.' }),
    tradRoute('Glencoe Limestone',    'HVS', '5a', bhancairMain, { height: 18, description: 'Takes the main limestone wall — good holds on clean rock.' }),
    tradRoute('Bhancair Direct',      'E1',  '5b', bhancairMain, { height: 18, description: 'A direct line up the wall — technical and well positioned.' }),
    tradRoute('Glen Route',           'E2',  '5c', bhancairMain, { height: 20, description: 'The hardest trad route — small holds requiring precise technique.' }),
  ]) await r({ ...route, buttressId: route.buttress.id });

  console.log('  ✓ Glencoe: Buchaille Etive Mor, Aonach Dubh, Church Door Buttress, Creag a\' Bhancair');
}
