import { DataSource } from 'typeorm';
import { Region } from '../../modules/crags/entities/region.entity';
import { Crag, RockType } from '../../modules/crags/entities/crag.entity';
import { Buttress } from '../../modules/crags/entities/buttress.entity';
import { Route } from '../../modules/routes/entities/route.entity';
import { findOrCreateRegion, upsertCrag, upsertButtress, tradRoute } from './seed-helpers';

export async function seedLakeDistrictExtended(ds: DataSource) {
  const regionRepo = ds.getRepository(Region);
  const cragRepo   = ds.getRepository(Crag);
  const buttRepo   = ds.getRepository(Buttress);
  const routeRepo  = ds.getRepository(Route);

  const lake = await findOrCreateRegion(regionRepo, {
    name: 'Lake District', country: 'England',
    description: 'Lakeland fells and crags. Classic trad climbing on rhyolite, granite and slate.',
  });

  // ── Wildcat Crag, Borrowdale ──────────────────────────────────────────────
  const wildcat = await upsertCrag(cragRepo, {
    name: 'Wildcat Crag', region: lake, regionId: lake.id,
    latitude: 54.5345, longitude: -3.1521, rockType: RockType.OTHER,
    description: 'A fine rhyolite crag in the upper reaches of Borrowdale with some excellent middle-grade routes. Wildcat Buttress is the centrepiece — a superb VS on immaculate rock.',
    approach: '30 min walk from Seathwaite Farm. Follow the path toward Sty Head.',
    parkingInfo: 'Seathwaite Farm car park (donation). Very limited spaces.',
  });
  const wcMain   = await upsertButtress(buttRepo, { name: 'Wildcat Buttress', crag: wildcat, cragId: wildcat.id, sortOrder: 1 });
  const wcRight  = await upsertButtress(buttRepo, { name: 'Right Wing', crag: wildcat, cragId: wildcat.id, sortOrder: 2 });
  await routeRepo.save([
    tradRoute('Wildcat', 'VS', '4c', wcMain, { pitches: 2, height: 45, description: 'The eponymous classic — a sustained VS on immaculate rhyolite with excellent protection.', sortOrder: 1 }),
    tradRoute('Wildcat Direct', 'HVS', '5a', wcMain, { pitches: 2, height: 45, description: 'More direct line up the buttress — technically demanding.', sortOrder: 2 }),
    tradRoute('Tiger Traverse', 'HVS', '5a', wcMain, { pitches: 1, height: 25, description: 'An exposed traverse across the upper buttress.', sortOrder: 3 }),
    tradRoute('Panther Wall', 'E1', '5b', wcMain, { pitches: 2, height: 40, description: 'Bold face climbing with a committing crux.', sortOrder: 4 }),
    tradRoute('Puma Crack', 'VS', '4c', wcRight, { pitches: 1, height: 20, description: 'Excellent crack on the right wing of the crag.', sortOrder: 1 }),
    tradRoute('Leopard\'s Way', 'HS', '4b', wcRight, { pitches: 2, height: 35, description: 'A fine route up the right section of the crag.', sortOrder: 2 }),
    tradRoute('Snow Leopard', 'E3', '5c', wcRight, { pitches: 1, height: 25, description: 'The hardest route on Wildcat — a fierce technical sequence.', sortOrder: 3 }),
  ]);

  // ── White Ghyll (expanded) ────────────────────────────────────────────────
  const whiteGhyll = await upsertCrag(cragRepo, {
    name: 'White Ghyll', region: lake, regionId: lake.id,
    latitude: 54.4412, longitude: -3.0865, rockType: RockType.OTHER,
    description: 'A fine steep crag in upper Langdale, giving sustained routes on excellent rhyolite. White Ghyll Wall and Hollin Groove are among the best routes in Langdale.',
    approach: '40 min walk from the Old Dungeon Ghyll. Follow the stream up through White Ghyll.',
    parkingInfo: 'National Trust car park at Old Dungeon Ghyll, Langdale (pay & display).',
  });
  const wgWall   = await upsertButtress(buttRepo, { name: 'White Ghyll Wall', crag: whiteGhyll, cragId: whiteGhyll.id, sortOrder: 1 });
  const wgHollin = await upsertButtress(buttRepo, { name: 'Hollin Groove Area', crag: whiteGhyll, cragId: whiteGhyll.id, sortOrder: 2 });
  await routeRepo.save([
    tradRoute('White Ghyll Wall', 'E2', '5c', wgWall, { pitches: 2, height: 55, description: 'One of the finest E2s in the Lake District — steep wall climbing on superb rock.', sortOrder: 1 }),
    tradRoute('Slip Knot', 'E1', '5b', wgWall, { pitches: 2, height: 50, description: 'A classic E1 on the wall — sustained and well-protected.', sortOrder: 2 }),
    tradRoute('Laugh Not', 'HVS', '5a', wgWall, { pitches: 3, height: 65, description: 'Superb sustained climbing up the left side of the wall.', sortOrder: 3 }),
    tradRoute('Perhaps Not', 'VS', '4c', wgWall, { pitches: 2, height: 50, description: 'A fine VS — one of the easiest routes on this wall.', sortOrder: 4 }),
    tradRoute('Hollin Groove', 'HVS', '5a', wgHollin, { pitches: 3, height: 70, description: 'The classic route on this section — takes the obvious groove line up the crag.', sortOrder: 1 }),
    tradRoute('Holly Tree Traverse', 'VS', '4c', wgHollin, { pitches: 2, height: 45, description: 'The traverse pitch is one of the best in Langdale.', sortOrder: 2 }),
    tradRoute('Gordian Knot', 'E3', '5c', wgHollin, { pitches: 2, height: 50, description: 'A technical and bold route — one of White Ghyll\'s hardest.', sortOrder: 3 }),
  ]);

  // ── Raven Crag, Walthwaite ─────────────────────────────────────────────────
  const ravenWalt = await upsertCrag(cragRepo, {
    name: 'Raven Crag Walthwaite', region: lake, regionId: lake.id,
    latitude: 54.4280, longitude: -3.0710, rockType: RockType.OTHER,
    description: 'A compact crag above Great Langdale with some excellent routes. Pluto and Centaur are all-time classic Lakeland outings.',
    approach: '25 min walk from Walthwaite camping area. Follow the path up through the woods.',
    parkingInfo: 'National Trust car park at New Dungeon Ghyll, Langdale.',
  });
  const rwMain = await upsertButtress(buttRepo, { name: 'Main Crag', crag: ravenWalt, cragId: ravenWalt.id, sortOrder: 1 });
  await routeRepo.save([
    tradRoute('Centaur', 'VS', '4c', rwMain, { pitches: 2, height: 55, description: 'The classic VS on Raven Crag — sustained climbing on superb rock.', sortOrder: 1 }),
    tradRoute('Pluto', 'HVS', '5a', rwMain, { pitches: 3, height: 65, description: 'One of the great Langdale routes — a brilliant sustained HVS.', sortOrder: 2 }),
    tradRoute('Raven Crag Buttress', 'VD', '3b', rwMain, { pitches: 3, height: 60, description: 'The original classic on this crag — an enjoyable adventure.', sortOrder: 3 }),
    tradRoute('Trilogy', 'E1', '5b', rwMain, { pitches: 2, height: 50, description: 'Bold wall climbing on the right side of the crag.', sortOrder: 4 }),
    tradRoute('The Medlar', 'E2', '5c', rwMain, { pitches: 2, height: 55, description: 'Technical and sustained — one of the hardest routes on the crag.', sortOrder: 5 }),
  ]);

  // ── Napes, Great Gable ────────────────────────────────────────────────────
  const napes = await upsertCrag(cragRepo, {
    name: 'Napes Ridges, Great Gable', region: lake, regionId: lake.id,
    latitude: 54.4820, longitude: -3.2195, rockType: RockType.OTHER,
    description: 'Historic mountain crags on the flanks of Great Gable. The Napes Needle is one of the most famous rock features in Britain — the birthplace of British rock climbing.',
    approach: '1.5 hr walk from Wasdale Head via Sty Head. Great care needed on the steep descent to the Needle.',
    parkingInfo: 'Wasdale Head car park (National Trust, pay & display).',
  });
  const napesNeedle = await upsertButtress(buttRepo, { name: 'Napes Needle', crag: napes, cragId: napes.id, sortOrder: 1 });
  const napesGauntlet = await upsertButtress(buttRepo, { name: 'Arrowhead Ridge', crag: napes, cragId: napes.id, sortOrder: 2 });
  const kernKnotts = await upsertButtress(buttRepo, { name: 'Kern Knotts', crag: napes, cragId: napes.id, sortOrder: 3 });
  await routeRepo.save([
    tradRoute('Wasdale Crack', 'VD', '3c', napesNeedle, { pitches: 1, height: 18, description: 'The original ascent route of Napes Needle by W.P. Haskett-Smith in 1886 — the start of British rock climbing.', sortOrder: 1 }),
    tradRoute('Oblique Chimney', 'D', '2c', napesNeedle, { pitches: 1, height: 18, description: 'The easier alternative to Wasdale Crack.', sortOrder: 2 }),
    tradRoute('Arête and Crack', 'VS', '4c', napesNeedle, { pitches: 1, height: 18, description: 'The classic harder finish — takes the exposed arête.', sortOrder: 3 }),
    tradRoute('Eagle\'s Nest Direct', 'VS', '4c', napesNeedle, { pitches: 2, height: 35, description: 'A fine route on the walls below the Needle.', sortOrder: 4 }),
    tradRoute('Arrowhead Ridge', 'VD', '3c', napesGauntlet, { pitches: 3, height: 60, description: 'The classic easy mountain ridge climb on Great Gable.', sortOrder: 1 }),
    tradRoute('Needle Ridge', 'VS', '4c', napesGauntlet, { pitches: 3, height: 65, description: 'The best ridge route on the Napes — sustained and exposed.', sortOrder: 2 }),
    tradRoute('Kern Knotts Crack', 'HS', '4b', kernKnotts, { pitches: 1, height: 18, description: 'One of the classic Lakeland cracks — well-protected jamming on perfect rock.', sortOrder: 1 }),
    tradRoute('Kern Knotts Chimney', 'D', '2c', kernKnotts, { pitches: 1, height: 14, description: 'The easy classic on this sector — a pleasant groove.', sortOrder: 2 }),
    tradRoute('Sepulchre', 'E2', '5c', kernKnotts, { pitches: 2, height: 35, description: 'A serious route on the overhanging wall of Kern Knotts.', sortOrder: 3 }),
  ]);

  // ── Pavey Ark (expanded) ──────────────────────────────────────────────────
  const pavey = await upsertCrag(cragRepo, {
    name: 'Pavey Ark', region: lake, regionId: lake.id,
    latitude: 54.4565, longitude: -3.0895, rockType: RockType.OTHER,
    description: 'The largest continuous rock face above Stickle Tarn in Langdale. Jack\'s Rake is a famous easy scramble; the climbing routes are all longer multi-pitch adventures.',
    approach: '45 min walk via Stickle Ghyll from the New Dungeon Ghyll. Follow the tourist path.',
    parkingInfo: 'National Trust car park at New Dungeon Ghyll (pay & display).',
  });
  const paveyMain  = await upsertButtress(buttRepo, { name: 'Main Face', crag: pavey, cragId: pavey.id, sortOrder: 1 });
  const paveyE     = await upsertButtress(buttRepo, { name: 'East Wall', crag: pavey, cragId: pavey.id, sortOrder: 2 });
  await routeRepo.save([
    tradRoute('Jack\'s Rake', 'S', '3a', paveyMain, { pitches: 3, height: 120, description: 'The classic diagonal scramble across the face — one of Lakeland\'s great mountain ways.', sortOrder: 1 }),
    tradRoute('Arcturus', 'E2', '5c', paveyMain, { pitches: 3, height: 85, description: 'One of the finest routes on Pavey Ark — sustained on superb rock.', sortOrder: 2 }),
    tradRoute('Crescent Slabs', 'VD', '3b', paveyMain, { pitches: 4, height: 100, description: 'A long, pleasant slab route — the easiest proper rock climb on Pavey Ark.', sortOrder: 3 }),
    tradRoute('Gwynne\'s Chimney', 'VD', '3c', paveyMain, { pitches: 3, height: 80, description: 'The classic chimney on Pavey Ark — atmospheric and memorable.', sortOrder: 4 }),
    tradRoute('Rake End Wall', 'E1', '5b', paveyMain, { pitches: 2, height: 50, description: 'Steep wall climbing above Jack\'s Rake.', sortOrder: 5 }),
    tradRoute('Cascade', 'HVS', '5a', paveyE, { pitches: 3, height: 75, description: 'A superb route on the East Wall — sustained and well-positioned.', sortOrder: 1 }),
    tradRoute('Golden Slipper', 'E1', '5b', paveyE, { pitches: 2, height: 55, description: 'The classic E1 on the East Wall — technical and memorable.', sortOrder: 2 }),
    tradRoute('Aardvark', 'E3', '5c', paveyE, { pitches: 2, height: 55, description: 'Hard face climbing on superb rock.', sortOrder: 3 }),
  ]);

  // ── Scafell Crag (expanded) ───────────────────────────────────────────────
  const scafell = await upsertCrag(cragRepo, {
    name: 'Scafell Crag', region: lake, regionId: lake.id,
    latitude: 54.4540, longitude: -3.2415, rockType: RockType.OTHER,
    description: 'England\'s greatest mountain crag — a massive volcanic rhyolite face below Scafell\'s summit. Routes from VD to E5 in the finest mountain setting in England.',
    approach: '2 hr walk from Wasdale Head via Brown Tongue. A long, serious approach.',
    parkingInfo: 'Wasdale Head car park (National Trust, pay & display).',
  });
  const scafellCB  = await upsertButtress(buttRepo, { name: 'Central Buttress', crag: scafell, cragId: scafell.id, sortOrder: 1 });
  const scafellNB  = await upsertButtress(buttRepo, { name: 'North Buttress', crag: scafell, cragId: scafell.id, sortOrder: 2 });
  const scafellPF  = await upsertButtress(buttRepo, { name: 'Pisgah Face', crag: scafell, cragId: scafell.id, sortOrder: 3 });
  await routeRepo.save([
    tradRoute('Central Buttress', 'E2', '5b', scafellCB, { pitches: 5, height: 130, description: 'One of the great routes of British mountaineering — a long, serious and spectacular ascent.', sortOrder: 1 }),
    tradRoute('Botterill\'s Slab', 'E1', '5a', scafellCB, { pitches: 4, height: 100, description: 'A historic route — the hardest climb in England when first made in 1903. Now a serious E1.', sortOrder: 2 }),
    tradRoute('Moss Ghyll Grooves', 'VS', '4c', scafellCB, { pitches: 4, height: 120, description: 'One of the finest VS routes in England — a grand mountain outing.', sortOrder: 3 }),
    tradRoute('Keswick Brothers', 'VD', '3c', scafellNB, { pitches: 4, height: 100, description: 'The classic easy route on Scafell Crag — a mountain adventure.', sortOrder: 1 }),
    tradRoute('Pisgah Buttress', 'D', '3a', scafellNB, { pitches: 3, height: 80, description: 'The easiest route on the crag — takes the broad buttress.', sortOrder: 2 }),
    tradRoute('Overhanging Wall', 'E3', '5c', scafellCB, { pitches: 3, height: 80, description: 'Serious and bold climbing on the overhanging section of Central Buttress.', sortOrder: 4 }),
    tradRoute('White Wizard', 'E4', '6a', scafellCB, { pitches: 2, height: 60, description: 'The hardest route on the main face — technical and committing.', sortOrder: 5 }),
    tradRoute('Pisgah Face Route', 'VS', '4c', scafellPF, { pitches: 3, height: 75, description: 'Classic mountain VS on the Pisgah Face.', sortOrder: 1 }),
  ]);

  // ── Pillar Rock (expanded) ────────────────────────────────────────────────
  const pillar = await upsertCrag(cragRepo, {
    name: 'Pillar Rock', region: lake, regionId: lake.id,
    latitude: 54.4909, longitude: -3.2680, rockType: RockType.OTHER,
    description: 'The most remote of Lakeland\'s mountain crags — an isolated rock tower on the flanks of Pillar. The Jordan Gap routes are legendary.',
    approach: '2.5 hr walk from Wasdale Head via Black Sail Pass or Ennerdale via the High Level Traverse.',
    parkingInfo: 'Wasdale Head car park (National Trust, pay & display).',
  });
  const pillarN  = await upsertButtress(buttRepo, { name: 'North Face', crag: pillar, cragId: pillar.id, sortOrder: 1 });
  const pillarW  = await upsertButtress(buttRepo, { name: 'West Face', crag: pillar, cragId: pillar.id, sortOrder: 2 });
  await routeRepo.save([
    tradRoute('Old West Route', 'D', '3a', pillarW, { pitches: 4, height: 120, description: 'The classic easy way up Pillar Rock — a mountain adventure.', sortOrder: 1 }),
    tradRoute('Ennerdale Face Route', 'VD', '3c', pillarW, { pitches: 4, height: 120, description: 'The standard route up the west face.', sortOrder: 2 }),
    tradRoute('New West', 'HS', '4b', pillarW, { pitches: 4, height: 115, description: 'The classic harder alternative — spectacular positions above Ennerdale.', sortOrder: 3 }),
    tradRoute('North Climb', 'VD', '3b', pillarN, { pitches: 3, height: 90, description: 'The original route on the North Face.', sortOrder: 1 }),
    tradRoute('Grooved Arête', 'HVS', '5a', pillarN, { pitches: 3, height: 80, description: 'A superb modern route on the North Face — sustained and exposed.', sortOrder: 2 }),
    tradRoute('Slab and Notch', 'D', '2c', pillarN, { pitches: 2, height: 60, description: 'The easy classic taking the slab and notch features.', sortOrder: 3 }),
    tradRoute('Walker\'s Gully', 'D', '3a', pillarN, { pitches: 2, height: 55, description: 'The classic gully on Pillar Rock — a historic adventure.', sortOrder: 4 }),
  ]);

  // ── Gimmer Crag (expanded) ────────────────────────────────────────────────
  const gimmer = await upsertCrag(cragRepo, {
    name: 'Gimmer Crag', region: lake, regionId: lake.id,
    latitude: 54.4478, longitude: -3.0695, rockType: RockType.OTHER,
    description: 'The finest mountain crag in Langdale. Steep, clean rhyolite giving sustained routes from VS to E5. Gimmer Crack is widely regarded as the best VS in the Lake District.',
    approach: '45 min walk from the Stickle Barn, Langdale. Take the path towards Loft Crag.',
    parkingInfo: 'National Trust car park at the Old Dungeon Ghyll, Langdale (pay & display).',
  });
  const gimmerNW  = await upsertButtress(buttRepo, { name: 'NW Face', crag: gimmer, cragId: gimmer.id, sortOrder: 1 });
  const gimmerSE  = await upsertButtress(buttRepo, { name: 'SE Face', crag: gimmer, cragId: gimmer.id, sortOrder: 2 });
  const gimmerB   = await upsertButtress(buttRepo, { name: 'B Route Wall', crag: gimmer, cragId: gimmer.id, sortOrder: 3 });
  await routeRepo.save([
    tradRoute('B Route', 'VD', '3c', gimmerB, { pitches: 3, height: 75, description: 'The classic easy route on Gimmer — B for Beginners, but excellent.', sortOrder: 1 }),
    tradRoute('C Route', 'S', '4a', gimmerB, { pitches: 3, height: 75, description: 'One step up from B Route — equally satisfying.', sortOrder: 2 }),
    tradRoute('D Route', 'VS', '4b', gimmerB, { pitches: 3, height: 80, description: 'The first VS on Gimmer to do — a fine route.', sortOrder: 3 }),
    tradRoute('E Route', 'HVS', '5a', gimmerB, { pitches: 3, height: 80, description: 'Sustained and technical — excellent HVS climbing.', sortOrder: 4 }),
    tradRoute('F Route', 'HVS', '5b', gimmerB, { pitches: 2, height: 60, description: 'The hardest of the lettered routes — fine climbing.', sortOrder: 5 }),
    tradRoute('Ash Tree Slabs', 'VD', '3b', gimmerNW, { pitches: 2, height: 50, description: 'The classic low-grade route on the NW Face.', sortOrder: 1 }),
    tradRoute('Joas', 'E2', '5c', gimmerNW, { pitches: 2, height: 55, description: 'Hard wall climbing on the NW Face — a test piece.', sortOrder: 2 }),
    tradRoute('Diphthong', 'E4', '6a', gimmerSE, { pitches: 2, height: 50, description: 'A route of great difficulty on the SE Face.', sortOrder: 1 }),
  ]);

  // ── Eagle Crag, Borrowdale (expanded) ─────────────────────────────────────
  const eagle = await upsertCrag(cragRepo, {
    name: 'Eagle Crag, Borrowdale', region: lake, regionId: lake.id,
    latitude: 54.5255, longitude: -3.1195, rockType: RockType.OTHER,
    description: 'A fine mountain crag above Stonethwaite in Borrowdale. Eagle Front, the main route, is one of the great VS routes in the Lake District.',
    approach: '45 min walk from Stonethwaite car park via the Greenup Edge path.',
    parkingInfo: 'Stonethwaite car park (National Trust, donation). Alternatively Rosthwaite.',
  });
  const eagleMain = await upsertButtress(buttRepo, { name: 'Main Face', crag: eagle, cragId: eagle.id, sortOrder: 1 });
  await routeRepo.save([
    tradRoute('Eagle Front', 'VS', '4c', eagleMain, { pitches: 4, height: 110, description: 'One of the finest VSs in the Lake District — long, varied and in a spectacular mountain position.', sortOrder: 1 }),
    tradRoute('Falconer\'s Crack', 'E1', '5b', eagleMain, { pitches: 3, height: 80, description: 'The classic E1 on Eagle Crag — sustained and exposed.', sortOrder: 2 }),
    tradRoute('Kestrel Wall', 'HVS', '5a', eagleMain, { pitches: 3, height: 75, description: 'Technical wall climbing above the gully.', sortOrder: 3 }),
    tradRoute('Wailing Wall', 'E3', '5c', eagleMain, { pitches: 2, height: 55, description: 'One of the harder routes on this crag — bold and serious.', sortOrder: 4 }),
  ]);

  // ── Goat Crag, Borrowdale (expanded) ──────────────────────────────────────
  const goat = await upsertCrag(cragRepo, {
    name: 'Goat Crag, Borrowdale', region: lake, regionId: lake.id,
    latitude: 54.5140, longitude: -3.1045, rockType: RockType.OTHER,
    description: 'One of the most popular sport climbing venues in the Lake District, with excellent routes on clean rhyolite. A good crag for mixed sport/trad days.',
    approach: '20 min walk from Grange car park in Borrowdale.',
    parkingInfo: 'Grange car park (National Trust, pay & display).',
  });
  const goatMain = await upsertButtress(buttRepo, { name: 'Main Crag', crag: goat, cragId: goat.id, sortOrder: 1 });
  await routeRepo.save([
    tradRoute('Bitter Oasis', 'E2', '5c', goatMain, { pitches: 2, height: 45, description: 'One of the best E2s at this grade in Borrowdale — sustained and technical.', sortOrder: 1 }),
    tradRoute('Praying Mantis', 'E1', '5b', goatMain, { pitches: 2, height: 45, description: 'Fine steep climbing on the main face.', sortOrder: 2 }),
    tradRoute('Gormenghast', 'E4', '6a', goatMain, { pitches: 2, height: 40, description: 'One of the hardest trad routes on the crag — fierce and technical.', sortOrder: 3 }),
    tradRoute('Haste Not Direct', 'VS', '4c', goatMain, { pitches: 2, height: 40, description: 'A good VS on the main face — popular and well-protected.', sortOrder: 4 }),
    tradRoute('Little Chamonix', 'S', '4a', goatMain, { pitches: 2, height: 35, description: 'The classic easy route — a very popular introduction.', sortOrder: 5 }),
    tradRoute('Shepherd\'s Crag Ordinary Route', 'VD', '3b', goatMain, { pitches: 2, height: 30, description: 'Classic easy climbing — ideal for beginners.', sortOrder: 6 }),
  ]);
}
