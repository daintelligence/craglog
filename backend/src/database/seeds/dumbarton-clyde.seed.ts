import { DataSource } from 'typeorm';
import { Region } from '../../modules/crags/entities/region.entity';
import { Crag, RockType } from '../../modules/crags/entities/crag.entity';
import { Buttress } from '../../modules/crags/entities/buttress.entity';
import { Route } from '../../modules/routes/entities/route.entity';
import { findOrCreateRegion, upsertCrag, upsertButtress, upsertRoute, tradRoute, sportRoute } from './seed-helpers';

export async function seedDumbartonClyde(ds: DataSource) {
  const regionRepo = ds.getRepository(Region);
  const cragRepo   = ds.getRepository(Crag);
  const buttRepo   = ds.getRepository(Buttress);
  const routeRepo  = ds.getRepository(Route);

  const region = await findOrCreateRegion(regionRepo, { name: 'Central Scotland', country: 'Scotland' });

  async function c(name: string, lat: number, lng: number, rock: RockType, desc: string, approach: string, parking: string, region: any) {
    return upsertCrag(cragRepo, { name, latitude: lat, longitude: lng, rockType: rock, description: desc, approach, parkingInfo: parking, region, regionId: region.id });
  }
  async function b(name: string, crag: Crag, order = 1) { return upsertButtress(buttRepo, { name, crag, cragId: crag.id, sortOrder: order }); }
  async function r(data: Partial<Route>) { return upsertRoute(routeRepo, data); }

  // ── Dumbarton Rock ────────────────────────────────────────────────────────
  const dumbartonRock = await c('Dumbarton Rock', 55.9432, -4.5703, RockType.BASALT,
    'One of the most famous sport climbing venues in the world — the basalt plug of Dumbarton Castle rock rises above the Firth of Clyde and hosts Scotland\'s hardest sport routes. Dave MacLeod\'s Requiem (E8 6c) is the most celebrated traditional route in Scotland, while the sport wall to its right has hosted ascents at 9a and above. The rock is compact, featured basalt with crimps and technical face moves. A world-class venue in an extraordinary historical setting beneath an ancient fortress.',
    'The crag lies directly beneath Dumbarton Castle at the confluence of the Rivers Leven and Clyde. Follow the signed path from the castle car park — 5 min.',
    'Dumbarton Castle car park off Castle Road (Historic Environment Scotland, small fee). Regular trains from Glasgow Queen Street to Dumbarton Central.', region);
  const requiemWall   = await b('Requiem Wall', dumbartonRock, 1);
  const batmanWall    = await b('Batman Wall', dumbartonRock, 2);
  const fortressWall  = await b('Fortress Wall', dumbartonRock, 3);

  for (const route of [
    tradRoute('Requiem',                  'E8',  '6c', requiemWall,  { height: 20, description: 'The most famous traditional route in Scotland — Dave MacLeod\'s masterpiece up the overhanging basalt wall. A visionary lead on gear so poor that many consider it borderline sport. A defining route of British climbing.' }),
    sportRoute('Batman',                  '9a',  batmanWall,   { height: 22, description: 'A world-class sport route on the steepest part of the rock — powerful and sustained on compact basalt crimps. One of Scotland\'s hardest bolted lines.' }),
    sportRoute('Chemin de fer',           '8c',  batmanWall,   { height: 20, description: 'A landmark Scottish sport route — relentless technical climbing on the basalt wall. Established by Dave MacLeod and long considered one of the country\'s hardest lines.' }),
    sportRoute('The Undertaker',          '8b+', batmanWall,   { height: 20, description: 'A serious undertaking on the steepest section of Dumbarton — powerful boulder moves on the overhanging basalt wall.' }),
    sportRoute('Chemin de fer Extension', '8c+', batmanWall,   { height: 24, description: 'The extended version of Chemin de fer continues into even harder territory — one of the most sustained routes on the rock.' }),
    sportRoute('Dumbarton Classic',       '7b',  fortressWall, { height: 18, description: 'The accessible classic of Dumbarton Rock — a superb technical route on featured basalt giving a taste of the venue\'s world-class quality.' }),
    sportRoute('Fortress Wall',           '7a+', fortressWall, { height: 16, description: 'A fine route on the fortress wall sector — sustained and technical on excellent basalt below the castle ramparts.' }),
    sportRoute('Rock On',                 '6c',  fortressWall, { height: 15, description: 'The best mid-grade route at Dumbarton — well bolted and sustained on quality basalt. A popular warm-up for the harder lines.' }),
  ]) await r({ ...route, buttressId: route.buttress.id });

  // ── Auchinstarry Quarry ────────────────────────────────────────────────────
  const auchinstarry = await c('Auchinstarry Quarry', 55.9905, -4.1020, RockType.BASALT,
    'A popular and accessible basalt quarry on the Forth & Clyde Canal corridor north of Glasgow. Excellent sport climbing on vertical to slightly overhanging basalt walls with good bolting. A fine local crag for Glasgow climbers with routes from 6b to 7c+. The quarry walls are compact and featured with the canal towpath providing easy access.',
    'Follow the Forth & Clyde Canal towpath from Auchinstarry Bridge near Kilsyth. The quarry is visible from the path — 5 min walk.',
    'Auchinstarry Marina car park off the B802 near Kilsyth (free). Also accessible from Twechar village.', region);
  const auchinMain  = await b('Main Wall', auchinstarry, 1);
  const auchinRight = await b('Right Sector', auchinstarry, 2);

  for (const route of [
    sportRoute('Auchinstarry Classic',  '7a',  auchinMain,  { height: 15, description: 'The crag classic — a sustained technical route on compact basalt that encapsulates all that makes this quarry worth visiting.' }),
    sportRoute('Hard Quarry',           '7c',  auchinMain,  { height: 16, description: 'The testpiece of Auchinstarry — powerful moves on compact basalt requiring precise footwork and strong fingers.' }),
    sportRoute('Sport Route',           '6b+', auchinRight, { height: 14, description: 'A popular mid-grade route on the right sector — well bolted and sustained on excellent quarried basalt.' }),
    sportRoute('Quarry Wall',           '6c',  auchinRight, { height: 14, description: 'A fine route on the quarry wall — technical face climbing on compact dark basalt above the canal.' }),
  ]) await r({ ...route, buttressId: route.buttress.id });

  // ── Bowling Rock ───────────────────────────────────────────────────────────
  const bowlingRock = await c('Bowling Rock', 55.9217, -4.4931, RockType.BASALT,
    'A riverside basalt outcrop at Bowling on the south bank of the River Clyde near the mouth of the Forth & Clyde Canal. A pleasant venue with a mix of bouldering and short routes on compact dark basalt. The setting above the river estuary gives fine views westward to the Firth of Clyde and the Kilpatrick Hills.',
    'From Bowling harbour, follow the riverside path east below the Kilpatrick Hills. The outcrop is visible from the path — 10 min.',
    'Bowling harbour car park off the A814 (free). Bowling railway station nearby.', region);
  const bowlingMain = await b('River Wall', bowlingRock, 1);
  const bowlingLow  = await b('Lower Buttress', bowlingRock, 2);

  for (const route of [
    tradRoute('Bowling Classic',  'VS',  '4c', bowlingMain, { height: 12, description: 'The classic route at Bowling — a fine line on compact basalt above the River Clyde with views to the Firth.' }),
    tradRoute('River Wall',       'HVS', '5a', bowlingMain, { height: 12, description: 'Takes the wall directly above the river — technical and well-positioned on compact dark basalt.' }),
    tradRoute('Short Route',      'E1',  '5b', bowlingLow,  { height: 10, description: 'A short but worthwhile E1 on the lower buttress — technical moves on compact basalt.' }),
  ]) await r({ ...route, buttressId: route.buttress.id });

  // ── Dumbarton Boulders ─────────────────────────────────────────────────────
  const dumbartonBoulders = await c('Dumbarton Boulders', 55.9430, -4.5700, RockType.BASALT,
    'Roadside bouldering on basalt blocks and outcrops beneath Dumbarton Rock — the same compact dark basalt as the main crag provides excellent finger strength training. A convenient spot for local climbers warming up before or cooling down after routes on the main rock. Problems from Font 5 to 7b+ on featured basalt.',
    'The boulders lie adjacent to the castle car park and approach path — 2 min from parking.',
    'Dumbarton Castle car park off Castle Road (Historic Environment Scotland, small fee).', region);
  const boulderMain  = await b('Main Boulders', dumbartonBoulders, 1);
  const boulderLow   = await b('Low Traverse Wall', dumbartonBoulders, 2);

  for (const route of [
    sportRoute('Font 7a',          '7a',  boulderMain, { height: 4, description: 'A classic Font 7a boulder problem on the main basalt block — crimpy and technical on the same rock type as the famous sport routes above.' }),
    sportRoute('Boulder Problem',  '6c',  boulderMain, { height: 4, description: 'A popular 6c problem on featured basalt — good holds with technical footwork required.' }),
    sportRoute('Low Traverse',     '6b',  boulderLow,  { height: 3, description: 'A low horizontal traverse on the basalt wall — stamina testing and a fine warm-up for the main crag.' }),
  ]) await r({ ...route, buttressId: route.buttress.id });

  // ── Rowardennan Crag ───────────────────────────────────────────────────────
  const rowardennan = await c('Rowardennan Crag', 56.1580, -4.5900, RockType.GRANITE,
    'A granite crag on the eastern slopes of Ben Lomond above Rowardennan on the eastern shore of Loch Lomond. Routes from VD to HVS on sound pink granite with a magnificent loch-side setting. The crag lies within the Loch Lomond and The Trossachs National Park and provides a pleasant contrast to the polished basalt venues further south. Often quiet and a fine destination for a day combining walking and climbing.',
    'From Rowardennan car park and the West Highland Way, follow the path up the eastern slopes of Ben Lomond. The crag appears after approximately 20 min.',
    'Rowardennan car park at the end of the B837 (National Park pay & display). Ferry from Inversnaid in summer months.', region);
  const rowaMain  = await b('Main Buttress', rowardennan, 1);
  const rowaRight = await b('Right Arête', rowardennan, 2);

  for (const route of [
    tradRoute('Rowardennan Route', 'VS',  '4c', rowaMain,  { height: 25, description: 'The classic route of the crag — a fine line on sound pink granite with Loch Lomond spread below. Well protected and sustained at the grade.' }),
    tradRoute('Arête',             'HVS', '5a', rowaRight, { height: 22, description: 'Takes the right arête in fine style — exposed and technical on excellent rough granite above the loch.' }),
    tradRoute('Crack',             'S',   '4a', rowaMain,  { height: 20, description: 'A pleasant crack route on the main buttress — natural gear and good holds on granite typical of the Ben Lomond hills.' }),
  ]) await r({ ...route, buttressId: route.buttress.id });

  console.log('  ✓ Dumbarton & Clyde: Dumbarton Rock, Auchinstarry Quarry, Bowling Rock, Dumbarton Boulders, Rowardennan Crag');
}
