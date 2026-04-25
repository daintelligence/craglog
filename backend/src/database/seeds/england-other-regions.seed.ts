import { DataSource } from 'typeorm';
import { Region } from '../../modules/crags/entities/region.entity';
import { Crag, RockType } from '../../modules/crags/entities/crag.entity';
import { Buttress } from '../../modules/crags/entities/buttress.entity';
import { Route } from '../../modules/routes/entities/route.entity';
import {
  findOrCreateRegion, upsertCrag, upsertButtress, upsertRoute, tradRoute, sportRoute,
} from './seed-helpers';

export async function seedEnglandOtherRegions(ds: DataSource) {
  const regionRepo = ds.getRepository(Region);
  const cragRepo   = ds.getRepository(Crag);
  const buttRepo   = ds.getRepository(Buttress);
  const routeRepo  = ds.getRepository(Route);

  const northumberland = await findOrCreateRegion(regionRepo, {
    name: 'Northumberland', country: 'UK',
    description: 'Sandstone crags and Whin Sill outcrops of Northumberland. Bold, friction climbing on sandstone with unique character and texture.',
  });
  const gower = await findOrCreateRegion(regionRepo, {
    name: 'Gower Peninsula', country: 'UK',
    description: 'The limestone sea cliffs of the Gower Peninsula in South Wales. Classic trad and sport climbing on excellent compact limestone above sandy beaches.',
  });
  const kentSandstone = await findOrCreateRegion(regionRepo, {
    name: 'Kent Sandstone', country: 'UK',
    description: 'The sandstone outcrops of the High Weald. Short, technical climbing on rough sandstone with a unique culture — a foundational area for British climbing.',
  });
  const dorset = await findOrCreateRegion(regionRepo, {
    name: 'Dorset', country: 'UK',
    description: 'The limestone sea cliffs and Portland Bill. Classic sport and trad climbing on excellent Jurassic limestone above the English Channel.',
  });
  const wyeValley = await findOrCreateRegion(regionRepo, {
    name: 'Wye Valley', country: 'UK',
    description: 'Limestone crags above the River Wye near Symonds Yat. Excellent sport and trad climbing in a beautiful wooded gorge.',
  });

  // ─── NORTHUMBERLAND ──────────────────────────────────────────────────────

  // ── Bowden Doors ─────────────────────────────────────────────────────────
  const bowdenDoors = await upsertCrag(cragRepo, {
    name: 'Bowden Doors', region: northumberland, regionId: northumberland.id,
    latitude: 55.5935, longitude: -1.9685, rockType: RockType.SANDSTONE,
    description: 'The finest sandstone crag in Northumberland — long, continuous walls of perfect Fell Sandstone. Bold, friction climbing with a unique character. The Doors traverse is a legendary pumpy problem.',
    approach: '5 min walk from the roadside parking on the B6348.',
    parkingInfo: 'Roadside lay-by on the B6348 between Chatton and Belford.',
  });
  const bowdenMain   = await upsertButtress(buttRepo, { name: 'Main Wall',    crag: bowdenDoors, cragId: bowdenDoors.id, sortOrder: 1 });
  const bowdenCentral = await upsertButtress(buttRepo, { name: 'Central Wall', crag: bowdenDoors, cragId: bowdenDoors.id, sortOrder: 2 });
  await routeRepo.save([
    await upsertRoute(routeRepo, tradRoute('Whillans\' Route', 'VS', '4c', bowdenMain,
      { height: 15, description: 'A Bowden classic from the great Don Whillans — sustained wall climbing on perfect Fell Sandstone with characteristic Northumberland boldness.', sortOrder: 1 })),
    await upsertRoute(routeRepo, tradRoute('Doors Traverse', 'HVS', '5a', bowdenCentral,
      { height: 10, description: 'The legendary pumpy traverse of the central wall — the social route at Bowden, linking feature to feature with a vicious crux.', sortOrder: 1 })),
    await upsertRoute(routeRepo, tradRoute('Central Crack', 'VD', '3b', bowdenMain,
      { height: 14, description: 'The friendly introduction to Bowden Doors — a clean crack on the main wall with good gear.', sortOrder: 2 })),
    await upsertRoute(routeRepo, tradRoute('Clandestine', 'E2', '5c', bowdenCentral,
      { height: 15, description: 'A bold Northumberland test-piece — technical moves on smooth Fell Sandstone with sparse gear.', sortOrder: 2 })),
  ]);

  // ── Kyloe Crag ────────────────────────────────────────────────────────────
  const kyloe = await upsertCrag(cragRepo, {
    name: 'Kyloe Crag', region: northumberland, regionId: northumberland.id,
    latitude: 55.6425, longitude: -1.9880, rockType: RockType.SANDSTONE,
    description: 'A wooded sandstone crag near Holy Island with excellent routes from VD to E4. More sheltered than Bowden Doors and with a varied character. The cave routes are unique.',
    approach: '10 min walk through woodland from the B6353 near Kyloe village.',
    parkingInfo: 'Roadside parking on the B6353, Kyloe village.',
  });
  const kyloeMain = await upsertButtress(buttRepo, { name: 'Main Buttress', crag: kyloe, cragId: kyloe.id, sortOrder: 1 });
  const kyloeCave = await upsertButtress(buttRepo, { name: 'Cave Buttress', crag: kyloe, cragId: kyloe.id, sortOrder: 2 });
  await routeRepo.save([
    await upsertRoute(routeRepo, tradRoute('Kyloe in the Wood', 'VS', '4c', kyloeMain,
      { height: 18, description: 'The classic of Kyloe — a fine sandstone wall route with characteristic bold moves in a beautiful woodland setting.', sortOrder: 1 })),
    await upsertRoute(routeRepo, tradRoute('Clandestine Crack', 'VD', '3b', kyloeMain,
      { height: 15, description: 'A well-protected crack climb on the main buttress — a perfect introduction to Northumberland sandstone.', sortOrder: 2 })),
    await upsertRoute(routeRepo, tradRoute('Cave Route', 'HVS', '5a', kyloeCave,
      { height: 12, description: 'An atmospheric route through the cave system — unique Northumberland sandstone adventure.', sortOrder: 1 })),
  ]);

  // ── Crag Lough ────────────────────────────────────────────────────────────
  const cragLough = await upsertCrag(cragRepo, {
    name: 'Crag Lough', region: northumberland, regionId: northumberland.id,
    latitude: 55.0076, longitude: -2.3849, rockType: RockType.BASALT,
    description: 'A Whin Sill crag above a peaceful lake on Hadrian\'s Wall. Dolerite routes with a mountain atmosphere in the heart of Northumberland National Park. Great views along the wall.',
    approach: '15 min walk from the Steel Rigg or Housesteads car park along Hadrian\'s Wall Path.',
    parkingInfo: 'Steel Rigg National Park car park on the B6318 Military Road (English Heritage/NNP charge).',
  });
  const cragLoughMain = await upsertButtress(buttRepo, { name: 'Main Face', crag: cragLough, cragId: cragLough.id, sortOrder: 1 });
  await routeRepo.save([
    await upsertRoute(routeRepo, tradRoute('Hadrian\'s Crack', 'VS', '4c', cragLoughMain,
      { height: 15, description: 'The popular classic of Crag Lough — a satisfying crack on rough dolerite with views over the lake.', sortOrder: 1 })),
    await upsertRoute(routeRepo, tradRoute('Wall Climb', 'VD', '3b', cragLoughMain,
      { height: 12, description: 'An accessible route on the Whin Sill — popular with Hadrian\'s Wall visitors. Good introduction to dolerite climbing.', sortOrder: 2 })),
    await upsertRoute(routeRepo, tradRoute('Roman Wall', 'HVS', '5a', cragLoughMain,
      { height: 15, description: 'The bold test-piece of Crag Lough — exposed and committing with great views north over the moor.', sortOrder: 3 })),
  ]);

  // ── Simonside Crags ───────────────────────────────────────────────────────
  const simonside = await upsertCrag(cragRepo, {
    name: 'Simonside Crags', region: northumberland, regionId: northumberland.id,
    latitude: 55.3232, longitude: -1.9875, rockType: RockType.SANDSTONE,
    description: 'Moorland sandstone crags with a wild Northumberland atmosphere. Short, bold routes above a sea of heather. Great for a quiet day away from the crowds.',
    approach: '45 min walk from the Forestry Commission car park via the Simonside ridge path.',
    parkingInfo: 'Forestry Commission car park at Lordenshaws, near Rothbury, off the B6342.',
  });
  const simonsideMain = await upsertButtress(buttRepo, { name: 'Main Escarpment', crag: simonside, cragId: simonside.id, sortOrder: 1 });
  await routeRepo.save([
    await upsertRoute(routeRepo, tradRoute('Great Slab', 'VS', '4b', simonsideMain,
      { height: 12, description: 'A broad sweeping slab on the Simonside escarpment — friction moves on rough sandstone with superb moorland views.', sortOrder: 1 })),
    await upsertRoute(routeRepo, tradRoute('Simonside Slab', 'D', '2a', simonsideMain,
      { height: 10, description: 'The friendly classic — a popular route combining a moorland walk with short, enjoyable sandstone climbing.', sortOrder: 2 })),
    await upsertRoute(routeRepo, tradRoute('Raven\'s Crag', 'E1', '5b', simonsideMain,
      { height: 14, description: 'A bold sandstone test-piece — thin face climbing with the classic Northumberland runout feel.', sortOrder: 3 })),
  ]);

  // ─── GOWER PENINSULA ─────────────────────────────────────────────────────

  // ── Pennard Cliffs ────────────────────────────────────────────────────────
  const pennard = await upsertCrag(cragRepo, {
    name: 'Pennard Cliffs', region: gower, regionId: gower.id,
    latitude: 51.5662, longitude: -4.1097, rockType: RockType.LIMESTONE,
    description: 'Classic Gower limestone cliffs above Three Cliffs Bay — one of the most scenic climbing venues in Wales. Excellent trad routes from VS to E4 on compact limestone with wonderful sea views.',
    approach: '15 min walk from Southgate or Pobbles Bay along the South Gower coastal path.',
    parkingInfo: 'National Trust car park at Southgate village (charge), or roadside above Pobbles Bay.',
  });
  const pennardMain  = await upsertButtress(buttRepo, { name: 'Main Face',    crag: pennard, cragId: pennard.id, sortOrder: 1 });
  const pennardEast  = await upsertButtress(buttRepo, { name: 'East Sector',  crag: pennard, cragId: pennard.id, sortOrder: 2 });
  await routeRepo.save([
    await upsertRoute(routeRepo, tradRoute('Yellow Arête', 'VS', '4c', pennardMain,
      { height: 22, description: 'The classic of Pennard — a fine arête on compact limestone with wonderful positions above Three Cliffs Bay.', sortOrder: 1 })),
    await upsertRoute(routeRepo, tradRoute('Three Cliffs Climb', 'VD', '3b', pennardMain,
      { height: 18, description: 'A popular outing on the main face — well-protected and accessible with glorious coastal views.', sortOrder: 2 })),
    await upsertRoute(routeRepo, tradRoute('East Face Crack', 'HVS', '5a', pennardEast,
      { height: 20, description: 'A fine crack climb on the east sector — good gear and sustained interest above the sea.', sortOrder: 1 })),
    await upsertRoute(routeRepo, tradRoute('Gower Direct', 'E2', '5b', pennardEast,
      { height: 22, description: 'A bold wall route on the east sector — technical moves on small holds with sparse protection.', sortOrder: 2 })),
  ]);

  // ── Mewslade Bay ─────────────────────────────────────────────────────────
  const mewslade = await upsertCrag(cragRepo, {
    name: 'Mewslade Bay', region: gower, regionId: gower.id,
    latitude: 51.5541, longitude: -4.2124, rockType: RockType.LIMESTONE,
    description: 'Dramatic limestone zawn and cliff at one of Gower\'s most remote bays. Yellow Wall is the standout feature — a huge yellow limestone wall with bold, classic routes.',
    approach: '20 min walk from Pitton Cross farm across Rhossili Down.',
    parkingInfo: 'National Trust car park at Rhossili (pay & display) or parking at Pitton Cross.',
  });
  const mewsladeYellow = await upsertButtress(buttRepo, { name: 'Yellow Wall', crag: mewslade, cragId: mewslade.id, sortOrder: 1 });
  const mewsladeMain   = await upsertButtress(buttRepo, { name: 'Main Cliff',  crag: mewslade, cragId: mewslade.id, sortOrder: 2 });
  await routeRepo.save([
    await upsertRoute(routeRepo, tradRoute('Yellow Wall', 'E2', '5c', mewsladeYellow,
      { height: 30, description: 'The signature route of Mewslade — a bold wall climb up the magnificent yellow limestone with superb exposure and a committing crux.', sortOrder: 1 })),
    await upsertRoute(routeRepo, tradRoute('Mewslade Chimney', 'VD', '3b', mewsladeMain,
      { height: 20, description: 'A classic chimney adventure at the bay — a fun outing in a superb remote setting.', sortOrder: 1 })),
    await upsertRoute(routeRepo, tradRoute('Bay Route', 'VS', '4c', mewsladeMain,
      { height: 25, description: 'A fine route on the main cliff — sustained wall climbing on compact Gower limestone.', sortOrder: 2 })),
  ]);

  // ─── KENT SANDSTONE ──────────────────────────────────────────────────────

  // ── Harrison's Rocks ──────────────────────────────────────────────────────
  const harrisons = await upsertCrag(cragRepo, {
    name: 'Harrison\'s Rocks', region: kentSandstone, regionId: kentSandstone.id,
    latitude: 51.0694, longitude: 0.1272, rockType: RockType.SANDSTONE,
    description: 'The finest sandstone outcrop in Kent — a 500m long sweep of perfect Tunbridge Wells Sandstone. Hundreds of routes from VD to 7C boulder problems. The birthplace of British sport climbing technique.',
    approach: '10 min walk from the B2188 near Groombridge.',
    parkingInfo: 'BMC/MCGB car park at Harrison\'s Rocks off the B2188, near Groombridge (small charge).',
  });
  const harrisonsNorth  = await upsertButtress(buttRepo, { name: 'North Buttress',  crag: harrisons, cragId: harrisons.id, sortOrder: 1 });
  const harrisonsCentral = await upsertButtress(buttRepo, { name: 'Central Buttress', crag: harrisons, cragId: harrisons.id, sortOrder: 2 });
  const harrisonsSouth  = await upsertButtress(buttRepo, { name: 'South Buttress',  crag: harrisons, cragId: harrisons.id, sortOrder: 3 });
  await routeRepo.save([
    await upsertRoute(routeRepo, tradRoute('Niblick', 'VD', '3b', harrisonsCentral,
      { height: 8, description: 'The classic introduction to Harrison\'s — a pleasant crack climb on perfect Kentish sandstone.', sortOrder: 1 })),
    await upsertRoute(routeRepo, tradRoute('Bachelor\'s Left', 'VS', '4c', harrisonsCentral,
      { height: 9, description: 'One of Harrison\'s most popular routes — sustained wall climbing on the smooth central buttress.', sortOrder: 2 })),
    await upsertRoute(routeRepo, tradRoute('Flake Crack', 'HS', '4b', harrisonsNorth,
      { height: 9, description: 'A satisfying crack climb on the north buttress — good gear and sustained interest on excellent sandstone.', sortOrder: 1 })),
    await upsertRoute(routeRepo, tradRoute('Lean Man\'s Climb', 'E1', '5b', harrisonsSouth,
      { height: 10, description: 'A bold south buttress test-piece — technical face moves on the smooth sandstone above the lowest landing.', sortOrder: 1 })),
    await upsertRoute(routeRepo, tradRoute('Tricorn', 'HVS', '5a', harrisonsCentral,
      { height: 9, description: 'A popular HVS on the central buttress — technical and sustained with the characteristic feel of Kent sandstone.', sortOrder: 3 })),
  ]);

  // ── High Rocks ────────────────────────────────────────────────────────────
  const highRocks = await upsertCrag(cragRepo, {
    name: 'High Rocks', region: kentSandstone, regionId: kentSandstone.id,
    latitude: 51.1062, longitude: 0.2198, rockType: RockType.SANDSTONE,
    description: 'Dramatic sandstone rocks in a beautiful woodland setting near Tunbridge Wells. A historic climbing venue with an entrance fee. Good routes from VD to E2 with unique sandstone character.',
    approach: '2 min walk from the High Rocks pub car park.',
    parkingInfo: 'Car park at the High Rocks pub/hotel off the A264 near Tunbridge Wells (entrance fee for the rocks).',
  });
  const highRocksMain = await upsertButtress(buttRepo, { name: 'Main Rocks', crag: highRocks, cragId: highRocks.id, sortOrder: 1 });
  await routeRepo.save([
    await upsertRoute(routeRepo, tradRoute('High Rock Climb', 'VD', '3a', highRocksMain,
      { height: 7, description: 'The classic of the venue — a fun outing on excellent sandstone in the beautiful woodland setting.', sortOrder: 1 })),
    await upsertRoute(routeRepo, tradRoute('The Slab', 'S', '3c', highRocksMain,
      { height: 8, description: 'A popular friction slab — delicate footwork on characteristic Weald sandstone.', sortOrder: 2 })),
    await upsertRoute(routeRepo, tradRoute('Wedge Wall', 'HVS', '5a', highRocksMain,
      { height: 9, description: 'The best of High Rocks harder routes — bold face climbing on smooth sandstone.', sortOrder: 3 })),
  ]);

  // ── Stone Farm Rocks ──────────────────────────────────────────────────────
  const stoneFarm = await upsertCrag(cragRepo, {
    name: 'Stone Farm Rocks', region: kentSandstone, regionId: kentSandstone.id,
    latitude: 51.0654, longitude: 0.0788, rockType: RockType.SANDSTONE,
    description: 'A smaller sandstone outcrop near Forest Row with a variety of routes from VD to E3. Less visited than Harrison\'s, giving a quieter atmosphere on excellent Tunbridge Wells Sandstone.',
    approach: '5 min walk from the parking area off the minor road near Stone Farm.',
    parkingInfo: 'Roadside parking near Stone Farm, off the B2110 near Forest Row.',
  });
  const stoneFarmMain = await upsertButtress(buttRepo, { name: 'Main Face', crag: stoneFarm, cragId: stoneFarm.id, sortOrder: 1 });
  await routeRepo.save([
    await upsertRoute(routeRepo, tradRoute('Farm Route', 'VS', '4c', stoneFarmMain,
      { height: 9, description: 'A fine wall route — a quieter alternative to Harrison\'s with excellent sandstone quality.', sortOrder: 1 })),
    await upsertRoute(routeRepo, tradRoute('Stone Cold', 'E1', '5b', stoneFarmMain,
      { height: 10, description: 'A bold test-piece on the main face — thin moves on smooth sandstone with sparse protection.', sortOrder: 2 })),
  ]);

  // ─── DORSET ───────────────────────────────────────────────────────────────

  // ── Portland Bill ─────────────────────────────────────────────────────────
  const portland = await upsertCrag(cragRepo, {
    name: 'Portland Bill', region: dorset, regionId: dorset.id,
    latitude: 50.5155, longitude: -2.4436, rockType: RockType.LIMESTONE,
    description: 'The Isle of Portland\'s unique Jurassic limestone — perfectly compact, finely pocketed and incredibly varied. World-class sport climbing from 5+ to 9a. One of the UK\'s premier sport crags.',
    approach: 'Most crags are roadside or 5–15 min walk from car parks around the peninsula.',
    parkingInfo: 'Various car parks around Portland Bill. The Cheyne Weares car park gives access to many sectors.',
  });
  const portlandWhiteHole = await upsertButtress(buttRepo, { name: 'White Hole',      crag: portland, cragId: portland.id, sortOrder: 1 });
  const portlandBeachhead = await upsertButtress(buttRepo, { name: 'Beachhead Sector', crag: portland, cragId: portland.id, sortOrder: 2 });
  const portlandCave      = await upsertButtress(buttRepo, { name: 'Cave Hole',        crag: portland, cragId: portland.id, sortOrder: 3 });
  await routeRepo.save([
    await upsertRoute(routeRepo, sportRoute('Portland Classic', '6a+', portlandWhiteHole,
      { height: 18, description: 'The perfect introduction to Portland limestone — well-bolted pockets on immaculate white Jurassic rock.', sortOrder: 1 })),
    await upsertRoute(routeRepo, sportRoute('Equinox', '7a', portlandWhiteHole,
      { height: 20, description: 'A Portland benchmark — sustained technical pockets with a crux sequence at mid-height.', sortOrder: 2 })),
    await upsertRoute(routeRepo, sportRoute('Spacecracker', '7c', portlandBeachhead,
      { height: 22, description: 'One of Portland\'s most coveted routes — powerful roof climbing transitioning to sustained technical face.', sortOrder: 1 })),
    await upsertRoute(routeRepo, sportRoute('Cave Hole Classic', '6c', portlandCave,
      { height: 20, description: 'An atmospheric cave route on Portland\'s unique roof limestone — pumpy and technical.', sortOrder: 1 })),
    await upsertRoute(routeRepo, sportRoute('Mutation', '8c', portlandBeachhead,
      { height: 15, description: 'One of the UK\'s hardest sport routes — an intense bouldery sequence on Portland\'s most compact limestone.', sortOrder: 2 })),
  ]);

  // ── Swanage ───────────────────────────────────────────────────────────────
  const swanage = await upsertCrag(cragRepo, {
    name: 'Swanage', region: dorset, regionId: dorset.id,
    latitude: 50.5993, longitude: -1.9785, rockType: RockType.LIMESTONE,
    description: 'A collection of magnificent sea cliffs around Swanage Bay and Durlston. Trad and sport climbing on Purbeck limestone with a range from VS to E6. Subluminal and Fisherman\'s Friend are Dorset legends.',
    approach: '10–30 min walk from Durlston Country Park or roadside near Swanage.',
    parkingInfo: 'Durlston Country Park car park (Dorset Wildlife Trust charge), or town car parks in Swanage.',
  });
  const swanageBoulder = await upsertButtress(buttRepo, { name: 'Boulder Ruckle', crag: swanage, cragId: swanage.id, sortOrder: 1 });
  const swanageDurlston = await upsertButtress(buttRepo, { name: 'Durlston Head', crag: swanage, cragId: swanage.id, sortOrder: 2 });
  await routeRepo.save([
    await upsertRoute(routeRepo, tradRoute('Conner', 'VS', '4c', swanageBoulder,
      { height: 28, description: 'A Swanage classic on the Boulder Ruckle — sustained limestone wall climbing above the sea.', sortOrder: 1 })),
    await upsertRoute(routeRepo, tradRoute('Fisherfield', 'E2', '5c', swanageBoulder,
      { height: 30, description: 'A bold route on the Ruckle — technical face climbing on compact Purbeck limestone with a serious atmosphere.', sortOrder: 2 })),
    await upsertRoute(routeRepo, sportRoute('Subluminal', '7c', swanageDurlston,
      { height: 25, description: 'The most famous Swanage sport route — a sustained technical line up the Durlston head limestone.', sortOrder: 1 })),
    await upsertRoute(routeRepo, tradRoute('Fisherman\'s Friend', 'E4', '6a', swanageDurlston,
      { height: 30, description: 'A Dorset legend — bold and technical trad climbing high on Durlston Head. One of Swanage\'s all-time classics.', sortOrder: 2 })),
  ]);

  // ─── WYE VALLEY ──────────────────────────────────────────────────────────

  // ── Symonds Yat ───────────────────────────────────────────────────────────
  const symondsYat = await upsertCrag(cragRepo, {
    name: 'Symonds Yat', region: wyeValley, regionId: wyeValley.id,
    latitude: 51.8405, longitude: -2.6459, rockType: RockType.LIMESTONE,
    description: 'A large limestone crag in the magnificent Wye Valley gorge. Excellent sport and trad routes on good rock with views of the river far below. A major climbing destination for the Midlands.',
    approach: '10 min walk from the Symonds Yat East car park down to the riverside and up to the crags.',
    parkingInfo: 'Pay & display car park at Symonds Yat East, off the B4432 in the Forest of Dean.',
  });
  const symondsMain   = await upsertButtress(buttRepo, { name: 'Main Cliff',  crag: symondsYat, cragId: symondsYat.id, sortOrder: 1 });
  const symondsUpper  = await upsertButtress(buttRepo, { name: 'Upper Tier',  crag: symondsYat, cragId: symondsYat.id, sortOrder: 2 });
  await routeRepo.save([
    await upsertRoute(routeRepo, tradRoute('Usual Route', 'VD', '3b', symondsMain,
      { height: 25, description: 'The popular easy classic of Symonds Yat — a fine multi-move route up the main face with great views of the Wye.', sortOrder: 1 })),
    await upsertRoute(routeRepo, tradRoute('Krapp\'s Last Tape', 'HVS', '5a', symondsMain,
      { height: 30, description: 'The Symonds Yat trad classic — sustained wall climbing on excellent Wye Valley limestone.', sortOrder: 2 })),
    await upsertRoute(routeRepo, sportRoute('Rock Atrocity', '7a+', symondsUpper,
      { height: 18, description: 'The benchmark sport route on the upper tier — powerful moves on compact limestone with a memorable crux.', sortOrder: 1 })),
    await upsertRoute(routeRepo, sportRoute('Wye Not', '6b', symondsMain,
      { height: 22, description: 'A popular sport route on the main cliff — well-bolted and accessible with excellent limestone pockets.', sortOrder: 3 })),
    await upsertRoute(routeRepo, tradRoute('Yat Direct', 'E2', '5c', symondsUpper,
      { height: 28, description: 'A bold trad route on the upper tier — technical face climbing above the gorge with a serious atmosphere.', sortOrder: 2 })),
  ]);
}
