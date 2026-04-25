import { DataSource } from 'typeorm';
import { Region } from '../../modules/crags/entities/region.entity';
import { Crag, RockType } from '../../modules/crags/entities/crag.entity';
import { Buttress } from '../../modules/crags/entities/buttress.entity';
import { Route } from '../../modules/routes/entities/route.entity';
import {
  findOrCreateRegion, upsertCrag, upsertButtress, upsertRoute, tradRoute, sportRoute,
} from './seed-helpers';

export async function seedYorkshire(ds: DataSource) {
  const regionRepo = ds.getRepository(Region);
  const cragRepo   = ds.getRepository(Crag);
  const buttRepo   = ds.getRepository(Buttress);
  const routeRepo  = ds.getRepository(Route);

  const yorksDales = await findOrCreateRegion(regionRepo, {
    name: 'Yorkshire Dales', country: 'UK',
    description: 'Limestone dales and gritstone edges of the Yorkshire Dales and Moors. Outstanding variety from slabby Dales limestone to bold moorland gritstone.',
  });
  const yorksOther = await findOrCreateRegion(regionRepo, {
    name: 'Yorkshire', country: 'UK',
    description: 'Yorkshire gritstone edges and crags from Wharfedale to Nidderdale. Rounded holds, friction smears and bold runout gritstone classics.',
  });

  // ── Gordale Scar ─────────────────────────────────────────────────────────
  const gordale = await upsertCrag(cragRepo, {
    name: 'Gordale Scar', region: yorksDales, regionId: yorksDales.id,
    latitude: 54.0745, longitude: -2.1225, rockType: RockType.LIMESTONE,
    description: 'A spectacular limestone gorge with overhanging walls up to 100 m high. Home to some of the most dramatic sport and trad climbing in the country, including the legendary John Sheard\'s route.',
    approach: '5 min walk from the Gordale Scar car park. Follow the beck into the gorge.',
    parkingInfo: 'National Trust car park at Gordale Scar (pay & display), just off the B6163 near Malham.',
  });
  const gordaleRightWall = await upsertButtress(buttRepo, { name: 'Right Wall', crag: gordale, cragId: gordale.id, sortOrder: 1 });
  const gordaleLeftWall  = await upsertButtress(buttRepo, { name: 'Left Wall',  crag: gordale, cragId: gordale.id, sortOrder: 2 });
  const gordaleMain      = await upsertButtress(buttRepo, { name: 'Main Buttress', crag: gordale, cragId: gordale.id, sortOrder: 3 });
  await routeRepo.save([
    await upsertRoute(routeRepo, tradRoute('Zig-Zag', 'VD', '3c', gordaleMain,
      { pitches: 2, height: 40, description: 'The tourist route — a scramble through the falls, thrilling for the grade.', sortOrder: 1 })),
    await upsertRoute(routeRepo, tradRoute('John Sheard\'s Route', 'E2', '5c', gordaleRightWall,
      { height: 45, description: 'A Gordale landmark. Spectacular climbing through the overhangs on the right wall.', sortOrder: 1 })),
    await upsertRoute(routeRepo, tradRoute('Gordale Groove', 'HVS', '5a', gordaleRightWall,
      { height: 40, description: 'Sustained wall climbing with a pumpy crux groove.', sortOrder: 2 })),
    await upsertRoute(routeRepo, sportRoute('La Corniche', '7b', gordaleLeftWall,
      { height: 30, description: 'Classic limestone sport on the left wall, positive pockets and a powerful crux.', sortOrder: 1 })),
    await upsertRoute(routeRepo, sportRoute('Pierrepoint', '7c', gordaleLeftWall,
      { height: 35, description: 'One of Yorkshire\'s finest 7cs — sustained and technical on the left wall\'s main pitch.', sortOrder: 2 })),
    await upsertRoute(routeRepo, tradRoute('Cave Route', 'VS', '4c', gordaleMain,
      { height: 30, description: 'Threading through the cave systems in the lower gorge. Unique limestone adventure.', sortOrder: 2 })),
  ]);

  // ── Kilnsey Crag ─────────────────────────────────────────────────────────
  const kilnsey = await upsertCrag(cragRepo, {
    name: 'Kilnsey Crag', region: yorksDales, regionId: yorksDales.id,
    latitude: 54.0657, longitude: -2.0163, rockType: RockType.LIMESTONE,
    description: 'A huge roadside limestone overhang — one of the most impressive crags in England. The massive main overhang juts 12 m out and gives extremely hard sport routes. Classic trad on the left sector.',
    approach: 'Immediate roadside — park below the crag on the B6160 near Kilnsey.',
    parkingInfo: 'Lay-by directly below the crag on the B6160 Wharfedale road.',
  });
  const kilnseyMain    = await upsertButtress(buttRepo, { name: 'Main Overhang', crag: kilnsey, cragId: kilnsey.id, sortOrder: 1 });
  const kilnseyLeft    = await upsertButtress(buttRepo, { name: 'Left Sector',   crag: kilnsey, cragId: kilnsey.id, sortOrder: 2 });
  const kilnseyRapport = await upsertButtress(buttRepo, { name: 'Rapport Buttress', crag: kilnsey, cragId: kilnsey.id, sortOrder: 3 });
  await routeRepo.save([
    await upsertRoute(routeRepo, tradRoute('Kilnsey Eliminate', 'HVS', '5a', kilnseyLeft,
      { height: 25, description: 'The must-do trad on Kilnsey. Sustained limestone wall climbing with good gear.', sortOrder: 1 })),
    await upsertRoute(routeRepo, tradRoute('Central Wall', 'E2', '5c', kilnseyLeft,
      { height: 28, description: 'Bold face climbing up the centre of the left sector.', sortOrder: 2 })),
    await upsertRoute(routeRepo, sportRoute('Mandela', '8a', kilnseyMain,
      { height: 20, description: 'Iconic roof problem — the first 8a in Yorkshire. Huge moves through the main overhang.', sortOrder: 1 })),
    await upsertRoute(routeRepo, sportRoute('Tupperware Party', '7c+', kilnseyMain,
      { height: 18, description: 'Brilliant powerful climbing through the lip of the overhang.', sortOrder: 2 })),
    await upsertRoute(routeRepo, sportRoute('Rapport', '7a', kilnseyRapport,
      { height: 22, description: 'The accessible classic — sustained crimping up the rapport buttress, excellent rock.', sortOrder: 1 })),
    await upsertRoute(routeRepo, sportRoute('Northern Exposure', '7b+', kilnseyRapport,
      { height: 25, description: 'One of Kilnsey\'s best — long and sustained with a crux at the top.', sortOrder: 2 })),
  ]);

  // ── Brimham Rocks ─────────────────────────────────────────────────────────
  const brimham = await upsertCrag(cragRepo, {
    name: 'Brimham Rocks', region: yorksOther, regionId: yorksOther.id,
    latitude: 54.0758, longitude: -1.6874, rockType: RockType.GRITSTONE,
    description: 'Extraordinary moorland boulders and short gritstone outcrops near Harrogate. Hundreds of routes on fantastically sculptured rock. A unique environment — great for bouldering and short routes.',
    approach: 'The rocks are spread across the moor. Park at the National Trust car park and explore.',
    parkingInfo: 'National Trust car park at Brimham Rocks, off B6165 near Summerbridge. Admission charge.',
  });
  const brimhamCannonRock = await upsertButtress(buttRepo, { name: 'Cannon Rock',    crag: brimham, cragId: brimham.id, sortOrder: 1 });
  const brimhamKingRock   = await upsertButtress(buttRepo, { name: 'King Rock',      crag: brimham, cragId: brimham.id, sortOrder: 2 });
  const brimhamIdolRock   = await upsertButtress(buttRepo, { name: 'Idol Rock',      crag: brimham, cragId: brimham.id, sortOrder: 3 });
  const brimhamEagleRock  = await upsertButtress(buttRepo, { name: 'Eagle Rock',     crag: brimham, cragId: brimham.id, sortOrder: 4 });
  await routeRepo.save([
    await upsertRoute(routeRepo, tradRoute('Cannon Buttress', 'S', '4a', brimhamCannonRock,
      { height: 10, description: 'Short pleasant groove on the distinctive cannon-shaped boulder.', sortOrder: 1 })),
    await upsertRoute(routeRepo, tradRoute('King Swing', 'VS', '4c', brimhamKingRock,
      { height: 12, description: 'Airy traverse then bold mantelshelf on King Rock — classic Brimham.', sortOrder: 1 })),
    await upsertRoute(routeRepo, tradRoute('Idol Groove', 'VD', '3b', brimhamIdolRock,
      { height: 8, description: 'Friendly corner crack on the famous Idol Rock. A popular beginner outing.', sortOrder: 1 })),
    await upsertRoute(routeRepo, tradRoute('Eagle Front', 'HVS', '5a', brimhamEagleRock,
      { height: 12, description: 'Bold slab climbing up the front face of Eagle Rock with a committing top-out.', sortOrder: 1 })),
    await upsertRoute(routeRepo, tradRoute('Dancing Bear', 'E1', '5b', brimhamEagleRock,
      { height: 10, description: 'Technical wall with a sharp crux move on poor footholds. A Brimham test-piece.', sortOrder: 2 })),
  ]);

  // ── Almscliff Crag ────────────────────────────────────────────────────────
  const almscliff = await upsertCrag(cragRepo, {
    name: 'Almscliff Crag', region: yorksOther, regionId: yorksOther.id,
    latitude: 53.9656, longitude: -1.5834, rockType: RockType.GRITSTONE,
    description: 'A compact gritstone outcrop near Harrogate with a fierce reputation for hard climbing. Many classic Yorkshire gritstone routes from S to E5. The venue for some of the hardest routes of their era.',
    approach: '10 min walk from the village of North Rigton. Park on the road and follow footpath signs.',
    parkingInfo: 'Roadside parking in North Rigton village.',
  });
  const almscliffMainFace  = await upsertButtress(buttRepo, { name: 'Main Face',   crag: almscliff, cragId: almscliff.id, sortOrder: 1 });
  const almscliffNorthFace = await upsertButtress(buttRepo, { name: 'North Face',  crag: almscliff, cragId: almscliff.id, sortOrder: 2 });
  const almscliffLowMan    = await upsertButtress(buttRepo, { name: 'Low Man',     crag: almscliff, cragId: almscliff.id, sortOrder: 3 });
  await routeRepo.save([
    await upsertRoute(routeRepo, tradRoute('Western Front', 'VS', '4c', almscliffMainFace,
      { height: 14, description: 'A Wharfedale classic — technical wall climbing up the main face. Excellent rock and gear.', sortOrder: 1 })),
    await upsertRoute(routeRepo, tradRoute('Great Western', 'HVS', '5a', almscliffMainFace,
      { height: 14, description: 'The signature route of Almscliff — sustained and technical with a memorable crux.', sortOrder: 2 })),
    await upsertRoute(routeRepo, tradRoute('Overhanging Groove', 'E1', '5b', almscliffNorthFace,
      { height: 12, description: 'A steep groove with an intimidating start and technical climbing throughout.', sortOrder: 1 })),
    await upsertRoute(routeRepo, tradRoute('Whisky Crack', 'E3', '5c', almscliffNorthFace,
      { height: 12, description: 'A fierce sustained crack — one of the hardest routes at Almscliff for years after its first ascent.', sortOrder: 2 })),
    await upsertRoute(routeRepo, tradRoute('Low Man Crack', 'S', '4a', almscliffLowMan,
      { height: 8, description: 'The friendly classic on Low Man — a good introduction to Almscliff gritstone.', sortOrder: 1 })),
    await upsertRoute(routeRepo, tradRoute('Frankland\'s Green Crack', 'HVS', '5a', almscliffLowMan,
      { height: 10, description: 'Named after the pioneering climber C.D. Frankland — technical finger crack with a slippery crux.', sortOrder: 2 })),
  ]);

  // ── Cow and Calf (Ilkley Moor) ────────────────────────────────────────────
  const cowAndCalf = await upsertCrag(cragRepo, {
    name: 'Cow and Calf Rocks', region: yorksOther, regionId: yorksOther.id,
    latitude: 53.9188, longitude: -1.8249, rockType: RockType.GRITSTONE,
    description: 'The iconic gritstone outcrop above Ilkley. The Cow gives classic routes on a broad gritstone face; the Calf is a detached boulder with excellent bouldering. A hugely popular venue for all levels.',
    approach: 'Direct 5 min walk from the Cow and Calf hotel car park on Ilkley Moor.',
    parkingInfo: 'Large pay & display car park at the Cow and Calf pub, Hangingstone Road, Ilkley.',
  });
  const cowMain   = await upsertButtress(buttRepo, { name: 'Main Face', crag: cowAndCalf, cragId: cowAndCalf.id, sortOrder: 1 });
  const cowCrack  = await upsertButtress(buttRepo, { name: 'Crack Area', crag: cowAndCalf, cragId: cowAndCalf.id, sortOrder: 2 });
  const calfBoulder = await upsertButtress(buttRepo, { name: 'The Calf', crag: cowAndCalf, cragId: cowAndCalf.id, sortOrder: 3 });
  await routeRepo.save([
    await upsertRoute(routeRepo, tradRoute('Buttress Climb', 'D', '2c', cowMain,
      { height: 15, description: 'The most popular route on the moor — a classic moderate for beginners with magnificent views.', sortOrder: 1 })),
    await upsertRoute(routeRepo, tradRoute('Diagonal', 'VD', '3b', cowMain,
      { height: 15, description: 'An entertaining traverse-then-exit on the main face. Great for groups.', sortOrder: 2 })),
    await upsertRoute(routeRepo, tradRoute('The Groove', 'HS', '4b', cowCrack,
      { height: 14, description: 'The distinctive central groove — sustained bridging with a pleasant layback exit.', sortOrder: 1 })),
    await upsertRoute(routeRepo, tradRoute('Josephine', 'HVS', '5a', cowCrack,
      { height: 14, description: 'Bold, technical wall climbing — a Ilkley test-piece with a serious feel.', sortOrder: 2 })),
    await upsertRoute(routeRepo, tradRoute('Calf Wall', 'VS', '4c', calfBoulder,
      { height: 6, description: 'A short but perfectly formed problem on the Calf boulder — classic gritstone face moves.', sortOrder: 1 })),
  ]);

  // ── Simon's Seat ──────────────────────────────────────────────────────────
  const simonsSeat = await upsertCrag(cragRepo, {
    name: 'Simon\'s Seat', region: yorksOther, regionId: yorksOther.id,
    latitude: 54.0226, longitude: -1.8965, rockType: RockType.GRITSTONE,
    description: 'A moorland gritstone outcrop above Wharfedale with wonderful views. Remote and atmospheric, routes tend to be bold and serious. Best for experienced gritstone climbers.',
    approach: '45 min moorland walk from Barden Bridge or Bolton Abbey. The outcrop is visible from a distance on the ridgeline.',
    parkingInfo: 'Barden Bridge car park or Bolton Abbey estate car park.',
  });
  const simonsMain  = await upsertButtress(buttRepo, { name: 'Main Buttress', crag: simonsSeat, cragId: simonsSeat.id, sortOrder: 1 });
  const simonsEast  = await upsertButtress(buttRepo, { name: 'East Buttress',  crag: simonsSeat, cragId: simonsSeat.id, sortOrder: 2 });
  await routeRepo.save([
    await upsertRoute(routeRepo, tradRoute('Simon Says', 'VS', '4c', simonsMain,
      { height: 12, description: 'A remote classic — exposed ridge traverse with committing moves and glorious surroundings.', sortOrder: 1 })),
    await upsertRoute(routeRepo, tradRoute('Seat Crack', 'S', '4a', simonsMain,
      { height: 10, description: 'A clean finger crack up the main face — good gear and satisfying climbing.', sortOrder: 2 })),
    await upsertRoute(routeRepo, tradRoute('East Arête', 'HVS', '5a', simonsEast,
      { height: 12, description: 'The exposed east arête — very bold with sparse protection. Wharfedale spread out below.', sortOrder: 1 })),
    await upsertRoute(routeRepo, tradRoute('Moorland Slab', 'VD', '3c', simonsEast,
      { height: 10, description: 'A pleasant open slab — delightful friction moves on clean gritstone.', sortOrder: 2 })),
  ]);

  // ── Guisecliff ────────────────────────────────────────────────────────────
  const guisecliff = await upsertCrag(cragRepo, {
    name: 'Guisecliff', region: yorksOther, regionId: yorksOther.id,
    latitude: 54.0623, longitude: -1.7278, rockType: RockType.GRITSTONE,
    description: 'A long, low gritstone outcrop in Nidderdale, often quiet compared to more popular venues. Plenty of quality routes on clean rock from Diff to E4. A local favourite for Harrogate climbers.',
    approach: '15 min walk from Pateley Bridge. Follow the signed path from Guisecliff Wood.',
    parkingInfo: 'Pateley Bridge town car parks. Short walk to the path.',
  });
  const guisecliffMain  = await upsertButtress(buttRepo, { name: 'Main Wall',   crag: guisecliff, cragId: guisecliff.id, sortOrder: 1 });
  const guisecliffRight = await upsertButtress(buttRepo, { name: 'Right Wing',  crag: guisecliff, cragId: guisecliff.id, sortOrder: 2 });
  await routeRepo.save([
    await upsertRoute(routeRepo, tradRoute('Guise Wall', 'HS', '4b', guisecliffMain,
      { height: 10, description: 'A popular introductory route up the main wall — well-protected and excellent rock.', sortOrder: 1 })),
    await upsertRoute(routeRepo, tradRoute('Long Tall Sally', 'E2', '5c', guisecliffMain,
      { height: 12, description: 'Sustained technical climbing up the main wall — one of Guisecliff\'s finest.', sortOrder: 2 })),
    await upsertRoute(routeRepo, tradRoute('Right Wing Crack', 'VS', '4b', guisecliffRight,
      { height: 10, description: 'A fine crack climb on the right sector — jamming and bridging up a well-defined fissure.', sortOrder: 1 })),
    await upsertRoute(routeRepo, tradRoute('Balcony Buttress', 'VD', '3c', guisecliffRight,
      { height: 9, description: 'A pleasant outing with an airy finish on the right buttress.', sortOrder: 2 })),
  ]);

  // ── Caley Crags ───────────────────────────────────────────────────────────
  const caleyCrags = await upsertCrag(cragRepo, {
    name: 'Caley Crags', region: yorksOther, regionId: yorksOther.id,
    latitude: 53.9412, longitude: -1.7355, rockType: RockType.GRITSTONE,
    description: 'A scattered gritstone outcrop above Otley with classic bouldering and short routes. A popular after-work venue for Leeds and Bradford climbers with a friendly atmosphere.',
    approach: '10 min walk from roadside parking on the A660 Otley–Pool road.',
    parkingInfo: 'Lay-by on the A660, west of Bramhope. Follow the path uphill to the crags.',
  });
  const caleyMain   = await upsertButtress(buttRepo, { name: 'Main Buttress', crag: caleyCrags, cragId: caleyCrags.id, sortOrder: 1 });
  const caleyWall   = await upsertButtress(buttRepo, { name: 'Caley Wall',    crag: caleyCrags, cragId: caleyCrags.id, sortOrder: 2 });
  await routeRepo.save([
    await upsertRoute(routeRepo, tradRoute('Caley Buttress Direct', 'VS', '4c', caleyMain,
      { height: 8, description: 'The direct line up the main buttress — bold slab climbing on the rounded gritstone holds.', sortOrder: 1 })),
    await upsertRoute(routeRepo, tradRoute('Thin Crack', 'HVS', '5a', caleyMain,
      { height: 8, description: 'A narrow finger crack splitting the main face — elegant and technical.', sortOrder: 2 })),
    await upsertRoute(routeRepo, tradRoute('The Wall', 'E1', '5b', caleyWall,
      { height: 7, description: 'Bold wall climbing on Caley\'s finest piece of rock — friction smearing and confidence required.', sortOrder: 1 })),
    await upsertRoute(routeRepo, tradRoute('Easy Slab', 'D', '2b', caleyWall,
      { height: 6, description: 'A gentle introduction to Caley — popular with beginners and kids.', sortOrder: 2 })),
  ]);
}
