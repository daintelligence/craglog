import { DataSource } from 'typeorm';
import { Region } from '../../modules/crags/entities/region.entity';
import { Crag, RockType } from '../../modules/crags/entities/crag.entity';
import { Buttress } from '../../modules/crags/entities/buttress.entity';
import { Route } from '../../modules/routes/entities/route.entity';
import {
  findOrCreateRegion, upsertCrag, upsertButtress, upsertRoute, tradRoute, sportRoute,
} from './seed-helpers';

export async function seedLakeDistrict(ds: DataSource) {
  const regionRepo = ds.getRepository(Region);
  const cragRepo   = ds.getRepository(Crag);
  const buttRepo   = ds.getRepository(Buttress);
  const routeRepo  = ds.getRepository(Route);

  const lake = await findOrCreateRegion(regionRepo, {
    name: 'Lake District', country: 'UK',
    description: 'Lakeland fells and crags. Classic trad climbing on rhyolite, granite and slate.',
  });

  // ── Dow Crag ──────────────────────────────────────────────────────────────
  const dow = await upsertCrag(cragRepo, {
    name: 'Dow Crag', region: lake, regionId: lake.id,
    latitude: 54.3660, longitude: -3.1762, rockType: RockType.OTHER,
    description: 'A classic Lakeland mountain crag above Goats Water. Five distinct buttresses giving climbs from Diff to E5. An atmospheric mountain environment with stunning views over the Coniston fells.',
    approach: '1.5hr walk from Coniston village via Goats Water. Follow the Old Man of Coniston path.',
    parkingInfo: 'Coniston village car parks (pay & display). Start at the copper mines car park.',
  });
  const dowA = await upsertButtress(buttRepo, { name: 'A Buttress', crag: dow, cragId: dow.id, sortOrder: 1 });
  const dowB = await upsertButtress(buttRepo, { name: 'B Buttress', crag: dow, cragId: dow.id, sortOrder: 2 });
  const dowC = await upsertButtress(buttRepo, { name: 'C Buttress', crag: dow, cragId: dow.id, sortOrder: 3 });
  await routeRepo.save([
    tradRoute('Murray\'s Route', 'VD', '3c', dowA, { pitches: 3, height: 80, description: 'A grand mountain outing — the classic easy route on Dow Crag.', sortOrder: 1 }),
    tradRoute('Giant\'s Crawl', 'HS', '4b', dowA, { pitches: 3, height: 90, description: 'Exposed ridge climbing with magnificent situations.', sortOrder: 2 }),
    tradRoute('Eliminate A', 'VS', '4c', dowB, { pitches: 4, height: 110, description: 'One of the finest VS routes in the Lake District — superb climbing on perfect rock.', sortOrder: 1 }),
    tradRoute('Leopard\'s Crawl', 'HVS', '5a', dowB, { pitches: 3, height: 90, description: 'Technical wall climbing with a memorable crux move.', sortOrder: 2 }),
    tradRoute('Nimrod', 'E1', '5b', dowC, { pitches: 3, height: 80, description: 'Bold and committing — the best E1 on Dow.', sortOrder: 1 }),
    tradRoute('Isengard', 'E3', '5c', dowC, { pitches: 2, height: 60, description: 'Sustained and serious. A mountain E3.', sortOrder: 2 }),
  ]);

  // ── Gimmer Crag ───────────────────────────────────────────────────────────
  const gimmer = await upsertCrag(cragRepo, {
    name: 'Gimmer Crag', region: lake, regionId: lake.id,
    latitude: 54.4478, longitude: -3.0695, rockType: RockType.OTHER,
    description: 'The finest mountain crag in Langdale. Steep, clean rhyolite giving sustained routes from VS to E5. Gimmer Crack is widely regarded as the best VS in the Lake District.',
    approach: '45 min walk from the Stickle Barn, Langdale. Take the path towards Loft Crag.',
    parkingInfo: 'National Trust car park at the Old Dungeon Ghyll, Langdale (pay & display).',
  });
  const gimmerNW = await upsertButtress(buttRepo, { name: 'NW Face', crag: gimmer, cragId: gimmer.id, sortOrder: 1 });
  const gimmerSE = await upsertButtress(buttRepo, { name: 'SE Face', crag: gimmer, cragId: gimmer.id, sortOrder: 2 });
  await routeRepo.save([
    tradRoute('Amen Corner', 'HS', '4b', gimmerNW, { pitches: 2, height: 50, description: 'The easiest classic on Gimmer — steep grooves on excellent rock.', sortOrder: 1 }),
    tradRoute('Gimmer Crack', 'VS', '4c', gimmerNW, { pitches: 3, height: 80, description: 'THE Lake District VS — a perfect crack up the NW face in a stunning position. Arguably the finest VS in England.', sortOrder: 2 }),
    tradRoute('Kipling Groove', 'HVS', '5b', gimmerNW, { pitches: 3, height: 75, description: 'A great route — steep groove climbing on perfect rhyolite.', sortOrder: 3 }),
    tradRoute('Gimmer String', 'E1', '5b', gimmerSE, { pitches: 3, height: 70, sortOrder: 1 }),
    tradRoute('Poacher', 'E3', '5c', gimmerSE, { pitches: 2, height: 55, description: 'Strenuous and technical — one of the hardest classics on Gimmer.', sortOrder: 2 }),
    tradRoute('Hiatus', 'VS', '4c', gimmerSE, { pitches: 2, height: 55, description: 'Classic ridge and groove climbing.', sortOrder: 3 }),
  ]);

  // ── Shepherd's Crag, Borrowdale ────────────────────────────────────────────
  const shepherds = await upsertCrag(cragRepo, {
    name: 'Shepherd\'s Crag', region: lake, regionId: lake.id,
    latitude: 54.5393, longitude: -3.1369, rockType: RockType.OTHER,
    description: 'The best and most accessible roadside crag in Borrowdale. A wonderful mix of slabs, walls and cracks at every grade. Little Chamonix is a legendary Diff. Eve is a superb mid-grade classic.',
    approach: '5 min walk from the roadside parking near Barrow Bay, B5289 Borrowdale road.',
    parkingInfo: 'Barrow Bay parking area on B5289, Borrowdale (National Trust, pay & display).',
  });
  const shepBrown = await upsertButtress(buttRepo, { name: 'Brown Slabs', crag: shepherds, cragId: shepherds.id, sortOrder: 1 });
  const shepCentral = await upsertButtress(buttRepo, { name: 'Central Area', crag: shepherds, cragId: shepherds.id, sortOrder: 2 });
  await routeRepo.save([
    tradRoute('Brown Slabs Arête', 'VD', '3c', shepBrown, { height: 30, description: 'One of the finest VDs in the Lake District — long open slab climbing.', sortOrder: 1 }),
    tradRoute('Little Chamonix', 'VD', '3b', shepBrown, { pitches: 2, height: 35, description: 'The legendary Borrowdale easy classic. A must-do for any beginner.', sortOrder: 2 }),
    tradRoute('Ardus', 'S', '4a', shepBrown, { height: 28, description: 'Popular slab route above the Borrowdale road.', sortOrder: 3 }),
    tradRoute('Eve', 'VS', '4c', shepCentral, { height: 30, description: 'The best VS on the crag — a sustained crack up the central wall.', sortOrder: 1 }),
    tradRoute('Brown Slabs Direct', 'HVS', '5a', shepCentral, { height: 30, description: 'Technical and bold. A fine harder route.', sortOrder: 2 }),
    tradRoute('Cleopatra', 'E2', '5b', shepCentral, { height: 28, sortOrder: 3 }),
  ]);

  // ── Pavey Ark ─────────────────────────────────────────────────────────────
  const pavey = await upsertCrag(cragRepo, {
    name: 'Pavey Ark', region: lake, regionId: lake.id,
    latitude: 54.4527, longitude: -3.0741, rockType: RockType.OTHER,
    description: 'Towering mountain crag above Stickle Tarn in Langdale. Jack\'s Rake provides the famous Grade 1 scramble; the faces give excellent routes from VS to E4. A dramatic setting.',
    approach: '45 min walk from Langdale via Stickle Ghyll. Follow the path to Stickle Tarn.',
    parkingInfo: 'National Trust Langdale car parks (pay & display).',
  });
  const paveyMain = await upsertButtress(buttRepo, { name: 'Main Face', crag: pavey, cragId: pavey.id, sortOrder: 1 });
  const paveyEast = await upsertButtress(buttRepo, { name: 'East Buttress', crag: pavey, cragId: pavey.id, sortOrder: 2 });
  await routeRepo.save([
    tradRoute('Jack\'s Rake', 'M', '', paveyMain, { pitches: 4, height: 200, description: 'The famous Grade 1 scramble — exposed and thrilling. More scramble than rock climb but demands respect.', sortOrder: 1 }),
    tradRoute('Arcturus', 'VS', '4c', paveyMain, { pitches: 3, height: 90, description: 'A superb mountaineering VS up the central face.', sortOrder: 2 }),
    tradRoute('Rake End Wall', 'E1', '5b', paveyMain, { pitches: 2, height: 60, description: 'The classic E1 above Jack\'s Rake. Exposed and exhilarating.', sortOrder: 3 }),
    tradRoute('Golden Slipper', 'E2', '5c', paveyEast, { pitches: 2, height: 55, description: 'Technical and bold — one of the best routes on Pavey.', sortOrder: 1 }),
    tradRoute('Cook\'s Tour', 'HVS', '5a', paveyEast, { pitches: 3, height: 70, sortOrder: 2 }),
  ]);

  // ── White Ghyll ───────────────────────────────────────────────────────────
  const whiteGhyll = await upsertCrag(cragRepo, {
    name: 'White Ghyll', region: lake, regionId: lake.id,
    latitude: 54.4500, longitude: -3.0743, rockType: RockType.OTHER,
    description: 'A beautiful crag in its own ghyll above Langdale. The routes here have a wonderfully remote feel despite being accessible. Haste Not is one of Lakeland\'s finest VSs.',
    approach: '40 min walk from Langdale. Follow White Ghyll from the valley floor.',
    parkingInfo: 'National Trust Langdale car parks (pay & display).',
  });
  const whiteMain = await upsertButtress(buttRepo, { name: 'Main Crag', crag: whiteGhyll, cragId: whiteGhyll.id, sortOrder: 1 });
  await routeRepo.save([
    tradRoute('White Ghyll Chimney', 'VD', '3c', whiteMain, { height: 30, description: 'Classic easy route in the ghyll — atmospheric and fun.', sortOrder: 1 }),
    tradRoute('Haste Not', 'VS', '4c', whiteMain, { pitches: 2, height: 55, description: 'One of the finest VS routes in the Lake District — long, sustained and perfectly positioned.', sortOrder: 2 }),
    tradRoute('Slip Knot', 'HVS', '5a', whiteMain, { pitches: 2, height: 50, description: 'Technical wall climbing above the ghyll.', sortOrder: 3 }),
    tradRoute('Gordian Knot', 'E1', '5b', whiteMain, { pitches: 2, height: 50, sortOrder: 4 }),
    tradRoute('White Ghyll Wall', 'VS', '4c', whiteMain, { height: 40, sortOrder: 5 }),
  ]);

  // ── Raven Crag, Langdale ───────────────────────────────────────────────────
  const ravenCrag = await upsertCrag(cragRepo, {
    name: 'Raven Crag, Langdale', region: lake, regionId: lake.id,
    latitude: 54.4417, longitude: -3.0627, rockType: RockType.OTHER,
    description: 'Visible from the valley floor in Langdale. Middlefell Buttress is one of the most popular easy routes in the Lakes. A reliable crag for wet days due to its south-facing aspect.',
    approach: '20 min walk from Langdale car park. Head up the hillside from the New Dungeon Ghyll.',
    parkingInfo: 'New Dungeon Ghyll or Stickle Barn car parks (National Trust, pay & display).',
  });
  const ravenMain = await upsertButtress(buttRepo, { name: 'Main Face', crag: ravenCrag, cragId: ravenCrag.id, sortOrder: 1 });
  await routeRepo.save([
    tradRoute('Middlefell Buttress', 'VD', '3c', ravenMain, { pitches: 3, height: 60, description: 'One of the most famous easy routes in the Lake District. Justifiably popular — great positions and good rock.', sortOrder: 1 }),
    tradRoute('Centipede', 'S', '4a', ravenMain, { pitches: 2, height: 50, description: 'An enjoyable multi-pitch above Middlefell.', sortOrder: 2 }),
    tradRoute('Pluto', 'HVS', '5a', ravenMain, { pitches: 2, height: 45, sortOrder: 3 }),
    tradRoute('Bilberry Buttress', 'VS', '4c', ravenMain, { pitches: 2, height: 50, sortOrder: 4 }),
  ]);

  // ── Pillar Rock ───────────────────────────────────────────────────────────
  const pillar = await upsertCrag(cragRepo, {
    name: 'Pillar Rock', region: lake, regionId: lake.id,
    latitude: 54.4858, longitude: -3.2793, rockType: RockType.OTHER,
    description: 'A legendary mountain crag above Ennerdale — England\'s finest mountain rock climb destination. The Old West Route and North Climb are historic classics. A serious, committing environment.',
    approach: '2.5hr approach from Wasdale Head or Ennerdale. Follow the High Level Route from Wasdale.',
    parkingInfo: 'National Trust car park at Wasdale Head (donations).',
  });
  const pillarMain = await upsertButtress(buttRepo, { name: 'High Man', crag: pillar, cragId: pillar.id, sortOrder: 1 });
  const pillarWest = await upsertButtress(buttRepo, { name: 'West Face', crag: pillar, cragId: pillar.id, sortOrder: 2 });
  await routeRepo.save([
    tradRoute('Old West Route', 'VD', '3c', pillarMain, { pitches: 4, height: 120, description: 'The definitive easy route on Pillar Rock — a classic Lakeland adventure.', sortOrder: 1 }),
    tradRoute('Slab and Notch Route', 'HS', '4b', pillarMain, { pitches: 4, height: 130, description: 'Superb sustained climbing to the summit of the Rock.', sortOrder: 2 }),
    tradRoute('North Climb', 'VS', '4c', pillarMain, { pitches: 5, height: 150, description: 'The great classic of Pillar — a sustained outing on perfect Lakeland rock.', sortOrder: 3 }),
    tradRoute('Groove and Wall Route', 'E1', '5b', pillarWest, { pitches: 3, height: 90, sortOrder: 1 }),
    tradRoute('New West Climb', 'HVS', '5a', pillarWest, { pitches: 4, height: 120, description: 'Serious and sustained — deserves full marks for atmosphere.', sortOrder: 2 }),
  ]);

  // ── Castle Rock of Triermain ───────────────────────────────────────────────
  const castle = await upsertCrag(cragRepo, {
    name: 'Castle Rock of Triermain', region: lake, regionId: lake.id,
    latitude: 54.6270, longitude: -3.1122, rockType: RockType.OTHER,
    description: 'A dramatic crag in St John\'s in the Vale. Overhanging Bastion is one of the Lake District\'s most impressive HVS routes. South-facing with a quick drying time.',
    approach: 'Short walk from the lay-by on the A591 at Legburthwaite. Follow signs to the crag.',
    parkingInfo: 'Lay-by on the A591 near Legburthwaite (free).',
  });
  const castleMain = await upsertButtress(buttRepo, { name: 'Main Face', crag: castle, cragId: castle.id, sortOrder: 1 });
  await routeRepo.save([
    tradRoute('Rigor Mortis', 'VS', '4c', castleMain, { height: 35, description: 'Good technical climbing up the central wall.', sortOrder: 1 }),
    tradRoute('Overhanging Bastion', 'HVS', '5a', castleMain, { height: 40, description: 'The most impressive line on the crag — bold and sustained.', sortOrder: 2 }),
    tradRoute('May Day Cracks', 'E1', '5b', castleMain, { height: 35, description: 'Strenuous finger cracks — one of the best E1s in the north Lakes.', sortOrder: 3 }),
    tradRoute('North Crag Eliminate', 'E3', '5c', castleMain, { height: 30, sortOrder: 4 }),
  ]);

  // ── Eagle Crag, Borrowdale ─────────────────────────────────────────────────
  const eagleCrag = await upsertCrag(cragRepo, {
    name: 'Eagle Crag, Borrowdale', region: lake, regionId: lake.id,
    latitude: 54.5202, longitude: -3.1000, rockType: RockType.OTHER,
    description: 'A magnificent mountain crag above the Greenup Gill in Borrowdale. Routes are long, sustained and serious. Eagle Front is a top Lakeland HVS.',
    approach: '45 min walk up Greenup Gill from the B5289. Take the valley path from Stonethwaite.',
    parkingInfo: 'Stonethwaite village (limited roadside, free).',
  });
  const eagleMain = await upsertButtress(buttRepo, { name: 'Front Face', crag: eagleCrag, cragId: eagleCrag.id, sortOrder: 1 });
  await routeRepo.save([
    tradRoute('Eagle Front', 'HVS', '5a', eagleMain, { pitches: 4, height: 110, description: 'A brilliant mountaineering HVS — long, sustained and atmospheric.', sortOrder: 1 }),
    tradRoute('Postern Gate', 'E1', '5b', eagleMain, { pitches: 3, height: 90, sortOrder: 2 }),
    tradRoute('Falconer\'s Crack', 'E3', '5c', eagleMain, { pitches: 3, height: 85, description: 'Hard and serious. A mountain E3 in every sense.', sortOrder: 3 }),
    tradRoute('Great Slab', 'VS', '4c', eagleMain, { pitches: 3, height: 90, sortOrder: 4 }),
  ]);

  // ── Goat Crag, Borrowdale ──────────────────────────────────────────────────
  const goatCrag = await upsertCrag(cragRepo, {
    name: 'Goat Crag, Borrowdale', region: lake, regionId: lake.id,
    latitude: 54.5227, longitude: -3.1162, rockType: RockType.OTHER,
    description: 'A fine crag in the Borrowdale woods, popular for its hard routes. Praying Mantis is one of the most celebrated E2s in the Lake District.',
    approach: '20 min walk from the car park at Grange in Borrowdale.',
    parkingInfo: 'Grange village car park (National Trust, donations).',
  });
  const goatMain = await upsertButtress(buttRepo, { name: 'Main Face', crag: goatCrag, cragId: goatCrag.id, sortOrder: 1 });
  await routeRepo.save([
    tradRoute('Praying Mantis', 'E2', '5c', goatMain, { pitches: 3, height: 75, description: 'One of the Lakes\' finest E2s — technical mantelshelves and wall climbing.', sortOrder: 1 }),
    tradRoute('Bitter Oasis', 'E3', '5c', goatMain, { pitches: 2, height: 60, sortOrder: 2 }),
    tradRoute('Brutal', 'E5', '6b', goatMain, { pitches: 2, height: 55, description: 'Aptly named — strenuous and unforgiving.', sortOrder: 3 }),
    tradRoute('Girdle Traverse', 'VS', '4c', goatMain, { pitches: 5, height: 60, description: 'An adventurous girdle of the main face.', sortOrder: 4 }),
  ]);

  // ── Buckstone How, Honister ────────────────────────────────────────────────
  const buckstone = await upsertCrag(cragRepo, {
    name: 'Buckstone How', region: lake, regionId: lake.id,
    latitude: 54.5160, longitude: -3.1500, rockType: RockType.OTHER,
    description: 'A crag on the Honister slate above the famous quarry. The rock is excellent — rough and featured. Quick drying.',
    approach: 'Short walk from Honister Hause car park (NY 2256 1351).',
    parkingInfo: 'Honister Hause car park (National Trust, pay & display).',
  });
  const buckMain = await upsertButtress(buttRepo, { name: 'Main Crag', crag: buckstone, cragId: buckstone.id, sortOrder: 1 });
  await routeRepo.save([
    tradRoute('Bluebell Gully', 'D', '3a', buckMain, { height: 30, description: 'Pleasant introductory route.', sortOrder: 1 }),
    tradRoute('Honister Groove', 'HS', '4b', buckMain, { height: 35, description: 'Classic groove climbing on good rock.', sortOrder: 2 }),
    tradRoute('Communist Convert', 'E1', '5b', buckMain, { height: 38, description: 'Pumpy and sustained — the best harder route here.', sortOrder: 3 }),
  ]);

  // ── Hodge Close Quarry ─────────────────────────────────────────────────────
  const hodge = await upsertCrag(cragRepo, {
    name: 'Hodge Close Quarry', region: lake, regionId: lake.id,
    latitude: 54.3954, longitude: -3.0553, rockType: RockType.OTHER,
    description: 'Dramatic slate quarry above Tilberthwaite in the Coniston fells. A unique and atmospheric venue. The route through the arch is iconic.',
    approach: 'Park at Tilberthwaite car park (SD 3015 0103). Walk up the quarry track, 15 min.',
    parkingInfo: 'National Trust car park at Tilberthwaite (pay & display).',
  });
  const hodgeMain = await upsertButtress(buttRepo, { name: 'Main Quarry', crag: hodge, cragId: hodge.id, sortOrder: 1 });
  await routeRepo.save([
    tradRoute('Window', 'HVS', '5a', hodgeMain, { height: 40, description: 'Through the famous quarry window arch — one of the most unusual routes in the Lakes.', sortOrder: 1 }),
    tradRoute('Harlequin', 'E1', '5b', hodgeMain, { height: 35, sortOrder: 2 }),
    tradRoute('Over the Rainbow', 'E2', '5c', hodgeMain, { height: 40, description: 'Sustained technical climbing on the main quarry wall.', sortOrder: 3 }),
  ]);

  // ── Scout Crag, Langdale ───────────────────────────────────────────────────
  const scout = await upsertCrag(cragRepo, {
    name: 'Scout Crag, Langdale', region: lake, regionId: lake.id,
    latitude: 54.4390, longitude: -3.0640, rockType: RockType.OTHER,
    description: 'An excellent beginners and intermediate crag in Langdale — quick to reach and south-facing. Ideal for a first day out or when time is short.',
    approach: '15 min walk from the New Dungeon Ghyll in Langdale. Take the path S below Raven Crag.',
    parkingInfo: 'National Trust Langdale car parks (pay & display).',
  });
  const scoutMain = await upsertButtress(buttRepo, { name: 'Main Face', crag: scout, cragId: scout.id, sortOrder: 1 });
  await routeRepo.save([
    tradRoute('Scout Crag Ordinary', 'M', '', scoutMain, { height: 15, description: 'The easiest way up — good for absolute beginners.', sortOrder: 1 }),
    tradRoute('Junipall Gully', 'D', '3a', scoutMain, { height: 18, sortOrder: 2 }),
    tradRoute('Chequer Buttress', 'HS', '4b', scoutMain, { height: 22, description: 'Great intro HS — well protected and satisfying.', sortOrder: 3 }),
    tradRoute('Scout Crag VS', 'VS', '4c', scoutMain, { height: 22, sortOrder: 4 }),
  ]);

  console.log('  ✓ Lake District: Dow Crag, Gimmer, Shepherd\'s, Pavey Ark, White Ghyll, Raven Crag, Pillar Rock, Castle Rock, Eagle Crag, Goat Crag, Buckstone How, Hodge Close, Scout Crag');
}
