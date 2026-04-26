import { DataSource } from 'typeorm';
import { Region } from '../../modules/crags/entities/region.entity';
import { Crag, RockType } from '../../modules/crags/entities/crag.entity';
import { Buttress } from '../../modules/crags/entities/buttress.entity';
import { Route } from '../../modules/routes/entities/route.entity';
import { findOrCreateRegion, upsertCrag, upsertButtress, tradRoute, sportRoute } from './seed-helpers';

export async function seedScotlandExtended(ds: DataSource) {
  const regionRepo = ds.getRepository(Region);
  const cragRepo   = ds.getRepository(Crag);
  const buttRepo   = ds.getRepository(Buttress);
  const routeRepo  = ds.getRepository(Route);

  const highlands = await findOrCreateRegion(regionRepo, {
    name: 'Scottish Highlands', country: 'Scotland',
    description: 'Remote mountain crags and sea cliffs in the Scottish Highlands.',
  });
  const central = await findOrCreateRegion(regionRepo, {
    name: 'Central Scotland', country: 'Scotland',
    description: 'Sport and trad climbing around Stirling, Perth and the Central Belt.',
  });
  const argyll = await findOrCreateRegion(regionRepo, {
    name: 'Argyll', country: 'Scotland',
    description: 'Varied climbing in Argyll including Glen Coe, Arrochar and the west coast sea cliffs.',
  });
  const cairngorms = await findOrCreateRegion(regionRepo, {
    name: 'Cairngorms', country: 'Scotland',
    description: 'High-mountain granite crags in the Cairngorms National Park.',
  });

  // ── Creag Dubh, Newtonmore (expanded) ─────────────────────────────────────
  const creagDubh = await upsertCrag(cragRepo, {
    name: 'Creag Dubh', region: central, regionId: central.id,
    latitude: 57.0460, longitude: -4.1310, rockType: RockType.GRANITE,
    description: 'An excellent granite crag above Newtonmore offering technical sport and trad routes. Sexual Salami and Inbred are famous hard test pieces.',
    approach: 'Park in Newtonmore village. 30 min walk up a forest track to the crag.',
    parkingInfo: 'Small car park in Newtonmore. Walk up the track signposted for the crag.',
  });
  const cdMain  = await upsertButtress(buttRepo, { name: 'Main Wall', crag: creagDubh, cragId: creagDubh.id, sortOrder: 1 });
  const cdRight = await upsertButtress(buttRepo, { name: 'Right-Hand Buttress', crag: creagDubh, cragId: creagDubh.id, sortOrder: 2 });
  await routeRepo.save([
    tradRoute('Inbred', 'E6', '6c', cdMain, { height: 20, description: 'Dave MacLeod\'s famous test piece — one of the hardest trad routes in Scotland.', sortOrder: 1 }),
    tradRoute('Wet Dreams', 'E3', '5c', cdMain, { height: 18, description: 'A classic Creag Dubh route — technical and sustained.', sortOrder: 2 }),
    tradRoute('King Bee', 'E2', '5c', cdMain, { height: 18, description: 'Fine face climbing on the main wall.', sortOrder: 3 }),
    sportRoute('Sexual Salami', '8a', cdMain, { height: 20, description: 'The famous sport route — one of the hardest in Scotland.', sortOrder: 4 }),
    sportRoute('Freakshow', '7c+', cdMain, { height: 18, description: 'Hard sport climbing on the main wall.', sortOrder: 5 }),
    sportRoute('Flying Dutchman', '7b', cdRight, { height: 16, description: 'Excellent sport climbing on the right buttress.', sortOrder: 1 }),
    tradRoute('Clearance Route', 'VS', '4c', cdRight, { height: 14, description: 'A classic VS on the easier right-hand buttress.', sortOrder: 2 }),
    tradRoute('Land of the Wild', 'E1', '5b', cdRight, { height: 16, description: 'Bold face climbing on the right side.', sortOrder: 3 }),
  ]);

  // ── Binnein Shuas ─────────────────────────────────────────────────────────
  const binnein = await upsertCrag(cragRepo, {
    name: 'Binnein Shuas', region: highlands, regionId: highlands.id,
    latitude: 56.9130, longitude: -4.7350, rockType: RockType.GRANITE,
    description: 'A remote Highland crag above Loch Laggan with long, sustained routes on excellent granite. The approach is scenic but demanding.',
    approach: '1.5 hr walk from the road at Loch Laggan. Follow the stalker\'s path.',
    parkingInfo: 'Small parking area at the foot of the access track, off A86 near Moy Lodge.',
  });
  const binnMain = await upsertButtress(buttRepo, { name: 'Main Face', crag: binnein, cragId: binnein.id, sortOrder: 1 });
  const binnSE   = await upsertButtress(buttRepo, { name: 'South-East Face', crag: binnein, cragId: binnein.id, sortOrder: 2 });
  await routeRepo.save([
    tradRoute('Ardverikie Wall', 'VS', '4c', binnMain, { pitches: 5, height: 150, description: 'The Highland VS classic — a magnificent long route in a superb position above Loch Laggan.', sortOrder: 1 }),
    tradRoute('Kubla Khan', 'E1', '5b', binnMain, { pitches: 4, height: 120, description: 'A fine route with sustained interest throughout.', sortOrder: 2 }),
    tradRoute('Xanadu', 'E3', '5c', binnMain, { pitches: 3, height: 90, description: 'Hard and serious — one of the test pieces of the crag.', sortOrder: 3 }),
    tradRoute('Twisting Gully', 'D', '2c', binnMain, { pitches: 4, height: 110, description: 'The original easy route — a mountain adventure.', sortOrder: 4 }),
    tradRoute('Naughty by Nature', 'E2', '5c', binnSE, { pitches: 3, height: 85, description: 'Technical and sustained on the SE face.', sortOrder: 1 }),
    tradRoute('The Jewel', 'HVS', '5a', binnSE, { pitches: 4, height: 100, description: 'A superb HVS on excellent granite.', sortOrder: 2 }),
  ]);

  // ── Polldubh Crags, Glen Nevis (expanded) ─────────────────────────────────
  const polldubh = await upsertCrag(cragRepo, {
    name: 'Polldubh Crags', region: highlands, regionId: highlands.id,
    latitude: 56.7730, longitude: -5.0830, rockType: RockType.GRANITE,
    description: 'A collection of granite crags in the gorge of Glen Nevis. Excellent varied climbing from Diff to E5 on clean rough granite with a warm, sheltered aspect.',
    approach: 'Park at the Polldubh car park in Glen Nevis. Various crags within 5-15 min.',
    parkingInfo: 'Polldubh car park (free) at the end of the Glen Nevis road.',
  });
  const pollMain   = await upsertButtress(buttRepo, { name: 'Lower Buttress', crag: polldubh, cragId: polldubh.id, sortOrder: 1 });
  const pollSecret = await upsertButtress(buttRepo, { name: 'Secret Garden', crag: polldubh, cragId: polldubh.id, sortOrder: 2 });
  const pollBrunt  = await upsertButtress(buttRepo, { name: 'Bruach Mhor', crag: polldubh, cragId: polldubh.id, sortOrder: 3 });
  await routeRepo.save([
    tradRoute('Secretaries\' Direct', 'VS', '4c', pollMain, { pitches: 2, height: 40, description: 'A popular VS on the Lower Buttress — well-protected and satisfying.', sortOrder: 1 }),
    tradRoute('Conspiracy', 'E1', '5b', pollMain, { pitches: 2, height: 40, description: 'Bold climbing on the main face.', sortOrder: 2 }),
    tradRoute('Agrippa', 'HVS', '5b', pollMain, { pitches: 2, height: 35, description: 'Technical wall climbing — a good HVS.', sortOrder: 3 }),
    tradRoute('Spartan Slab', 'VD', '3c', pollMain, { pitches: 2, height: 35, description: 'The classic easy route in the lower gorge.', sortOrder: 4 }),
    tradRoute('Green Wall', 'E3', '5c', pollSecret, { pitches: 2, height: 30, description: 'Hard face climbing in the Secret Garden.', sortOrder: 1 }),
    tradRoute('Garden Path', 'VS', '4c', pollSecret, { pitches: 2, height: 30, description: 'A pleasant VS in the hidden garden area.', sortOrder: 2 }),
    tradRoute('The Clasp', 'E4', '6a', pollBrunt, { pitches: 2, height: 35, description: 'One of the hardest routes at Polldubh.', sortOrder: 1 }),
    tradRoute('Long Reach', 'E2', '5b', pollBrunt, { pitches: 2, height: 35, description: 'Sustained climbing requiring a long reach.', sortOrder: 2 }),
    tradRoute('Bruach Mhor Rib', 'D', '2c', pollBrunt, { pitches: 2, height: 30, description: 'The easiest route in this area.', sortOrder: 3 }),
  ]);

  // ── Ben Nevis (expanded) ──────────────────────────────────────────────────
  const benNevis = await upsertCrag(cragRepo, {
    name: 'Ben Nevis North Face', region: highlands, regionId: highlands.id,
    latitude: 56.7969, longitude: -5.0045, rockType: RockType.OTHER,
    description: 'The biggest mountain face in Britain — a massive complex of buttresses, ridges and gullies. Tower Ridge is one of the great mountain routes of these islands.',
    approach: '2.5 hr walk from the Ben Nevis Visitor Centre in Glen Nevis. Very serious mountain environment.',
    parkingInfo: 'Ben Nevis Visitor Centre car park, Glen Nevis (pay & display).',
  });
  const bnTower   = await upsertButtress(buttRepo, { name: 'Tower Ridge', crag: benNevis, cragId: benNevis.id, sortOrder: 1 });
  const bnCastle  = await upsertButtress(buttRepo, { name: 'Castle Ridge', crag: benNevis, cragId: benNevis.id, sortOrder: 2 });
  const bnCastle2 = await upsertButtress(buttRepo, { name: 'Carn Dearg Buttress', crag: benNevis, cragId: benNevis.id, sortOrder: 3 });
  await routeRepo.save([
    tradRoute('Tower Ridge', 'D', '3a', bnTower, { pitches: 8, height: 500, description: 'The greatest mountain route in the British Isles — a long, serious ridge leading to the summit of Britain\'s highest mountain.', sortOrder: 1 }),
    tradRoute('Tower Scoop', 'VS', '4c', bnTower, { pitches: 3, height: 80, description: 'A fine route on the Tower — one of the better summer routes on Ben Nevis.', sortOrder: 2 }),
    tradRoute('Castle Ridge', 'VD', '3c', bnCastle, { pitches: 6, height: 250, description: 'The classic easy ridge route — a good introduction to Ben Nevis summer climbing.', sortOrder: 1 }),
    tradRoute('Minus One Gully', 'E1', '5b', bnCastle, { pitches: 4, height: 150, description: 'A famous rock route on the Ben.', sortOrder: 2 }),
    tradRoute('Indicator Wall', 'E4', '6a', bnCastle2, { pitches: 3, height: 90, description: 'Hard technical climbing on the Carn Dearg Buttress.', sortOrder: 1 }),
    tradRoute('Centurion', 'E3', '5c', bnCastle2, { pitches: 4, height: 110, description: 'A superb sustained route — one of the classics of Ben Nevis.', sortOrder: 2 }),
    tradRoute('Sassenach', 'E1', '5b', bnCastle2, { pitches: 4, height: 110, description: 'A brilliant route on the Carn Dearg Buttress.', sortOrder: 3 }),
    tradRoute('The Bullroar', 'E3', '5c', bnCastle2, { pitches: 3, height: 90, description: 'Sustained and technical on perfect rhyolite.', sortOrder: 4 }),
  ]);

  // ── Sron na Ciche, Skye (expanded) ────────────────────────────────────────
  const sronCiche = await upsertCrag(cragRepo, {
    name: 'Sron na Ciche', region: highlands, regionId: highlands.id,
    latitude: 57.2055, longitude: -6.2490, rockType: RockType.OTHER,
    description: 'The great gabbro cliff of the Cuillin of Skye. Cioch Direct is one of the most photographed rock climbs in Scotland.',
    approach: '2.5 hr walk from Glen Brittle. A long and serious approach on rough terrain.',
    parkingInfo: 'Glen Brittle campsite or Memorial Hut car park, Isle of Skye.',
  });
  const sronMain = await upsertButtress(buttRepo, { name: 'Cioch Area', crag: sronCiche, cragId: sronCiche.id, sortOrder: 1 });
  const sronEast = await upsertButtress(buttRepo, { name: 'East Buttress', crag: sronCiche, cragId: sronCiche.id, sortOrder: 2 });
  await routeRepo.save([
    tradRoute('Cioch Direct', 'VS', '4c', sronMain, { pitches: 3, height: 85, description: 'One of the most iconic climbs in Scotland — takes the prominent Cioch feature on perfect gabbro.', sortOrder: 1 }),
    tradRoute('Cioch Nose', 'HVS', '5a', sronMain, { pitches: 3, height: 90, description: 'A harder variation on the Cioch — superb climbing.', sortOrder: 2 }),
    tradRoute('Eastern Climb', 'D', '3a', sronMain, { pitches: 5, height: 150, description: 'The original route to the Cioch — a grand mountain outing.', sortOrder: 3 }),
    tradRoute('Trophy Crack', 'E2', '5c', sronEast, { pitches: 2, height: 55, description: 'A fine crack route on the East Buttress of the Ciche.', sortOrder: 1 }),
    tradRoute('Wallwork\'s Route', 'VS', '4c', sronEast, { pitches: 3, height: 80, description: 'The original VS on the East Buttress.', sortOrder: 2 }),
  ]);

  // ── Aonach Dubh, Glen Coe (expanded) ──────────────────────────────────────
  const aonach = await upsertCrag(cragRepo, {
    name: 'Aonach Dubh', region: argyll, regionId: argyll.id,
    latitude: 56.6795, longitude: -5.0045, rockType: RockType.OTHER,
    description: 'One of the Three Sisters of Glen Coe. The faces of Aonach Dubh give classic routes from Diff to E5 on rough schist in a spectacular mountain setting.',
    approach: '30-60 min walk from the Clachaig Inn or the A82 lay-by, depending on the route.',
    parkingInfo: 'Lay-bys on A82 in Glen Coe. Alternatively Clachaig Inn car park.',
  });
  const aonachW = await upsertButtress(buttRepo, { name: 'West Face', crag: aonach, cragId: aonach.id, sortOrder: 1 });
  const aonachE = await upsertButtress(buttRepo, { name: 'East Face', crag: aonach, cragId: aonach.id, sortOrder: 2 });
  await routeRepo.save([
    tradRoute('Archer Ridge', 'D', '2c', aonachW, { pitches: 4, height: 100, description: 'The classic easy route on the West Face — a good introduction to Glen Coe climbing.', sortOrder: 1 }),
    tradRoute('Fingal\'s Cave', 'VS', '4c', aonachW, { pitches: 3, height: 75, description: 'A popular VS on the West Face — well-protected and enjoyable.', sortOrder: 2 }),
    tradRoute('Spacewalk', 'E3', '5c', aonachW, { pitches: 3, height: 80, description: 'A hard route in a spectacular position.', sortOrder: 3 }),
    tradRoute('Quiver Rib', 'HS', '4b', aonachE, { pitches: 3, height: 70, description: 'A classic HS on the East Face.', sortOrder: 1 }),
    tradRoute('Trapeze', 'E2', '5b', aonachE, { pitches: 3, height: 70, description: 'Bold wall climbing on the East Face.', sortOrder: 2 }),
    tradRoute('1931 Face Route', 'VD', '3b', aonachE, { pitches: 4, height: 100, description: 'Historic route from 1931 — the original ascent of the East Face.', sortOrder: 3 }),
  ]);

  // ── Buachaille Etive Mor (expanded) ───────────────────────────────────────
  const buach = await upsertCrag(cragRepo, {
    name: 'Buachaille Etive Mor', region: argyll, regionId: argyll.id,
    latitude: 56.6524, longitude: -4.9580, rockType: RockType.OTHER,
    description: 'The Shepherd of Glen Etive — one of Scotland\'s most iconic mountains. The Crowberry Tower and Rannoch Wall give superb routes on excellent rhyolite.',
    approach: 'Park at the Altnafeadh lay-by on A82. Approaches of 30-60 min to the various crags.',
    parkingInfo: 'Altnafeadh lay-by on A82 (free). Large flat area.',
  });
  const buachRW  = await upsertButtress(buttRepo, { name: 'Rannoch Wall', crag: buach, cragId: buach.id, sortOrder: 1 });
  const buachCT  = await upsertButtress(buttRepo, { name: 'Crowberry Tower', crag: buach, cragId: buach.id, sortOrder: 2 });
  await routeRepo.save([
    tradRoute('January Jigsaw', 'VD', '3c', buachRW, { pitches: 5, height: 120, description: 'The classic VS on Rannoch Wall — a fine sustained route.', sortOrder: 1 }),
    tradRoute('Curved Ridge', 'D', '3a', buachCT, { pitches: 5, height: 150, description: 'One of Scotland\'s great ridge scrambles — the standard route up Buachaille.', sortOrder: 1 }),
    tradRoute('Agag\'s Groove', 'VD', '3c', buachCT, { pitches: 4, height: 120, description: 'A classic moderate route on the Crowberry Tower.', sortOrder: 2 }),
    tradRoute('Crowberry Ridge', 'VD', '3c', buachCT, { pitches: 5, height: 140, description: 'The great ridge route — long, varied and exposed.', sortOrder: 3 }),
    tradRoute('D Gully Buttress', 'S', '3c', buachCT, { pitches: 4, height: 110, description: 'A classic buttress route on the Buachaille.', sortOrder: 4 }),
    tradRoute('North Buttress', 'VS', '4c', buachRW, { pitches: 4, height: 110, description: 'A fine VS on the north buttress of Rannoch Wall.', sortOrder: 2 }),
    tradRoute('Shackle Route', 'HVS', '5a', buachRW, { pitches: 3, height: 80, description: 'A harder option on the Rannoch Wall.', sortOrder: 3 }),
  ]);

  // ── Cairn Gorm Crags (Coire an t-Sneachda expanded) ───────────────────────
  const snea = await upsertCrag(cragRepo, {
    name: 'Coire an t-Sneachda', region: cairngorms, regionId: cairngorms.id,
    latitude: 57.1188, longitude: -3.6738, rockType: RockType.GRANITE,
    description: 'The main summer climbing crag in the Cairngorms — a granite bowl below the Cairn Gorm plateau. Fluted Buttress and Aladdin\'s Couloir are classic outings.',
    approach: '1.5 hr walk from Cairngorm Mountain car park via the Fiacaill Ridge or Coire Cas.',
    parkingInfo: 'Cairngorm Mountain car park (pay & display). Off B970 near Aviemore.',
  });
  const sneaFB = await upsertButtress(buttRepo, { name: 'Fluted Buttress', crag: snea, cragId: snea.id, sortOrder: 1 });
  const sneaAlad = await upsertButtress(buttRepo, { name: 'Aladdin\'s Buttress', crag: snea, cragId: snea.id, sortOrder: 2 });
  await routeRepo.save([
    tradRoute('Fluted Buttress', 'D', '3a', sneaFB, { pitches: 5, height: 130, description: 'The finest easy rock route in the Cairngorms.', sortOrder: 1 }),
    tradRoute('Original Route', 'VD', '3c', sneaFB, { pitches: 4, height: 110, description: 'The original route on Fluted Buttress — a classic mountain outing.', sortOrder: 2 }),
    tradRoute('Fiacaill Buttress', 'VS', '4c', sneaAlad, { pitches: 3, height: 80, description: 'A good VS on the granite walls of the corrie.', sortOrder: 1 }),
    tradRoute('Savage Slit', 'HVS', '5b', sneaAlad, { pitches: 2, height: 55, description: 'A strenuous crack in the back of the corrie.', sortOrder: 2 }),
    tradRoute('Aladdin\'s Mirror', 'D', '3a', sneaAlad, { pitches: 4, height: 110, description: 'Classic easy route with excellent views.', sortOrder: 3 }),
  ]);

  // ── Dumbarton Rock (expanded) ─────────────────────────────────────────────
  const dumbarton = await upsertCrag(cragRepo, {
    name: 'Dumbarton Rock', region: central, regionId: central.id,
    latitude: 55.9420, longitude: -4.5690, rockType: RockType.OTHER,
    description: 'An urban volcanic rock above Dumbarton with world-class sport routes. Requiem is one of the hardest sport routes in Scotland.',
    approach: 'From Dumbarton town centre. 10 min walk to the base of the rock.',
    parkingInfo: 'Dumbarton town centre car parks. Or residential streets near the rock.',
  });
  const dumbMain = await upsertButtress(buttRepo, { name: 'Main Face', crag: dumbarton, cragId: dumbarton.id, sortOrder: 1 });
  await routeRepo.save([
    sportRoute('Requiem', '9a', dumbMain, { height: 15, description: 'Dave MacLeod\'s landmark ascent — one of the hardest sport routes in the world at the time.', sortOrder: 1 }),
    sportRoute('The Radge', '8c+', dumbMain, { height: 15, description: 'A stunning line on the main face.', sortOrder: 2 }),
    sportRoute('Chemin de Fer', '8b', dumbMain, { height: 14, description: 'A classic hard sport route — sustained throughout.', sortOrder: 3 }),
    sportRoute('Fear of the Dark', '7c', dumbMain, { height: 14, description: 'An excellent hard sport route.', sortOrder: 4 }),
    sportRoute('Power of the Dark', '7b+', dumbMain, { height: 13, description: 'A good sport route — accessible for hard-sport climbers.', sortOrder: 5 }),
    tradRoute('Emerald Buttress', 'HS', '4b', dumbMain, { height: 12, description: 'The classic trad route on the rock.', sortOrder: 6 }),
  ]);
}
