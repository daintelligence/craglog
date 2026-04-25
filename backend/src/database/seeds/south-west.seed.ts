import { DataSource } from 'typeorm';
import { Region } from '../../modules/crags/entities/region.entity';
import { Crag, RockType } from '../../modules/crags/entities/crag.entity';
import { Buttress } from '../../modules/crags/entities/buttress.entity';
import { Route } from '../../modules/routes/entities/route.entity';
import {
  findOrCreateRegion, upsertCrag, upsertButtress, upsertRoute, tradRoute, sportRoute,
} from './seed-helpers';

export async function seedSouthWest(ds: DataSource) {
  const regionRepo = ds.getRepository(Region);
  const cragRepo   = ds.getRepository(Crag);
  const buttRepo   = ds.getRepository(Buttress);
  const routeRepo  = ds.getRepository(Route);

  const cornwall = await findOrCreateRegion(regionRepo, {
    name: 'Cornwall', country: 'UK',
    description: 'The granite sea cliffs and moorland tors of Cornwall. Classic trad climbing on superb coarse granite above the Atlantic.',
  });
  const dartmoor = await findOrCreateRegion(regionRepo, {
    name: 'Dartmoor', country: 'UK',
    description: 'The granite tors of Dartmoor National Park. Short but excellent routes on coarse moorland granite.',
  });
  const devonCoast = await findOrCreateRegion(regionRepo, {
    name: 'Devon Coast', country: 'UK',
    description: 'Limestone and slate sea cliffs of South Devon. Berry Head, Chudleigh and the Torbay limestone.',
  });

  // ── Bosigran ──────────────────────────────────────────────────────────────
  const bosigran = await upsertCrag(cragRepo, {
    name: 'Bosigran', region: cornwall, regionId: cornwall.id,
    latitude: 50.1680, longitude: -5.6204, rockType: RockType.GRANITE,
    description: 'The finest traditional granite cliff in Cornwall. Spectacular Commando Ridge and Count\'s Buttress give VS–E3 routes in a magnificent Atlantic setting. The Climbers\' Club hut is nearby.',
    approach: '15 min walk from Carn Galver or Bosigran farm along the South West Coast Path.',
    parkingInfo: 'Small car park at Bosigran farm, or roadside near the old mine workings on the B3306.',
  });
  const bosigranMain     = await upsertButtress(buttRepo, { name: 'Main Face',       crag: bosigran, cragId: bosigran.id, sortOrder: 1 });
  const bosigranCommando = await upsertButtress(buttRepo, { name: 'Commando Ridge',  crag: bosigran, cragId: bosigran.id, sortOrder: 2 });
  const bosigranCounts   = await upsertButtress(buttRepo, { name: 'Count\'s Buttress', crag: bosigran, cragId: bosigran.id, sortOrder: 3 });
  await routeRepo.save([
    await upsertRoute(routeRepo, tradRoute('Commando Ridge', 'VD', '3b', bosigranCommando,
      { pitches: 4, height: 90, description: 'The great easy route of Bosigran — a magnificent ridge line above the Atlantic. One of the finest VDs in England.', sortOrder: 1 })),
    await upsertRoute(routeRepo, tradRoute('Doorpost', 'VS', '4c', bosigranMain,
      { height: 35, description: 'A Bosigran masterpiece — sustained wall climbing on coarse granite with superb positions above the sea.', sortOrder: 1 })),
    await upsertRoute(routeRepo, tradRoute('Ledge Climb', 'S', '3c', bosigranMain,
      { pitches: 3, height: 70, description: 'A friendly multi-pitch adventure on the main face — excellent for those new to sea cliff climbing.', sortOrder: 2 })),
    await upsertRoute(routeRepo, tradRoute('Little Brown Jug', 'E1', '5b', bosigranCounts,
      { height: 30, description: 'A bold and technical route on Count\'s Buttress — wonderful situations above crashing Atlantic waves.', sortOrder: 1 })),
    await upsertRoute(routeRepo, tradRoute('Bow Wall', 'E2', '5b', bosigranCounts,
      { height: 30, description: 'A superb exposed arête on the Count\'s Buttress — one of Bosigran\'s finest harder routes.', sortOrder: 2 })),
  ]);

  // ── Chair Ladder ──────────────────────────────────────────────────────────
  const chairLadder = await upsertCrag(cragRepo, {
    name: 'Chair Ladder', region: cornwall, regionId: cornwall.id,
    latitude: 50.0335, longitude: -5.6774, rockType: RockType.GRANITE,
    description: 'A dramatic granite sea cliff at the very tip of Cornwall near Land\'s End. Superb trad routes from VS to E4 in an impressively remote setting. Tidal access to some sectors.',
    approach: '20 min walk from Porthgwarra cove along the South West Coast Path.',
    parkingInfo: 'Small National Trust car park at Porthgwarra, near St Levan (charge).',
  });
  const chairMain   = await upsertButtress(buttRepo, { name: 'Main Face',     crag: chairLadder, cragId: chairLadder.id, sortOrder: 1 });
  const chairPoet   = await upsertButtress(buttRepo, { name: 'Poet\'s Corner', crag: chairLadder, cragId: chairLadder.id, sortOrder: 2 });
  await routeRepo.save([
    await upsertRoute(routeRepo, tradRoute('Seagull', 'VS', '4c', chairMain,
      { height: 30, description: 'The classic of Chair Ladder — a fine granite route above the sea with superb positions and an airy finish.', sortOrder: 1 })),
    await upsertRoute(routeRepo, tradRoute('Demo Route', 'VD', '3b', chairMain,
      { pitches: 2, height: 40, description: 'A popular introduction to Chair Ladder — accessible and well-protected granite climbing above the cove.', sortOrder: 2 })),
    await upsertRoute(routeRepo, tradRoute('Bishop\'s Rib', 'E1', '5b', chairPoet,
      { height: 28, description: 'A fine technical route on Poet\'s Corner — bold moves on sloping granite holds above deep water.', sortOrder: 1 })),
    await upsertRoute(routeRepo, tradRoute('Flannel Avenue', 'HS', '4b', chairPoet,
      { height: 25, description: 'A popular outing in the heart of Poet\'s Corner — steady climbing on excellent coarse granite.', sortOrder: 2 })),
  ]);

  // ── Sennen Cove (Land's End) ──────────────────────────────────────────────
  const sennen = await upsertCrag(cragRepo, {
    name: 'Sennen Cove', region: cornwall, regionId: cornwall.id,
    latitude: 50.0710, longitude: -5.7008, rockType: RockType.GRANITE,
    description: 'The great granite headland above Sennen Cove — the most westerly climbing in England. Short to mid-length routes on coarse Atlantic granite. A fantastic setting with surfing beach below.',
    approach: '10 min walk from Sennen Cove village along the coast path.',
    parkingInfo: 'National Trust car park at Sennen Cove (pay & display). Very busy in summer.',
  });
  const sennenMain   = await upsertButtress(buttRepo, { name: 'Main Cliff',   crag: sennen, cragId: sennen.id, sortOrder: 1 });
  const sennenPocket = await upsertButtress(buttRepo, { name: 'Pocket Wall', crag: sennen, cragId: sennen.id, sortOrder: 2 });
  await routeRepo.save([
    await upsertRoute(routeRepo, tradRoute('Land\'s End Long Climb', 'VD', '3b', sennenMain,
      { pitches: 3, height: 60, description: 'The great easy outing at Land\'s End — a long rambling adventure on the outermost granite of England.', sortOrder: 1 })),
    await upsertRoute(routeRepo, tradRoute('Alison Rib', 'VS', '4c', sennenMain,
      { height: 22, description: 'A popular single-pitch classic — technical arête climbing on perfect coarse granite.', sortOrder: 2 })),
    await upsertRoute(routeRepo, tradRoute('Triton', 'E2', '5b', sennenPocket,
      { height: 20, description: 'A fine technical wall route on Pocket Wall — sustained crimping on excellent granite above the Atlantic.', sortOrder: 1 })),
  ]);

  // ── Haytor Rocks ──────────────────────────────────────────────────────────
  const haytor = await upsertCrag(cragRepo, {
    name: 'Haytor Rocks', region: dartmoor, regionId: dartmoor.id,
    latitude: 50.5773, longitude: -3.7577, rockType: RockType.GRANITE,
    description: 'The iconic tor of Dartmoor — coarse, rough granite giving short, bold routes in a stunning moorland setting. Some of the best small-crag granite climbing in England. Very popular with all levels.',
    approach: '5 min walk from the Haytor car park.',
    parkingInfo: 'Large pay & display car park at Haytor, off the B3387 near Bovey Tracey.',
  });
  const haytorMain = await upsertButtress(buttRepo, { name: 'Main Tor',    crag: haytor, cragId: haytor.id, sortOrder: 1 });
  const haytorLow  = await upsertButtress(buttRepo, { name: 'Low Man Tor', crag: haytor, cragId: haytor.id, sortOrder: 2 });
  await routeRepo.save([
    await upsertRoute(routeRepo, tradRoute('Haytor Ordinary', 'M', '1a', haytorMain,
      { height: 15, description: 'The easiest way to the top — a scramble that has introduced countless beginners to Dartmoor granite.', sortOrder: 1 })),
    await upsertRoute(routeRepo, tradRoute('Grooved Slab', 'VD', '3a', haytorMain,
      { height: 18, description: 'A delightful friction slab on coarse Dartmoor granite — the most popular route on the tor.', sortOrder: 2 })),
    await upsertRoute(routeRepo, tradRoute('South Face Direct', 'VS', '4c', haytorMain,
      { height: 20, description: 'The technical test-piece of Haytor — sustained wall climbing on horizontal breaks with a bold crux.', sortOrder: 3 })),
    await upsertRoute(routeRepo, tradRoute('Low Man Slab', 'S', '3c', haytorLow,
      { height: 12, description: 'A pleasant slab on the lower tor — a good after-walk single-pitch classic.', sortOrder: 1 })),
    await upsertRoute(routeRepo, tradRoute('East Face Route', 'HVS', '5a', haytorMain,
      { height: 18, description: 'Bold climbing up the east face — exposed and technical with a committing crux on rounded granite.', sortOrder: 4 })),
  ]);

  // ── Hound Tor ─────────────────────────────────────────────────────────────
  const houndTor = await upsertCrag(cragRepo, {
    name: 'Hound Tor', region: dartmoor, regionId: dartmoor.id,
    latitude: 50.5912, longitude: -3.7510, rockType: RockType.GRANITE,
    description: 'A magnificent jumble of granite tors with varied climbing on all aspects. Less visited than Haytor, giving a wilder feel. Good routes from VD to E3 on excellent coarse granite.',
    approach: '10 min walk from the car park at Swallerton Gate.',
    parkingInfo: 'Free car park at Swallerton Gate on the minor road between Manaton and Widecombe.',
  });
  const houndMain   = await upsertButtress(buttRepo, { name: 'Main Tor',  crag: houndTor, cragId: houndTor.id, sortOrder: 1 });
  const houndNorth  = await upsertButtress(buttRepo, { name: 'North Tor', crag: houndTor, cragId: houndTor.id, sortOrder: 2 });
  await routeRepo.save([
    await upsertRoute(routeRepo, tradRoute('Hound\'s Head', 'VD', '3b', houndMain,
      { height: 15, description: 'The popular classic — a satisfying line up the main tor with good positions and a scramble approach.', sortOrder: 1 })),
    await upsertRoute(routeRepo, tradRoute('Devil\'s Tor', 'HS', '4b', houndMain,
      { height: 14, description: 'A sustained crack and arête combination on the main tor — one of Hound Tor\'s best routes.', sortOrder: 2 })),
    await upsertRoute(routeRepo, tradRoute('Hound of the Baskervilles', 'E2', '5b', houndNorth,
      { height: 16, description: 'The bold classic of Hound Tor — technical face climbing with sparse protection on perfect granite.', sortOrder: 1 })),
    await upsertRoute(routeRepo, tradRoute('Kennel Wall', 'VS', '4c', houndNorth,
      { height: 14, description: 'A popular VS on the north tor — good gear, sustained interest and great views over the moor.', sortOrder: 2 })),
  ]);

  // ── Dewerstone ────────────────────────────────────────────────────────────
  const dewerstone = await upsertCrag(cragRepo, {
    name: 'Dewerstone', region: dartmoor, regionId: dartmoor.id,
    latitude: 50.4552, longitude: -4.0572, rockType: RockType.GRANITE,
    description: 'A wooded granite crag above the River Plym gorge near Plymouth. Long, sustained routes from VS to E5 on excellent coarse granite in a beautiful riverside setting. Crow\'s Nest is a Dartmoor legend.',
    approach: '20 min walk from the National Trust car park through woodland to the base of the cliff.',
    parkingInfo: 'National Trust car park at Goodameavy, near Shaugh Prior village.',
  });
  const dewerMain   = await upsertButtress(buttRepo, { name: 'Main Face',     crag: dewerstone, cragId: dewerstone.id, sortOrder: 1 });
  const dewerRaven  = await upsertButtress(buttRepo, { name: 'Raven Buttress', crag: dewerstone, cragId: dewerstone.id, sortOrder: 2 });
  await routeRepo.save([
    await upsertRoute(routeRepo, tradRoute('Crow\'s Nest', 'VS', '4c', dewerMain,
      { pitches: 2, height: 50, description: 'The Dewerstone classic — a magnificent route up the main face with superb rock and an atmospheric gorge setting.', sortOrder: 1 })),
    await upsertRoute(routeRepo, tradRoute('Suspension Flake', 'HVS', '5a', dewerMain,
      { pitches: 2, height: 45, description: 'A bold and committing route on the main face — the crux flake move is a Dartmoor test-piece.', sortOrder: 2 })),
    await upsertRoute(routeRepo, tradRoute('Devil\'s Leap', 'E1', '5b', dewerRaven,
      { height: 30, description: 'A superb E1 on Raven Buttress — technical and sustained with a bold upper section.', sortOrder: 1 })),
    await upsertRoute(routeRepo, tradRoute('Dewerstone Corner', 'S', '3c', dewerMain,
      { height: 25, description: 'The popular introduction to the Dewerstone — a well-protected corner crack ideal for developing granite technique.', sortOrder: 3 })),
    await upsertRoute(routeRepo, tradRoute('Black Widow', 'E3', '5c', dewerRaven,
      { height: 32, description: 'The bold classic of Raven Buttress — serious, sustained and magnificent.', sortOrder: 2 })),
  ]);

  // ── Berry Head ────────────────────────────────────────────────────────────
  const berryHead = await upsertCrag(cragRepo, {
    name: 'Berry Head', region: devonCoast, regionId: devonCoast.id,
    latitude: 50.3985, longitude: -3.4859, rockType: RockType.LIMESTONE,
    description: 'A prominent limestone headland above Torbay with sport and trad routes on excellent compact limestone. Home to the Torbay area\'s best sport climbing. SSSI site with seasonal restrictions for nesting birds.',
    approach: '5 min walk from the Berry Head Country Park car park along the coastal path.',
    parkingInfo: 'Pay & display car park at Berry Head Country Park, above Brixham.',
  });
  const berryMainWall  = await upsertButtress(buttRepo, { name: 'Main Wall',    crag: berryHead, cragId: berryHead.id, sortOrder: 1 });
  const berryNorthFace = await upsertButtress(buttRepo, { name: 'North Face',   crag: berryHead, cragId: berryHead.id, sortOrder: 2 });
  await routeRepo.save([
    await upsertRoute(routeRepo, sportRoute('Berry Squeeze', '6b', berryMainWall,
      { height: 20, description: 'The accessible classic of Berry Head sport climbing — consistent pocket pulling up the main wall.', sortOrder: 1 })),
    await upsertRoute(routeRepo, sportRoute('Atlantic Wall', '7a', berryMainWall,
      { height: 22, description: 'A fine harder route on the main wall — sustained limestone climbing with a technical crux at two-thirds height.', sortOrder: 2 })),
    await upsertRoute(routeRepo, tradRoute('North Face Route', 'VS', '4c', berryNorthFace,
      { height: 25, description: 'The trad classic of Berry Head — sustained wall climbing on good limestone above the sea.', sortOrder: 1 })),
    await upsertRoute(routeRepo, sportRoute('Headland Direct', '6c+', berryNorthFace,
      { height: 24, description: 'A direct sport line up the north face — bouldery start then sustained technical moves to the anchor.', sortOrder: 2 })),
  ]);

  // ── Chudleigh Rocks ───────────────────────────────────────────────────────
  const chudleigh = await upsertCrag(cragRepo, {
    name: 'Chudleigh Rocks', region: devonCoast, regionId: devonCoast.id,
    latitude: 50.5965, longitude: -3.5912, rockType: RockType.LIMESTONE,
    description: 'A compact limestone crag above the Teign gorge — the most popular sport climbing venue in Devon. Excellent bolted routes from 5 to 7c on good rock. Dry in all but the heaviest rain.',
    approach: '5 min walk from Chudleigh village car park, through the Nature Reserve woodland.',
    parkingInfo: 'Free car park in Chudleigh village centre, off the B3344.',
  });
  const chudMain   = await upsertButtress(buttRepo, { name: 'Main Wall',  crag: chudleigh, cragId: chudleigh.id, sortOrder: 1 });
  const chudOrange = await upsertButtress(buttRepo, { name: 'Orange Wall', crag: chudleigh, cragId: chudleigh.id, sortOrder: 2 });
  const chudCave   = await upsertButtress(buttRepo, { name: 'Cave Area',   crag: chudleigh, cragId: chudleigh.id, sortOrder: 3 });
  await routeRepo.save([
    await upsertRoute(routeRepo, sportRoute('Gorge Route', '5+', chudMain,
      { height: 15, description: 'The friendly introduction to Chudleigh — well-bolted and accessible on excellent limestone.', sortOrder: 1 })),
    await upsertRoute(routeRepo, sportRoute('Orange Peel', '6b+', chudOrange,
      { height: 18, description: 'The Chudleigh classic — sustained orange limestone pockets up the most colourful wall.', sortOrder: 1 })),
    await upsertRoute(routeRepo, sportRoute('Orange Alert', '6c', chudOrange,
      { height: 18, description: 'A step up from Orange Peel — bouldery crux in the middle of the orange wall.', sortOrder: 2 })),
    await upsertRoute(routeRepo, sportRoute('Cave Crack', '7a', chudCave,
      { height: 20, description: 'An exciting route through the cave roof — powerful moves to gain the lip then technical climbing above.', sortOrder: 1 })),
    await upsertRoute(routeRepo, sportRoute('Devon Cream', '7b', chudCave,
      { height: 22, description: 'Devon\'s finest sport route — sustained technical climbing through and above the cave with a powerful crux sequence.', sortOrder: 2 })),
  ]);
}
