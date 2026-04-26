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

export async function seedSouthEastSandstone(ds: DataSource) {
  const regionRepo = ds.getRepository(Region);
  const cragRepo   = ds.getRepository(Crag);
  const buttRepo   = ds.getRepository(Buttress);
  const routeRepo  = ds.getRepository(Route);

  const kent = await findOrCreateRegion(regionRepo, {
    name: 'Kent Sandstone',
    country: 'England',
    description: 'The sandstone outcrops of the High Weald in Kent and East Sussex. Short but technical climbing on rough Tunbridge Wells Sandstone — a foundational area for British climbing technique and the birthplace of many landmark ascents.',
  });

  // ── Harrison's Rocks ──────────────────────────────────────────────────────
  // Already seeded in england-other-regions with 5 routes — upsertCrag returns
  // the existing row; we add the remaining buttresses and full route list.
  const harrisons = await upsertCrag(cragRepo, {
    name: "Harrison's Rocks",
    region: kent,
    regionId: kent.id,
    latitude: 51.0690,
    longitude: 0.1310,
    rockType: RockType.SANDSTONE,
    description: "The premier sandstone crag in South East England — a 500 m sweep of perfect Tunbridge Wells Sandstone giving hundreds of routes from VD to 8A bouldering. Deep landings, no gear placements and rough, high-friction rock make this a unique technical training ground that has shaped generations of British climbers.",
    approach: '10 min walk from the B2188 near Groombridge. Follow the signed path from the car park.',
    parkingInfo: "BMC/MCofS car park at Harrison's Rocks off the B2188, near Groombridge (small charge per car).",
  });

  const hrMainWall     = await upsertButtress(buttRepo, { name: 'Main Wall',            crag: harrisons, cragId: harrisons.id, sortOrder: 1 });
  const hrCaveArea     = await upsertButtress(buttRepo, { name: 'The Cave Area',         crag: harrisons, cragId: harrisons.id, sortOrder: 2 });
  const hrRightHand    = await upsertButtress(buttRepo, { name: 'Right-Hand Buttress',   crag: harrisons, cragId: harrisons.id, sortOrder: 3 });
  const hrNorthEnd     = await upsertButtress(buttRepo, { name: 'North End',             crag: harrisons, cragId: harrisons.id, sortOrder: 4 });

  await routeRepo.save([
    // Main Wall
    tradRoute('Niblick', 'VD', '3b', hrMainWall, {
      height: 8, sortOrder: 1,
      description: "The classic introduction to Harrison's — a clean, well-featured crack on perfect Kentish sandstone. Every regular visitor has done this route dozens of times.",
    }),
    tradRoute('Curving Crack', 'VD', '3c', hrMainWall, {
      height: 8, sortOrder: 2,
      description: 'Pleasant curved crack, excellent for building confidence on sandstone. Starts just left of the central section.',
    }),
    tradRoute('Bluebell Crack', 'S', '4a', hrMainWall, {
      height: 9, sortOrder: 3,
      description: 'Popular S on the main wall — a fine straight crack taking a direct line up the face.',
    }),
    tradRoute('Central Crack', 'HS', '4b', hrMainWall, {
      height: 9, sortOrder: 4,
      description: "One of Harrison's most-climbed routes. A direct crack up the centre of the main wall with sustained interest.",
    }),
    tradRoute('Corkscrew', 'HS', '4b', hrMainWall, {
      height: 9, sortOrder: 5,
      description: 'Follows a sinuous line through the wall, finding positive holds on what looks initially blank. Characteristic of the subtle Harrison\'s style.',
    }),
    tradRoute('Tombstone', 'VS', '4c', hrMainWall, {
      height: 10, sortOrder: 6,
      description: 'Takes the big block feature on the main wall. Sustained moves on flat holds with a committing top-out.',
    }),
    tradRoute('Slimline', 'VS', '4c', hrMainWall, {
      height: 9, sortOrder: 7,
      description: 'Thin face climbing up the smoother section of the main wall. Balance and friction technique are key.',
    }),
    tradRoute('Niblick Direct', 'E2', '5c', hrMainWall, {
      height: 9, sortOrder: 8,
      description: 'The direct start to Niblick is considerably harder — a stiff technical problem requiring precise footwork on the lower slab.',
    }),
    tradRoute('Flimsy Wall', 'E1', '5b', hrMainWall, {
      height: 9, sortOrder: 9,
      description: 'Aptly named — thin holds on a slightly bulging wall. A bold outing by Harrison\'s standards with the characteristic committing crux.',
    }),
    tradRoute('Birch Tree Wall', 'HVS', '5a', hrMainWall, {
      height: 10, sortOrder: 10,
      description: 'Technical wall climbing past the famous birch tree ledge. One of the best HVS lines on the crag.',
    }),
    tradRoute('Boomerang', 'S', '3c', hrMainWall, {
      height: 8, sortOrder: 11,
      description: 'A curving line that returns you to where you started — more climbing for your money.',
    }),
    tradRoute('Overhanging Flake', 'HVS', '5a', hrMainWall, {
      height: 8, sortOrder: 12,
      description: 'The hanging flake on the right of the main wall provides a strenuous sequence. Good layback technique required.',
    }),

    // Cave Area
    tradRoute('Cave Crack', 'HS', '4b', hrCaveArea, {
      height: 8, sortOrder: 1,
      description: 'Takes the crack at the left edge of the cave — dark, atmospheric and well-featured with good jams.',
    }),
    tradRoute('Cave Wall', 'E1', '5b', hrCaveArea, {
      height: 8, sortOrder: 2,
      description: 'The wall to the right of the cave crack. More sustained than it looks — a fine technical challenge.',
    }),
    tradRoute('Sewer Crack', 'VS', '4c', hrCaveArea, {
      height: 7, sortOrder: 3,
      description: 'Climbs the left-hand crack system in the cave bay. Despite the name, the rock is excellent.',
    }),
    tradRoute('The Drain', 'E2', '5b', hrCaveArea, {
      height: 7, sortOrder: 4,
      description: 'Bold face climbing on the cave wall. Takes the direct line where other routes deviate.',
    }),
    tradRoute('Undercut Flake', 'E1', '5b', hrCaveArea, {
      height: 8, sortOrder: 5,
      description: 'Uses the big undercut to launch onto the face above — an unusual move by Harrison\'s standards.',
    }),

    // Right-Hand Buttress
    tradRoute('Bachelor\'s Left', 'VS', '4c', hrRightHand, {
      height: 9, sortOrder: 1,
      description: "The classic VS on the right-hand buttress — sustained wall climbing on the smooth central section. One of Harrison's most popular routes.",
    }),
    tradRoute('Bachelor\'s Right', 'HVS', '5a', hrRightHand, {
      height: 9, sortOrder: 2,
      description: 'A harder companion to Bachelor\'s Left taking the right-hand side of the buttress. Slightly more bold.',
    }),
    tradRoute('Lean Man\'s Climb', 'E1', '5b', hrRightHand, {
      height: 10, sortOrder: 3,
      description: "A bold south end test-piece — technical face moves on smooth sandstone above the lowest landing. One of Harrison's early E1s.",
    }),
    tradRoute('Tricorn', 'HVS', '5a', hrRightHand, {
      height: 9, sortOrder: 4,
      description: "Popular HVS on the right-hand buttress — technical and sustained with characteristic Kent sandstone feel.",
    }),
    tradRoute('Right-Hand Arête', 'VS', '4c', hrRightHand, {
      height: 9, sortOrder: 5,
      description: 'Takes the right bounding arête of the buttress — exposed and satisfying.',
    }),

    // North End
    tradRoute('Flake Crack', 'HS', '4b', hrNorthEnd, {
      height: 9, sortOrder: 1,
      description: "A satisfying crack climb on the north end — good gear and sustained interest on excellent sandstone.",
    }),
    tradRoute('North End Slab', 'S', '3c', hrNorthEnd, {
      height: 8, sortOrder: 2,
      description: 'Delicate friction slab at the quieter north end of the crag. Good for practising balance technique.',
    }),
    tradRoute('Tombstone Direct', 'E2', '5c', hrNorthEnd, {
      height: 9, sortOrder: 3,
      description: 'The direct version of Tombstone enters from below the block rather than from the side. Considerably harder.',
    }),
  ]);

  // ── High Rocks ────────────────────────────────────────────────────────────
  const highRocks = await upsertCrag(cragRepo, {
    name: 'High Rocks',
    region: kent,
    regionId: kent.id,
    latitude: 51.0850,
    longitude: 0.2170,
    rockType: RockType.SANDSTONE,
    description: 'Dramatic sandstone rocks in a beautiful woodland setting near Tunbridge Wells — one of the oldest climbing venues in England. The labyrinthine passages, deep chimneys and unique boulder formations give a totally different character from open-face climbing. An entrance fee applies.',
    approach: '2 min walk from the High Rocks pub car park off the A264.',
    parkingInfo: 'Car park at the High Rocks pub/hotel, off the A264 between Tunbridge Wells and Groombridge. Entry fee charged at the rocks.',
  });

  const hrockMainRocks   = await upsertButtress(buttRepo, { name: 'Main Rocks',       crag: highRocks, cragId: highRocks.id, sortOrder: 1 });
  const hrockTowerRocks  = await upsertButtress(buttRepo, { name: 'Tower Area',        crag: highRocks, cragId: highRocks.id, sortOrder: 2 });
  const hrockEastRocks   = await upsertButtress(buttRepo, { name: 'East Rocks',        crag: highRocks, cragId: highRocks.id, sortOrder: 3 });

  await routeRepo.save([
    // Main Rocks
    tradRoute('Original Route', 'D', '3a', hrockMainRocks, {
      height: 7, sortOrder: 1,
      description: 'The traditional first route at High Rocks — a pleasant outing on excellent sandstone in the beautiful woodland setting.',
    }),
    tradRoute('The Gangway', 'VD', '3b', hrockMainRocks, {
      height: 8, sortOrder: 2,
      description: 'One of the most popular routes at High Rocks — follows the natural gangway feature across the main rocks.',
    }),
    tradRoute('High Rocks Traverse', 'VS', '4c', hrockMainRocks, {
      height: 8, sortOrder: 3,
      description: 'The classic girdle traverse of the main rocks — a pump-fest linking the features together.',
    }),
    tradRoute('Central Slab', 'S', '3c', hrockMainRocks, {
      height: 8, sortOrder: 4,
      description: 'A delicate slab route — good introduction to High Rocks character with pleasant friction moves.',
    }),
    tradRoute('Wedge Wall', 'HVS', '5a', hrockMainRocks, {
      height: 9, sortOrder: 5,
      description: "The best of the harder routes at High Rocks — bold face climbing on smooth sandstone.",
    }),
    tradRoute('The Slab', 'S', '3c', hrockMainRocks, {
      height: 8, sortOrder: 6,
      description: 'Popular friction slab — delicate footwork on characteristic Weald sandstone.',
    }),

    // Tower Area
    tradRoute('Tower Route', 'HS', '4b', hrockTowerRocks, {
      height: 9, sortOrder: 1,
      description: 'Takes the tower feature — good holds throughout with an exposed final section.',
    }),
    tradRoute('Tower Arête', 'VS', '4c', hrockTowerRocks, {
      height: 9, sortOrder: 2,
      description: 'The left arête of the tower — technical and bold, requiring good balance.',
    }),
    tradRoute('High Rocks Eliminate', 'E1', '5b', hrockTowerRocks, {
      height: 9, sortOrder: 3,
      description: "A bold eliminate taking the direct line up the tower — Harrison's-style boldness without the usual landing.",
    }),

    // East Rocks
    tradRoute('East Climb', 'VD', '3b', hrockEastRocks, {
      height: 7, sortOrder: 1,
      description: 'The classic easy route on the east rocks — a pleasant outing in a quieter part of the crag.',
    }),
    tradRoute('East Wall Direct', 'HVS', '5a', hrockEastRocks, {
      height: 8, sortOrder: 2,
      description: 'Takes the east wall directly — bold moves on smooth sandstone.',
    }),
    tradRoute('Chimney Route', 'D', '3a', hrockEastRocks, {
      height: 6, sortOrder: 3,
      description: 'Atmospheric chimney climbing in the rocks — unique High Rocks sandstone adventure.',
    }),
    tradRoute('East Face Crack', 'HS', '4b', hrockEastRocks, {
      height: 8, sortOrder: 4,
      description: 'A fine crack on the east face — well-protected and sustained.',
    }),
    tradRoute('The Notch', 'VS', '4c', hrockEastRocks, {
      height: 8, sortOrder: 5,
      description: 'Takes the prominent notch feature — an unusual move gaining the notch from below.',
    }),
  ]);

  // ── Stone Farm Rocks ──────────────────────────────────────────────────────
  const stoneFarm = await upsertCrag(cragRepo, {
    name: 'Stone Farm Rocks',
    region: kent,
    regionId: kent.id,
    latitude: 51.0600,
    longitude: 0.1410,
    rockType: RockType.SANDSTONE,
    description: "A quieter sandstone outcrop near Forest Row with varied climbing from VD to E3 on excellent Tunbridge Wells Sandstone. Less visited than Harrison's, it rewards those seeking peace and quality rock away from crowds.",
    approach: '5 min walk from parking along the minor road near Stone Farm.',
    parkingInfo: 'Roadside parking near Stone Farm, off the B2110 near Forest Row. Limited spaces.',
  });

  const sfMainFace   = await upsertButtress(buttRepo, { name: 'Main Face',    crag: stoneFarm, cragId: stoneFarm.id, sortOrder: 1 });
  const sfRightWing  = await upsertButtress(buttRepo, { name: 'Right Wing',   crag: stoneFarm, cragId: stoneFarm.id, sortOrder: 2 });

  await routeRepo.save([
    tradRoute('Farm Route', 'VS', '4c', sfMainFace, {
      height: 9, sortOrder: 1,
      description: "A fine wall route — a quieter alternative to Harrison's with excellent sandstone quality and a sustained crux.",
    }),
    tradRoute('Stone Cold', 'E1', '5b', sfMainFace, {
      height: 10, sortOrder: 2,
      description: 'A bold test-piece on the main face — thin moves on smooth sandstone with sparse protection.',
    }),
    tradRoute('Barn Door', 'VD', '3c', sfMainFace, {
      height: 8, sortOrder: 3,
      description: 'The easy classic — named for the big door-like flake feature. A pleasant introduction to the crag.',
    }),
    tradRoute('Threshing Machine', 'HS', '4b', sfMainFace, {
      height: 9, sortOrder: 4,
      description: 'A fine crack through the bulge on the main face — good gear and a satisfying finish.',
    }),
    tradRoute('Harvest Moon', 'HVS', '5a', sfMainFace, {
      height: 9, sortOrder: 5,
      description: 'Technical face moves past the curved hold with a bold upper section. Best done in good conditions.',
    }),
    tradRoute('Combine Harvester', 'E2', '5c', sfMainFace, {
      height: 10, sortOrder: 6,
      description: 'The hardest route on the main face — a serious test piece with bold moves on the upper wall.',
    }),
    tradRoute('Plough Slab', 'S', '3c', sfRightWing, {
      height: 8, sortOrder: 1,
      description: 'Enjoyable friction slab on the right wing — good for building confidence.',
    }),
    tradRoute('Right Wing Crack', 'VS', '4c', sfRightWing, {
      height: 8, sortOrder: 2,
      description: 'A satisfying crack on the right wing — well-featured and enjoyable.',
    }),
    tradRoute('Stone Wall', 'E1', '5b', sfRightWing, {
      height: 9, sortOrder: 3,
      description: 'Bold wall climbing on the right wing — technical footwork on smooth sandstone.',
    }),
    tradRoute('Field Day', 'D', '3b', sfRightWing, {
      height: 7, sortOrder: 4,
      description: 'The easy classic on the right wing — a pleasant day out.',
    }),
  ]);

  // ── Bowles Rocks ──────────────────────────────────────────────────────────
  const bowlesRocks = await upsertCrag(cragRepo, {
    name: 'Bowles Rocks',
    region: kent,
    regionId: kent.id,
    latitude: 51.0840,
    longitude: 0.2010,
    rockType: RockType.SANDSTONE,
    description: 'An excellent sandstone venue near Eridge, operated by Bowles Outdoor Centre. Continuous use for instruction makes the holds polished on the popular routes, but plenty of rougher lines remain. Good for beginners and improvers alongside harder trad challenges.',
    approach: '2 min walk from the Bowles Outdoor Centre near Eridge.',
    parkingInfo: 'Parking at Bowles Outdoor Centre, Eridge Green (charge may apply; contact centre in advance).',
  });

  const bowlesMain   = await upsertButtress(buttRepo, { name: 'Main Buttress',  crag: bowlesRocks, cragId: bowlesRocks.id, sortOrder: 1 });
  const bowlesSport  = await upsertButtress(buttRepo, { name: 'Sport Wall',     crag: bowlesRocks, cragId: bowlesRocks.id, sortOrder: 2 });
  const bowlesNorth  = await upsertButtress(buttRepo, { name: 'North Buttress', crag: bowlesRocks, cragId: bowlesRocks.id, sortOrder: 3 });

  await routeRepo.save([
    tradRoute('Bowles Slab', 'VD', '3b', bowlesMain, {
      height: 8, sortOrder: 1,
      description: 'The classic introduction — a straightforward slab with good holds.',
    }),
    tradRoute('Centre Route', 'S', '3c', bowlesMain, {
      height: 9, sortOrder: 2,
      description: 'The central line up the main buttress — popular and well-worn holds.',
    }),
    tradRoute('Direct Start', 'HVS', '5a', bowlesMain, {
      height: 9, sortOrder: 3,
      description: 'The bold direct entry to the main buttress — technical lower section.',
    }),
    tradRoute('Girdle of Bowles', 'VS', '4c', bowlesMain, {
      height: 8, sortOrder: 4,
      description: 'Traverses the main buttress at mid-height — pumpy and enjoyable.',
    }),
    tradRoute('Bowles Crack', 'HS', '4b', bowlesMain, {
      height: 9, sortOrder: 5,
      description: 'The prominent crack on the right side — solid jams all the way.',
    }),
    tradRoute('North Buttress Eliminate', 'E2', '5c', bowlesNorth, {
      height: 9, sortOrder: 1,
      description: 'The hardest traditional route at Bowles — bold face climbing on smooth sandstone requiring commitment.',
    }),
    tradRoute('North Buttress Route', 'VD', '3c', bowlesNorth, {
      height: 8, sortOrder: 2,
      description: 'Easy climbing on the north buttress — quieter and less polished.',
    }),
    tradRoute('Finger Traverse', 'E1', '5b', bowlesNorth, {
      height: 6, sortOrder: 3,
      description: 'A low-level traverse on small finger holds — surprisingly taxing.',
    }),
    sportRoute('Bowles Sport Classic', '6b+', bowlesSport, {
      height: 9, sortOrder: 1,
      description: 'Well-bolted sport route on the sport wall — a good introduction to sport climbing on sandstone.',
    }),
    sportRoute('Centre Sport', '7a', bowlesSport, {
      height: 9, sortOrder: 2,
      description: 'Technical sport climbing — sustained small holds on the sport wall.',
    }),
    tradRoute('Overhang Crack', 'E1', '5b', bowlesMain, {
      height: 8, sortOrder: 6,
      description: 'Tackles the small overhang on the main buttress — a strenuous bridging sequence.',
    }),
  ]);

  // ── Eridge Green Rocks ────────────────────────────────────────────────────
  const eridgeGreen = await upsertCrag(cragRepo, {
    name: 'Eridge Green Rocks',
    region: kent,
    regionId: kent.id,
    latitude: 51.0960,
    longitude: 0.2240,
    rockType: RockType.SANDSTONE,
    description: 'A pleasant sandstone outcrop in the Eridge estate woodland, offering a variety of problems and routes on excellent rough sandstone. An underrated venue — quieter than its famous neighbours with some real gems from VD to E3.',
    approach: '10 min walk through the Eridge estate from parking near Eridge village.',
    parkingInfo: 'Roadside parking near Eridge village or at the Eridge Park entrance. Check estate access before visiting.',
  });

  const eridgeMain   = await upsertButtress(buttRepo, { name: 'Main Wall',     crag: eridgeGreen, cragId: eridgeGreen.id, sortOrder: 1 });
  const eridgeEast   = await upsertButtress(buttRepo, { name: 'East Face',     crag: eridgeGreen, cragId: eridgeGreen.id, sortOrder: 2 });
  const eridgeCave   = await upsertButtress(buttRepo, { name: 'Cave Buttress', crag: eridgeGreen, cragId: eridgeGreen.id, sortOrder: 3 });

  await routeRepo.save([
    tradRoute('Green Slab', 'VD', '3b', eridgeMain, {
      height: 8, sortOrder: 1,
      description: 'The entry-level classic at Eridge Green — a pleasant mossy slab when dry.',
    }),
    tradRoute('Eridge Classic', 'S', '3c', eridgeMain, {
      height: 9, sortOrder: 2,
      description: 'The best S on the crag — a fine line taking the central features.',
    }),
    tradRoute('Green Wall', 'VS', '4c', eridgeMain, {
      height: 9, sortOrder: 3,
      description: 'Technical face climbing on the main wall — small holds and precise footwork.',
    }),
    tradRoute('Eridge Crack', 'HS', '4b', eridgeMain, {
      height: 9, sortOrder: 4,
      description: 'A well-defined crack on the main wall — sustained interest throughout.',
    }),
    tradRoute('Eridge HVS', 'HVS', '5a', eridgeMain, {
      height: 9, sortOrder: 5,
      description: 'Technical wall climbing — the start is the crux, above is sustained.',
    }),
    tradRoute('Eridge Eliminate', 'E2', '5c', eridgeMain, {
      height: 9, sortOrder: 6,
      description: 'The main wall eliminate — takes the hardest possible line without deviating. Bold and technical.',
    }),
    tradRoute('East Face Route', 'VS', '4c', eridgeEast, {
      height: 8, sortOrder: 1,
      description: 'Classic VS on the east face — a fine route in a quieter part of the crag.',
    }),
    tradRoute('East Arête', 'HS', '4b', eridgeEast, {
      height: 8, sortOrder: 2,
      description: 'The east arête — well-positioned with enjoyable moves throughout.',
    }),
    tradRoute('East Face Direct', 'E1', '5b', eridgeEast, {
      height: 8, sortOrder: 3,
      description: 'The direct line on the east face — a bold finish above the main difficulty.',
    }),
    tradRoute('Cave Route', 'D', '3a', eridgeCave, {
      height: 7, sortOrder: 1,
      description: 'An atmospheric route through the cave formation — unique Weald sandstone adventure.',
    }),
    tradRoute('Cave Crack', 'HVS', '5a', eridgeCave, {
      height: 7, sortOrder: 2,
      description: 'Strenuous crack emerging from the cave — a powerful sequence in a confined space.',
    }),
    tradRoute('Cave Wall', 'E3', '5c', eridgeCave, {
      height: 8, sortOrder: 3,
      description: 'The hardest route on the cave buttress — bold and technical on the wall above the cave.',
    }),
  ]);

  // ── Cheddar Gorge — supplementary trad routes ─────────────────────────────
  // Cheddar Gorge is seeded in avon-gorge.seed.ts; we add further routes
  // that may not exist yet. The South East region entry here covers the
  // guidebook convention of grouping Cheddar under Somerset / South East England.
  const southEast = await findOrCreateRegion(regionRepo, {
    name: 'South East',
    country: 'England',
    description: 'Limestone and sandstone crags of South East England including Cheddar Gorge.',
  });

  const cheddar = await upsertCrag(cragRepo, {
    name: 'Cheddar Gorge',
    region: southEast,
    regionId: southEast.id,
    latitude: 51.2860,
    longitude: -2.7583,
    rockType: RockType.LIMESTONE,
    description: "Britain's largest limestone gorge — 140 m walls of Carboniferous limestone above the B3135. Some of England's boldest and most committing trad routes alongside modern sport lines. Coronation Street is an iconic HVS and one of the great British multi-pitch routes.",
    approach: 'Most routes accessed directly from roadside paths in the gorge. Lion Rock and Pinnacle Wall are the main trad areas.',
    parkingInfo: 'National Trust car park in Cheddar village. Walk into the gorge along the road (gorge road is toll-free on foot).',
  });

  const cheddarLionRock   = await upsertButtress(buttRepo, { name: 'Lion Rock',        crag: cheddar, cragId: cheddar.id, sortOrder: 1 });
  const cheddarPinnacle   = await upsertButtress(buttRepo, { name: 'Pinnacle Wall',     crag: cheddar, cragId: cheddar.id, sortOrder: 2 });
  const cheddarDovetail   = await upsertButtress(buttRepo, { name: 'Dovetail Wall',     crag: cheddar, cragId: cheddar.id, sortOrder: 3 });
  const cheddarUpperGorge = await upsertButtress(buttRepo, { name: 'Upper Gorge Walls', crag: cheddar, cragId: cheddar.id, sortOrder: 4 });

  await routeRepo.save([
    // Lion Rock
    tradRoute('Coronation Street', 'HVS', '5a', cheddarLionRock, {
      pitches: 4, height: 115, sortOrder: 1,
      description: 'An iconic British HVS — a 115 m line up the great face of Lion Rock with huge exposure and sustained technical interest. The views over the Mendip Hills from the top are unforgettable.',
    }),
    tradRoute('Sceptre', 'E1', '5b', cheddarLionRock, {
      pitches: 2, height: 50, sortOrder: 2,
      description: 'One of the classic Cheddar trad routes — long, exposed and surprisingly steady at the grade. Takes the prominent rib on the left side of Lion Rock.',
    }),
    tradRoute('Wild at Heart', 'E3', '5c', cheddarLionRock, {
      pitches: 2, height: 55, sortOrder: 3,
      description: 'A serious and bold route on the Lion Rock face — technical moves on compact limestone with poor protection.',
    }),
    tradRoute('Coronation Crack', 'VS', '4c', cheddarLionRock, {
      pitches: 2, height: 40, sortOrder: 4,
      description: 'The classic VS crack on Lion Rock — sustained and well-protected jamming in a fine position.',
    }),
    tradRoute('Sunset Boulevard', 'HVS', '5a', cheddarLionRock, {
      pitches: 3, height: 75, sortOrder: 5,
      description: 'A superb direct line up the right side of Lion Rock finishing in a spectacularly exposed position above the gorge.',
    }),
    tradRoute('Gorge Yourself', 'E2', '5c', cheddarLionRock, {
      pitches: 2, height: 50, sortOrder: 6,
      description: 'Takes the middle section of the Lion Rock face where the grades are stiffest. A sustained E2 with a crux on a slightly overhanging wall.',
    }),
    tradRoute('Coronation Street Direct', 'E4', '6a', cheddarLionRock, {
      pitches: 3, height: 90, sortOrder: 7,
      description: 'The direct version of the classic — takes the headwall direct rather than traversing. A committing and serious undertaking.',
    }),

    // Pinnacle Wall
    tradRoute('Long Climb', 'D', '3a', cheddarPinnacle, {
      pitches: 3, height: 60, sortOrder: 1,
      description: 'Classic beginners\' outing — the longest D in the gorge. Takes the easiest line up Pinnacle Wall, three pleasant pitches.',
    }),
    tradRoute('The Pinnacle', 'VS', '4c', cheddarPinnacle, {
      pitches: 2, height: 35, sortOrder: 2,
      description: 'The iconic Cheddar ridge line — a fine exposed VS with the pinnacle feature providing a dramatic summit.',
    }),
    tradRoute('Gorge Wall', 'E1', '5b', cheddarPinnacle, {
      pitches: 2, height: 45, sortOrder: 3,
      description: 'Technical limestone wall climbing on the Pinnacle Wall — good gear but sustained difficulties.',
    }),

    // Dovetail Wall
    tradRoute('Dovetail', 'VS', '4c', cheddarDovetail, {
      pitches: 2, height: 40, sortOrder: 1,
      description: 'The original trad line on the Dovetail Wall — takes the natural crack and groove system up the centre.',
    }),
    tradRoute('Dovetail Direct', 'E2', '5c', cheddarDovetail, {
      pitches: 1, height: 30, sortOrder: 2,
      description: 'A bold direct version avoiding the main crack by climbing the wall to its left. Technical and committing.',
    }),

    // Upper Gorge Walls
    tradRoute('Upper Gorge Slab', 'S', '3c', cheddarUpperGorge, {
      pitches: 2, height: 35, sortOrder: 1,
      description: 'A pleasant slab route in the upper gorge — less frequented and more peaceful than the main areas.',
    }),
    tradRoute('Cheddar Cheese', 'HVS', '5a', cheddarUpperGorge, {
      pitches: 2, height: 45, sortOrder: 2,
      description: 'A well-named route — full of holes (pockets) on excellent compact limestone. One of the better mid-grade routes in the upper gorge.',
    }),
  ]);

  console.log('  ✓ South East Sandstone: Harrison\'s Rocks, High Rocks, Stone Farm, Bowles Rocks, Eridge Green, Cheddar Gorge (supplementary)');
}
