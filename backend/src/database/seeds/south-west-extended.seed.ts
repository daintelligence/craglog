import { DataSource } from 'typeorm';
import { Region } from '../../modules/crags/entities/region.entity';
import { Crag, RockType } from '../../modules/crags/entities/crag.entity';
import { Buttress } from '../../modules/crags/entities/buttress.entity';
import { Route } from '../../modules/routes/entities/route.entity';
import { findOrCreateRegion, upsertCrag, upsertButtress, tradRoute, sportRoute, boulderRoute } from './seed-helpers';

export async function seedSouthWestExtended(ds: DataSource) {
  const regionRepo = ds.getRepository(Region);
  const cragRepo   = ds.getRepository(Crag);
  const buttRepo   = ds.getRepository(Buttress);
  const routeRepo  = ds.getRepository(Route);

  const devonCoast = await findOrCreateRegion(regionRepo, {
    name: 'Devon Coast', country: 'England',
    description: 'The Atlantic and Channel sea cliffs of North and South Devon — trad climbing on shale, slate and metamorphic rock.',
  });
  const dartmoor = await findOrCreateRegion(regionRepo, {
    name: 'Dartmoor', country: 'England',
    description: 'The granite tors of Dartmoor National Park. Short but excellent routes on coarse moorland granite.',
  });
  const cornwall = await findOrCreateRegion(regionRepo, {
    name: 'Cornwall', country: 'England',
    description: 'Granite sea cliffs and moorland tors of West Cornwall. Classic trad climbing on superb coarse granite above the Atlantic.',
  });

  // ── Baggy Point ───────────────────────────────────────────────────────────
  const baggyPoint = await upsertCrag(cragRepo, {
    name: 'Baggy Point', region: devonCoast, regionId: devonCoast.id,
    latitude: 51.1430, longitude: -4.2710, rockType: RockType.OTHER,
    description: 'A dramatic Atlantic headland on the north Devon coast giving spectacular trad climbing on shale and slate. Bold routes from D to E5 in a magnificent setting above the Bristol Channel. The rock requires care — test holds before committing. Outstanding routes including the classic Kinkyboots.',
    approach: '25 min walk from Croyde village along the South West Coast Path to the headland.',
    parkingInfo: 'National Trust car park at Croyde (pay & display, busy in summer). Alternative at Putsborough Sands (pay & display).',
  });
  const baggyMain   = await upsertButtress(buttRepo, { name: 'Main Headland', crag: baggyPoint, cragId: baggyPoint.id, sortOrder: 1 });
  const baggyEast   = await upsertButtress(buttRepo, { name: 'East Face',     crag: baggyPoint, cragId: baggyPoint.id, sortOrder: 2 });
  const baggyNorth  = await upsertButtress(buttRepo, { name: 'North Cliff',   crag: baggyPoint, cragId: baggyPoint.id, sortOrder: 3 });
  await routeRepo.save([
    tradRoute('Kinkyboots', 'E4', '6a', baggyMain,
      { height: 30, description: 'The Baggy Point test-piece — a bold and powerful route up the prow of the headland. The crux requires committing moves on sloping holds above minimal gear. A Devon classic.', sortOrder: 1 }),
    tradRoute('Promontory Traverse', 'VS', '4c', baggyMain,
      { pitches: 3, height: 60, description: 'A magnificent multi-pitch traverse of the Baggy Point headland — atmospheric, adventurous and technically interesting throughout. One of the finest VS outings in Devon.', sortOrder: 2 }),
    tradRoute('Fly Wall', 'E2', '5b', baggyEast,
      { height: 28, description: 'A bold outing up the east face — sustained moves on compact rock with tricky gear placements. Excellent positions above the Atlantic.', sortOrder: 1 }),
    tradRoute('Long Rock Slab', 'D', '2c', baggyNorth,
      { pitches: 2, height: 40, description: 'The easiest multi-pitch route at Baggy — a long slab climb on the north cliff giving a pleasant adventure with fine views to Lundy.', sortOrder: 1 }),
    tradRoute('Baggy Wrinkle', 'HVS', '5a', baggyMain,
      { height: 25, description: 'A fine HVS threading up the wrinkled central section of the headland wall — solid climbing on interesting rock architecture.', sortOrder: 3 }),
    tradRoute('Microbe', 'E1', '5b', baggyEast,
      { height: 25, description: 'A sustained technical route on the east face — the crux is a sequence of small holds leading to a good rest on the upper arête.', sortOrder: 2 }),
    tradRoute('Croyde Bay View', 'S', '3c', baggyNorth,
      { height: 20, description: 'A pleasant north cliff route with spectacular views across Croyde Bay — straightforward climbing on the better rock.', sortOrder: 2 }),
    tradRoute('Headland Arête', 'HS', '4b', baggyMain,
      { height: 22, description: 'The prominent arête forming the nose of the headland — exposed and exciting with a bold crux move near the top.', sortOrder: 4 }),
    tradRoute('Atlantic Slab', 'VD', '3b', baggyNorth,
      { height: 18, description: 'A long, low-angled slab on the north cliff — ideal for those new to Devon sea cliff climbing.', sortOrder: 3 }),
    tradRoute('North Devon Classic', 'E3', '5c', baggyEast,
      { pitches: 2, height: 40, description: 'A serious outing on the east face — sustained technical climbing on compact rock with a committing crux high on the second pitch.', sortOrder: 3 }),
    tradRoute('The Promontory Finish', 'E1', '5b', baggyMain,
      { height: 22, description: 'Direct finish to Promontory Traverse — a bold wall leads to the summit of the headland.', sortOrder: 5 }),
    tradRoute('Shale Route', 'VS', '4b', baggyNorth,
      { pitches: 2, height: 35, description: 'A long VS on the north cliff — care needed with the rock quality on the lower section, but excellent in the upper half.', sortOrder: 4 }),
    tradRoute('Bristol Channel Wall', 'E2', '5c', baggyMain,
      { height: 28, description: 'A technical wall route on the seaward face — bold and atmospheric with fine views towards Wales on a clear day.', sortOrder: 6 }),
    tradRoute('Baggy Bypass', 'HVS', '4c', baggyEast,
      { pitches: 2, height: 40, description: 'A wandering two-pitch route across the east face — sustained at the grade with a memorable upper section above the sea.', sortOrder: 4 }),
    tradRoute('Tidal Route', 'E2', '5b', baggyNorth,
      { height: 22, description: 'Accessed only at low tide — an exciting adventure on the base of the north cliff with a superb atmosphere.', sortOrder: 5 }),
  ]);

  // ── Lundy Island ──────────────────────────────────────────────────────────
  const lundy = await upsertCrag(cragRepo, {
    name: 'Lundy Island', region: devonCoast, regionId: devonCoast.id,
    latitude: 51.1750, longitude: -4.6650, rockType: RockType.GRANITE,
    description: 'A remote granite island in the Bristol Channel, reached by ferry from Bideford or Ilfracombe. The island offers superb coarse granite sea cliff climbing — bold, adventurous and utterly unique. Accommodation available on the island. The setting and approach make this an unforgettable destination. Devil\'s Slide is one of the most celebrated easy routes in Britain.',
    approach: 'Ferry from Bideford or Ilfracombe (seasonal, book in advance). Routes are reached on foot across the island, mostly 15–45 min walk.',
    parkingInfo: 'Park at Bideford or Ilfracombe ferry terminal. On the island itself there are no cars.',
  });
  const lundyWest   = await upsertButtress(buttRepo, { name: 'West Side',      crag: lundy, cragId: lundy.id, sortOrder: 1 });
  const lundyNorth  = await upsertButtress(buttRepo, { name: 'North End',       crag: lundy, cragId: lundy.id, sortOrder: 2 });
  const lundyQuarter = await upsertButtress(buttRepo, { name: 'Quarter Wall',   crag: lundy, cragId: lundy.id, sortOrder: 3 });
  await routeRepo.save([
    tradRoute('Devil\'s Slide', 'D', '3a', lundyWest,
      { pitches: 6, height: 120, description: 'The most famous route on Lundy — a magnificent 120m friction slab rising from the sea. One of the greatest easy routes in Britain. The coarse Atlantic granite gives superb friction even when damp.', sortOrder: 1 }),
    tradRoute('Albion', 'VS', '4c', lundyWest,
      { pitches: 4, height: 80, description: 'A brilliant multi-pitch route on the west side — sustained VS climbing on excellent coarse granite with superb Atlantic views. A worthy companion to Devil\'s Slide.', sortOrder: 2 }),
    tradRoute('Windward', 'S', '3c', lundyWest,
      { pitches: 3, height: 60, description: 'A fine multi-pitch Severe on the exposed west side — sustained slab and groove climbing with a wild Atlantic atmosphere.', sortOrder: 3 }),
    tradRoute('Jupiter', 'HVS', '5a', lundyNorth,
      { pitches: 3, height: 65, description: 'The classic HVS of the north end — powerful moves on excellent granite with fine positions above the Bristol Channel.', sortOrder: 1 }),
    tradRoute('Gannet', 'E1', '5b', lundyNorth,
      { pitches: 2, height: 50, description: 'Named after the gannets that fish around the island — a bold and technical route on the north-end granite.', sortOrder: 2 }),
    tradRoute('Puffin', 'HS', '4b', lundyQuarter,
      { pitches: 2, height: 45, description: 'A pleasant mid-grade route on the Quarter Wall granite — solid climbing in the middle of the island.', sortOrder: 1 }),
    tradRoute('Shag Rock Crack', 'VD', '3b', lundyNorth,
      { height: 25, description: 'A fine crack route on the north end — good solid granite with a reliable protection pattern.', sortOrder: 3 }),
    tradRoute('Lighthouse Buttress', 'E2', '5b', lundyWest,
      { pitches: 2, height: 55, description: 'A bold route on the west side near the lighthouse — sustained and serious with the full exposure of the Atlantic.', sortOrder: 4 }),
    tradRoute('Island Way', 'VS', '4b', lundyQuarter,
      { pitches: 2, height: 40, description: 'A classic island route on the Quarter Wall — fine granite climbing in a superb setting.', sortOrder: 2 }),
    tradRoute('Atlantic Slab (Lundy)', 'D', '2c', lundyWest,
      { pitches: 4, height: 70, description: 'Another magnificent easy slab on the west side — nearly as good as Devil\'s Slide and often quieter.', sortOrder: 5 }),
  ]);

  // ── Hartland Quay ─────────────────────────────────────────────────────────
  const hartlandQuay = await upsertCrag(cragRepo, {
    name: 'Hartland Quay', region: devonCoast, regionId: devonCoast.id,
    latitude: 50.9980, longitude: -4.5290, rockType: RockType.OTHER,
    description: 'Wild and dramatic sea cliff climbing on the contorted metamorphic rock of the Hartland Peninsula. The most remote crag in mainland Devon — long approach but utterly spectacular. Routes are bold, adventurous and unlike anywhere else. The rock folds and tilts at wild angles giving routes of unique character.',
    approach: '5 min walk from Hartland Quay hotel to the cliff top, then abseil or scramble to routes. Some routes require tidal timing.',
    parkingInfo: 'Pay & display car park at Hartland Quay, off the B3248. 14 miles west of Bideford.',
  });
  const hartlandMain  = await upsertButtress(buttRepo, { name: 'Main Zawn',    crag: hartlandQuay, cragId: hartlandQuay.id, sortOrder: 1 });
  const hartlandSouth = await upsertButtress(buttRepo, { name: 'South Walls',  crag: hartlandQuay, cragId: hartlandQuay.id, sortOrder: 2 });
  const hartlandNorth = await upsertButtress(buttRepo, { name: 'North Buttress', crag: hartlandQuay, cragId: hartlandQuay.id, sortOrder: 3 });
  await routeRepo.save([
    tradRoute('Cathedral', 'VS', '4c', hartlandMain,
      { pitches: 3, height: 60, description: 'The finest mid-grade route at Hartland — a long, varied multi-pitch exploiting the natural lines on the cathedral-like walls of the main zawn. One of Devon\'s great VS routes.', sortOrder: 1 }),
    tradRoute('South Face Direct', 'E1', '5b', hartlandSouth,
      { pitches: 2, height: 45, description: 'A sustained and bold route up the south walls — the contorted rock architecture provides interesting gear placements and memorable moves.', sortOrder: 1 }),
    tradRoute('Cyclotron', 'E2', '5c', hartlandMain,
      { height: 35, description: 'A technical route through the centre of the main zawn — the folded rock gives surprisingly positive holds on an otherwise intimidating-looking face.', sortOrder: 2 }),
    tradRoute('Quay Wall', 'HS', '4b', hartlandMain,
      { height: 22, description: 'A fine mid-grade route on the lower tier of the main zawn — a good introduction to Hartland\'s unique rock character.', sortOrder: 3 }),
    tradRoute('Hartland Slab', 'VD', '3b', hartlandNorth,
      { pitches: 2, height: 40, description: 'A pleasant two-pitch slab route on the north buttress — the most accessible route at Hartland.', sortOrder: 1 }),
    tradRoute('North Corner', 'S', '3c', hartlandNorth,
      { height: 25, description: 'The corner line on the north buttress — a good moderate in a wild setting, well away from the harder main zawn routes.', sortOrder: 2 }),
    tradRoute('Quaystone Crack', 'VS', '4b', hartlandNorth,
      { height: 22, description: 'A crack route on the north buttress — solid jamming on the better rock away from the tidal zone.', sortOrder: 3 }),
    tradRoute('The Arete Above the Sea', 'E2', '5b', hartlandSouth,
      { pitches: 2, height: 45, description: 'A spectacular arête route above the Atlantic — bold, committing and exposed with superb views in all directions.', sortOrder: 2 }),
    tradRoute('Hartland Direct', 'E3', '5c', hartlandMain,
      { pitches: 2, height: 50, description: 'A serious and technical direct line up the main zawn — the hardest traditionally climbed route at Hartland. Sustained and bold.', sortOrder: 4 }),
    tradRoute('Wave Catcher', 'HVS', '5a', hartlandSouth,
      { height: 28, description: 'An atmospheric route accessed at low tide — technical moves above crashing Atlantic waves on the south walls.', sortOrder: 3 }),
  ]);

  // ── Dewerstone (expanded) ─────────────────────────────────────────────────
  const dewerstone = await upsertCrag(cragRepo, {
    name: 'Dewerstone', region: dartmoor, regionId: dartmoor.id,
    latitude: 50.4552, longitude: -4.0572, rockType: RockType.GRANITE,
    description: 'A wooded granite crag above the River Plym gorge near Plymouth. Long, sustained routes from VS to E5 on excellent coarse granite in a beautiful riverside setting. Crow\'s Nest is a Dartmoor legend.',
    approach: '20 min walk from the National Trust car park through woodland to the base of the cliff.',
    parkingInfo: 'National Trust car park at Goodameavy, near Shaugh Prior village.',
  });
  const dewerMain    = await upsertButtress(buttRepo, { name: 'Main Face',       crag: dewerstone, cragId: dewerstone.id, sortOrder: 1 });
  const dewerRaven   = await upsertButtress(buttRepo, { name: 'Raven Buttress',  crag: dewerstone, cragId: dewerstone.id, sortOrder: 2 });
  const dewerPlym    = await upsertButtress(buttRepo, { name: 'Plym Wall',        crag: dewerstone, cragId: dewerstone.id, sortOrder: 3 });
  await routeRepo.save([
    tradRoute('Dewerstone Crack', 'VS', '4c', dewerMain,
      { pitches: 2, height: 45, description: 'The definitive crack route on Dewerstone — excellent jamming on Dartmoor granite with bomber protection. A rite of passage for Devon climbers.', sortOrder: 1 }),
    tradRoute('Zig Zag', 'HS', '4b', dewerMain,
      { pitches: 2, height: 40, description: 'A Dewerstone favourite — a wandering line up the main face exploiting the natural zig-zag of breaks and ledges. Well-protected and satisfying.', sortOrder: 2 }),
    tradRoute('Suspension Slab', 'E1', '5b', dewerMain,
      { pitches: 2, height: 50, description: 'A superb E1 up the main slab — delicate friction moves on rough Dartmoor granite with committing protection. One of the crag\'s finest routes.', sortOrder: 3 }),
    tradRoute('The Groove', 'VD', '3b', dewerMain,
      { pitches: 2, height: 40, description: 'The classic easy route at Dewerstone — a natural groove line giving pleasant climbing above the river gorge.', sortOrder: 4 }),
    tradRoute('Plym Wall Direct', 'E2', '5c', dewerPlym,
      { pitches: 2, height: 50, description: 'The direct line up the Plym Wall — bold face climbing above the river on excellent coarse granite. A serious and atmospheric outing.', sortOrder: 1 }),
    tradRoute('Raven\'s Nest Crack', 'HVS', '5a', dewerRaven,
      { pitches: 2, height: 45, description: 'A sustained crack on Raven Buttress — strenuous jamming with good protection and a superb position above the Plym gorge.', sortOrder: 1 }),
    tradRoute('River Wall', 'VS', '4b', dewerPlym,
      { pitches: 2, height: 40, description: 'A pleasant VS overlooking the River Plym — steady climbing on good granite with attractive situations.', sortOrder: 2 }),
    tradRoute('Dewerstone Pillar', 'E3', '5c', dewerMain,
      { pitches: 2, height: 55, description: 'Takes the prominent pillar feature on the main face — sustained and bold with a technical crux at two-thirds height.', sortOrder: 5 }),
    tradRoute('Gorge Route', 'S', '3c', dewerPlym,
      { pitches: 2, height: 35, description: 'A pleasant Severe on the Plym Wall — well-protected climbing above the river gorge with fine views downstream.', sortOrder: 3 }),
    tradRoute('Devil\'s Leap (Dewerstone)', 'E1', '5b', dewerRaven,
      { height: 30, description: 'A fine E1 on Raven Buttress — sustained moves on clean granite with bold upper wall climbing.', sortOrder: 2 }),
    tradRoute('Wall of Flame', 'E4', '6a', dewerMain,
      { height: 35, description: 'The hardest route on the main face — desperate technical moves through the steepest section. A serious lead for experienced Dartmoor granite specialists.', sortOrder: 6 }),
    tradRoute('Plym Pillar', 'VD', '3b', dewerPlym,
      { pitches: 2, height: 40, description: 'A classic easy outing on the Plym Wall — a natural pillar feature giving sound granite climbing.', sortOrder: 4 }),
    tradRoute('Beginner\'s Groove', 'D', '2b', dewerMain,
      { height: 20, description: 'The easiest route at Dewerstone — a sheltered corner giving a gentle introduction to granite climbing.', sortOrder: 7 }),
    tradRoute('Raven Traverse', 'E2', '5b', dewerRaven,
      { pitches: 2, height: 45, description: 'A traversing route across the full width of Raven Buttress — adventurous and committing with a strenuous crux.', sortOrder: 3 }),
    tradRoute('Dark Gorge', 'HVS', '5a', dewerPlym,
      { pitches: 2, height: 45, description: 'A route deep in the gorge atmosphere — the overhanging lower section gives way to sustained wall climbing above.', sortOrder: 5 }),
  ]);

  // ── Carn Brea ─────────────────────────────────────────────────────────────
  const carnBrea = await upsertCrag(cragRepo, {
    name: 'Carn Brea', region: cornwall, regionId: cornwall.id,
    latitude: 50.2230, longitude: -5.2430, rockType: RockType.GRANITE,
    description: 'A prominent granite hill rising above the post-industrial landscape near Redruth. Excellent short trad and boulder problems on coarse Cornish granite blocks. The summit tor and lower outcrops give a variety of routes from bouldering to short VS trad. The castle and monument on the summit add atmosphere. A unique and underrated venue.',
    approach: '15 min walk from the car park near Carnkie village along the well-marked path to the summit.',
    parkingInfo: 'Small car park near Carnkie village (free), or roadside near the Carn Brea monument access road.',
  });
  const carnBreaMain   = await upsertButtress(buttRepo, { name: 'Summit Tor',     crag: carnBrea, cragId: carnBrea.id, sortOrder: 1 });
  const carnBreaLower  = await upsertButtress(buttRepo, { name: 'Lower Blocks',   crag: carnBrea, cragId: carnBrea.id, sortOrder: 2 });
  const carnBreaEast   = await upsertButtress(buttRepo, { name: 'East Outcrop',   crag: carnBrea, cragId: carnBrea.id, sortOrder: 3 });
  await routeRepo.save([
    tradRoute('Castle Crack', 'VS', '4c', carnBreaMain,
      { height: 15, description: 'The finest route on the summit tor — a clean hand crack on perfect rough granite close to the ancient castle. A true Carn Brea classic.', sortOrder: 1 }),
    tradRoute('Monument Wall', 'HVS', '5a', carnBreaMain,
      { height: 14, description: 'Technical face climbing on the upper summit blocks near the Bassett Monument — bold on small granite holds with a superb vista.', sortOrder: 2 }),
    tradRoute('Carn Direct', 'S', '3c', carnBreaMain,
      { height: 12, description: 'A direct line up the summit tor — well-protected crack and slab climbing with great views across the Camborne–Redruth ridge.', sortOrder: 3 }),
    tradRoute('Redruth Slab', 'VD', '3a', carnBreaLower,
      { height: 10, description: 'A pleasant friction slab on the lower blocks — coarse granite giving reliable friction for beginners.', sortOrder: 1 }),
    tradRoute('Lower Crack', 'HS', '4b', carnBreaLower,
      { height: 12, description: 'The best crack line on the lower outcrops — classic jamming on coarse Cornish granite.', sortOrder: 2 }),
    boulderRoute('Brea Mantel', '5', carnBreaLower,
      { height: 4, description: 'A classic mantel problem onto a broad granite ledge — the most-repeated move at Carn Brea.', sortOrder: 3 }),
    boulderRoute('Castle Dyke', '6A', carnBreaMain,
      { height: 5, description: 'A fine eliminante boulder problem on the summit blocks — delicate balance moves on sloping granite.', sortOrder: 4 }),
    boulderRoute('Industrial Arête', '5+', carnBreaEast,
      { height: 4, description: 'A pleasant arête problem with panoramic views over the industrial heritage of the Camborne–Redruth district.', sortOrder: 1 }),
    tradRoute('East Ridge', 'D', '2c', carnBreaEast,
      { height: 10, description: 'The easiest route on the east outcrop — a scramble-to-climb outing along the east ridge.', sortOrder: 1 }),
    tradRoute('East Wall', 'VS', '4b', carnBreaEast,
      { height: 12, description: 'A fine short VS on the east outcrop — bold face moves on compact granite with a stiff finish.', sortOrder: 2 }),
  ]);

  // ── Sennen Cove (expanded) ────────────────────────────────────────────────
  const sennen = await upsertCrag(cragRepo, {
    name: 'Sennen Cove', region: cornwall, regionId: cornwall.id,
    latitude: 50.0710, longitude: -5.7008, rockType: RockType.GRANITE,
    description: 'The great granite headland above Sennen Cove — the most westerly climbing in England. Short to mid-length routes on coarse Atlantic granite. A fantastic setting with surfing beach below.',
    approach: '10 min walk from Sennen Cove village along the coast path.',
    parkingInfo: 'National Trust car park at Sennen Cove (pay & display). Very busy in summer.',
  });
  const sennenMain    = await upsertButtress(buttRepo, { name: 'Main Cliff',     crag: sennen, cragId: sennen.id, sortOrder: 1 });
  const sennenPocket  = await upsertButtress(buttRepo, { name: 'Pocket Wall',    crag: sennen, cragId: sennen.id, sortOrder: 2 });
  const sennenNorth   = await upsertButtress(buttRepo, { name: 'North Face',     crag: sennen, cragId: sennen.id, sortOrder: 3 });
  await routeRepo.save([
    tradRoute('The Ledge Route', 'D', '2c', sennenMain,
      { pitches: 2, height: 30, description: 'The classic easy outing at Sennen — a pleasant two-pitch route following a natural ledge system across the main cliff. A fine introduction to this spectacular headland.', sortOrder: 1 }),
    tradRoute('Ochre Slab', 'S', '3c', sennenMain,
      { height: 22, description: 'A distinctive ochre-coloured slab on the main cliff — delicate friction climbing on coarse Atlantic granite above the surfing beach.', sortOrder: 2 }),
    tradRoute('Demo Route', 'HS', '4b', sennenMain,
      { height: 20, description: 'The instructional classic of Sennen — used by generations of climbing instructors to demonstrate technique. Solid, well-protected and enjoyable.', sortOrder: 3 }),
    tradRoute('Armed and Dangerous', 'E2', '5c', sennenMain,
      { height: 25, description: 'The technical test-piece of the main cliff — sustained thin face climbing on Sennen\'s finest wall above the Atlantic. Bold and committing.', sortOrder: 4 }),
    tradRoute('Atlantic Arête', 'HVS', '5a', sennenNorth,
      { height: 22, description: 'A fine arête route on the north face — exposed and technical with the full force of the Atlantic atmosphere below.', sortOrder: 1 }),
    tradRoute('West Face Wall', 'VS', '4c', sennenNorth,
      { height: 20, description: 'A popular VS on the north face — sustained wall climbing on excellent coarse granite above deep water.', sortOrder: 2 }),
    tradRoute('Sennen Groove', 'VD', '3b', sennenPocket,
      { height: 16, description: 'A pleasant groove route on the Pocket Wall — a good warm-up for harder routes on the main cliff.', sortOrder: 1 }),
    tradRoute('Pocket Full of Rock', 'E1', '5b', sennenPocket,
      { height: 18, description: 'Intricate climbing on the Pocket Wall — the natural pocket holds give deceptive difficulty with a bold crux sequence.', sortOrder: 2 }),
    tradRoute('Cove Crack', 'VS', '4b', sennenPocket,
      { height: 15, description: 'A clean hand crack on the Pocket Wall — excellent practice for those developing granite crack technique.', sortOrder: 3 }),
    tradRoute('Land\'s End Traverse', 'E3', '5c', sennenMain,
      { pitches: 3, height: 50, description: 'A sustained multi-pitch traverse of the full Sennen headland — the finest adventurous outing on this cliff. Committing and atmospheric throughout.', sortOrder: 5 }),
  ]);
}
