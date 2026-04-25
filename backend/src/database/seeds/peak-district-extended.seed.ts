import { DataSource } from 'typeorm';
import { Region } from '../../modules/crags/entities/region.entity';
import { Crag, RockType } from '../../modules/crags/entities/crag.entity';
import { Buttress } from '../../modules/crags/entities/buttress.entity';
import { Route } from '../../modules/routes/entities/route.entity';
import {
  findOrCreateRegion, upsertCrag, upsertButtress, upsertRoute, tradRoute, sportRoute,
} from './seed-helpers';

export async function seedPeakDistrictExtended(ds: DataSource) {
  const regionRepo = ds.getRepository(Region);
  const cragRepo   = ds.getRepository(Crag);
  const buttRepo   = ds.getRepository(Buttress);
  const routeRepo  = ds.getRepository(Route);

  const peak = await findOrCreateRegion(regionRepo, {
    name: 'Peak District', country: 'UK',
    description: 'The Peak District — UK climbing heartland. Gritstone edges and limestone dales.',
  });

  // ── Curbar Edge ──────────────────────────────────────────────────────────
  const curbar = await upsertCrag(cragRepo, {
    name: 'Curbar Edge', region: peak, regionId: peak.id,
    latitude: 53.2871, longitude: -1.6133, rockType: RockType.GRITSTONE,
    description: 'Immaculate gritstone edge above the Derwent Valley. Home to some of the best problems at every grade, from slabs to cracks to power moves.',
    approach: 'Park at Curbar Gap (SK 2621 7485). 10 min walk south along the edge.',
    parkingInfo: 'Curbar Gap car park, Baslow Road (pay & display). Limited roadside on Bar Road.',
  });
  const curbarMain = await upsertButtress(buttRepo, { name: 'Main Buttress', crag: curbar, cragId: curbar.id, sortOrder: 1 });
  const curbarPow  = await upsertButtress(buttRepo, { name: 'Power Buttress', crag: curbar, cragId: curbar.id, sortOrder: 2 });
  await routeRepo.save([
    tradRoute('The Peapod', 'VS',  '4c', curbarMain, { height: 14, description: 'Classic VS — a perfect hand-and-fist crack splitting a smooth arête.', sortOrder: 1 }),
    tradRoute('Profit of Doom', 'E3', '5c', curbarMain, { height: 15, description: 'One of the most photogenic routes on gritstone — a flying arête with a bold crux.', sortOrder: 2 }),
    tradRoute('The File', 'E1', '5b', curbarMain, { height: 16, description: 'Superb thin crack on perfect Curbar gritstone.', sortOrder: 3 }),
    tradRoute('Hairless Heart', 'E5', '6b', curbarPow, { height: 12, description: 'Desperate finger crack in a hanging groove.', sortOrder: 1 }),
    tradRoute('Elder Crack', 'E4', '6a', curbarPow, { height: 14, description: 'A stamina test on tiny edges — one of the Peak\'s great test pieces.', sortOrder: 2 }),
    tradRoute('Not to Be Taken Away', 'E8', '6c', curbarPow, { height: 14, description: 'John Allen\'s terrifying wall. One of the first E8s in Britain.', sortOrder: 3 }),
  ]);

  // ── Baslow Edge ───────────────────────────────────────────────────────────
  const baslow = await upsertCrag(cragRepo, {
    name: 'Baslow Edge', region: peak, regionId: peak.id,
    latitude: 53.2743, longitude: -1.6178, rockType: RockType.GRITSTONE,
    description: 'Compact gritstone edge overlooking Chatsworth. Excellent friction slabs and walls. Wellington\'s Monument stands nearby.',
    approach: '10 min walk from Baslow village. Cross the road bridge and follow the path NW.',
    parkingInfo: 'Lay-by on A619 near Calver crossroads, or Curbar Gap.',
  });
  const baslowMain = await upsertButtress(buttRepo, { name: 'Main Face', crag: baslow, cragId: baslow.id, sortOrder: 1 });
  await routeRepo.save([
    tradRoute('Valerian', 'S',   '4a', baslowMain, { height: 10, description: 'Classic easy route on perfect gritstone.', sortOrder: 1 }),
    tradRoute('Ariel', 'VS',  '4c', baslowMain, { height: 12, description: 'Elegant wall climbing on impeccable rock.', sortOrder: 2 }),
    tradRoute('Blurter', 'E2', '5c', baslowMain, { height: 12, description: 'Technical wall-and-mantelshelf sequence.', sortOrder: 3 }),
    tradRoute('Wellington Crack', 'HS', '4b', baslowMain, { height: 10, description: 'Good protection in a fine crack line.', sortOrder: 4 }),
  ]);

  // ── Burbage North ─────────────────────────────────────────────────────────
  const burbageNorth = await upsertCrag(cragRepo, {
    name: 'Burbage North', region: peak, regionId: peak.id,
    latitude: 53.3403, longitude: -1.6572, rockType: RockType.GRITSTONE,
    description: 'Long, moorland gritstone edge — exposed and characterful. Excellent for all grades, particularly VS–E2. One of the most accessible Peakcrags.',
    approach: '5 min walk from Ringinglow Road lay-by (SK 2605 8233). Head north along the escarpment.',
    parkingInfo: 'Roadside lay-by on Ringinglow Road (free).',
  });
  const burbNMain = await upsertButtress(buttRepo, { name: 'Main Edge', crag: burbageNorth, cragId: burbageNorth.id, sortOrder: 1 });
  const burbNSouth = await upsertButtress(buttRepo, { name: 'South Buttress', crag: burbageNorth, cragId: burbageNorth.id, sortOrder: 2 });
  await routeRepo.save([
    tradRoute('Long Causeway Crack', 'HS', '4b', burbNMain, { height: 9, description: 'Classic hand crack — well protected and satisfying.', sortOrder: 1 }),
    tradRoute('Ash Tree Wall', 'E1', '5b', burbNMain, { height: 11, description: 'Bold slab climb past a single small tree.', sortOrder: 2 }),
    tradRoute('Calvary', 'E2', '5c', burbNMain, { height: 12, description: 'Thin wall climbing with a desperate crux.', sortOrder: 3 }),
    tradRoute('Ulysses', 'E2', '5c', burbNSouth, { height: 14, description: 'Long sustained wall, fine positions.', sortOrder: 1 }),
    tradRoute('Twisting Crack', 'VS', '4c', burbNSouth, { height: 10, description: 'Perfect hand-crack — one of the best VSs on the edge.', sortOrder: 2 }),
  ]);

  // ── Burbage South ─────────────────────────────────────────────────────────
  const burbageSouth = await upsertCrag(cragRepo, {
    name: 'Burbage South', region: peak, regionId: peak.id,
    latitude: 53.3327, longitude: -1.6535, rockType: RockType.GRITSTONE,
    description: 'South face of the Burbage Valley. Excellent bouldering at the base and fine routes on the upper walls.',
    approach: 'From Ringinglow Road, descend into Burbage Valley, 15 min walk.',
    parkingInfo: 'Ox Stones car park or Ringinglow Road lay-bys.',
  });
  const burbSMain = await upsertButtress(buttRepo, { name: 'Main Wall', crag: burbageSouth, cragId: burbageSouth.id, sortOrder: 1 });
  await routeRepo.save([
    tradRoute('Lean Man\'s Slab', 'HS', '4b', burbSMain, { height: 10, sortOrder: 1 }),
    tradRoute('Wailing Wall', 'E3', '5c', burbSMain, { height: 12, description: 'Desperate sequence on rounded holds — a gritstone classic.', sortOrder: 2 }),
    tradRoute('Goliath', 'VS', '4c', burbSMain, { height: 11, sortOrder: 3 }),
    tradRoute('Central Route', 'VD', '3c', burbSMain, { height: 9, sortOrder: 4 }),
  ]);

  // ── Millstone Edge ────────────────────────────────────────────────────────
  const millstone = await upsertCrag(cragRepo, {
    name: 'Millstone Edge', region: peak, regionId: peak.id,
    latitude: 53.3386, longitude: -1.6246, rockType: RockType.GRITSTONE,
    description: 'Imposing quarried gritstone edge above Hathersage. Home to some of the most famous hard routes in Britain including London Wall and Master\'s Wall.',
    approach: 'Follow the path NW from the lay-by on A6187 near Surprise View (SK 2517 8015). 10 min.',
    parkingInfo: 'Lay-by at Surprise View on A6187 (free).',
  });
  const millMain = await upsertButtress(buttRepo, { name: 'Main Wall', crag: millstone, cragId: millstone.id, sortOrder: 1 });
  const millEdge = await upsertButtress(buttRepo, { name: 'Edge Buttress', crag: millstone, cragId: millstone.id, sortOrder: 2 });
  await routeRepo.save([
    tradRoute('Great North Road', 'HVS', '5a', millMain, { height: 24, description: 'The classic Millstone HVS — a superb crack line up the main face.', sortOrder: 1 }),
    tradRoute('London Wall', 'E5', '6a', millMain, { height: 24, description: 'Pete Livesey\'s legendary finger-layaway — one of the first E5s in Britain.', sortOrder: 2 }),
    tradRoute('Master\'s Wall', 'E7', '6c', millMain, { height: 24, description: 'Johnny Dawes\' masterpiece. Britain\'s first E7 — bold technical climbing on Millstone\'s finest wall.', sortOrder: 3 }),
    tradRoute('Green Death', 'E2', '5c', millEdge, { height: 18, description: 'Fierce finger crack — not as horrific as the name suggests.', sortOrder: 1 }),
    tradRoute('Embankment 4', 'VS', '4c', millEdge, { height: 15, description: 'The easiest classic on the crag — a fine corner crack.', sortOrder: 2 }),
  ]);

  // ── Bamford Edge ──────────────────────────────────────────────────────────
  const bamford = await upsertCrag(cragRepo, {
    name: 'Bamford Edge', region: peak, regionId: peak.id,
    latitude: 53.3556, longitude: -1.6840, rockType: RockType.GRITSTONE,
    description: 'A fine gritstone edge above the Ladybower Reservoir with a broad range of easy to mid-grade routes. Brilliant views.',
    approach: '15 min walk from Bamford village. Head NW past the school.',
    parkingInfo: 'Roadside in Bamford village (free). Limited pull-off near the crag start.',
  });
  const bamMain = await upsertButtress(buttRepo, { name: 'Main Buttress', crag: bamford, cragId: bamford.id, sortOrder: 1 });
  await routeRepo.save([
    tradRoute('Bamford Crack', 'VD', '3b', bamMain, { height: 8, description: 'Enjoyable easy crack — a great introduction.', sortOrder: 1 }),
    tradRoute('Broken Crack', 'S', '4a', bamMain, { height: 10, sortOrder: 2 }),
    tradRoute('Slab and Crack', 'HS', '4b', bamMain, { height: 10, description: 'Clean gritstone slab leading to a well-protected crack.', sortOrder: 3 }),
    tradRoute('Reservoir Wall', 'VS', '4c', bamMain, { height: 12, sortOrder: 4 }),
  ]);

  // ── Higgar Tor ────────────────────────────────────────────────────────────
  const higgar = await upsertCrag(cragRepo, {
    name: 'Higgar Tor', region: peak, regionId: peak.id,
    latitude: 53.3539, longitude: -1.6609, rockType: RockType.GRITSTONE,
    description: 'Dramatic tor above the Burbage moor. The Rasp is one of the most celebrated HVS routes in the Peak. Wild and atmospheric setting.',
    approach: 'Short walk from Ringinglow Road. Cross the moor NE from Burbage South car parks.',
    parkingInfo: 'Roadside on Ringinglow Road or Burbage South car parks (free).',
  });
  const higgarMain = await upsertButtress(buttRepo, { name: 'Main Tor', crag: higgar, cragId: higgar.id, sortOrder: 1 });
  await routeRepo.save([
    tradRoute('The Rasp', 'HVS', '5a', higgarMain, { height: 12, description: 'The classic of Higgar — a superb rasping crack with a strenuous crux.', sortOrder: 1 }),
    tradRoute('Leaning Buttress Direct', 'VS', '4c', higgarMain, { height: 10, description: 'Excellent climbing up the leaning west face.', sortOrder: 2 }),
    tradRoute('Cracked Arête', 'E1', '5b', higgarMain, { height: 11, sortOrder: 3 }),
    tradRoute('Doorstep', 'D', '3a', higgarMain, { height: 6, description: 'Simple scramble to the summit. Good for beginners.', sortOrder: 4 }),
  ]);

  // ── Carl Wark ─────────────────────────────────────────────────────────────
  const carlWark = await upsertCrag(cragRepo, {
    name: 'Carl Wark', region: peak, regionId: peak.id,
    latitude: 53.3513, longitude: -1.6568, rockType: RockType.GRITSTONE,
    description: 'An iron age fort on a gritstone promontory. The faces give a variety of routes in a unique archaeological setting.',
    approach: '5 min walk from Burbage South. Cross the stream and ascend the promontory.',
    parkingInfo: 'Ringinglow Road lay-bys or Burbage car parks.',
  });
  const carlMain = await upsertButtress(buttRepo, { name: 'South Face', crag: carlWark, cragId: carlWark.id, sortOrder: 1 });
  await routeRepo.save([
    tradRoute('South Face Original', 'VD', '3c', carlMain, { height: 8, sortOrder: 1 }),
    tradRoute('Fort Wall', 'HS', '4b', carlMain, { height: 9, description: 'The best mid-grade line on the crag.', sortOrder: 2 }),
    tradRoute('Fortress', 'E1', '5b', carlMain, { height: 10, sortOrder: 3 }),
  ]);

  // ── Gardoms Edge ──────────────────────────────────────────────────────────
  const gardoms = await upsertCrag(cragRepo, {
    name: 'Gardoms Edge', region: peak, regionId: peak.id,
    latitude: 53.2804, longitude: -1.6094, rockType: RockType.GRITSTONE,
    description: 'A gritstone edge less visited than Curbar or Froggatt but with excellent routes across all grades. Good selection of trad climbing.',
    approach: 'Park near the Birchen car park (SK 2825 7257). Walk 15 min N along the edge.',
    parkingInfo: 'Birchen Edge car park (pay & display, National Trust).',
  });
  const gardMain = await upsertButtress(buttRepo, { name: 'Main Edge', crag: gardoms, cragId: gardoms.id, sortOrder: 1 });
  await routeRepo.save([
    tradRoute('Topsail', 'VS', '4c', gardMain, { height: 12, description: 'Classic VS — technical wall with some hidden holds.', sortOrder: 1 }),
    tradRoute('Greek Street', 'E2', '5c', gardMain, { height: 13, description: 'Tenuous and sustained. One of Gardoms\' best harder routes.', sortOrder: 2 }),
    tradRoute('Mortal Coil', 'E1', '5b', gardMain, { height: 12, sortOrder: 3 }),
    tradRoute('Plinth Route', 'HS', '4b', gardMain, { height: 10, sortOrder: 4 }),
  ]);

  // ── Black Rocks, Cromford ─────────────────────────────────────────────────
  const blackRocks = await upsertCrag(cragRepo, {
    name: 'Black Rocks, Cromford', region: peak, regionId: peak.id,
    latitude: 53.0836, longitude: -1.5501, rockType: RockType.GRITSTONE,
    description: 'A distinctive gritstone outcrop on the edge of Matlock. The Promontory offers excellent friction climbing; celebrated for its bold VSs.',
    approach: 'Park at Black Rocks car park (SK 2960 5583). 5 min walk to the rocks.',
    parkingInfo: 'Black Rocks Derbyshire County Council car park (pay & display).',
  });
  const blackMain = await upsertButtress(buttRepo, { name: 'Promontory', crag: blackRocks, cragId: blackRocks.id, sortOrder: 1 });
  const blackNorth = await upsertButtress(buttRepo, { name: 'North Buttress', crag: blackRocks, cragId: blackRocks.id, sortOrder: 2 });
  await routeRepo.save([
    tradRoute('Black Rocks Ordinary Route', 'VD', '3c', blackMain, { height: 9, description: 'The introductory classic — a great way to get your eye in.', sortOrder: 1 }),
    tradRoute('Lean Man\'s Climb', 'VS', '4c', blackMain, { height: 10, description: 'Technical balance moves and friction — typical Black Rocks.', sortOrder: 2 }),
    tradRoute('Promontory Wall', 'E1', '5b', blackMain, { height: 11, description: 'Bold friction slab to a fine finish.', sortOrder: 3 }),
    tradRoute('The Rippler', 'HVS', '5a', blackNorth, { height: 10, sortOrder: 1 }),
    tradRoute('Millrace Wall', 'E2', '5b', blackNorth, { height: 11, sortOrder: 2 }),
  ]);

  // ── The Roches ────────────────────────────────────────────────────────────
  const roches = await upsertCrag(cragRepo, {
    name: 'The Roches', region: peak, regionId: peak.id,
    latitude: 53.1444, longitude: -2.0001, rockType: RockType.GRITSTONE,
    description: 'A long gritstone edge in the Staffordshire Moorlands. Sloth is one of the most famous gritstone traverses. The Roches gives climbing with real character.',
    approach: 'Park in the Upper Hulme lay-by (SJ 0050 6224). 15 min walk up to the crag.',
    parkingInfo: 'Upper Hulme lay-by (free) or Roches Estate car park.',
  });
  const rochesMain = await upsertButtress(buttRepo, { name: 'Lower Tier', crag: roches, cragId: roches.id, sortOrder: 1 });
  const rochesUpper = await upsertButtress(buttRepo, { name: 'Upper Tier', crag: roches, cragId: roches.id, sortOrder: 2 });
  await routeRepo.save([
    tradRoute('Right Angle Gully', 'D', '3a', rochesMain, { height: 9, description: 'Enjoyable corner crack — good for beginners.', sortOrder: 1 }),
    tradRoute('Bachelor\'s Left Hand', 'VD', '3c', rochesMain, { height: 10, sortOrder: 2 }),
    tradRoute('Sloth', 'HVS', '5b', rochesMain, { height: 12, description: 'The famous Roches traverse — a hanging sloth-like crack system over the roof. Spectacular.', sortOrder: 3 }),
    tradRoute('Technical Slab', 'E1', '5b', rochesUpper, { height: 10, description: 'Friction test on the upper face.', sortOrder: 1 }),
    tradRoute('Debauchery', 'E3', '5c', rochesUpper, { height: 12, description: 'Strenuous crack at the right end of the upper tier.', sortOrder: 2 }),
  ]);

  // ── Hen Cloud ─────────────────────────────────────────────────────────────
  const henCloud = await upsertCrag(cragRepo, {
    name: 'Hen Cloud', region: peak, regionId: peak.id,
    latitude: 53.1327, longitude: -2.0023, rockType: RockType.GRITSTONE,
    description: 'Impressive prow of gritstone standing above the Staffordshire plains. Excellent routes on the N and W faces. Views to the West are superb.',
    approach: 'From Upper Hulme, follow the bridleway S past Hen Cloud farm. 15 min.',
    parkingInfo: 'Upper Hulme lay-by (free) or near the farm track.',
  });
  const henMain = await upsertButtress(buttRepo, { name: 'West Face', crag: henCloud, cragId: henCloud.id, sortOrder: 1 });
  const henNorth = await upsertButtress(buttRepo, { name: 'North Face', crag: henCloud, cragId: henCloud.id, sortOrder: 2 });
  await routeRepo.save([
    tradRoute('Lower Girdle', 'S', '4a', henMain, { height: 10, description: 'An enjoyable low traverse of the west face.', sortOrder: 1 }),
    tradRoute('North Wall Direct', 'VS', '4c', henMain, { height: 14, description: 'The classic VS of Hen Cloud — sustained crack up the N face.', sortOrder: 2 }),
    tradRoute('Saul\'s Crack', 'HVS', '5a', henNorth, { height: 15, description: 'One of the best HVS cracks in the Roches area.', sortOrder: 1 }),
    tradRoute('Overhanging Bastion', 'E2', '5b', henNorth, { height: 14, sortOrder: 2 }),
  ]);

  // ── Windgather Rocks ──────────────────────────────────────────────────────
  const windgather = await upsertCrag(cragRepo, {
    name: 'Windgather Rocks', region: peak, regionId: peak.id,
    latitude: 53.2508, longitude: -2.0076, rockType: RockType.GRITSTONE,
    description: 'A popular training crag on the W fringe of the Peak. Excellent short routes in the lower grades — perfect for groups and beginners.',
    approach: 'Park at the small parking area off Pym Chair road (SJ 9956 7788). 5 min walk.',
    parkingInfo: 'Roadside near crag (free, limited spaces).',
  });
  const windMain = await upsertButtress(buttRepo, { name: 'Main Rocks', crag: windgather, cragId: windgather.id, sortOrder: 1 });
  await routeRepo.save([
    tradRoute('First Pinnacle Rib', 'D', '3a', windMain, { height: 6, sortOrder: 1 }),
    tradRoute('Second Pinnacle Crack', 'S', '4a', windMain, { height: 7, sortOrder: 2 }),
    tradRoute('Windgather Crack', 'VS', '4c', windMain, { height: 8, description: 'The best route on the crag — finger crack on excellent gritstone.', sortOrder: 3 }),
    tradRoute('West End', 'HS', '4b', windMain, { height: 7, sortOrder: 4 }),
    tradRoute('Central Route', 'VD', '3c', windMain, { height: 7, sortOrder: 5 }),
  ]);

  // ── Stoney Middleton ──────────────────────────────────────────────────────
  const stoney = await upsertCrag(cragRepo, {
    name: 'Stoney Middleton', region: peak, regionId: peak.id,
    latitude: 53.2667, longitude: -1.6341, rockType: RockType.LIMESTONE,
    description: 'A compact roadside limestone dale famous for classics at all grades. UK sport climbing played a major role here. Windhover and Our Father are all-time classics.',
    approach: 'Park in Stoney Middleton village. The crag is visible from the road (SK 2299 7541).',
    parkingInfo: 'Roadside in Stoney Middleton (free, limited).',
  });
  const stoneyMain = await upsertButtress(buttRepo, { name: 'Main Face', crag: stoney, cragId: stoney.id, sortOrder: 1 });
  const stoneyRoofs = await upsertButtress(buttRepo, { name: 'Windhover Wall', crag: stoney, cragId: stoney.id, sortOrder: 2 });
  await routeRepo.save([
    tradRoute('Scoop Wall', 'VS', '4c', stoneyMain, { height: 18, description: 'Superb positional climbing up the central scoop.', sortOrder: 1 }),
    tradRoute('Windhover', 'E2', '5b', stoneyMain, { height: 20, description: 'Justly famous — sustained bridging and laybacking above the dale.', sortOrder: 2 }),
    tradRoute('Our Father', 'E4', '6a', stoneyMain, { height: 18, description: 'Serious and sustained — the defining test piece of Stoney.', sortOrder: 3 }),
    { ...sportRoute('Frantic', '6c', stoneyRoofs, { height: 16, description: 'Technical crimping on good limestone.', sortOrder: 1 }) },
    { ...sportRoute('Moon Walk', '7a', stoneyRoofs, { height: 16, sortOrder: 2 }) },
  ]);

  // ── Cheedale / The Cornice ─────────────────────────────────────────────────
  const cheedale = await upsertCrag(cragRepo, {
    name: 'Cheedale', region: peak, regionId: peak.id,
    latitude: 53.1966, longitude: -1.7724, rockType: RockType.LIMESTONE,
    description: 'A beautiful limestone dale with both trad and sport routes. The Cornice gives some of the most sustained hard sport routes in the Peak.',
    approach: 'Park at Miller\'s Dale station (SK 1385 7323). Walk along the disused railway line 1km W.',
    parkingInfo: 'Miller\'s Dale Monsal Trail car park (pay & display).',
  });
  const cheecornice = await upsertButtress(buttRepo, { name: 'The Cornice', crag: cheedale, cragId: cheedale.id, sortOrder: 1 });
  const cheeDale = await upsertButtress(buttRepo, { name: 'Plum Buttress', crag: cheedale, cragId: cheedale.id, sortOrder: 2 });
  await routeRepo.save([
    tradRoute('The Cornice', 'HVS', '5a', cheecornice, { height: 18, description: 'The classic easy route — fine positions on good limestone.', sortOrder: 1 }),
    tradRoute('Mortlock\'s Arête', 'E3', '6a', cheecornice, { height: 18, description: 'One of the finest routes in the dale — technical arête above the river.', sortOrder: 2 }),
    { ...sportRoute('Plumb Line', '6b+', cheeDale, { height: 20, description: 'Beautiful sustained sport route.', sortOrder: 1 }) },
    { ...sportRoute('Gone with the Wind', '7b', cheeDale, { height: 22, sortOrder: 2 }) },
    { ...sportRoute('Dawes Rides a Shovel', '7c', cheeDale, { height: 20, description: 'Classic hard Cheedale sport — John Dawes\' route.', sortOrder: 3 }) },
  ]);

  // ── Horseshoe Quarry ───────────────────────────────────────────────────────
  const horseshoe = await upsertCrag(cragRepo, {
    name: 'Horseshoe Quarry', region: peak, regionId: peak.id,
    latitude: 53.2632, longitude: -1.6350, rockType: RockType.LIMESTONE,
    description: 'The Peak\'s most developed sport climbing venue. A quarried limestone horseshoe with hundreds of bolted routes from 5 to 8b. Very popular with beginners and experienced sport climbers alike.',
    approach: 'Park at Stoney Middleton. Walk up Middleton Dale 800m. Access track on right.',
    parkingInfo: 'Stoney Middleton village or Miller\'s Dale car park.',
  });
  const horseLeft = await upsertButtress(buttRepo, { name: 'Left Wing', crag: horseshoe, cragId: horseshoe.id, sortOrder: 1 });
  const horseCentral = await upsertButtress(buttRepo, { name: 'Central Section', crag: horseshoe, cragId: horseshoe.id, sortOrder: 2 });
  const horseRight = await upsertButtress(buttRepo, { name: 'Right Wing', crag: horseshoe, cragId: horseshoe.id, sortOrder: 3 });
  await routeRepo.save([
    { ...sportRoute('High Performance', '6b',  horseLeft, { height: 14, description: 'Classic intro-level sport route.', sortOrder: 1 }) },
    { ...sportRoute('Wires and Worry', '6c',  horseLeft, { height: 14, sortOrder: 2 }) },
    { ...sportRoute('Soapstone', '6c+', horseCentral, { height: 15, sortOrder: 1 }) },
    { ...sportRoute('Boomerang', '7a',  horseCentral, { height: 15, description: 'One of the Horseshoe\'s best 7s.', sortOrder: 2 }) },
    { ...sportRoute('Flying Pig', '7b', horseCentral, { height: 15, sortOrder: 3 }) },
    { ...sportRoute('Toxic Shock', '5+', horseRight, { height: 12, description: 'Great beginner sport route.', sortOrder: 1 }) },
    { ...sportRoute('Blue Nun', '6a',  horseRight, { height: 12, sortOrder: 2 }) },
    { ...sportRoute('Blaze of Glory', '7c', horseRight, { height: 14, sortOrder: 3 }) },
  ]);

  console.log('  ✓ Peak District extended: Curbar, Baslow, Burbage N/S, Millstone, Bamford, Higgar Tor, Carl Wark, Gardoms, Black Rocks, Roches, Hen Cloud, Windgather, Stoney Middleton, Cheedale, Horseshoe Quarry');
}
