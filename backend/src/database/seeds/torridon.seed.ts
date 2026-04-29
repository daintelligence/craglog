import { DataSource } from 'typeorm';
import { Region } from '../../modules/crags/entities/region.entity';
import { Crag, RockType } from '../../modules/crags/entities/crag.entity';
import { Buttress } from '../../modules/crags/entities/buttress.entity';
import { Route } from '../../modules/routes/entities/route.entity';
import { findOrCreateRegion, upsertCrag, upsertButtress, upsertRoute, tradRoute } from './seed-helpers';

export async function seedTorridon(ds: DataSource) {
  const regionRepo = ds.getRepository(Region);
  const cragRepo   = ds.getRepository(Crag);
  const buttRepo   = ds.getRepository(Buttress);
  const routeRepo  = ds.getRepository(Route);

  const torridon = await findOrCreateRegion(regionRepo, { name: 'Torridon', country: 'Scotland' });

  async function c(name: string, lat: number, lng: number, rock: RockType, desc: string, approach: string, parking: string, region: any) {
    return upsertCrag(cragRepo, { name, latitude: lat, longitude: lng, rockType: rock, description: desc, approach, parkingInfo: parking, region, regionId: region.id });
  }
  async function b(name: string, crag: Crag, order = 1) { return upsertButtress(buttRepo, { name, crag, cragId: crag.id, sortOrder: order }); }
  async function r(data: Partial<Route>) { return upsertRoute(routeRepo, data); }

  // ── Coire Mhic Fhearchair (Beinn Eighe) ───────────────────────────────────
  const coireMhic = await c('Coire Mhic Fhearchair', 57.5840, -5.3905, RockType.QUARTZITE,
    'One of the most spectacular corries in Scotland — the Triple Buttresses of Beinn Eighe rise 300m above a dark lochan in one of Britain\'s finest mountain settings. The quartzite is rough and excellent. Routes from Difficult to E3 on the three main buttresses. A serious mountain undertaking requiring a 3-hour approach.',
    'From Kinlochewe, follow the path west into Coire Mhic Fhearchair — 3 hours. Full mountain navigation and gear required. Remote and serious in bad weather.',
    'Car park at the end of the minor road near Kinlochewe off the A832 (free, limited).', torridon);
  const eastButtress   = await b('East Buttress', coireMhic, 1);
  const centralButtress = await b('Central Buttress', coireMhic, 2);
  const westButtress   = await b('West Buttress', coireMhic, 3);

  for (const route of [
    tradRoute('East Buttress Route',  'D',   '2c', eastButtress,    { height: 250, pitches: 6, description: 'The classic Beinn Eighe route — a magnificent long outing on the east buttress. Perfect rough quartzite in a spectacular Highland corrie.' }),
    tradRoute('Central Rib',          'VD',  '3c', centralButtress, { height: 280, pitches: 6, description: 'The central classic — follows the main rib of the middle buttress in outstanding mountain surroundings.' }),
    tradRoute('Far East Wall',        'E2',  '5c', eastButtress,    { height: 200, pitches: 4, description: 'A harder route on the east buttress — sustained technical climbing on excellent quartzite in a remote corrie.' }),
    tradRoute('West Buttress Route',  'VD',  '3c', westButtress,    { height: 240, pitches: 5, description: 'Takes the west buttress — a fine long route completing the Triple Buttress trilogy.' }),
    tradRoute('Boggle',               'VS',  '4c', centralButtress, { height: 200, pitches: 4, description: 'A fine VS on the central buttress — varied climbing on perfect rough quartzite above the dark lochan.' }),
    tradRoute('East Gully Wall',      'HVS', '5a', eastButtress,    { height: 180, pitches: 4, description: 'A sustained route on the wall beside the east gully — serious and committing in the remote corrie.' }),
  ]) await r({ ...route, buttressId: route.buttress.id });

  // ── Liathach Crags ────────────────────────────────────────────────────────
  const liathach = await c('Liathach North Face', 57.5650, -5.4370, RockType.QUARTZITE,
    'The forbidding north face of Liathach — one of Scotland\'s most dramatic mountain ridges. Routes from VD to E3 on rough Torridonian sandstone and quartzite in a wild and serious setting. The north face sees little sun and is a serious winter and summer venue. Not for the inexperienced.',
    'From Torridon village, follow the path onto the north side of Liathach — 2–2.5 hours. Full mountain equipment essential.',
    'Torridon NTS car park in the village (free, National Trust for Scotland).', torridon);
  const liathachNorth = await b('North Face', liathach, 1);
  const liathachCorrie = await b('North Corrie', liathach, 2);

  for (const route of [
    tradRoute('Fuselage Wall',        'E2',  '5c', liathachNorth,  { height: 120, pitches: 3, description: 'A serious route on Liathach\'s north face — sustained and committing in a wild mountain setting.' }),
    tradRoute('North Face Route',     'VD',  '3c', liathachNorth,  { height: 150, pitches: 4, description: 'A classic moderate on the north face — a long and serious mountain outing.' }),
    tradRoute('Corrie Route',         'VS',  '4c', liathachCorrie, { height: 100, pitches: 3, description: 'A fine route in the north corrie — excellent rough sandstone in an outstanding Highland setting.' }),
    tradRoute('Liathach Direct',      'HVS', '5a', liathachNorth,  { height: 130, pitches: 3, description: 'A sustained direct route up the north face — technical and committing.' }),
  ]) await r({ ...route, buttressId: route.buttress.id });

  // ── Beinn Alligin Horns ───────────────────────────────────────────────────
  const beinnAlligin = await c('Beinn Alligin', 57.5820, -5.5060, RockType.QUARTZITE,
    'The Horns of Alligin give exciting scrambling and easy climbing above Upper Loch Torridon. Routes from Difficult to VS on rough Torridonian quartzite in superb coastal mountain scenery. One of the most beautiful peaks in Scotland.',
    'From the Torridon road, follow the path to the Coire nan Laogh then up to the Horns — 2.5 hours.',
    'Roadside parking near Torridon village on the Diabaig road (free).', torridon);
  const hornsMain = await b('The Horns', beinnAlligin, 1);

  for (const route of [
    tradRoute('Horns Ridge',          'D',   '2c', hornsMain, { height: 100, pitches: 3, description: 'The classic Beinn Alligin scramble/route — follows the dramatic rocky horns in a magnificent coastal Highland setting.' }),
    tradRoute('Alligin Wall',         'VS',  '4c', hornsMain, { height: 70,  pitches: 2, description: 'A fine route on the Horns — good rough quartzite with views over Upper Loch Torridon.' }),
    tradRoute('Tom na Gruagaich',     'VD',  '3c', hornsMain, { height: 80,  pitches: 2, description: 'Takes the upper Alligin area — a pleasant outing with stunning loch views.' }),
  ]) await r({ ...route, buttressId: route.buttress.id });

  // ── Diabaig Buttresses ────────────────────────────────────────────────────
  const diabaig = await c('Diabaig', 57.5648, -5.5522, RockType.GRANITE,
    'A beautiful collection of granite crags above Loch Torridon near the remote village of Diabaig. Routes from VS to E4 on excellent rough granite in a stunning Highland coastal setting. Previously lightly seeded — these additional routes fill out the coverage.',
    'From Torridon, drive or walk the single-track road to Diabaig village. Crags are above the village — 20 min walk.',
    'Diabaig village (very limited roadside parking — be considerate). The road beyond Torridon is single track.', torridon);
  const diabaigMain  = await b('Upper Crag', diabaig, 10);
  const diabaigRight = await b('Right Flank', diabaig, 11);

  for (const route of [
    tradRoute('Diabaig Pillar',       'E2',  '5c', diabaigMain,  { height: 50, pitches: 2, description: 'A fine harder route on the upper crag — sustained on good rough granite above the loch.' }),
    tradRoute('Loch View',            'VS',  '4c', diabaigMain,  { height: 45, pitches: 2, description: 'A classic VS with views over Loch Torridon — excellent rough Torridonian granite.' }),
    tradRoute('Flank Route',          'HVS', '5a', diabaigRight, { height: 40, pitches: 2, description: 'A sustained route on the right flank — technical on compact granite.' }),
    tradRoute('Village Route',        'S',   '4a', diabaigMain,  { height: 35, description: 'A pleasant accessible route above the village — great intro to Diabaig granite.' }),
  ]) await r({ ...route, buttressId: route.buttress.id });

  // ── Quinag Crags ──────────────────────────────────────────────────────────
  const quinag = await c('Quinag', 58.2220, -5.0700, RockType.QUARTZITE,
    'The dramatic multi-topped Quinag massif in Sutherland gives remote climbing on Torridonian sandstone and quartzite. Routes from Difficult to E2 in some of the most remote terrain in Britain. The approach through Kylesku moorland is as rewarding as the climbing.',
    'From the A894 near Kylesku, follow the path into the corries of Quinag — 2–3 hours depending on sector.',
    'Layby on the A894 near Kylesku (free). Very remote — self-sufficient navigation required.', torridon);
  const quinagMain = await b('Main Buttress', quinag, 1);

  for (const route of [
    tradRoute('Quinag Buttress',      'VD',  '3c', quinagMain, { height: 120, pitches: 3, description: 'The classic Quinag route — a fine mountain outing on rough Sutherland quartzite in remote Highland scenery.' }),
    tradRoute('Sutherland Route',     'VS',  '4c', quinagMain, { height: 100, pitches: 3, description: 'A sustained route in the Quinag corries — excellent rough quartzite in a truly wild setting.' }),
    tradRoute('Kylesku Wall',         'HVS', '5a', quinagMain, { height: 90,  pitches: 2, description: 'A fine technical route on the main buttress — views across the Sutherland lochs.' }),
  ]) await r({ ...route, buttressId: route.buttress.id });

  console.log('  ✓ Torridon: Beinn Eighe Triple Buttresses, Liathach, Beinn Alligin, Diabaig, Quinag');
}
