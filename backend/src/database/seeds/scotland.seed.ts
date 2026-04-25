import { DataSource } from 'typeorm';
import { Region } from '../../modules/crags/entities/region.entity';
import { Crag, RockType } from '../../modules/crags/entities/crag.entity';
import { Buttress } from '../../modules/crags/entities/buttress.entity';
import { Route } from '../../modules/routes/entities/route.entity';
import {
  findOrCreateRegion, upsertCrag, upsertButtress, upsertRoute, tradRoute, sportRoute,
} from './seed-helpers';

export async function seedScotland(ds: DataSource) {
  const regionRepo = ds.getRepository(Region);
  const cragRepo   = ds.getRepository(Crag);
  const buttRepo   = ds.getRepository(Buttress);
  const routeRepo  = ds.getRepository(Route);

  const highlands = await findOrCreateRegion(regionRepo, {
    name: 'Scottish Highlands', country: 'UK',
    description: 'The mountain crags of the Highlands — Ben Nevis, Glencoe, Torridon and beyond. Serious mountain climbing requiring full alpinism skills.',
  });
  const skye = await findOrCreateRegion(regionRepo, {
    name: 'Isle of Skye', country: 'UK',
    description: 'The Cuillin Ridge and sea cliffs of Skye — the most spectacular mountain environment in Britain.',
  });
  const centralScotland = await findOrCreateRegion(regionRepo, {
    name: 'Central Scotland', country: 'UK',
    description: 'Lowland and central belt crags — Dumbarton Rock, the Whangie, Traprain Law.',
  });

  // ── Ben Nevis North Face ──────────────────────────────────────────────────
  const benNevis = await upsertCrag(cragRepo, {
    name: 'Ben Nevis North Face', region: highlands, regionId: highlands.id,
    latitude: 56.7969, longitude: -5.0035, rockType: RockType.GRANITE,
    description: 'The highest and most serious crag in Britain. Tower Ridge, Castle Ridge, Observatory Ridge and the buttresses above 1000 m. Routes from VD to E7 in a full alpine environment. Winter and summer classics.',
    approach: '3hr approach from Fort William via the Allt a\'Mhuilinn path. Full mountain kit essential.',
    parkingInfo: 'North Face car park at the Torlundy road end, or Fort William town car parks.',
  });
  const benNevisIndicator  = await upsertButtress(buttRepo, { name: 'Indicator Wall',      crag: benNevis, cragId: benNevis.id, sortOrder: 1 });
  const benNevisTower      = await upsertButtress(buttRepo, { name: 'Tower Ridge',          crag: benNevis, cragId: benNevis.id, sortOrder: 2 });
  const benNevisObsRidge   = await upsertButtress(buttRepo, { name: 'Observatory Ridge',    crag: benNevis, cragId: benNevis.id, sortOrder: 3 });
  const benNevisCarnDearg  = await upsertButtress(buttRepo, { name: 'Carn Dearg Buttress',  crag: benNevis, cragId: benNevis.id, sortOrder: 4 });
  await routeRepo.save([
    await upsertRoute(routeRepo, tradRoute('Tower Ridge', 'VD', '3c', benNevisTower,
      { pitches: 8, height: 600, description: 'The finest alpine ridge in Britain — a 2km ridge requiring full mountain skills. The Great Tower is the crux. An unforgettable expedition.', sortOrder: 1 })),
    await upsertRoute(routeRepo, tradRoute('Observatory Ridge', 'VD', '3b', benNevisObsRidge,
      { pitches: 7, height: 550, description: 'The easiest of the great Ben Nevis ridges — still a serious mountain day with magnificent situations.', sortOrder: 1 })),
    await upsertRoute(routeRepo, tradRoute('Rubicon Wall', 'VS', '4c', benNevisCarnDearg,
      { pitches: 4, height: 200, description: 'A route for the connoisseur — sustained technical climbing high on the Carn Dearg Buttress with a serious mountain atmosphere.', sortOrder: 1 })),
    await upsertRoute(routeRepo, tradRoute('Centurion', 'E1', '5b', benNevisCarnDearg,
      { pitches: 5, height: 250, description: 'A great mountaineering route on Carn Dearg — superb rock and situations at high altitude.', sortOrder: 2 })),
    await upsertRoute(routeRepo, tradRoute('The Bullroar', 'E3', '5c', benNevisIndicator,
      { pitches: 3, height: 150, description: 'Serious technical climbing on the remote Indicator Wall — a major expedition to the highest rock face in Britain.', sortOrder: 1 })),
  ]);

  // ── Buachaille Etive Mor ──────────────────────────────────────────────────
  const buachaille = await upsertCrag(cragRepo, {
    name: 'Buachaille Etive Mor', region: highlands, regionId: highlands.id,
    latitude: 56.6659, longitude: -4.8812, rockType: RockType.OTHER,
    description: 'The iconic pyramid of Glencoe. Curved Ridge and Crowberry Ridge give some of the finest ridge climbing in Scotland. Rannoch Wall is one of the most spectacular rock faces in Britain.',
    approach: '1hr walk from the A82 Altnafeadh car park via Coire na Tulaich or the Curved Ridge path.',
    parkingInfo: 'Altnafeadh lay-by on the A82 at the head of Rannoch Moor (free).',
  });
  const buachailleCurved    = await upsertButtress(buttRepo, { name: 'Curved Ridge',    crag: buachaille, cragId: buachaille.id, sortOrder: 1 });
  const buachailleRannoch   = await upsertButtress(buttRepo, { name: 'Rannoch Wall',    crag: buachaille, cragId: buachaille.id, sortOrder: 2 });
  const buachailleCrowberry = await upsertButtress(buttRepo, { name: 'Crowberry Ridge', crag: buachaille, cragId: buachaille.id, sortOrder: 3 });
  await routeRepo.save([
    await upsertRoute(routeRepo, tradRoute('Curved Ridge', 'D', '2c', buachailleCurved,
      { pitches: 5, height: 300, description: 'The most popular mountaineering route in Glencoe — a classic scramble/climb up the great curved ridge of Buachaille. Magnificent views over Rannoch Moor.', sortOrder: 1 })),
    await upsertRoute(routeRepo, tradRoute('Agag\'s Groove', 'VD', '3b', buachailleRannoch,
      { pitches: 4, height: 180, description: 'The classic of Rannoch Wall — a spectacular slabby groove with incredible exposure above the moor.', sortOrder: 1 })),
    await upsertRoute(routeRepo, tradRoute('January Jigsaw', 'VS', '4b', buachailleRannoch,
      { pitches: 4, height: 180, description: 'A superb route up the centre of Rannoch Wall — sustained and atmospheric.', sortOrder: 2 })),
    await upsertRoute(routeRepo, tradRoute('Crowberry Ridge Direct', 'VD', '3b', buachailleCrowberry,
      { pitches: 5, height: 250, description: 'A grand mountaineering route up the famous Crowberry Ridge — the direct line on Buachaille.', sortOrder: 1 })),
    await upsertRoute(routeRepo, tradRoute('Red Slab', 'VS', '4c', buachailleRannoch,
      { pitches: 3, height: 120, description: 'An elegant slab route on the red rhyolite of the Rannoch Wall — delicate friction and superb situations.', sortOrder: 3 })),
  ]);

  // ── Aonach Dubh ───────────────────────────────────────────────────────────
  const aonachDubh = await upsertCrag(cragRepo, {
    name: 'Aonach Dubh', region: highlands, regionId: highlands.id,
    latitude: 56.6604, longitude: -5.0022, rockType: RockType.OTHER,
    description: 'The great black cliff of Glencoe. D Gully Buttress, E Buttress and F Buttress give long, serious routes on excellent rhyolite. Shibboleth is one of the finest mountain E3s in Scotland.',
    approach: '45 min walk from the Glencoe car parks via the glen path. Approach the face directly from Loch Achtriochtan.',
    parkingInfo: 'National Trust for Scotland car park in Glencoe village, or NTS Glencoe visitor centre.',
  });
  const aonachE = await upsertButtress(buttRepo, { name: 'E Buttress', crag: aonachDubh, cragId: aonachDubh.id, sortOrder: 1 });
  const aonachF = await upsertButtress(buttRepo, { name: 'F Buttress', crag: aonachDubh, cragId: aonachDubh.id, sortOrder: 2 });
  await routeRepo.save([
    await upsertRoute(routeRepo, tradRoute('Shibboleth', 'E3', '5c', aonachE,
      { pitches: 5, height: 180, description: 'The greatest route in Glencoe — a massive sustained line on E Buttress. Serious, committing and utterly magnificent.', sortOrder: 1 })),
    await upsertRoute(routeRepo, tradRoute('Yo Yo', 'E1', '5b', aonachE,
      { pitches: 4, height: 150, description: 'A tremendous route up E Buttress — sustained technical climbing on excellent rock in a superb mountain position.', sortOrder: 2 })),
    await upsertRoute(routeRepo, tradRoute('Spectre', 'VS', '4c', aonachF,
      { pitches: 4, height: 140, description: 'A popular classic on F Buttress — good rock, sustained climbing and great situations.', sortOrder: 1 })),
    await upsertRoute(routeRepo, tradRoute('Hee Haw', 'HVS', '5a', aonachF,
      { pitches: 3, height: 120, description: 'A fine HVS line on the F Buttress — well worth doing for the mountain experience alone.', sortOrder: 2 })),
  ]);

  // ── Sron na Ciche (Skye) ─────────────────────────────────────────────────
  const sronNaCiche = await upsertCrag(cragRepo, {
    name: 'Sron na Ciche', region: skye, regionId: skye.id,
    latitude: 57.2052, longitude: -6.1835, rockType: RockType.OTHER,
    description: 'The largest crag on Skye\'s Cuillin Ridge. The Cioch is one of the most iconic features in British climbing. Gabbro rock gives extraordinary friction. Classic routes range from VD to E5 in a magnificent setting.',
    approach: '2hr approach from Glen Brittle via Coire Lagan. A serious mountain walk on rough terrain.',
    parkingInfo: 'Glen Brittle campsite and car park (charge). Follow the path into Coire Lagan.',
  });
  const cicheFace     = await upsertButtress(buttRepo, { name: 'Cioch Face',       crag: sronNaCiche, cragId: sronNaCiche.id, sortOrder: 1 });
  const ciocheUpper   = await upsertButtress(buttRepo, { name: 'Upper Buttress',   crag: sronNaCiche, cragId: sronNaCiche.id, sortOrder: 2 });
  const sronWest      = await upsertButtress(buttRepo, { name: 'Western Buttress', crag: sronNaCiche, cragId: sronNaCiche.id, sortOrder: 3 });
  await routeRepo.save([
    await upsertRoute(routeRepo, tradRoute('Cioch Direct', 'VS', '4c', cicheFace,
      { pitches: 3, height: 120, description: 'The classic route to the Cioch — spectacular gabbro climbing to one of the most famous features in British mountaineering. The friction is extraordinary.', sortOrder: 1 })),
    await upsertRoute(routeRepo, tradRoute('Integrity', 'HVS', '5a', cicheFace,
      { pitches: 4, height: 150, description: 'A great route on the Cioch face — sustained technical climbing on perfect gabbro.', sortOrder: 2 })),
    await upsertRoute(routeRepo, tradRoute('Slab Climb', 'VD', '3b', sronWest,
      { pitches: 5, height: 180, description: 'A grand outing up the western buttress — classic Cuillin slab climbing with extraordinary views over the sea.', sortOrder: 1 })),
    await upsertRoute(routeRepo, tradRoute('King Cobra', 'E3', '5c', ciocheUpper,
      { pitches: 2, height: 80, description: 'A serious test-piece on the upper buttress — technical climbing on excellent gabbro with minimal protection.', sortOrder: 1 })),
  ]);

  // ── Coire an t-Sneachda (Cairngorms) ─────────────────────────────────────
  const sneachda = await upsertCrag(cragRepo, {
    name: 'Coire an t-Sneachda', region: highlands, regionId: highlands.id,
    latitude: 57.1252, longitude: -3.6582, rockType: RockType.GRANITE,
    description: 'The most accessible Cairngorm corrie — reached by funicular. Excellent granite routes from Severe to E5 in an Arctic plateau environment. Fiacaill Buttress gives superb single-pitch climbing.',
    approach: '30 min walk from the Cairngorm Mountain funicular top station, or 1hr from the Coire Cas car park.',
    parkingInfo: 'Cairngorm Mountain ski resort car park (large, paid). Take the funicular or walk.',
  });
  const sneachdaFiacaill = await upsertButtress(buttRepo, { name: 'Fiacaill Buttress', crag: sneachda, cragId: sneachda.id, sortOrder: 1 });
  const sneachdaHorn     = await upsertButtress(buttRepo, { name: 'The Horn',          crag: sneachda, cragId: sneachda.id, sortOrder: 2 });
  await routeRepo.save([
    await upsertRoute(routeRepo, tradRoute('Fiacaill Ridge', 'D', '2c', sneachdaFiacaill,
      { pitches: 3, height: 100, description: 'The popular scrambling/climbing route on the Fiacaill ridge — an excellent introduction to Cairngorm granite.', sortOrder: 1 })),
    await upsertRoute(routeRepo, tradRoute('Aladdin\'s Mirror', 'HS', '4b', sneachdaFiacaill,
      { height: 60, description: 'A classic Cairngorm route — sustained slab climbing on excellent coarse granite in a spectacular arctic setting.', sortOrder: 2 })),
    await upsertRoute(routeRepo, tradRoute('The Haston Line', 'E2', '5b', sneachdaHorn,
      { height: 50, description: 'A quality E2 on the Horn — bold granite climbing in the plateau environment.', sortOrder: 1 })),
    await upsertRoute(routeRepo, tradRoute('Spiral Gully', 'VD', '3a', sneachdaFiacaill,
      { pitches: 2, height: 80, description: 'A popular moderate with good positions — excellent for introducing mountain climbing technique.', sortOrder: 3 })),
  ]);

  // ── Dumbarton Rock ────────────────────────────────────────────────────────
  const dumbarton = await upsertCrag(cragRepo, {
    name: 'Dumbarton Rock', region: centralScotland, regionId: centralScotland.id,
    latitude: 55.9424, longitude: -4.5722, rockType: RockType.BASALT,
    description: 'A volcanic basalt plug above the River Clyde — the birthplace of hard sport climbing in Scotland. Home to Dave MacLeod\'s Rhapsody 9a, long-standing hardest route in the UK. Superb sport climbing from 6c to 9a.',
    approach: 'The rock is in Dumbarton Castle grounds. 5 min walk from the castle car park.',
    parkingInfo: 'Dumbarton Castle car park at the base of the rock (Historic Environment Scotland).',
  });
  const dumbMain  = await upsertButtress(buttRepo, { name: 'Main Face',  crag: dumbarton, cragId: dumbarton.id, sortOrder: 1 });
  const dumbSouth = await upsertButtress(buttRepo, { name: 'South Face', crag: dumbarton, cragId: dumbarton.id, sortOrder: 2 });
  await routeRepo.save([
    await upsertRoute(routeRepo, sportRoute('Chemin de Fer', '7c', dumbMain,
      { height: 18, description: 'The most accessible hard route at Dumbarton — sustained crimping on perfect basalt. A Scottish sport climbing benchmark.', sortOrder: 1 })),
    await upsertRoute(routeRepo, sportRoute('Silk', '8b', dumbMain,
      { height: 20, description: 'One of Scotland\'s hardest sport routes — continuous technical moves on the main face.', sortOrder: 2 })),
    await upsertRoute(routeRepo, sportRoute('Requiem', '8b+', dumbSouth,
      { height: 22, description: 'A landmark route in Scottish sport climbing history — Dave MacLeod\'s famous test-piece on the south face.', sortOrder: 1 })),
    await upsertRoute(routeRepo, sportRoute('Rhapsody', '9a', dumbSouth,
      { height: 25, description: 'Dave MacLeod\'s 2006 masterpiece — for many years the hardest route in the UK. One of the most technically demanding climbs in the world.', sortOrder: 2 })),
  ]);

  // ── Creag Dubh ────────────────────────────────────────────────────────────
  const creagDubh = await upsertCrag(cragRepo, {
    name: 'Creag Dubh', region: highlands, regionId: highlands.id,
    latitude: 56.9756, longitude: -4.1752, rockType: RockType.OTHER,
    description: 'A major schist crag above Newtonmore in the Cairngorms National Park. Long, sustained trad routes from VS to E6 on excellent schist. Inbred and Strapadictomy are Scottish climbing legends.',
    approach: '30 min walk from Newtonmore via the track to Creag Dubh farm.',
    parkingInfo: 'Roadside parking at Newtonmore or the track end below the crag.',
  });
  const creagDubhMain = await upsertButtress(buttRepo, { name: 'Main Wall', crag: creagDubh, cragId: creagDubh.id, sortOrder: 1 });
  const creagDubhLeft = await upsertButtress(buttRepo, { name: 'Left Side', crag: creagDubh, cragId: creagDubh.id, sortOrder: 2 });
  await routeRepo.save([
    await upsertRoute(routeRepo, tradRoute('Inbred', 'E5', '6b', creagDubhMain,
      { height: 35, description: 'One of the finest E5s in Scotland — sustained, technical wall climbing on excellent schist with a bold atmosphere.', sortOrder: 1 })),
    await upsertRoute(routeRepo, tradRoute('Strapadictomy', 'E3', '5c', creagDubhMain,
      { height: 35, description: 'A Scottish classic — Creag Dubh at its finest. Long, sustained and atmospheric.', sortOrder: 2 })),
    await upsertRoute(routeRepo, tradRoute('Instant Lemon', 'E2', '5b', creagDubhLeft,
      { height: 30, description: 'A quality E2 on the left side — one of the best routes at the grade on Scottish schist.', sortOrder: 1 })),
    await upsertRoute(routeRepo, tradRoute('Raeburn\'s Groove', 'VS', '4c', creagDubhLeft,
      { height: 28, description: 'A pleasant groove route named after the great pioneer — good rock and sustained interest.', sortOrder: 2 })),
  ]);

  // ── Polldubh Crags ────────────────────────────────────────────────────────
  const polldubh = await upsertCrag(cragRepo, {
    name: 'Polldubh Crags', region: highlands, regionId: highlands.id,
    latitude: 56.8654, longitude: -5.0836, rockType: RockType.GRANITE,
    description: 'A collection of granite outcrops in Glen Nevis — ideal for a day when the Ben is in cloud. Superb granite routes from VD to E4 in a beautiful riverside setting. Perfect for all levels.',
    approach: '5–15 min walk from the Polldubh car park in Glen Nevis. Multiple distinct crags.',
    parkingInfo: 'Polldubh car park at the end of the Glen Nevis road, above the gorge.',
  });
  const polldubhSteall     = await upsertButtress(buttRepo, { name: 'Steall Area',        crag: polldubh, cragId: polldubh.id, sortOrder: 1 });
  const polldubhSecondary  = await upsertButtress(buttRepo, { name: 'Secondary Buttress', crag: polldubh, cragId: polldubh.id, sortOrder: 2 });
  await routeRepo.save([
    await upsertRoute(routeRepo, tradRoute('Pandora\'s Arête', 'VS', '4c', polldubhSteall,
      { height: 20, description: 'The finest VS on the Polldubh crags — a beautiful granite arête with excellent friction and gear.', sortOrder: 1 })),
    await upsertRoute(routeRepo, tradRoute('Solitude', 'HVS', '5a', polldubhSteall,
      { height: 18, description: 'A compelling line on excellent granite — surprisingly sustained for the grade.', sortOrder: 2 })),
    await upsertRoute(routeRepo, tradRoute('Secretaries\' Buttress', 'VD', '3b', polldubhSecondary,
      { height: 15, description: 'A popular gentle route — ideal for beginners learning to climb on granite.', sortOrder: 1 })),
    await upsertRoute(routeRepo, tradRoute('Purgatory', 'E1', '5b', polldubhSecondary,
      { height: 20, description: 'A fine E1 on the secondary buttress — technical wall climbing on perfect Ben Nevis granite.', sortOrder: 2 })),
  ]);

  // ── Traprain Law ──────────────────────────────────────────────────────────
  const traprain = await upsertCrag(cragRepo, {
    name: 'Traprain Law', region: centralScotland, regionId: centralScotland.id,
    latitude: 55.9679, longitude: -2.6695, rockType: RockType.BASALT,
    description: 'A volcanic plug in East Lothian — one of Scotland\'s most accessible crags, close to Edinburgh. Good basalt routes from Diff to E4 with an excellent beginners\' area. An ancient hillfort site.',
    approach: 'A short walk from the car park at the base of the law.',
    parkingInfo: 'Free car park off the B1377 near Traprain village.',
  });
  const trapMain = await upsertButtress(buttRepo, { name: 'Main Face', crag: traprain, cragId: traprain.id, sortOrder: 1 });
  const trapWest = await upsertButtress(buttRepo, { name: 'West Face', crag: traprain, cragId: traprain.id, sortOrder: 2 });
  await routeRepo.save([
    await upsertRoute(routeRepo, tradRoute('Central Crack', 'S', '4a', trapMain,
      { height: 12, description: 'The most popular route at Traprain — a fine crack climb ideal for building basic technique.', sortOrder: 1 })),
    await upsertRoute(routeRepo, tradRoute('The Flake', 'VS', '4c', trapMain,
      { height: 14, description: 'Up the distinctive flake feature — technical layback with good gear. A Traprain classic.', sortOrder: 2 })),
    await upsertRoute(routeRepo, tradRoute('Basalt Wall', 'HVS', '5a', trapWest,
      { height: 15, description: 'Bold face climbing up the west face — the best of Traprain\'s harder routes.', sortOrder: 1 })),
    await upsertRoute(routeRepo, tradRoute('Easy Way', 'D', '2a', trapMain,
      { height: 10, description: 'The gentle introduction route — well-trodden and perfect for beginners.', sortOrder: 3 })),
  ]);
}
