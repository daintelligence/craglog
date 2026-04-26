import { DataSource } from 'typeorm';
import { Region } from '../../modules/crags/entities/region.entity';
import { Crag, RockType } from '../../modules/crags/entities/crag.entity';
import { Buttress } from '../../modules/crags/entities/buttress.entity';
import { Route } from '../../modules/routes/entities/route.entity';
import {
  findOrCreateRegion, upsertCrag, upsertButtress, upsertRoute,
  tradRoute, sportRoute,
} from './seed-helpers';

export async function seedNorthumberlandExtended(ds: DataSource) {
  const regionRepo = ds.getRepository(Region);
  const cragRepo   = ds.getRepository(Crag);
  const buttRepo   = ds.getRepository(Buttress);
  const routeRepo  = ds.getRepository(Route);

  const northumberland = await findOrCreateRegion(regionRepo, {
    name: 'Northumberland',
    country: 'England',
    description: 'Northumberland sandstone edges and basalt outcrops along Hadrian\'s Wall — remote, atmospheric and surprisingly varied. Sandstone trad climbing at its best.',
  });

  async function r(route: Partial<Route>) {
    return upsertRoute(routeRepo, route);
  }

  // ── Simonside Crags ───────────────────────────────────────────────────────────
  const simonside = await upsertCrag(cragRepo, {
    name: 'Simonside Crags',
    region: northumberland,
    regionId: northumberland.id,
    latitude: 55.3185,
    longitude: -1.9650,
    rockType: RockType.SANDSTONE,
    description: 'The finest sandstone crag in Northumberland — a long, south-facing escarpment above the Simonside Hills with routes from VD to E4 on perfect rough sandstone. The summit tor gives spectacular views over Coquetdale and the Cheviot Hills. Some pitches require a long walk-off.',
    approach: 'From Rothbury, follow the minor road SW to Forestburn Gate then take the Forestry Commission track to Simonside car park (NZ 037 989). Follow the waymarked trail through forest to the main crag. Allow 40 min.',
    parkingInfo: 'Forestry Commission car park at Simonside, off the Rothbury–Elsdon road (free, opens at dawn).',
  });

  const simMain  = await upsertButtress(buttRepo, { name: 'Main Crag',   crag: simonside, cragId: simonside.id, sortOrder: 1 });
  const simSouth = await upsertButtress(buttRepo, { name: 'South Face',  crag: simonside, cragId: simonside.id, sortOrder: 2 });

  await r(tradRoute('Chockstone Chimney',    'VD', '3c', simMain,  { height: 12, description: 'The classic easy route at Simonside — a fine chimney with a chockstone to negotiate. Great for beginners.', sortOrder: 1 }));
  await r(tradRoute('Great Chimney',         'VD', '3b', simMain,  { height: 14, description: 'The largest chimney on the crag — wider than Chockstone but less intimidating. A good VD on excellent sandstone.', sortOrder: 2 }));
  await r(tradRoute('Belay Crack',           'S',  '4a', simMain,  { height: 10, description: 'A clean finger crack splitting the main tier wall. Well-protected with satisfying jamming throughout.', sortOrder: 3 }));
  await r(tradRoute('Little Sepulchre',      'HS', '4b', simMain,  { height: 12, description: 'Takes the wall and groove system right of the main chimney. Compact sandstone moves with good gear.', sortOrder: 4 }));
  await r(tradRoute('Cube Route',            'VS', '4c', simMain,  { height: 14, description: 'Up the cube-shaped buttress on the central section of the main tier. Varied climbing with a technical crux on the upper wall.', sortOrder: 5 }));
  await r(tradRoute('Enigma',                'HVS','5a', simMain,  { height: 14, description: 'The best HVS on the main crag. Climbs the imposing wall right of centre with a bold sequence above the last good placement.', sortOrder: 6 }));
  await r(tradRoute('Simonside Arête',       'E2', '5b', simMain,  { height: 16, description: 'The finest route at Simonside — takes the right arête of the main tier on technically demanding friction moves. Superb positions.', sortOrder: 7 }));
  await r(tradRoute('Dark Chimney',          'D',  '3a', simMain,  { height: 10, description: 'The narrow left-hand chimney. Awkward but safe — good for introducing beginners to chimneying.', sortOrder: 8 }));

  await r(tradRoute('Pinnacle Face',         'VS', '4c', simSouth, { height: 12, description: 'Climbs the south-facing pinnacle wall on good rough sandstone. A fine outing with exposure above the heather.', sortOrder: 1 }));
  await r(tradRoute('Ridge Route',           'VD', '3c', simSouth, { height: 10, description: 'Follows the south face ridge line — good rock and fine views over Coquetdale throughout.', sortOrder: 2 }));
  await r(tradRoute('South Crack',           'HS', '4b', simSouth, { height: 12, description: 'Clean crack on the south face. Typical Northumberland sandstone — rough, honest and rewarding.', sortOrder: 3 }));
  await r(tradRoute('South Wall Direct',     'E1', '5b', simSouth, { height: 14, description: 'Bold face climbing up the steepest part of the south face. A serious E1 with sparse gear on the upper wall.', sortOrder: 4 }));
  await r(tradRoute('Simonside Superdirect', 'E3', '5c', simSouth, { height: 16, description: 'The hardest route at Simonside. Pulls through the steepest section of the south face on thin edges and small footholds. Committing.', sortOrder: 5 }));
  await r(tradRoute('Prow Direct',           'HVS','5a', simSouth, { height: 12, description: 'Climbs the prow at the left end of the south face. Sustained and satisfying.', sortOrder: 6 }));
  await r(tradRoute('Heather Wall',          'S',  '4a', simSouth, { height: 10, description: 'Approaches the south face from the heather terrace. Relaxed climbing on perfect sandstone.', sortOrder: 7 }));

  // ── Bowden Doors ──────────────────────────────────────────────────────────────
  const bowden = await upsertCrag(cragRepo, {
    name: 'Bowden Doors',
    region: northumberland,
    regionId: northumberland.id,
    latitude: 55.5510,
    longitude: -1.9480,
    rockType: RockType.SANDSTONE,
    description: 'The best developed sandstone crag in North Northumberland. A long, accessible wall with over 100 routes from VD to E4 on typically excellent rough sandstone. Faces south-west and dries very quickly. The Main Face provides a superb concentration of classic routes.',
    approach: 'From the B6348 near Belford, follow signs to Bowden. The crag is in a field 800 m E of Bowden farm (NU 059 342). Park considerately on the lane and walk across the field. 5 min.',
    parkingInfo: 'Roadside on the lane to Bowden farm (free, very limited — 3 cars maximum). Please do not block the farm access.',
  });

  const bowMain  = await upsertButtress(buttRepo, { name: 'Main Face',  crag: bowden, cragId: bowden.id, sortOrder: 1 });
  const bowRight = await upsertButtress(buttRepo, { name: 'Right Wing', crag: bowden, cragId: bowden.id, sortOrder: 2 });

  await r(tradRoute('Diversion',             'VD', '3c', bowMain,  { height:  9, description: 'The starter route at Bowden — a well-worn VD on the left side of the main face. Good for getting your eye in on sandstone.', sortOrder: 1 }));
  await r(tradRoute('Bowden Doors Crack',    'HS', '4b', bowMain,  { height: 12, description: 'The most popular route at Bowden. A clean straight crack up the central section of the main face. Perfect jamming on rough sandstone.', sortOrder: 2 }));
  await r(tradRoute('Tumbleweed',            'VS', '4c', bowMain,  { height: 12, description: 'One of the best VSs in Northumberland. Climbs the wall right of Bowden Doors Crack on varied holds and good gear.', sortOrder: 3 }));
  await r(tradRoute('Dedication',            'VS', '4c', bowMain,  { height: 14, description: 'A long VS up the best section of the main face — sustained friction and crack climbing.', sortOrder: 4 }));
  await r(tradRoute('Blockade',              'HVS','5a', bowMain,  { height: 14, description: 'The best HVS at Bowden. A fine sequence of moves up the imposing central section with one bold move above the last gear.', sortOrder: 5 }));
  await r(tradRoute('Devastation',           'E1', '5b', bowMain,  { height: 14, description: 'Classic E1 — climbs the wall with committing moves on the upper section. Bold and satisfying.', sortOrder: 6 }));
  await r(tradRoute('Pegasus',               'E2', '5c', bowMain,  { height: 14, description: 'The finest hard route at Bowden. Takes the steepest central wall on technical moves with a tough crux sequence.', sortOrder: 7 }));
  await r(tradRoute('Thunder Road',          'E3', '6a', bowMain,  { height: 14, description: 'Bold and technical — one of the hardest routes on the main face. Climbs the wall on small edges with gear that doesn\'t inspire confidence.', sortOrder: 8 }));
  await r(tradRoute('Milestone',             'S',  '4a', bowMain,  { height: 10, description: 'Climbs the milestone-shaped feature on the left main face. Good gear, nice holds.', sortOrder: 9 }));
  await r(tradRoute('Sundowner',             'HVS','5a', bowMain,  { height: 12, description: 'Climbs the wall in the evening sun. Sustained face climbing with a technical finish.', sortOrder: 10 }));

  await r(tradRoute('Right Eliminate',       'VS', '4c', bowRight, { height: 10, description: 'The best VS on the right wing — takes the cleaned wall right of the main area. Well-protected.', sortOrder: 1 }));
  await r(tradRoute('Wing Commander',        'HS', '4b', bowRight, { height: 10, description: 'Classic right wing route up the obvious crack and wall.', sortOrder: 2 }));
  await r(tradRoute('Outflank',              'E1', '5b', bowRight, { height: 12, description: 'The hard route on the right wing. Moves leftward through the bulge on small holds.', sortOrder: 3 }));
  await r(tradRoute('Right Chimney',         'D',  '3a', bowRight, { height:  8, description: 'Easiest route on the right wing — the chimney corner.', sortOrder: 4 }));
  await r(tradRoute('Falcon',                'E2', '5b', bowRight, { height: 12, description: 'Climbs the arête at the right end of the crag. Technical and slightly bold.', sortOrder: 5 }));
  await r(tradRoute('Late Start',            'VD', '3c', bowRight, { height:  9, description: 'Easy crack line at the far right of the wing. Good introduction to Bowden.', sortOrder: 6 }));

  // ── Kyloe Crag ────────────────────────────────────────────────────────────────
  const kyloe = await upsertCrag(cragRepo, {
    name: 'Kyloe Crag',
    region: northumberland,
    regionId: northumberland.id,
    latitude: 55.6560,
    longitude: -1.9700,
    rockType: RockType.SANDSTONE,
    description: 'A split-level sandstone crag in dense forest near the Northumberland coast — split between the open Main Crag and the atmospheric Secret Crag. Both give excellent routes on clean Fell Sandstone in a remote woodland setting. One of the most prized destinations in North Northumberland.',
    approach: 'From the A1 near Belford, follow minor roads west towards Kyloe village (NU 055 385). A bridleway leads into the forestry block — follow for 20 min to the Main Crag. The Secret Crag is a further 10 min walk through the trees.',
    parkingInfo: 'Small pull-off at the forestry track gate near Kyloe (free). Do not obstruct the gate.',
  });

  const kyloeMain   = await upsertButtress(buttRepo, { name: 'Main Crag',   crag: kyloe, cragId: kyloe.id, sortOrder: 1 });
  const kyloeSecret = await upsertButtress(buttRepo, { name: 'Secret Crag', crag: kyloe, cragId: kyloe.id, sortOrder: 2 });

  await r(tradRoute('Pinnacle Route',        'VD', '3c', kyloeMain,   { height:  9, description: 'Climbs the distinctive pinnacle at the left end of the crag. A classic easy route on excellent Fell Sandstone.', sortOrder: 1 }));
  await r(tradRoute('Kyloe Crack',           'VS', '4c', kyloeMain,   { height: 14, description: 'The signature route of the Main Crag — a superb hand crack splitting the centre of the main wall. Perfect protection, perfect rock.', sortOrder: 2 }));
  await r(tradRoute('Mabel\'s Wall',         'HVS','5a', kyloeMain,   { height: 14, description: 'Named for the farmer\'s wife — sustained face climbing right of Kyloe Crack with a committing crux at two-thirds height.', sortOrder: 3 }));
  await r(tradRoute('Kyloe in the Wood',     'E1', '5b', kyloeMain,   { height: 15, description: 'The best route on the main crag. A sustained wall climb with a final bold sequence on the upper slabs.', sortOrder: 4 }));
  await r(tradRoute('Forestry Corner',       'S',  '4a', kyloeMain,   { height: 11, description: 'Takes the corner bounding the right side of the main wall. Good gear and a satisfying exit.', sortOrder: 5 }));
  await r(tradRoute('Afternoon Crack',       'HS', '4b', kyloeMain,   { height: 12, description: 'A clean crack line taking the afternoon sun. Good hand-jamming with good gear.', sortOrder: 6 }));
  await r(tradRoute('Main Face Direct',      'E2', '5c', kyloeMain,   { height: 15, description: 'The direct finish up the blank wall above Mabel\'s Wall. Technical and slightly bold.', sortOrder: 7 }));
  await r(tradRoute('Easy Wall',             'D',  '3a', kyloeMain,   { height:  8, description: 'The easiest route on the crag — a series of good holds on the easier angled wall at the left end.', sortOrder: 8 }));

  await r(tradRoute('Secret Route',          'VS', '4c', kyloeSecret, { height: 12, description: 'The classic of the Secret Crag. Climbs the hidden wall in the trees on excellent rough sandstone.', sortOrder: 1 }));
  await r(tradRoute('Hidden Crack',          'HS', '4b', kyloeSecret, { height: 11, description: 'A fine crack in the back of the Secret Crag. Excellent jams throughout.', sortOrder: 2 }));
  await r(tradRoute('Shade Wall',            'E1', '5b', kyloeSecret, { height: 12, description: 'Climbs the shaded wall deep in the crag. Technical face moves with limited gear options.', sortOrder: 3 }));
  await r(tradRoute('Green Wall',            'HVS','5a', kyloeSecret, { height: 12, description: 'Takes the slightly green wall on the right side of the Secret Crag. Bold in places but on superb sandstone.', sortOrder: 4 }));
  await r(tradRoute('Through the Trees',     'VD', '3b', kyloeSecret, { height:  9, description: 'Easy route through the most sheltered section of the Secret Crag. Perfect for a first visit.', sortOrder: 5 }));
  await r(tradRoute('Deep Recess',           'S',  '4a', kyloeSecret, { height: 10, description: 'Climbs the recess feature at the back of the secret area. Well protected in the niche.', sortOrder: 6 }));
  await r(tradRoute('Treetop Crack',         'E2', '5b', kyloeSecret, { height: 13, description: 'The hardest route in the Secret Crag. Thin crack above the tree canopy level — very exposed and technical.', sortOrder: 7 }));

  // ── Crag Lough ────────────────────────────────────────────────────────────────
  const cragLough = await upsertCrag(cragRepo, {
    name: 'Crag Lough',
    region: northumberland,
    regionId: northumberland.id,
    latitude: 55.0120,
    longitude: -2.3710,
    rockType: RockType.BASALT,
    description: 'A dramatic dolerite (whinstone) crag directly above Hadrian\'s Wall and the lough of the same name. The vertical basalt columns give sustained, technical routes on rough dark rock with some of the most impressive settings in northern England. Routes face north — slow to dry but atmospheric when in condition.',
    approach: 'From the Steel Rigg car park on the B6318 Military Road (NY 751 677). Follow Hadrian\'s Wall path east for 1.5 km to the crag above the lough. 20–25 min.',
    parkingInfo: 'Steel Rigg National Park car park (pay & display, NY 751 677). Alternatively Once Brewed Visitor Centre.',
  });

  const loughMain = await upsertButtress(buttRepo, { name: 'Main Face',         crag: cragLough, cragId: cragLough.id, sortOrder: 1 });
  const loughLeft = await upsertButtress(buttRepo, { name: 'Hadrian\'s Buttress', crag: cragLough, cragId: cragLough.id, sortOrder: 2 });

  await r(tradRoute('Hadrian\'s Buttress',   'VD', '3c', loughLeft, { height: 12, description: 'The classic easy route above Hadrian\'s Wall. Follows the obvious buttress on good rough dolerite holds. Historic setting.', sortOrder: 1 }));
  await r(tradRoute('Lough Route',           'HS', '4b', loughLeft, { height: 14, description: 'The most popular route at Crag Lough — a fine crack and wall combination on the left of the main face. Good gear.', sortOrder: 2 }));
  await r(tradRoute('Central Route',         'S',  '4a', loughLeft, { height: 12, description: 'Up the central groove of the left buttress. Reasonable gear in a characterful setting above the lough.', sortOrder: 3 }));
  await r(tradRoute('Roman Road',            'VD', '3b', loughLeft, { height: 10, description: 'Easy angled wall right of Hadrian\'s Buttress. Solid holds throughout.', sortOrder: 4 }));

  await r(tradRoute('Crag Lough Buttress',   'VS', '4c', loughMain, { height: 16, description: 'The finest VS at Crag Lough. Takes the centre of the main face on technical laybacking and bridging moves.', sortOrder: 1 }));
  await r(tradRoute('The Arête',             'HVS','5a', loughMain, { height: 16, description: 'The right arête of the main face — sustained technical climbing on the sharp basalt edge with a committing upper sequence.', sortOrder: 2 }));
  await r(tradRoute('Whinstone Wall',        'E1', '5b', loughMain, { height: 16, description: 'Direct up the main face on rough whinstone edges. Bold and sustained with a decisive crux in the centre.', sortOrder: 3 }));
  await r(tradRoute('Lough Crack',           'HS', '4b', loughMain, { height: 14, description: 'Clean crack splitting the right side of the main face. Good jams and gear throughout.', sortOrder: 4 }));
  await r(tradRoute('Black Dolerite',        'E2', '5c', loughMain, { height: 18, description: 'The hardest route at Crag Lough. Climbs the steepest part of the main face on the rough crystalline rock. Sparse gear.', sortOrder: 5 }));
  await r(tradRoute('Wall\'s End',           'E1', '5b', loughMain, { height: 14, description: 'Takes the right margin of the main face with a technical sequence and well-placed gear.', sortOrder: 6 }));
  await r(tradRoute('Milecastle',            'VS', '4c', loughMain, { height: 13, description: 'A pleasant VS on the lower-angled section of the main face. Good introduction to dolerite climbing.', sortOrder: 7 }));
  await r(tradRoute('Centurion',             'E3', '5c', loughMain, { height: 18, description: 'The bold E3 of the main face — sustained, technical and very committing with only marginal gear in the crux.', sortOrder: 8 }));
  await r(tradRoute('North Wall',            'S',  '4a', loughMain, { height: 11, description: 'The easiest route on the main face — up the least steep section on positive dolerite edges.', sortOrder: 9 }));

  // ── Sandy Crag ────────────────────────────────────────────────────────────────
  const sandyCrag = await upsertCrag(cragRepo, {
    name: 'Sandy Crag',
    region: northumberland,
    regionId: northumberland.id,
    latitude: 55.5820,
    longitude: -1.9820,
    rockType: RockType.SANDSTONE,
    description: 'A small but excellent sandstone crag near the Northumberland coast, giving short technical routes on clean Fell Sandstone. The crag dries rapidly after rain and sees little traffic, making it a fine alternative when Bowden Doors is busy.',
    approach: 'From the B6353 west of Belford, take minor roads north to Sandy Crag farm (NU 079 345). Walk north along the field edge for 300 m. 5 min from the parking.',
    parkingInfo: 'Small lay-by at the farm track junction (free, 2 cars). Please respect the farmer\'s access.',
  });

  const sandyMain = await upsertButtress(buttRepo, { name: 'Main Wall', crag: sandyCrag, cragId: sandyCrag.id, sortOrder: 1 });
  const sandyLeft = await upsertButtress(buttRepo, { name: 'Left Slab', crag: sandyCrag, cragId: sandyCrag.id, sortOrder: 2 });

  await r(tradRoute('Sandy Crack',           'VS', '4c', sandyMain, { height: 10, description: 'The star route of Sandy Crag — a fine finger crack in perfect sandstone. Better than it looks from below.', sortOrder: 1 }));
  await r(tradRoute('Dune Wall',             'HS', '4b', sandyMain, { height: 10, description: 'Up the centre of the main wall on good pockets and edges. Well-protected.', sortOrder: 2 }));
  await r(tradRoute('Coastal Route',         'VD', '3c', sandyMain, { height:  8, description: 'Easy angled route on the left of the main wall. Good for beginners or warm-up.', sortOrder: 3 }));
  await r(tradRoute('Northumbrian',          'E1', '5b', sandyMain, { height: 12, description: 'The hard route at Sandy Crag — direct up the steep section of the main wall on technical friction moves.', sortOrder: 4 }));
  await r(tradRoute('Sea Breeze',            'HVS','5a', sandyMain, { height: 11, description: 'Takes the wall with a sustained sequence and a single hard move near the top.', sortOrder: 5 }));

  await r(tradRoute('Slab Original',         'D',  '3a', sandyLeft, { height:  6, description: 'Easy slab on the left section — perfect for complete beginners.', sortOrder: 1 }));
  await r(tradRoute('Slab Direct',           'S',  '4a', sandyLeft, { height:  7, description: 'Direct up the slab centre — more technical than the original line.', sortOrder: 2 }));
  await r(tradRoute('Slab Arête',            'HS', '4b', sandyLeft, { height:  8, description: 'The left arête of the slab — delicate balance moves on the sharp edge.', sortOrder: 3 }));
  await r(tradRoute('Sandy Slab Superdirect','VS', '4c', sandyLeft, { height:  8, description: 'Direct up the centre of the slab on friction. Scarce gear makes this feel harder than the grade.', sortOrder: 4 }));
  await r(tradRoute('Corner Route',          'VD', '3b', sandyLeft, { height:  7, description: 'The corner bounding the left slab — easy and enjoyable.', sortOrder: 5 }));

  // ── Great Wanney ──────────────────────────────────────────────────────────────
  const greatWanney = await upsertCrag(cragRepo, {
    name: 'Great Wanney',
    region: northumberland,
    regionId: northumberland.id,
    latitude: 55.2190,
    longitude: -2.1760,
    rockType: RockType.SANDSTONE,
    description: 'A remote moorland sandstone crag south of Otterburn in the wilder heart of Northumberland. Routes from VD to E3 on excellent rough Fell Sandstone. The approach walk through heather and bracken adds to the adventure. Rarely crowded and superb on a clear day.',
    approach: 'From Otterburn on the A696, follow the minor road west to Great Tosson and then track northwest (NY 958 008). Walk across the moor on a faint path for 1.5 km. Allow 35–40 min from the road. Good compass and OS map skills recommended.',
    parkingInfo: 'Roadside pull-off on the Tosson lane (free, NY 957 010). Do not obstruct the farm gate.',
  });

  const wanMain  = await upsertButtress(buttRepo, { name: 'Main Face',     crag: greatWanney, cragId: greatWanney.id, sortOrder: 1 });
  const wanPinn  = await upsertButtress(buttRepo, { name: 'Pinnacle Area', crag: greatWanney, cragId: greatWanney.id, sortOrder: 2 });

  await r(tradRoute('Wanney Chimney',        'VD', '3c', wanMain,  { height: 10, description: 'The introductory route at Great Wanney — a fine chimney on the left side of the main face. Atmospheric setting.', sortOrder: 1 }));
  await r(tradRoute('Main Wall Crack',       'S',  '4a', wanMain,  { height: 12, description: 'Clean crack in the centre of the main face. Good gear and rough rock make this a pleasure.', sortOrder: 2 }));
  await r(tradRoute('Great Wanney Wall',     'VS', '4c', wanMain,  { height: 14, description: 'The classic VS of Great Wanney. Direct face climbing on the main wall — sustained, technical and very satisfying.', sortOrder: 3 }));
  await r(tradRoute('Wanney Arête',          'HVS','5a', wanMain,  { height: 14, description: 'The right arête of the main face — bold, exposed and technical. One of the finest routes at the crag.', sortOrder: 4 }));
  await r(tradRoute('Moorland Direct',       'E2', '5c', wanMain,  { height: 14, description: 'Climbs the steep central wall between the crack and arête. Hard moves on small holds with minimal gear.', sortOrder: 5 }));
  await r(tradRoute('Heather Groove',        'HS', '4b', wanMain,  { height: 11, description: 'Takes the groove at the right of the main face. Well-protected and enjoyable.', sortOrder: 6 }));
  await r(tradRoute('Overhang Route',        'E1', '5b', wanMain,  { height: 12, description: 'Climbs directly through the small overhang on the main face. Technical sequence and a bold pull-through.', sortOrder: 7 }));
  await r(tradRoute('Moorland Eliminate',    'E3', '5c', wanMain,  { height: 14, description: 'The hardest main face route. Takes a very direct line through the steepest section on sustained thin moves.', sortOrder: 8 }));

  await r(tradRoute('Pinnacle Ridge',        'VD', '3b', wanPinn,  { height:  8, description: 'Easy ridge climbing on the pinnacle feature. Good fun and fine views.', sortOrder: 1 }));
  await r(tradRoute('Pinnacle Crack',        'HS', '4b', wanPinn,  { height: 10, description: 'The crack on the east face of the pinnacle. Good gear in a fine position.', sortOrder: 2 }));
  await r(tradRoute('Pinnacle West Face',    'VS', '4c', wanPinn,  { height: 10, description: 'Technical face climbing on the western side of the pinnacle. The crux is low, where the holds are smallest.', sortOrder: 3 }));
  await r(tradRoute('Tower Route',           'D',  '3a', wanPinn,  { height:  7, description: 'Easy scramble to the pinnacle top via the south side. A good first route.', sortOrder: 4 }));
  await r(tradRoute('North Face Direct',     'E1', '5b', wanPinn,  { height: 11, description: 'The shaded north side of the pinnacle. More technical than the other faces and rarely dry in winter.', sortOrder: 5 }));
  await r(tradRoute('Corner and Wall',       'S',  '4a', wanPinn,  { height: 10, description: 'Climbs the corner then moves onto the wall. Good gear throughout.', sortOrder: 6 }));
  await r(tradRoute('Rim Route',             'HVS','5a', wanPinn,  { height: 11, description: 'Follows the rim of the pinnacle. Exposed and technical with a memorable finish at the top.', sortOrder: 7 }));

  console.log('  ✓ Northumberland extended: Simonside Crags, Bowden Doors, Kyloe Crag, Crag Lough, Sandy Crag, Great Wanney');
}
