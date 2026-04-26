import { DataSource } from 'typeorm';
import { Region } from '../../modules/crags/entities/region.entity';
import { Crag, RockType } from '../../modules/crags/entities/crag.entity';
import { Buttress } from '../../modules/crags/entities/buttress.entity';
import { Route } from '../../modules/routes/entities/route.entity';
import {
  findOrCreateRegion,
  upsertCrag,
  upsertButtress,
  tradRoute,
  sportRoute,
} from './seed-helpers';

export async function seedLakeDistrictBorrowdale(ds: DataSource) {
  const regionRepo = ds.getRepository(Region);
  const cragRepo   = ds.getRepository(Crag);
  const buttRepo   = ds.getRepository(Buttress);
  const routeRepo  = ds.getRepository(Route);

  const lake = await findOrCreateRegion(regionRepo, {
    name: 'Lake District',
    country: 'England',
    description: 'Lakeland fells and crags. Classic trad climbing on rhyolite, granite and slate.',
  });

  // ── Shepherd's Crag, Borrowdale ───────────────────────────────────────────
  // Seeded in lake-district.seed.ts with 6 routes — we add buttresses and
  // the full suite of routes that make this the definitive Borrowdale roadside venue.
  const shepherds = await upsertCrag(cragRepo, {
    name: "Shepherd's Crag",
    region: lake,
    regionId: lake.id,
    latitude: 54.5393,
    longitude: -3.1369,
    rockType: RockType.OTHER,
    description: "The best and most accessible roadside crag in Borrowdale — a wonderful mix of slabs, walls and cracks at every grade on excellent rhyolite. Little Chamonix is a legendary Diff known by every Lakes climber. Eve and Adam represent the perfect progression from VS to E1 on immaculate rock.",
    approach: 'Walk 5 min from the roadside parking near Barrow Bay on the B5289 Borrowdale road.',
    parkingInfo: 'Barrow Bay parking area on B5289, Borrowdale (National Trust, pay & display). Fills quickly on summer weekends.',
  });

  const shepBrown    = await upsertButtress(buttRepo, { name: 'Brown Slabs',       crag: shepherds, cragId: shepherds.id, sortOrder: 1 });
  const shepCentral  = await upsertButtress(buttRepo, { name: 'Central Area',       crag: shepherds, cragId: shepherds.id, sortOrder: 2 });
  const shepUpper    = await upsertButtress(buttRepo, { name: 'Upper Crag',         crag: shepherds, cragId: shepherds.id, sortOrder: 3 });
  const shepQuayfoot = await upsertButtress(buttRepo, { name: 'Quayfoot Buttress',  crag: shepherds, cragId: shepherds.id, sortOrder: 4 });

  await routeRepo.save([
    // Brown Slabs
    tradRoute('Little Chamonix', 'VD', '3b', shepBrown, {
      pitches: 2, height: 35, sortOrder: 1,
      description: "The legendary Borrowdale easy classic — two pitches of perfect open slab climbing in a beautiful position. A must-do for any Lakes climber regardless of ability. Named for its alpine character.",
    }),
    tradRoute('Chamonix', 'VD', '3c', shepBrown, {
      pitches: 2, height: 35, sortOrder: 2,
      description: 'The companion route to Little Chamonix — equally fine and slightly more direct. Takes the crack system to the right.',
    }),
    tradRoute('Brown Slabs Arête', 'VS', '4c', shepBrown, {
      height: 30, sortOrder: 3,
      description: "One of the finest VSs in the Lake District on long open slab. The arête provides a natural and elegant line with excellent friction.",
    }),
    tradRoute('Ardus', 'S', '4a', shepBrown, {
      height: 28, sortOrder: 4,
      description: 'Popular slab route above the Borrowdale road — a fine introduction to Brown Slabs with sustained interest.',
    }),
    tradRoute('Brown Slabs Direct', 'HVS', '5a', shepBrown, {
      height: 30, sortOrder: 5,
      description: 'The direct line up Brown Slabs — technical and bold, taking the steeper section rather than the easier slab.',
    }),
    tradRoute('Little Chamonix Direct', 'HVS', '5a', shepBrown, {
      pitches: 2, height: 38, sortOrder: 6,
      description: "The direct version of Little Chamonix — avoids the easy traverse pitch and instead takes a steeper line. A good step up from the classic.",
    }),

    // Central Area
    tradRoute('Eve', 'VS', '4c', shepCentral, {
      height: 30, sortOrder: 1,
      description: "The best VS on the crag — a sustained crack up the central wall. One of the great Lakeland middle-grade routes, combining technical crack technique with fine exposure.",
    }),
    tradRoute('Adam', 'E1', '5b', shepCentral, {
      height: 30, sortOrder: 2,
      description: "The natural progression from Eve — takes the steeper wall above with a technical crux. One of the most sought-after E1s at Shepherd's.",
    }),
    tradRoute('Cleopatra', 'E2', '5b', shepCentral, {
      height: 28, sortOrder: 3,
      description: "Sustained and technical wall climbing on Shepherd's finest section — the crux sequence requires precise footwork.",
    }),
    tradRoute('Prana', 'E2', '5c', shepCentral, {
      height: 28, sortOrder: 4,
      description: "A stiff technical route on the central face — sustained small holds with a bold crux where the wall steepens.",
    }),
    tradRoute('Nectarine', 'E3', '5c', shepCentral, {
      height: 28, sortOrder: 5,
      description: 'One of the harder routes at Shepherd\'s — bold face climbing on the steepest part of the central wall. Sparse protection on the key moves.',
    }),
    tradRoute('Fishers Folly', 'E1', '5b', shepCentral, {
      height: 25, sortOrder: 6,
      description: 'A fine E1 on the central face — technical and sustained with a memorable crux.',
    }),

    // Upper Crag
    tradRoute('Brown Crag Wall', 'VS', '4c', shepUpper, {
      height: 25, sortOrder: 1,
      description: "Classic VS on the upper crag — one of Shepherd's best routes at this grade. Well-protected and satisfying.",
    }),
    tradRoute('Brown Crag Traverse', 'VS', '4c', shepUpper, {
      height: 20, sortOrder: 2,
      description: 'Traverses the upper crag at mid-height — a pleasant and varied route.',
    }),
    tradRoute('Shepherd\'s Delight', 'HVS', '5a', shepUpper, {
      height: 25, sortOrder: 3,
      description: 'Technical wall climbing on the upper crag. The crux is low down where the wall is at its steepest.',
    }),
    tradRoute('Upper Wall Route', 'E1', '5b', shepUpper, {
      height: 22, sortOrder: 4,
      description: 'Sustained wall climbing on the upper section — a bold route with a technical middle section.',
    }),

    // Quayfoot Buttress
    tradRoute('Quayfoot Buttress', 'HS', '4b', shepQuayfoot, {
      pitches: 2, height: 35, sortOrder: 1,
      description: 'The classic HS on the Quayfoot Buttress — takes the natural line up the steep lower section and onto the easier upper crag.',
    }),
    tradRoute('Quayfoot Crack', 'VS', '4c', shepQuayfoot, {
      height: 30, sortOrder: 2,
      description: 'Fine crack climbing on the Quayfoot Buttress — well-protected jamming on excellent rough rhyolite.',
    }),
    tradRoute('Quayfoot Wall', 'E2', '5c', shepQuayfoot, {
      height: 28, sortOrder: 3,
      description: 'Bold face climbing on the Quayfoot Buttress — the hardest route on this section.',
    }),
  ]);

  // ── Castle Rock of Triermain ───────────────────────────────────────────────
  // Seeded in lake-district.seed.ts with 4 routes — we add buttresses and
  // the full complement of classic and modern routes.
  const castle = await upsertCrag(cragRepo, {
    name: 'Castle Rock of Triermain',
    region: lake,
    regionId: lake.id,
    latitude: 54.6270,
    longitude: -3.1122,
    rockType: RockType.OTHER,
    description: "A dramatic roadside crag in the Vale of St John's. The overhanging main face gives some of the finest and most sustained routes in the north Lakes — Overhanging Bastion is an unforgettable HVS and North Crag Eliminate is a modern classic E2. Southfacing and quick-drying.",
    approach: 'Short walk from the lay-by on the A591 at Legburthwaite, following the signed path.',
    parkingInfo: 'Lay-by on the A591 near Legburthwaite (free). Alternative parking at the Swinside Inn.',
  });

  const castleMainFace = await upsertButtress(buttRepo, { name: 'Main Face',        crag: castle, cragId: castle.id, sortOrder: 1 });
  const castleNorthCrag = await upsertButtress(buttRepo, { name: 'North Crag',       crag: castle, cragId: castle.id, sortOrder: 2 });
  const castleSouthFace = await upsertButtress(buttRepo, { name: 'South Face',       crag: castle, cragId: castle.id, sortOrder: 3 });

  await routeRepo.save([
    // Main Face
    tradRoute('Castle Rock Original', 'VD', '3c', castleMainFace, {
      pitches: 3, height: 60, sortOrder: 1,
      description: 'The original and easiest route on Castle Rock — three enjoyable pitches with good positions and views of the Vale of St John\'s.',
    }),
    tradRoute('Slab and Groove', 'HS', '4b', castleMainFace, {
      pitches: 2, height: 50, sortOrder: 2,
      description: 'A classic HS taking the obvious slab and groove feature on the main face — well-protected and satisfying.',
    }),
    tradRoute('Rigor Mortis', 'VS', '4c', castleMainFace, {
      height: 35, sortOrder: 3,
      description: 'Good technical climbing up the central wall — a fine Lake District VS.',
    }),
    tradRoute('Girdle Traverse', 'VS', '4c', castleMainFace, {
      pitches: 4, height: 40, sortOrder: 4,
      description: 'A classic traversing route linking all the main features of Castle Rock — adventurous and varied.',
    }),
    tradRoute('Overhanging Bastion', 'HVS', '5a', castleMainFace, {
      height: 40, sortOrder: 5,
      description: "The most impressive line on Castle Rock — bold, sustained and exposed. One of the great north Lakes HVS routes and a landmark in Lake District climbing history.",
    }),
    tradRoute('Via Media', 'HVS', '5a', castleMainFace, {
      pitches: 2, height: 45, sortOrder: 6,
      description: 'An excellent HVS taking the middle way up the main face — less famous than Overhanging Bastion but equally rewarding.',
    }),
    tradRoute('May Day Cracks', 'E1', '5b', castleMainFace, {
      height: 35, sortOrder: 7,
      description: 'Strenuous finger cracks on the main face — one of the best E1s in the north Lakes. A good test of jamming technique.',
    }),
    tradRoute('Triermain Eliminate', 'E1', '5b', castleMainFace, {
      height: 35, sortOrder: 8,
      description: 'A demanding eliminate taking the hardest possible line on the main face — bold and technical.',
    }),

    // North Crag
    tradRoute('North Crag Eliminate', 'E2', '5c', castleNorthCrag, {
      height: 30, sortOrder: 1,
      description: 'The modern classic of Castle Rock — sustained technical climbing on the north crag with a series of increasingly difficult moves. One of the best E2s in Cumbria.',
    }),
    tradRoute('North Crag Route', 'VS', '4c', castleNorthCrag, {
      pitches: 2, height: 40, sortOrder: 2,
      description: 'The standard VS on the north crag — a fine route in a less-visited section.',
    }),
    tradRoute('North Crag Wall', 'E1', '5b', castleNorthCrag, {
      height: 30, sortOrder: 3,
      description: 'Technical face climbing on the north crag — exposed and sustained.',
    }),
    tradRoute('North Crag Traverse', 'HVS', '5a', castleNorthCrag, {
      pitches: 3, height: 35, sortOrder: 4,
      description: 'A traversing route along the north crag — gives good exposure and varied climbing.',
    }),

    // South Face
    tradRoute('South Face Route', 'S', '3c', castleSouthFace, {
      pitches: 2, height: 40, sortOrder: 1,
      description: 'The easiest way up the crag — a pleasant outing on the south-facing slabs.',
    }),
    tradRoute('Arrowhead', 'E3', '5c', castleSouthFace, {
      height: 28, sortOrder: 2,
      description: 'A bold route on the south face — technical and serious with sparse protection on the crux.',
    }),
    tradRoute('South Face Crack', 'HS', '4b', castleSouthFace, {
      height: 30, sortOrder: 3,
      description: 'The prominent crack on the south face — well-protected and satisfying jamming.',
    }),
  ]);

  // ── Hodge Close Quarry ─────────────────────────────────────────────────────
  // Seeded in lake-district.seed.ts with 3 routes — we add full buttresses
  // and the sport and harder trad lines that make this a unique venue.
  const hodge = await upsertCrag(cragRepo, {
    name: 'Hodge Close Quarry',
    region: lake,
    regionId: lake.id,
    latitude: 54.3954,
    longitude: -3.0553,
    rockType: RockType.OTHER,
    description: 'Dramatic slate quarry above Tilberthwaite in the Coniston fells. A uniquely atmospheric venue with an iconic hole through the quarry rim providing both the approach and the descent. The sport routes use this venue to the full; the trad routes venture onto the steeper and more serious quarry walls.',
    approach: 'Park at Tilberthwaite car park (SD 3015 0103). Walk up the quarry track — 15 min. Access through the arch.',
    parkingInfo: 'National Trust car park at Tilberthwaite (pay & display). The quarry itself is open access.',
  });

  const hodgeMainWall  = await upsertButtress(buttRepo, { name: 'Main Quarry Wall', crag: hodge, cragId: hodge.id, sortOrder: 1 });
  const hodgeCaveWall  = await upsertButtress(buttRepo, { name: 'Cave Wall',        crag: hodge, cragId: hodge.id, sortOrder: 2 });
  const hodgeSportWall = await upsertButtress(buttRepo, { name: 'Sport Wall',       crag: hodge, cragId: hodge.id, sortOrder: 3 });

  await routeRepo.save([
    // Main Quarry Wall — trad
    tradRoute('Window', 'HVS', '5a', hodgeMainWall, {
      height: 40, sortOrder: 1,
      description: 'Through the famous quarry window arch — one of the most unusual and atmospheric routes in the Lake District. A must-do.',
    }),
    tradRoute('Harlequin', 'E1', '5b', hodgeMainWall, {
      height: 35, sortOrder: 2,
      description: 'Fine sustained climbing on the quarry wall — technical slate moves with good gear placements.',
    }),
    tradRoute('Over the Rainbow', 'E2', '5c', hodgeMainWall, {
      height: 40, sortOrder: 3,
      description: 'Sustained technical climbing on the main quarry wall — good moves on excellent slate throughout.',
    }),
    tradRoute('Subterranean', 'E3', '5c', hodgeMainWall, {
      height: 45, sortOrder: 4,
      description: 'A bold route taking the steeper section of the main quarry wall — serious and committing with a crux near the top.',
    }),
    tradRoute('Deep Space', 'E4', '6a', hodgeMainWall, {
      height: 45, sortOrder: 5,
      description: 'One of the hardest trad routes at Hodge Close — a bold and technical face climb on the upper quarry wall. Sparse gear.',
    }),
    tradRoute('Quarry Wall Girdle', 'E2', '5b', hodgeMainWall, {
      pitches: 3, height: 40, sortOrder: 6,
      description: 'A traversing route linking the main quarry wall features — adventurous and gives a good overview of the venue.',
    }),

    // Cave Wall — trad
    tradRoute('Cave Route', 'E1', '5b', hodgeCaveWall, {
      height: 35, sortOrder: 1,
      description: 'The classic cave route at Hodge Close — atmospheric climbing through the cave formation with a technical exit.',
    }),
    tradRoute('Cave Wall Crack', 'HVS', '5a', hodgeCaveWall, {
      height: 30, sortOrder: 2,
      description: 'A fine crack system through the cave wall — technical jamming on excellent slate.',
    }),
    tradRoute('Cave Wall Direct', 'E3', '6a', hodgeCaveWall, {
      height: 35, sortOrder: 3,
      description: 'The direct version of Cave Route — avoids the crack and takes the blank wall to its left. Bold and technical.',
    }),

    // Sport Wall — bolted routes
    sportRoute('Dark Crystal', '7a+', hodgeSportWall, {
      height: 25, sortOrder: 1,
      description: 'The benchmark sport route at Hodge Close — sustained technical moves on smooth slate with a crux sequence on the headwall.',
    }),
    sportRoute('Shadow World', '7b', hodgeSportWall, {
      height: 25, sortOrder: 2,
      description: 'A harder test on the sport wall — sustained small holds on slightly overhanging slate.',
    }),
    sportRoute('Light Fantastic', '6c', hodgeSportWall, {
      height: 22, sortOrder: 3,
      description: 'More accessible sport climbing at Hodge Close — a fine route for building confidence on slate.',
    }),
    sportRoute('Slate Warrior', '7b+', hodgeSportWall, {
      height: 25, sortOrder: 4,
      description: 'Hard bolted climbing on the sport wall — powerful moves on the steeper lower section leading to a technical headwall.',
    }),
    sportRoute('Quarry Master', '6b+', hodgeSportWall, {
      height: 22, sortOrder: 5,
      description: 'A quality mid-grade sport route — well-bolted and engaging throughout.',
    }),
    sportRoute('Abyss', '7c', hodgeSportWall, {
      height: 25, sortOrder: 6,
      description: 'One of the harder sport routes in the quarry — a powerful sequence through the steepest section.',
    }),
  ]);

  // ── Falcon Crag, Borrowdale ────────────────────────────────────────────────
  const falconCrag = await upsertCrag(cragRepo, {
    name: 'Falcon Crag, Borrowdale',
    region: lake,
    regionId: lake.id,
    latitude: 54.5465,
    longitude: -3.1425,
    rockType: RockType.OTHER,
    description: "A superb roadside crag above the Borrowdale valley giving long multi-pitch routes on excellent rhyolite. Hedera Grooves is a classic long VD in one of England's most beautiful valleys; Illusion and Cleopatra represent the harder possibilities. The crag faces south-west and catches the afternoon sun.",
    approach: '15 min walk from Barrow Bay parking or the Lodore Falls car park on the B5289.',
    parkingInfo: 'Barrow Bay lay-by on the B5289, Borrowdale (National Trust). Alternatively Lodore car park.',
  });

  const falconMainFace  = await upsertButtress(buttRepo, { name: 'Main Face',    crag: falconCrag, cragId: falconCrag.id, sortOrder: 1 });
  const falconUpper     = await upsertButtress(buttRepo, { name: 'Upper Crag',   crag: falconCrag, cragId: falconCrag.id, sortOrder: 2 });
  const falconLeftWing  = await upsertButtress(buttRepo, { name: 'Left Wing',    crag: falconCrag, cragId: falconCrag.id, sortOrder: 3 });

  await routeRepo.save([
    // Main Face
    tradRoute('Hedera Grooves', 'VD', '3c', falconMainFace, {
      pitches: 3, height: 70, sortOrder: 1,
      description: "The classic long VD on Falcon Crag — three pitches of sustained groove climbing on perfect Borrowdale rhyolite in the heart of England's finest valley. Named for the ivy (hedera) clinging to the lower approaches.",
    }),
    tradRoute('Fern Groove', 'S', '4a', falconMainFace, {
      pitches: 2, height: 50, sortOrder: 2,
      description: 'A fine companion route to Hedera Grooves — takes the groove line slightly to the right with good positions throughout.',
    }),
    tradRoute('Bludgeon', 'HVS', '5a', falconMainFace, {
      pitches: 2, height: 55, sortOrder: 3,
      description: 'Aptly named — strenuous crack and wall climbing with a committing crux pitch. One of the better HVS routes in Borrowdale.',
    }),
    tradRoute('Frustration', 'E1', '5b', falconMainFace, {
      pitches: 2, height: 55, sortOrder: 4,
      description: 'A sustained E1 — the crux comes near the top where the wall steepens. Well-protected but committing.',
    }),
    tradRoute('Illusion', 'E2', '5c', falconMainFace, {
      pitches: 2, height: 60, sortOrder: 5,
      description: 'A classic Falcon Crag E2 — technical face climbing with a bold crux where the protection is adequate but feels sparse. One of the great Borrowdale routes.',
    }),
    tradRoute('Cleopatra', 'E3', '5c', falconMainFace, {
      pitches: 2, height: 60, sortOrder: 6,
      description: 'The hardest of the classic Falcon Crag routes — bold and sustained on the main face with a crux sequence requiring precise technique.',
    }),
    tradRoute('Chick Crack', 'VS', '4c', falconMainFace, {
      pitches: 2, height: 50, sortOrder: 7,
      description: 'A fine VS crack line on the main face — sustained jamming on excellent rock.',
    }),
    tradRoute('Corvus', 'HVS', '5a', falconMainFace, {
      pitches: 2, height: 55, sortOrder: 8,
      description: 'A good HVS taking the central line of the main face — sustained and technical with a bold upper section.',
    }),
    tradRoute('Kestrel Wall', 'VS', '4c', falconMainFace, {
      pitches: 2, height: 50, sortOrder: 9,
      description: 'A popular VS — takes the wall below and left of the main groove system. Well-featured and enjoyable.',
    }),

    // Upper Crag
    tradRoute('Upper Falcon', 'HS', '4b', falconUpper, {
      pitches: 2, height: 40, sortOrder: 1,
      description: 'Pleasant climbing on the upper crag section — good positions with views across Borrowdale.',
    }),
    tradRoute('Falcon Crack', 'E1', '5b', falconUpper, {
      height: 30, sortOrder: 2,
      description: 'A strenuous crack on the upper crag — technical jamming on the steeper section.',
    }),

    // Left Wing
    tradRoute('Left Wing Route', 'VD', '3b', falconLeftWing, {
      pitches: 2, height: 45, sortOrder: 1,
      description: 'The easy classic on the left wing — a long and pleasant route.',
    }),
    tradRoute('Left Wall', 'E1', '5b', falconLeftWing, {
      height: 35, sortOrder: 2,
      description: 'Bold face climbing on the left wing — technical moves on a slightly overhanging wall.',
    }),
    tradRoute('Merlin', 'E2', '5c', falconLeftWing, {
      height: 35, sortOrder: 3,
      description: 'The best route on the left wing — a technical face climb with a fine crux sequence.',
    }),
  ]);

  // ── Buckstone How ─────────────────────────────────────────────────────────
  // Seeded in lake-district.seed.ts with 3 routes — we add buttresses and
  // the full route list including the classic lines.
  const buckstone = await upsertCrag(cragRepo, {
    name: 'Buckstone How',
    region: lake,
    regionId: lake.id,
    latitude: 54.5160,
    longitude: -3.1500,
    rockType: RockType.OTHER,
    description: "A crag on the Honister Pass above the famous slate quarry. Excellent rough rock with plenty of features — quick drying and south-facing. Often underestimated, Buckstone How offers some of the best climbing in the Honister area with a range from D to E3.",
    approach: 'Short walk from Honister Hause car park, following the path above the quarry workings.',
    parkingInfo: 'Honister Hause car park (National Trust, pay & display). Busy with Honister Slate Mine visitors on weekends.',
  });

  const buckMain   = await upsertButtress(buttRepo, { name: 'Main Crag',      crag: buckstone, cragId: buckstone.id, sortOrder: 1 });
  const buckLeft   = await upsertButtress(buttRepo, { name: 'Left Buttress',  crag: buckstone, cragId: buckstone.id, sortOrder: 2 });
  const buckRight  = await upsertButtress(buttRepo, { name: 'Right Buttress', crag: buckstone, cragId: buckstone.id, sortOrder: 3 });

  await routeRepo.save([
    // Main Crag
    tradRoute('Bluebell Gully', 'D', '3a', buckMain, {
      height: 30, sortOrder: 1,
      description: 'Pleasant introductory route — the easiest way up the crag.',
    }),
    tradRoute('Honister Groove', 'HS', '4b', buckMain, {
      height: 35, sortOrder: 2,
      description: 'Classic groove climbing on good rock — the best HS on the crag.',
    }),
    tradRoute('Communist Convert', 'E1', '5b', buckMain, {
      height: 38, sortOrder: 3,
      description: 'Pumpy and sustained — the best harder route here. Finds the weakness up the steeper central section.',
    }),
    tradRoute('Sinister Grooves', 'VS', '4c', buckMain, {
      pitches: 2, height: 45, sortOrder: 4,
      description: "A fine multi-pitch VS — takes the grooves on the left side of the main crag with good positions. Buckstone How's most popular route.",
    }),
    tradRoute('Dexter Wall', 'HVS', '5a', buckMain, {
      height: 35, sortOrder: 5,
      description: 'Technical face climbing on the right side of the main crag — a bold HVS with a well-defined crux sequence.',
    }),
    tradRoute('Fool\'s Paradise', 'E1', '5b', buckMain, {
      height: 35, sortOrder: 6,
      description: "A deceptive route — looks straightforward but the crux comes unexpectedly high. One of Buckstone's best harder routes.",
    }),
    tradRoute('Honister Highway', 'VD', '3c', buckMain, {
      pitches: 2, height: 40, sortOrder: 7,
      description: 'The classic easy multi-pitch on Buckstone How — fine climbing on excellent rough rock with views of the pass.',
    }),
    tradRoute('Honister Wall', 'VS', '4c', buckMain, {
      height: 30, sortOrder: 8,
      description: 'Sustained wall climbing on excellent rock — the central face route of the main crag.',
    }),

    // Left Buttress
    tradRoute('Left Edge', 'S', '3c', buckLeft, {
      height: 28, sortOrder: 1,
      description: 'An enjoyable easy route on the left buttress — well-featured and accessible.',
    }),
    tradRoute('Slate Direct', 'HVS', '5a', buckLeft, {
      height: 32, sortOrder: 2,
      description: 'Direct line on the left buttress — technical footwork on smooth slate sections.',
    }),
    tradRoute('Left Buttress Eliminate', 'E2', '5c', buckLeft, {
      height: 30, sortOrder: 3,
      description: 'The eliminate of the left buttress — bold climbing avoiding all the easy options.',
    }),

    // Right Buttress
    tradRoute('Right Buttress Route', 'HS', '4b', buckRight, {
      pitches: 2, height: 40, sortOrder: 1,
      description: 'A fine route on the right buttress — good positions with views of Honister Pass.',
    }),
    tradRoute('Paradise Found', 'E3', '6a', buckRight, {
      height: 30, sortOrder: 2,
      description: "The hardest route on Buckstone How — a serious face climb on the right buttress requiring bold climbing on small holds.",
    }),
    tradRoute('Right Edge', 'VS', '4c', buckRight, {
      height: 28, sortOrder: 3,
      description: 'Takes the right bounding edge of the right buttress — an exposed and satisfying VS.',
    }),
  ]);

  console.log('  ✓ Lake District Borrowdale: Shepherd\'s Crag, Castle Rock, Hodge Close Quarry, Falcon Crag, Buckstone How');
}
