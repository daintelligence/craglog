import { DataSource } from 'typeorm';
import { Region } from '../../modules/crags/entities/region.entity';
import { Crag, RockType } from '../../modules/crags/entities/crag.entity';
import { Buttress } from '../../modules/crags/entities/buttress.entity';
import { Route } from '../../modules/routes/entities/route.entity';
import { findOrCreateRegion, upsertCrag, upsertButtress, tradRoute, sportRoute } from './seed-helpers';

export async function seedStanageExtended(ds: DataSource) {
  const regionRepo = ds.getRepository(Region);
  const cragRepo   = ds.getRepository(Crag);
  const buttRepo   = ds.getRepository(Buttress);
  const routeRepo  = ds.getRepository(Route);

  const peak = await findOrCreateRegion(regionRepo, {
    name: 'Peak District', country: 'England',
    description: 'The Peak District — UK climbing heartland. Gritstone edges and limestone dales.',
  });

  // ── Stanage Edge (massive expansion) ─────────────────────────────────────
  const stanage = await upsertCrag(cragRepo, {
    name: 'Stanage Edge', region: peak, regionId: peak.id,
    latitude: 53.3465, longitude: -1.6512, rockType: RockType.GRITSTONE,
    description: 'The definitive gritstone edge. Five kilometres of immaculate rock giving classics at every grade from Mod to E9. The right and left unconquerables define the grit VS experience.',
    approach: 'Multiple car parks along Hooks Car Road and Dennis Knoll. 5–15 min walk to the edge.',
    parkingInfo: 'Dennis Knoll (free, SK 2362 8380), Hooks Car (pay & display, SK 2480 8325), Upper Burbage Bridge.',
  });

  const stanHN   = await upsertButtress(buttRepo, { name: 'High Neb', crag: stanage, cragId: stanage.id, sortOrder: 1 });
  const stanAN   = await upsertButtress(buttRepo, { name: 'Apparent North', crag: stanage, cragId: stanage.id, sortOrder: 2 });
  const stanBH   = await upsertButtress(buttRepo, { name: 'Black Hawk Area', crag: stanage, cragId: stanage.id, sortOrder: 3 });
  const stanPop  = await upsertButtress(buttRepo, { name: 'Popular End', crag: stanage, cragId: stanage.id, sortOrder: 4 });
  const stanCB   = await upsertButtress(buttRepo, { name: "Count's Buttress Area", crag: stanage, cragId: stanage.id, sortOrder: 5 });
  const stanMW   = await upsertButtress(buttRepo, { name: 'Marble Wall Area', crag: stanage, cragId: stanage.id, sortOrder: 6 });
  const stanSB   = await upsertButtress(buttRepo, { name: 'Stanage Bannister Buttress', crag: stanage, cragId: stanage.id, sortOrder: 7 });

  await routeRepo.save([
    // High Neb
    tradRoute('High Neb Buttress', 'VD', '3b', stanHN, { height: 14, description: 'The broad easy buttress at the north end of the edge. A fine introduction to gritstone.', sortOrder: 1 }),
    tradRoute('Flying Buttress', 'HS', '4b', stanHN, { height: 14, description: 'Elegant arête and wall — one of the best HSs on Stanage. Clear line, fine situations.', sortOrder: 2 }),
    tradRoute('Flying Buttress Direct', 'E1', '5b', stanHN, { height: 14, description: 'Straight up the front of the buttress — bold, technical and exposed.', sortOrder: 3 }),
    tradRoute('Flying Buttress Arête', 'VS', '4c', stanHN, { height: 12, description: 'Left arête of the main buttress. Excellent friction climbing.', sortOrder: 4 }),
    tradRoute('High Neb Crack', 'VD', '3c', stanHN, { height: 10, description: 'Clean crack splitting the upper tier. Perfect jamming.', sortOrder: 5 }),
    tradRoute('High Neb Groove', 'S', '4a', stanHN, { height: 12, description: 'Open groove with good pockets. A pleasant lower-grade outing.', sortOrder: 6 }),
    tradRoute('Hob\'s Groove', 'VS', '4c', stanHN, { height: 13, description: 'Sustained groove on the right side of the High Neb sector.', sortOrder: 7 }),
    tradRoute('Mortar Crack', 'HS', '4b', stanHN, { height: 11, description: 'A clean crack splitting the wall right of Flying Buttress.', sortOrder: 8 }),

    // Apparent North
    tradRoute('Apparent North', 'VS', '4c', stanAN, { height: 14, description: 'Classic VS arête line — sustained and varied.', sortOrder: 1 }),
    tradRoute('Goliath\'s Groove', 'HVS', '5a', stanAN, { height: 16, description: 'Magnificent groove system. One of the great HVS routes on Stanage — well-protected, sustained.', sortOrder: 2 }),
    tradRoute('Goliath', 'E5', '6b', stanAN, { height: 14, description: 'One of the hardest traditional routes on the edge — a desperate sequence on the Goliath walls.', sortOrder: 3 }),
    tradRoute('Heaven Crack', 'E1', '5b', stanAN, { height: 15, description: 'Sustained layback crack — strenuous and committing.', sortOrder: 4 }),
    tradRoute('March Hare\'s Buttress', 'HVS', '5a', stanAN, { height: 14, description: 'Technical wall and corner — brilliant positions.', sortOrder: 5 }),
    tradRoute('Jasper', 'E2', '5c', stanAN, { height: 13, description: 'Thin wall climbing with a committing crux move.', sortOrder: 6 }),
    tradRoute('Inverted V', 'VS', '4c', stanAN, { height: 12, description: 'The unmistakable V-shaped groove in the middle of the edge. A true Stanage classic.', sortOrder: 7 }),
    tradRoute('Quietus', 'E1', '5b', stanAN, { height: 16, description: 'Superb sustained wall climbing — perhaps the finest E1 on Stanage.', sortOrder: 8 }),
    tradRoute('Crack of Gloom', 'E2', '5c', stanAN, { height: 15, description: 'A dark, brooding crack — strenuous and atmospheric.', sortOrder: 9 }),
    tradRoute('Ellis\'s Eliminate', 'E1', '5b', stanAN, { height: 14, description: 'Bold slab climbing above the most obvious line.', sortOrder: 10 }),
    tradRoute('Archangel', 'E3', '5c', stanAN, { height: 16, description: 'The superb arête right of Goliath\'s Groove — brilliant positions, hard crux.', sortOrder: 11 }),
    tradRoute('Brain Damage', 'E7', '6c', stanAN, { height: 12, description: 'Johnny Dawes\'s terrifying eliminate — one of Britain\'s hardest traditional routes when first climbed.', sortOrder: 12 }),

    // Black Hawk Area
    tradRoute('Black Hawk Hell Crack', 'E2', '5c', stanBH, { height: 16, description: 'THE E2 on Stanage. A fierce crack splitting the dark wall — strenuous and brilliant.', sortOrder: 1 }),
    tradRoute('Black Hawk Bastion', 'HS', '4b', stanBH, { height: 14, description: 'The direct line up the bastion — a fine outing at the grade.', sortOrder: 2 }),
    tradRoute('Black Hawk Traverse', 'VS', '4c', stanBH, { height: 14, description: 'Rightward traverse of the Black Hawk walls. Unusual and excellent.', sortOrder: 3 }),
    tradRoute('Black Hawk Nevis', 'E3', '5c', stanBH, { height: 15, description: 'Hard climbing on the dark wall left of Hell Crack.', sortOrder: 4 }),
    tradRoute('Bengal Buttress', 'HS', '4b', stanBH, { height: 12, description: 'Fine buttress above the heather — well positioned.', sortOrder: 5 }),
    tradRoute('Bengal Crack', 'E1', '5b', stanBH, { height: 13, description: 'Sustained crack climbing on perfect gritstone.', sortOrder: 6 }),
    tradRoute('Byne\'s Route', 'VS', '4c', stanBH, { height: 14, description: 'A long-established classic — varied climbing on good rock.', sortOrder: 7 }),
    tradRoute('Desperate Dan', 'E4', '6a', stanBH, { height: 14, description: 'One of Stanage\'s hardest face climbs — technical and serious.', sortOrder: 8 }),

    // Popular End
    tradRoute('Right Unconquerable', 'VS', '4c', stanPop, { height: 15, description: 'THE Stanage VS — a magnificent crack with layback, jam and bridge sections. Every gritstone climber\'s tick.', sortOrder: 1 }),
    tradRoute('Left Unconquerable', 'HVS', '5a', stanPop, { height: 15, description: 'The harder of the pair — sustained finger and fist jamming. Equally classic.', sortOrder: 2 }),
    tradRoute('Kelly\'s Eliminate', 'VS', '4c', stanPop, { height: 14, description: 'Takes the wall between the Unconquerables. A fine VS eliminate.', sortOrder: 3 }),
    tradRoute('Cave Crack', 'VD', '3b', stanPop, { height: 12, description: 'An earthy crack into Robin Hood\'s Cave. The first choice for beginners at Popular End.', sortOrder: 4 }),
    tradRoute('Cave Crack Right', 'VS', '4c', stanPop, { height: 12, description: 'Right-hand exit from the cave — more technical than the standard route.', sortOrder: 5 }),
    tradRoute('Long Slab', 'S', '3c', stanPop, { height: 14, description: 'A long, low-angled slab giving friction climbing in perfect gritstone style.', sortOrder: 6 }),
    tradRoute('Tower Crack', 'VS', '4c', stanPop, { height: 16, description: 'Excellent crack at the tower section — well-protected and satisfying.', sortOrder: 7 }),
    tradRoute('Rusty Wall', 'VS', '4c', stanPop, { height: 12, description: 'Technical wall moves right of Tower Crack. A fine eliminate.', sortOrder: 8 }),
    tradRoute('Tower Face', 'HVS', '5a', stanPop, { height: 16, description: 'Open face climbing with one bold move. Spectacular.', sortOrder: 9 }),
    tradRoute('Martello Tower', 'VS', '4c', stanPop, { height: 14, description: 'Excellent crack and wall at the tower feature.', sortOrder: 10 }),
    tradRoute('The Dangler', 'HVS', '5a', stanPop, { height: 15, description: 'An intimidating route with a memorable crux. Very popular.', sortOrder: 11 }),
    tradRoute('Green Gut', 'HVS', '5a', stanPop, { height: 13, description: 'Wide crack and groove — unusual gritstone climbing.', sortOrder: 12 }),
    tradRoute('Wall End Slab', 'M', '3a', stanPop, { height: 8, description: 'The easiest route at Popular End — gentle slab, popular with beginners.', sortOrder: 13 }),
    tradRoute('Wall End Crack', 'VS', '4c', stanPop, { height: 10, description: 'Direct crack line up the end wall.', sortOrder: 14 }),

    // Count's Buttress Area
    tradRoute("Count's Buttress", 'S', '3c', stanCB, { height: 12, description: 'The classic route on Count\'s Buttress — fine sustained climbing.', sortOrder: 1 }),
    tradRoute("Count's Arête", 'VS', '4c', stanCB, { height: 12, description: 'The arête right of Count\'s Buttress. Technical and elegant.', sortOrder: 2 }),
    tradRoute('Easter Rib', 'HS', '4b', stanCB, { height: 14, description: 'A beautiful slabby rib — excellent Easter climbing.', sortOrder: 3 }),
    tradRoute('Holloway\'s Route', 'VD', '3c', stanCB, { height: 14, description: 'An early classic at this end of the edge. Fine open climbing.', sortOrder: 4 }),
    tradRoute('Mississippi Buttress', 'E1', '5b', stanCB, { height: 15, description: 'Bold face climbing on the buttress left of Count\'s. A serious outing.', sortOrder: 5 }),
    tradRoute('Wall Climb', 'HS', '4b', stanCB, { height: 11, description: 'Straightforward wall climbing on good gritstone.', sortOrder: 6 }),

    // Marble Wall Area
    tradRoute('Alcasan', 'E3', '5c', stanMW, { height: 14, description: 'One of Stanage\'s best E3s — a fine line on the Marble Wall.', sortOrder: 1 }),
    tradRoute('Eucalyptus', 'HVS', '5a', stanMW, { height: 14, description: 'A route of great character on the Marble Wall sector.', sortOrder: 2 }),
    tradRoute('Marble Wall', 'VS', '4c', stanMW, { height: 12, description: 'The original route on this wall — varied and interesting.', sortOrder: 3 }),

    // Stanage Bannister Buttress
    tradRoute('Stanage Bannister', 'E3', '6a', stanSB, { height: 18, description: 'The magnificent crack system right of Quietus — sustained jamming and face moves. One of Stanage\'s great test pieces.', sortOrder: 1 }),
    tradRoute('Ouroboros', 'E3', '6a', stanSB, { height: 15, description: 'Fine face climbing with a hard crux.', sortOrder: 2 }),
    tradRoute('Three Pebble Slab', 'VD', '3b', stanSB, { height: 8, description: 'Delicate friction slab climbing on perfect gritstone.', sortOrder: 3 }),
    tradRoute('Anniversary Groove', 'HS', '4b', stanSB, { height: 12, description: 'Pleasant groove climbing — a popular middle-grade outing.', sortOrder: 4 }),
    tradRoute('Sleek Wall', 'HVS', '5a', stanSB, { height: 13, description: 'Smooth wall climbing with good friction — a Stanage gem.', sortOrder: 5 }),
  ]);

  // ── Millstone Edge (expanded) ─────────────────────────────────────────────
  const mill = await upsertCrag(cragRepo, {
    name: 'Millstone Edge', region: peak, regionId: peak.id,
    latitude: 53.3145, longitude: -1.6235, rockType: RockType.GRITSTONE,
    description: 'Sheer gritstone quarry wall giving long, sustained technical routes from E1 to E7. London Wall, Master\'s Edge and Great West Road are all-time UK classics.',
    approach: 'Park at Surprise View car park (SK 2498 8024). 10 min walk north.',
    parkingInfo: 'Surprise View car park on A6187 (pay & display, Peak District).',
  });
  const millMain  = await upsertButtress(buttRepo, { name: 'Main Wall', crag: mill, cragId: mill.id, sortOrder: 1 });
  const millRight = await upsertButtress(buttRepo, { name: 'Right Wall', crag: mill, cragId: mill.id, sortOrder: 2 });
  await routeRepo.save([
    tradRoute('Great West Road', 'E3', '5c', millMain, { height: 22, description: 'One of the longest routes on gritstone — a sustained girdle of the main wall.', sortOrder: 1 }),
    tradRoute('London Wall', 'E5', '6b', millMain, { height: 22, description: 'Ron Fawcett\'s masterpiece. Long, strenuous and technical — one of Britain\'s great routes.', sortOrder: 2 }),
    tradRoute('Edge Lane', 'E3', '5c', millMain, { height: 20, description: 'A stunning route up the left edge of the main wall — very sustained.', sortOrder: 3 }),
    tradRoute('Regent Street', 'E1', '5b', millMain, { height: 18, description: 'Fine crack and wall — one of the best E1s in the Peak District.', sortOrder: 4 }),
    tradRoute('Technical Master', 'E5', '6b', millMain, { height: 20, description: 'Desperate finger-tip climbing up the main wall.', sortOrder: 5 }),
    tradRoute('Master\'s Edge', 'E7', '6c', millRight, { height: 20, description: 'John Allen\'s landmark route — one of the most intimidating lines on gritstone.', sortOrder: 1 }),
    tradRoute('Embankment Route 1', 'HS', '4b', millRight, { height: 14, description: 'The easiest classic on Millstone — a pleasant groove.', sortOrder: 2 }),
    tradRoute('Embankment Route 2', 'VS', '4c', millRight, { height: 16, description: 'Harder version taking the wall to the right.', sortOrder: 3 }),
    tradRoute('Embankment Route 4', 'E1', '5b', millRight, { height: 18, description: 'Sustained wall climbing — the crux is high.', sortOrder: 4 }),
    tradRoute('Keystone Crack', 'HS', '4b', millRight, { height: 12, description: 'Classic vertical crack — well protected.', sortOrder: 5 }),
    tradRoute('Green Death', 'E5', '6b', millRight, { height: 20, description: 'An infamous route — bold and technical. The name says it all.', sortOrder: 6 }),
    tradRoute('Midnight Lightning', 'E4', '6a', millRight, { height: 18, description: 'Powerful face climbing on the right side of Millstone.', sortOrder: 7 }),
  ]);

  // ── Froggatt Edge (expanded) ──────────────────────────────────────────────
  const frogg = await upsertCrag(cragRepo, {
    name: 'Froggatt Edge', region: peak, regionId: peak.id,
    latitude: 53.2960, longitude: -1.6255, rockType: RockType.GRITSTONE,
    description: 'Perfect gritstone slabs, walls and cracks. Home to Valkyrie, one of Britain\'s most celebrated VSs, and a host of hard test pieces on immaculate rock.',
    approach: 'Park at Hay Wood car park (SK 2530 7680). 10 min walk up through the wood.',
    parkingInfo: 'Hay Wood car park on B6054 (National Trust, pay & display).',
  });
  const froggMain = await upsertButtress(buttRepo, { name: 'Main Buttress', crag: frogg, cragId: frogg.id, sortOrder: 1 });
  const froggSlab = await upsertButtress(buttRepo, { name: 'Slab Area', crag: frogg, cragId: frogg.id, sortOrder: 2 });
  const froggRight = await upsertButtress(buttRepo, { name: 'Right Buttress', crag: frogg, cragId: frogg.id, sortOrder: 3 });
  await routeRepo.save([
    tradRoute('Valkyrie', 'VS', '4c', froggMain, { height: 18, description: 'The Froggatt classic — a long, varied route with a memorable roof section. One of the finest VSs in Britain.', sortOrder: 1 }),
    tradRoute('Strapadictomy', 'E1', '5b', froggMain, { height: 16, description: 'Magnificent sustained crack — strenuous and technical.', sortOrder: 2 }),
    tradRoute('Tody\'s Wall', 'E3', '6a', froggMain, { height: 14, description: 'Serious face climbing on the main wall — one of Froggatt\'s hardest classics.', sortOrder: 3 }),
    tradRoute('Downhill Racer', 'E2', '5c', froggMain, { height: 16, description: 'Bold slab climbing — a committing lead.', sortOrder: 4 }),
    tradRoute('Great Slab', 'S', '4a', froggSlab, { height: 14, description: 'The classic easy slab route on Froggatt — superb friction climbing.', sortOrder: 1 }),
    tradRoute('Chequers Crack', 'VS', '4c', froggSlab, { height: 14, description: 'Fine crack climbing on the slab area — popular and well-protected.', sortOrder: 2 }),
    tradRoute('Chequers Buttress', 'HVS', '5a', froggSlab, { height: 14, description: 'Technical wall moves between the crack lines.', sortOrder: 3 }),
    tradRoute('Oedipus', 'E4', '6a', froggSlab, { height: 12, description: 'One of the hardest routes on the slab — a delicate and serious face climb.', sortOrder: 4 }),
    tradRoute('Sunset Slab', 'VS', '4b', froggSlab, { height: 12, description: 'Angled slab with friction crux — best in evening light.', sortOrder: 5 }),
    tradRoute('Diabolo', 'E2', '5c', froggRight, { height: 16, description: 'Technical face climbing — strenuous and sustained.', sortOrder: 1 }),
    tradRoute('Brown\'s Eliminate', 'E3', '5c', froggRight, { height: 18, description: 'Long, serious wall climbing — a real test piece.', sortOrder: 2 }),
    tradRoute('Ginger Cake', 'E1', '5b', froggRight, { height: 14, description: 'Excellent wall climbing on the right side of Froggatt.', sortOrder: 3 }),
    tradRoute('Long John\'s Slab', 'VD', '3c', froggRight, { height: 12, description: 'Easy slab with good holds — a popular intro route.', sortOrder: 4 }),
    tradRoute('Heather Wall', 'HS', '4b', froggRight, { height: 13, description: 'Sustained wall above the heather ledge.', sortOrder: 5 }),
  ]);

  // ── Higgar Tor (expanded) ─────────────────────────────────────────────────
  const higgar = await upsertCrag(cragRepo, {
    name: 'Higgar Tor', region: peak, regionId: peak.id,
    latitude: 53.3370, longitude: -1.6415, rockType: RockType.GRITSTONE,
    description: 'A compact moorland tor above Hathersage. Classic short routes from VS to E5, and some of the best bouldering in the Peak District.',
    approach: '10 min walk from the Dennis Knoll car park or Carl Wark.',
    parkingInfo: 'Dennis Knoll car park (free) or Toad\'s Mouth lay-by.',
  });
  const higgarMain = await upsertButtress(buttRepo, { name: 'Main Buttress', crag: higgar, cragId: higgar.id, sortOrder: 1 });
  await routeRepo.save([
    tradRoute('The Rasp', 'HVS', '5b', higgarMain, { height: 10, description: 'The classic HVS on Higgar — a fine jamming crack on superb rock.', sortOrder: 1 }),
    tradRoute('Mississippi Buttress', 'E1', '5b', higgarMain, { height: 12, description: 'Brilliant exposed arête — very popular.', sortOrder: 2 }),
    tradRoute('Mississippi Buttress Direct', 'E2', '5c', higgarMain, { height: 12, description: 'The harder direct start — serious and bold.', sortOrder: 3 }),
    tradRoute('Rasp Direct', 'E3', '6a', higgarMain, { height: 10, description: 'Hard finger-crack — a Higgar test piece.', sortOrder: 4 }),
    tradRoute('Leaning Block Crack', 'VS', '4c', higgarMain, { height: 8, description: 'Classic short crack on the leaning block.', sortOrder: 5 }),
    tradRoute('Marble Arch', 'VS', '4c', higgarMain, { height: 9, description: 'The arching crack line on the main face.', sortOrder: 6 }),
    tradRoute('Higgar Tor Eliminate', 'E4', '6a', higgarMain, { height: 11, description: 'Serious eliminate between the crack lines.', sortOrder: 7 }),
  ]);

  // ── Gardoms Edge (expanded) ───────────────────────────────────────────────
  const gardom = await upsertCrag(cragRepo, {
    name: 'Gardoms Edge', region: peak, regionId: peak.id,
    latitude: 53.2675, longitude: -1.6095, rockType: RockType.GRITSTONE,
    description: 'A long, low gritstone edge with many quality routes. Less visited than other Peak edges, giving a quieter experience.',
    approach: 'Park at Gardom\'s Edge car park on Bar Road (SK 2730 7350). 5 min walk.',
    parkingInfo: 'Small National Trust car park on Bar Road, Baslow.',
  });
  const gardomMain = await upsertButtress(buttRepo, { name: 'Main Crag', crag: gardom, cragId: gardom.id, sortOrder: 1 });
  await routeRepo.save([
    tradRoute('Gargoyle', 'HVS', '5a', gardomMain, { height: 12, description: 'The best route on Gardoms — a superb wall and crack combination.', sortOrder: 1 }),
    tradRoute('Broken Groove', 'VS', '4c', gardomMain, { height: 10, description: 'Varied climbing up the groove line.', sortOrder: 2 }),
    tradRoute('Easy Angled Slab', 'S', '3c', gardomMain, { height: 8, description: 'Gentle friction slab — a beginner\'s classic.', sortOrder: 3 }),
    tradRoute('Bird\'s Nest Crack', 'HVS', '5a', gardomMain, { height: 10, description: 'Fine jamming crack — one of Gardoms\' best.', sortOrder: 4 }),
    tradRoute('The Flake', 'VS', '4c', gardomMain, { height: 11, description: 'Flake crack giving excellent layback and jams.', sortOrder: 5 }),
  ]);
}
