import { DataSource } from 'typeorm';
import { Region } from '../../modules/crags/entities/region.entity';
import { Crag, RockType } from '../../modules/crags/entities/crag.entity';
import { Buttress } from '../../modules/crags/entities/buttress.entity';
import { Route } from '../../modules/routes/entities/route.entity';
import { findOrCreateRegion, upsertCrag, upsertButtress, tradRoute, boulderRoute } from './seed-helpers';

export async function seedPeakGritNewCrags(ds: DataSource) {
  const regionRepo = ds.getRepository(Region);
  const cragRepo   = ds.getRepository(Crag);
  const buttRepo   = ds.getRepository(Buttress);
  const routeRepo  = ds.getRepository(Route);

  const peak = await findOrCreateRegion(regionRepo, {
    name: 'Peak District', country: 'England',
    description: 'The Peak District — UK climbing heartland. Gritstone edges and limestone dales.',
  });

  // ── Robin Hood's Stride ───────────────────────────────────────────────────
  const rhs = await upsertCrag(cragRepo, {
    name: "Robin Hood's Stride", region: peak, regionId: peak.id,
    latitude: 53.1945, longitude: -1.7035, rockType: RockType.GRITSTONE,
    description: 'A dramatic moorland tor with two towers — the \'Mock Beggars Hall\' feature. Excellent short routes and some hard test pieces on fine gritstone.',
    approach: 'Park on the lane near Harthill Moor (SK 2253 6245). 10 min walk to the tor.',
    parkingInfo: 'Roadside parking on Limestone Lane near Elton.',
  });
  const rhsMain = await upsertButtress(buttRepo, { name: 'Main Tor', crag: rhs, cragId: rhs.id, sortOrder: 1 });
  const rhsInnominate = await upsertButtress(buttRepo, { name: 'Innominate Pinnacle', crag: rhs, cragId: rhs.id, sortOrder: 2 });
  await routeRepo.save([
    tradRoute('The Unconquerables', 'VS', '4c', rhsMain, { height: 10, description: 'The classic Stride route — takes the crack and wall on the main tor.', sortOrder: 1 }),
    tradRoute('Inaccessible Crack', 'S', '3c', rhsMain, { height: 8, description: 'Short crack requiring a bit of agility to reach.', sortOrder: 2 }),
    tradRoute('Mock Beggars Arête', 'HS', '4b', rhsMain, { height: 10, description: 'The fine arête of the main tower — exposed and classic.', sortOrder: 3 }),
    tradRoute('Weasel Crack', 'VS', '4c', rhsMain, { height: 9, description: 'Finger crack on the right side of the main tower.', sortOrder: 4 }),
    tradRoute('Tippler', 'HVS', '5a', rhsMain, { height: 9, description: 'Technical wall moves — one of the harder Stride routes.', sortOrder: 5 }),
    tradRoute('Stride Minor', 'D', '2c', rhsInnominate, { height: 7, description: 'Easy scramble to the top of the smaller pinnacle.', sortOrder: 1 }),
    tradRoute('Innominate Route', 'VD', '3a', rhsInnominate, { height: 8, description: 'The original route on the Innominate Pinnacle.', sortOrder: 2 }),
    tradRoute('Crack and Wall', 'E2', '5c', rhsInnominate, { height: 9, description: 'Hard face climbing — one of the Stride test pieces.', sortOrder: 3 }),
  ]);

  // ── Cratcliffe Tor ────────────────────────────────────────────────────────
  const crat = await upsertCrag(cragRepo, {
    name: 'Cratcliffe Tor', region: peak, regionId: peak.id,
    latitude: 53.2010, longitude: -1.6980, rockType: RockType.GRITSTONE,
    description: 'A beautiful hidden gritstone tor with an ancient hermit\'s cave at the base. Fine trad routes from VS to E4 on excellent rock.',
    approach: 'Park near Harthill Moor Farm. 15 min walk through woodland. Site of Special Scientific Interest.',
    parkingInfo: 'Small lay-by on lane near Elton (SK 2285 6255).',
  });
  const cratMain = await upsertButtress(buttRepo, { name: 'Main Face', crag: crat, cragId: crat.id, sortOrder: 1 });
  const cratLeft = await upsertButtress(buttRepo, { name: 'Left Section', crag: crat, cragId: crat.id, sortOrder: 2 });
  await routeRepo.save([
    tradRoute('Hermit', 'E4', '6a', cratMain, { height: 12, description: 'The hardest route on Cratcliffe — desperate face climbing above the hermit\'s cave.', sortOrder: 1 }),
    tradRoute('Suicide Wall', 'E2', '5c', cratMain, { height: 14, description: 'A serious route on the main face — bold and sustained.', sortOrder: 2 }),
    tradRoute('Suicide Wall Direct', 'E3', '5c', cratMain, { height: 14, description: 'The direct start adds difficulty to an already serious route.', sortOrder: 3 }),
    tradRoute('Owl Gully', 'D', '2c', cratMain, { height: 10, description: 'The easy gully right of the main face — good for beginners.', sortOrder: 4 }),
    tradRoute('Oak Tree Wall', 'VS', '4c', cratLeft, { height: 12, description: 'Classic wall climbing on the left section.', sortOrder: 1 }),
    tradRoute('The Flake Crack', 'HS', '4b', cratLeft, { height: 11, description: 'A good flake crack — well-protected and satisfying.', sortOrder: 2 }),
    tradRoute('Flying Buttress', 'VD', '3b', cratLeft, { height: 9, description: 'A pleasant easy route at the left end of the crag.', sortOrder: 3 }),
  ]);

  // ── Birchens Edge ─────────────────────────────────────────────────────────
  const birch = await upsertCrag(cragRepo, {
    name: 'Birchens Edge', region: peak, regionId: peak.id,
    latitude: 53.2632, longitude: -1.6020, rockType: RockType.GRITSTONE,
    description: 'Compact gritstone edge overlooking the Derwent Valley near Chatsworth. Features three Nelsonian pinnacles (the Three Ships) and a famous heritage boulder problem.',
    approach: 'Park at the car park on A619 at Birchens Edge (SK 2806 7270). 5 min walk.',
    parkingInfo: 'Birchens Edge car park off A619 (free, small car park).',
  });
  const birchMain = await upsertButtress(buttRepo, { name: 'Main Edge', crag: birch, cragId: birch.id, sortOrder: 1 });
  const birchShips = await upsertButtress(buttRepo, { name: 'Three Ships', crag: birch, cragId: birch.id, sortOrder: 2 });
  await routeRepo.save([
    tradRoute('Nelson\'s Slab', 'VD', '3b', birchMain, { height: 8, description: 'The gentle introductory slab below the Nelson pinnacle.', sortOrder: 1 }),
    tradRoute('The Admiral', 'VS', '4c', birchMain, { height: 9, description: 'Classic route on the main buttress — bold and technical.', sortOrder: 2 }),
    tradRoute('Hardy\'s Severe', 'S', '4a', birchMain, { height: 9, description: 'Named after Nelson\'s captain — a well-worn classic.', sortOrder: 3 }),
    tradRoute('Trafalgar Crack', 'HS', '4b', birchMain, { height: 10, description: 'A fine crack splitting the main section of the edge.', sortOrder: 4 }),
    tradRoute('Emma\'s Dilemma', 'HVS', '5a', birchMain, { height: 10, description: 'Technical wall moves between the crack lines.', sortOrder: 5 }),
    tradRoute('Victory Crack', 'VS', '4c', birchShips, { height: 8, description: 'The crack on the Victory pinnacle — the centerpiece of the Three Ships.', sortOrder: 1 }),
    tradRoute('Enterprise', 'HS', '4b', birchShips, { height: 8, description: 'The Enterprise pinnacle — a short but excellent route.', sortOrder: 2 }),
    tradRoute('Defiance', 'E1', '5b', birchShips, { height: 9, description: 'The hardest of the Three Ships routes — sustained crack.', sortOrder: 3 }),
  ]);

  // ── Derwent Edge ──────────────────────────────────────────────────────────
  const derw = await upsertCrag(cragRepo, {
    name: 'Derwent Edge', region: peak, regionId: peak.id,
    latitude: 53.3920, longitude: -1.6840, rockType: RockType.GRITSTONE,
    description: 'A remote moorland edge above the Derwent Reservoir with a series of distinctive tors — Salt Cellar, Wheel Stones, Cakes of Bread. Excellent routes in a wild setting.',
    approach: '1 hr walk from Fairholmes car park (SK 1730 8930) via the Derwent Dam and Cut Gate path.',
    parkingInfo: 'Fairholmes visitor centre car park (pay & display), Derwent Reservoir.',
  });
  const derwMain = await upsertButtress(buttRepo, { name: 'Salt Cellar', crag: derw, cragId: derw.id, sortOrder: 1 });
  const derwWheel = await upsertButtress(buttRepo, { name: 'Wheel Stones', crag: derw, cragId: derw.id, sortOrder: 2 });
  await routeRepo.save([
    tradRoute('Salt Cellar Crack', 'VS', '4c', derwMain, { height: 8, description: 'The classic crack on the Salt Cellar tor — exposed and satisfying.', sortOrder: 1 }),
    tradRoute('Salt Cellar Arête', 'HVS', '5a', derwMain, { height: 8, description: 'Technical arête — more serious than it looks.', sortOrder: 2 }),
    tradRoute('The Leaning Block', 'S', '3c', derwMain, { height: 7, description: 'The classic easy route on this section of the edge.', sortOrder: 3 }),
    tradRoute('Wheel Stones Ridge', 'VD', '3b', derwWheel, { height: 9, description: 'Easy scrambling up the prominent wheel-shaped tor.', sortOrder: 1 }),
    tradRoute('Wheel Stones Wall', 'E1', '5b', derwWheel, { height: 9, description: 'Technical climbing on the overhanging wall.', sortOrder: 2 }),
    tradRoute('Back Tor Climb', 'HS', '4a', derwWheel, { height: 10, description: 'A pleasant route on the rearward-facing wall.', sortOrder: 3 }),
  ]);

  // ── Ramshaw Rocks ─────────────────────────────────────────────────────────
  const ramshaw = await upsertCrag(cragRepo, {
    name: 'Ramshaw Rocks', region: peak, regionId: peak.id,
    latitude: 53.1330, longitude: -1.9570, rockType: RockType.GRITSTONE,
    description: 'A dramatic moorland gritstone outcrop on the Staffordshire moors above Leek. Excellent bouldering and short routes, with superb views over the Staffordshire moorlands.',
    approach: 'Roadside parking on A53 near the Mermaid pub (SK 0168 6333). 5 min walk to the rocks.',
    parkingInfo: 'Lay-bys on A53 Buxton–Leek road near Ramshaw. No dedicated car park.',
  });
  const ramMain = await upsertButtress(buttRepo, { name: 'Main Outcrop', crag: ramshaw, cragId: ramshaw.id, sortOrder: 1 });
  const ramBoul = await upsertButtress(buttRepo, { name: 'Boulder Field', crag: ramshaw, cragId: ramshaw.id, sortOrder: 2 });
  await routeRepo.save([
    tradRoute('The Flake Route', 'VS', '4c', ramMain, { height: 9, description: 'Classic flake crack on the main outcrop — excellent jamming.', sortOrder: 1 }),
    tradRoute('Ramshaw Eliminate', 'E2', '5c', ramMain, { height: 9, description: 'Technical wall climbing — one of the best routes on the crag.', sortOrder: 2 }),
    tradRoute('Mermaid Route', 'HS', '4b', ramMain, { height: 8, description: 'A popular route taking the obvious line near the mermaid carved into the rock.', sortOrder: 3 }),
    tradRoute('Leek Wall', 'VD', '3c', ramMain, { height: 7, description: 'Easy climbing on the lower tier.', sortOrder: 4 }),
    tradRoute('Ramshaw Crack', 'S', '4a', ramMain, { height: 8, description: 'Fine crack on the right side of the crag.', sortOrder: 5 }),
    boulderRoute('Ramshaw Traverse', '6A', ramBoul, { description: 'Classic low traverse of the boulders right to left.', sortOrder: 1 }),
    boulderRoute('The Overhang Problem', '6B', ramBoul, { description: 'Powerful moves through the main overhang on the lower boulders.', sortOrder: 2 }),
    boulderRoute('Side Pull Arête', '5', ramBoul, { description: 'A pleasant beginner\'s arête on the lower boulders.', sortOrder: 3 }),
  ]);

  // ── Windgather Rocks (expanded) ───────────────────────────────────────────
  const windg = await upsertCrag(cragRepo, {
    name: 'Windgather Rocks', region: peak, regionId: peak.id,
    latitude: 53.2808, longitude: -1.9790, rockType: RockType.GRITSTONE,
    description: 'A friendly gritstone outcrop near Kettleshulme — excellent for beginners and leaders alike. Short routes on clean gritstone with good gear placements.',
    approach: 'Park at Pym Chair car park on Kettleshulme Road (SJ 9950 7660). 5 min walk.',
    parkingInfo: 'Small car park at Pym Chair, Kettleshulme. Or roadside on Windgather Road.',
  });
  const windgMain = await upsertButtress(buttRepo, { name: 'Main Face', crag: windg, cragId: windg.id, sortOrder: 1 });
  await routeRepo.save([
    tradRoute('Western Slabs', 'M', '2b', windgMain, { height: 6, description: 'Gentle slabs — perfect for first leads.', sortOrder: 1 }),
    tradRoute('Windgather Crack', 'VD', '3b', windgMain, { height: 7, description: 'Classic short crack — well-used and well-loved.', sortOrder: 2 }),
    tradRoute('Windgather Groove', 'S', '3c', windgMain, { height: 7, description: 'Pleasant groove — a step up from the crack.', sortOrder: 3 }),
    tradRoute('Windgather Arête', 'VS', '4c', windgMain, { height: 7, description: 'The thin arête on the right of the main face.', sortOrder: 4 }),
    tradRoute('Windgather Wall', 'HS', '4b', windgMain, { height: 7, description: 'Open wall between the groove and arête.', sortOrder: 5 }),
  ]);

  // ── Hen Cloud (expanded) ──────────────────────────────────────────────────
  const henCloud = await upsertCrag(cragRepo, {
    name: 'Hen Cloud', region: peak, regionId: peak.id,
    latitude: 53.1412, longitude: -2.0065, rockType: RockType.GRITSTONE,
    description: 'A pointed gritstone summit on the Staffordshire moors, companion to The Roaches. Gives fine ridge and face routes in a dramatic position.',
    approach: 'From The Roaches car park, walk north past Rockhall to the summit.',
    parkingInfo: 'Upper Hulme car park (pay & display) or road-side on Roaches Road.',
  });
  const henMain = await upsertButtress(buttRepo, { name: 'Main Face', crag: henCloud, cragId: henCloud.id, sortOrder: 1 });
  const henSE = await upsertButtress(buttRepo, { name: 'SE Arête', crag: henCloud, cragId: henCloud.id, sortOrder: 2 });
  await routeRepo.save([
    tradRoute('Hen Cloud Ridge', 'VD', '3b', henMain, { height: 14, description: 'The classic way up Hen Cloud — follows the main ridge.', sortOrder: 1 }),
    tradRoute('Central Route', 'VS', '4c', henMain, { height: 14, description: 'Takes the central line on the main face.', sortOrder: 2 }),
    tradRoute('Beeline', 'E1', '5b', henMain, { height: 14, description: 'Direct and bold — a fine route on perfect gritstone.', sortOrder: 3 }),
    tradRoute('SE Arête', 'VD', '3c', henSE, { height: 12, description: 'Fine arête giving excellent climbing.', sortOrder: 1 }),
    tradRoute('Windhover', 'HVS', '5a', henSE, { height: 14, description: 'Technical face climbing on the south-east aspect.', sortOrder: 2 }),
  ]);

  // ── The Roaches (expanded) ────────────────────────────────────────────────
  const roaches = await upsertCrag(cragRepo, {
    name: 'The Roaches', region: peak, regionId: peak.id,
    latitude: 53.1575, longitude: -1.9993, rockType: RockType.GRITSTONE,
    description: 'One of the finest gritstone crags in Britain. Three tiers of immaculate rough gritstone give classics at every grade, from the lower Tier VDs to the hard eliminations on the upper tier.',
    approach: 'Park at Upper Hulme car park (SK 0041 6201). 20 min walk to the lower tier.',
    parkingInfo: 'Upper Hulme car park (pay and display, Staffordshire Moorlands). Can be busy at weekends.',
  });
  const roacLower = await upsertButtress(buttRepo, { name: 'Lower Tier', crag: roaches, cragId: roaches.id, sortOrder: 1 });
  const roacUpper = await upsertButtress(buttRepo, { name: 'Upper Tier', crag: roaches, cragId: roaches.id, sortOrder: 2 });
  const roacLichenWall = await upsertButtress(buttRepo, { name: 'Lichen Wall', crag: roaches, cragId: roaches.id, sortOrder: 3 });
  await routeRepo.save([
    // Lower Tier
    tradRoute('Five Finger Exercise', 'VD', '3b', roacLower, { height: 12, description: 'A classic lower-tier introduction to Roaches climbing.', sortOrder: 1 }),
    tradRoute('Batchelor\'s Left-Hand', 'VD', '3c', roacLower, { height: 14, description: 'The classic easier of the two Batchelor\'s routes — well protected.', sortOrder: 2 }),
    tradRoute('Batchelor\'s Right-Hand', 'S', '3c', roacLower, { height: 14, description: 'Slightly harder than its neighbour — still a classic at the grade.', sortOrder: 3 }),
    tradRoute('Saul\'s Crack', 'VS', '4c', roacLower, { height: 16, description: 'The quintessential Roaches VS — a perfect crack splitting the lower tier.', sortOrder: 4 }),
    tradRoute('Sloth', 'HVS', '5b', roacLower, { height: 14, description: 'A Don Whillans classic — an overhanging crack requiring technique and strength.', sortOrder: 5 }),
    tradRoute('Valerian', 'HS', '4a', roacLower, { height: 12, description: 'Classic HS on the lower tier — fine climbing on good rock.', sortOrder: 6 }),
    tradRoute('Technical Slab', 'S', '4a', roacLower, { height: 10, description: 'Clean friction slab — requires careful footwork.', sortOrder: 7 }),
    tradRoute('Tennis Shoe Route', 'D', '2c', roacLower, { height: 10, description: 'Named after Don Whillans\' footwear — the easiest line on the lower tier.', sortOrder: 8 }),
    tradRoute('The Cottage Crack', 'HS', '4b', roacLower, { height: 12, description: 'Excellent crack on the right side of the lower tier.', sortOrder: 9 }),
    tradRoute('Sunset Crack', 'E1', '5b', roacLower, { height: 14, description: 'Bold crack in the fine setting of the lower tier.', sortOrder: 10 }),
    // Upper Tier
    tradRoute('Pedestal Route', 'VD', '3b', roacUpper, { height: 12, description: 'Takes the pedestal feature on the upper tier.', sortOrder: 1 }),
    tradRoute('Crack and Corner', 'HS', '4b', roacUpper, { height: 14, description: 'Fine crack and corner combination — well-protected.', sortOrder: 2 }),
    tradRoute('The Girdle Traverse', 'HVS', '5a', roacUpper, { height: 14, description: 'The classic traverse of the upper tier — an adventure.', sortOrder: 3 }),
    tradRoute('Kavanagh\'s Groove', 'VS', '4c', roacUpper, { height: 14, description: 'A deep groove on the upper tier — satisfying climbing.', sortOrder: 4 }),
    tradRoute('The Sloth Direct', 'E3', '5c', roacUpper, { height: 14, description: 'The hardest variation on the Sloth — a real test piece.', sortOrder: 5 }),
    tradRoute('Bachelor\'s OD', 'E2', '5c', roacUpper, { height: 13, description: 'Strenuous overhanging crack — power climbing at its best.', sortOrder: 6 }),
    // Lichen Wall
    tradRoute('Lichen Wall Route 1', 'VD', '3c', roacLichenWall, { height: 8, description: 'Clean lichen-covered wall — popular intro route.', sortOrder: 1 }),
    tradRoute('Lichen Wall Route 2', 'S', '4a', roacLichenWall, { height: 8, description: 'A step up from Route 1.', sortOrder: 2 }),
  ]);

  // ── Carl Wark (expanded) ──────────────────────────────────────────────────
  const carl = await upsertCrag(cragRepo, {
    name: 'Carl Wark', region: peak, regionId: peak.id,
    latitude: 53.3330, longitude: -1.6400, rockType: RockType.GRITSTONE,
    description: 'An Iron Age hill fort on the moorland near Hathersage. Short gritstone climbs on the rampart walls and main faces.',
    approach: '15 min walk from Upper Burbage Bridge car park. Head south over the moor.',
    parkingInfo: 'Upper Burbage Bridge (SK 2600 8285) or Toad\'s Mouth lay-by.',
  });
  const carlMain = await upsertButtress(buttRepo, { name: 'Rampart Wall', crag: carl, cragId: carl.id, sortOrder: 1 });
  await routeRepo.save([
    tradRoute('Rampart Arête', 'HVS', '5a', carlMain, { height: 8, description: 'Technical arête on the south wall of the rampart.', sortOrder: 1 }),
    tradRoute('Rampart Wall', 'VS', '4c', carlMain, { height: 8, description: 'Diagonal crack across the wall face.', sortOrder: 2 }),
    tradRoute('Promontory Route', 'VD', '3b', carlMain, { height: 7, description: 'Easy climbing to the summit promontory.', sortOrder: 3 }),
    tradRoute('West Wall', 'HS', '4b', carlMain, { height: 7, description: 'Short wall on the western aspect.', sortOrder: 4 }),
  ]);

  // ── Rivelin Needle ────────────────────────────────────────────────────────
  const rivelin = await upsertCrag(cragRepo, {
    name: 'Rivelin Needle', region: peak, regionId: peak.id,
    latitude: 53.3640, longitude: -1.6435, rockType: RockType.GRITSTONE,
    description: 'A needle of gritstone in the Rivelin Valley above Sheffield. Short but memorable routes with a dramatic summit position.',
    approach: 'Park in the Rivelin Valley road (SK 2730 8760). 20 min walk up to the needle.',
    parkingInfo: 'Lay-bys in Rivelin Valley (Free). Limited spaces.',
  });
  const riveMain = await upsertButtress(buttRepo, { name: 'Main Needle', crag: rivelin, cragId: rivelin.id, sortOrder: 1 });
  await routeRepo.save([
    tradRoute('Ordinary Route', 'VD', '3b', riveMain, { height: 7, description: 'The easiest way up the Needle — an exposed summit.', sortOrder: 1 }),
    tradRoute('Overhanging Wall', 'HVS', '5a', riveMain, { height: 7, description: 'The hard route up the overhanging face.', sortOrder: 2 }),
    tradRoute('Needle Arête', 'VS', '4c', riveMain, { height: 7, description: 'The exposed arête of the Needle — memorable.', sortOrder: 3 }),
  ]);
}
