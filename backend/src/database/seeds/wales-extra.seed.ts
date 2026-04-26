import { DataSource } from 'typeorm';
import { Region } from '../../modules/crags/entities/region.entity';
import { Crag, RockType } from '../../modules/crags/entities/crag.entity';
import { Buttress } from '../../modules/crags/entities/buttress.entity';
import { Route } from '../../modules/routes/entities/route.entity';
import { findOrCreateRegion, upsertCrag, upsertButtress, tradRoute, sportRoute, boulderRoute } from './seed-helpers';

export async function seedWalesExtra(ds: DataSource) {
  const regionRepo = ds.getRepository(Region);
  const cragRepo   = ds.getRepository(Crag);
  const buttRepo   = ds.getRepository(Buttress);
  const routeRepo  = ds.getRepository(Route);

  const anglesey = await findOrCreateRegion(regionRepo, {
    name: 'Anglesey', country: 'Wales',
    description: 'Anglesey sea cliffs — Gogarth and the South Stack area. World-class sea cliff climbing on quartzite and schist.',
  });
  const snowdonia = await findOrCreateRegion(regionRepo, {
    name: 'Snowdonia', country: 'Wales',
    description: 'The mountain crags and sea cliffs of Snowdonia and Anglesey. Some of the most famous and serious trad climbing in the world.',
  });
  const northWales = await findOrCreateRegion(regionRepo, {
    name: 'North Wales', country: 'Wales',
    description: 'North Wales including Llanberis Pass, Tremadog, Gogarth and the Ogwen Valley.',
  });
  const ogwen = await findOrCreateRegion(regionRepo, {
    name: 'Ogwen Valley', country: 'Wales',
    description: 'The Ogwen Valley crags — Idwal Slabs, Tryfan, Glyder Fach and Pen yr Ole Wen. Classic mountain climbing.',
  });

  // ── Rhoscolyn ──────────────────────────────────────────────────────────────
  const rhoscolyn = await upsertCrag(cragRepo, {
    name: 'Rhoscolyn', region: anglesey, regionId: anglesey.id,
    latitude: 53.2480, longitude: -4.6320, rockType: RockType.QUARTZITE,
    description: 'A superb quartzite sea cliff on the south-west coast of Anglesey. Varied routes from Diff to E5 with some excellent deep-water soloing potential. White arch walls, slabs and arêtes above clear turquoise water. The routes are well-spaced and generally quick-drying.',
    approach: '15 min walk from Rhoscolyn village along the coast path. Follow signs to the beach, then south along the clifftop.',
    parkingInfo: 'Small car park in Rhoscolyn village (free). Alternatively park near the beach access at the end of the lane.',
  });
  const rhoscMainWall  = await upsertButtress(buttRepo, { name: 'Main Wall',     crag: rhoscolyn, cragId: rhoscolyn.id, sortOrder: 1 });
  const rhoscWhiteArch = await upsertButtress(buttRepo, { name: 'White Arch',    crag: rhoscolyn, cragId: rhoscolyn.id, sortOrder: 2 });
  const rhoscNorthFace = await upsertButtress(buttRepo, { name: 'North Face',    crag: rhoscolyn, cragId: rhoscolyn.id, sortOrder: 3 });
  await routeRepo.save([
    tradRoute('Diamond Solitaire', 'E1', '5b', rhoscMainWall,
      { height: 20, description: 'The finest route on the main wall — a clean quartzite line with a technical crux above excellent gear. An Anglesey sea cliff classic.', sortOrder: 1 }),
    tradRoute('Silver Lining', 'VS', '4c', rhoscMainWall,
      { height: 18, description: 'A popular VS following a silver streak of quartz up the main wall. Excellent rock and a satisfying line.', sortOrder: 2 }),
    tradRoute('Rhoscolyn Arête', 'HVS', '5a', rhoscMainWall,
      { height: 22, description: 'The prominent arête giving bold, technical climbing with fine situations above the sea. The crux requires confident footwork on sloping holds.', sortOrder: 3 }),
    tradRoute('Overhanging Crack', 'E2', '5c', rhoscMainWall,
      { height: 18, description: 'A strenuous jamming crack through a small overhang — short, powerful and immensely satisfying. The best crack route on the cliff.', sortOrder: 4 }),
    tradRoute('Aquamarine', 'E3', '5c', rhoscWhiteArch,
      { height: 25, description: 'A superb route through the White Arch area — technical and sustained on excellent quartzite with the sea directly below.', sortOrder: 1 }),
    tradRoute('White Arch Direct', 'E2', '5b', rhoscWhiteArch,
      { height: 22, description: 'The direct line through the natural arch — a remarkable feature giving an atmospheric and well-protected route.', sortOrder: 2 }),
    tradRoute('Sea Spray', 'HS', '4b', rhoscWhiteArch,
      { height: 20, description: 'A pleasant mid-grade route on solid quartzite — popular with parties looking for something accessible on this cliff.', sortOrder: 3 }),
    tradRoute('Turquoise Wall', 'E1', '5b', rhoscWhiteArch,
      { height: 22, description: 'Thin face climbing up the turquoise-tinged wall above the zawn. Delicate moves on small holds with a committing crux.', sortOrder: 4 }),
    tradRoute('North Arête', 'VD', '3b', rhoscNorthFace,
      { height: 15, description: 'The easiest route on the cliff — a friendly arête giving a good introduction to Rhoscolyn.', sortOrder: 1 }),
    tradRoute('Quartzy Cracks', 'S', '4a', rhoscNorthFace,
      { height: 16, description: 'A pair of crack lines on the north face giving solid, well-protected climbing.', sortOrder: 2 }),
    tradRoute('Saltwater Slab', 'VS', '4b', rhoscNorthFace,
      { height: 18, description: 'A delicate friction slab with just enough gear to keep you honest. A beautiful route in a spectacular setting.', sortOrder: 3 }),
    tradRoute('The Traverse of the Gods', 'E2', '5b', rhoscNorthFace,
      { pitches: 2, height: 30, description: 'A wandering two-pitch adventure traversing the north face above deep water — committing and atmospheric. DWS potential at high tide.', sortOrder: 4 }),
    tradRoute('Crystal Slab', 'HVS', '4c', rhoscMainWall,
      { height: 20, description: 'A fine slab route on crystalline quartzite — delicate friction climbing with a bold move to gain the upper slab.', sortOrder: 5 }),
    tradRoute('Sapphire', 'E1', '5a', rhoscNorthFace,
      { height: 18, description: 'A bold line on the north face — sustained face climbing on small but positive holds.', sortOrder: 5 }),
    tradRoute('Deep Water Solo Direct', 'E3', '5c', rhoscWhiteArch,
      { height: 12, description: 'A short, powerful DWS testpiece on the White Arch walls — powerful moves off the water onto steep quartzite.', sortOrder: 5 }),
  ]);

  // ── Holyhead Mountain (additional routes) ─────────────────────────────────
  const holyheadMtn = await upsertCrag(cragRepo, {
    name: 'Holyhead Mountain', region: anglesey, regionId: anglesey.id,
    latitude: 53.3079, longitude: -4.6561, rockType: RockType.QUARTZITE,
    description: 'North Stack and the quartzite outcrops of Holyhead Mountain. Shorter and more accessible than Gogarth, but still serious coastal climbing. Brilliant routes in the HS–E3 range.',
    approach: '15 min walk from roadside parking near North Stack, or the coastal path from South Stack.',
    parkingInfo: 'RSPB South Stack car park, or roadside near North Stack.',
  });
  const holyheadMain  = await upsertButtress(buttRepo, { name: 'Main Face',      crag: holyheadMtn, cragId: holyheadMtn.id, sortOrder: 1 });
  const holyheadNorth = await upsertButtress(buttRepo, { name: 'North Buttress', crag: holyheadMtn, cragId: holyheadMtn.id, sortOrder: 2 });
  const holyheadSouth = await upsertButtress(buttRepo, { name: 'South Stack Area', crag: holyheadMtn, cragId: holyheadMtn.id, sortOrder: 3 });
  await routeRepo.save([
    tradRoute('North Stack', 'VD', '3b', holyheadMain,
      { height: 20, description: 'The classic easy route at North Stack — a pleasant quartzite outing with excellent views across the Irish Sea.', sortOrder: 1 }),
    tradRoute('South Stack', 'S', '3c', holyheadSouth,
      { height: 22, description: 'A fine South Stack route on good quartzite — steady climbing up a clean line with superb coastal views.', sortOrder: 1 }),
    tradRoute('Sea Wall Route', 'HS', '4b', holyheadSouth,
      { height: 25, description: 'Traversing sea wall climbing on compact quartzite — one of the most entertaining routes at South Stack.', sortOrder: 2 }),
    tradRoute('Irish Sea Wall', 'HVS', '5a', holyheadNorth,
      { height: 28, description: 'A fine HVS on the North Buttress — sustained quartzite face climbing above crashing waves.', sortOrder: 1 }),
    tradRoute('Coastguard Crack', 'VS', '4c', holyheadNorth,
      { height: 22, description: 'A clean hand crack in the North Buttress — excellent jamming with good protection and fine atmosphere.', sortOrder: 2 }),
    tradRoute('Mountain Circuit', 'VD', '3a', holyheadMain,
      { pitches: 2, height: 35, description: 'A two-pitch outing linking two buttresses on the mountain — a pleasant expedition with good views to Snowdonia.', sortOrder: 2 }),
    tradRoute('Seabird Slab', 'S', '3c', holyheadMain,
      { height: 18, description: 'A friendly slab on the main face — often busy but rewarding. The bird life on the headland adds to the atmosphere.', sortOrder: 3 }),
    tradRoute('North Stack Traverse', 'E1', '5b', holyheadNorth,
      { pitches: 2, height: 35, description: 'An exciting traverse above the sea — committing and atmospheric, requiring confident movement on quartzite.', sortOrder: 3 }),
    tradRoute('Headland Wall', 'E2', '5c', holyheadNorth,
      { height: 28, description: 'Technical face climbing on the seaward side of the North Buttress — bold, sustained and brilliantly positioned.', sortOrder: 4 }),
    tradRoute('Quartzite Corner', 'HS', '4a', holyheadSouth,
      { height: 20, description: 'A well-protected corner crack on the South Stack area — a popular and accessible choice for the grade.', sortOrder: 3 }),
  ]);

  // ── Cwm Silyn (expanded) ──────────────────────────────────────────────────
  const cwmSilyn = await upsertCrag(cragRepo, {
    name: 'Cwm Silyn', region: snowdonia, regionId: snowdonia.id,
    latitude: 53.0220, longitude: -4.2540, rockType: RockType.OTHER,
    description: 'One of the most remote and atmospheric mountain crags in North Wales, set below the Nantlle Ridge. Excellent routes from VD to E3 in a wild, committing setting. Full commitment and mountain fitness required — this is a full mountain day.',
    approach: '1.5 hr approach from Rhyd Ddu or Nantlle village. Cross boggy moorland and ascend the cwm. Route-finding required in poor visibility.',
    parkingInfo: 'Rhyd Ddu village car park on the A4085 (free). Alternatively Nantlle village.',
  });
  const cwmSilynMain    = await upsertButtress(buttRepo, { name: 'Main Buttress',  crag: cwmSilyn, cragId: cwmSilyn.id, sortOrder: 1 });
  const cwmSilynOutside = await upsertButtress(buttRepo, { name: 'Outside Edge',   crag: cwmSilyn, cragId: cwmSilyn.id, sortOrder: 2 });
  const cwmSilynUpper   = await upsertButtress(buttRepo, { name: 'Upper Tier',     crag: cwmSilyn, cragId: cwmSilyn.id, sortOrder: 3 });
  await routeRepo.save([
    tradRoute('Outside Edge Route', 'VD', '3b', cwmSilynOutside,
      { pitches: 4, height: 110, description: 'The mountaineering classic of Cwm Silyn — a long, rambling ridge route following the outside edge of the buttress with magnificent views over the Nantlle Valley.', sortOrder: 1 }),
    tradRoute('Kirkus\'s Route', 'HS', '4b', cwmSilynMain,
      { pitches: 3, height: 85, description: 'Colin Kirkus\'s route from the 1930s — an elegant and sustained line up the main buttress on excellent rough rock.', sortOrder: 1 }),
    tradRoute('Great Slab', 'VS', '4c', cwmSilynMain,
      { pitches: 3, height: 90, description: 'A magnificent slab route rising up the central section of the main buttress — delicate and sustained on superb rough rock.', sortOrder: 2 }),
    tradRoute('Pincushion', 'E1', '5b', cwmSilynMain,
      { pitches: 3, height: 85, description: 'The best route of the grade on this crag — sustained technical climbing up the main buttress with a serious mountain atmosphere.', sortOrder: 3 }),
    tradRoute('The Nantlle Ridge Route', 'D', '2c', cwmSilynOutside,
      { pitches: 5, height: 130, description: 'A mountaineering route in its truest sense — long, rambling and utterly committing in a remote setting. A full mountain adventure.', sortOrder: 2 }),
    tradRoute('Left Arête', 'S', '3c', cwmSilynOutside,
      { pitches: 2, height: 60, description: 'Takes the left arête of the Outside Edge Buttress — pleasant climbing on good holds with fine situations.', sortOrder: 3 }),
    tradRoute('Central Rib', 'HS', '4b', cwmSilynMain,
      { pitches: 3, height: 80, description: 'The rib taken in a direct line up the centre of the main buttress — exposed and satisfying.', sortOrder: 4 }),
    tradRoute('Cwm Wall', 'E2', '5b', cwmSilynMain,
      { pitches: 2, height: 65, description: 'A bold and committing route on the steeper main wall — limited gear but positive holds allow determined progress.', sortOrder: 5 }),
    tradRoute('Upper Slab Route', 'VD', '3b', cwmSilynUpper,
      { pitches: 2, height: 50, description: 'The easiest route on the upper tier — a pleasant finishing pitch after other routes below.', sortOrder: 1 }),
    tradRoute('Direct Finish', 'E3', '5c', cwmSilynUpper,
      { pitches: 1, height: 30, description: 'A fierce direct finish to the upper tier — bold moves on compact rock with minimal protection.', sortOrder: 2 }),
    tradRoute('Cwm Silyn Eliminate', 'E2', '5c', cwmSilynMain,
      { pitches: 2, height: 70, description: 'A sustained and technical eliminate line threading between other routes on the main buttress. Serious and rewarding.', sortOrder: 6 }),
    tradRoute('The Cwm', 'HVS', '5a', cwmSilynMain,
      { pitches: 3, height: 85, description: 'A fine HVS taking a direct line up the buttress — sustained with a bold crux on the second pitch.', sortOrder: 7 }),
    tradRoute('Mountain Crack', 'VS', '4c', cwmSilynOutside,
      { pitches: 2, height: 55, description: 'A crack line on the outside edge giving good, solid climbing on rough Snowdonian rock.', sortOrder: 4 }),
    tradRoute('Nantlle Slab', 'S', '3c', cwmSilynUpper,
      { pitches: 2, height: 45, description: 'A pleasant friction slab on the upper tier — gentle climbing with superb views over the Nantlle Valley.', sortOrder: 3 }),
    tradRoute('Hidden Rib', 'HS', '4a', cwmSilynOutside,
      { pitches: 2, height: 55, description: 'An underestimated route tucked away on the outside edge — solid climbing in a quiet position.', sortOrder: 5 }),
  ]);

  // ── Craig y Forwen ────────────────────────────────────────────────────────
  const forwen = await upsertCrag(cragRepo, {
    name: 'Craig y Forwen', region: northWales, regionId: northWales.id,
    latitude: 53.1820, longitude: -3.8360, rockType: RockType.LIMESTONE,
    description: 'A compact limestone sport crag near Dyserth in North Wales. Well-bolted routes on compact grey limestone from 5+ to 7c+. Quick-drying and south-facing, making it a superb winter and spring venue. Routes tend to be steep with good holds rather than technical.',
    approach: '5 min walk from roadside parking below Dyserth waterfall. Follow the path east along the base of the escarpment.',
    parkingInfo: 'Roadside parking at Dyserth Waterfall (free). Alternatively the village car park.',
  });
  const forwenLeftWall   = await upsertButtress(buttRepo, { name: 'Left Wall',    crag: forwen, cragId: forwen.id, sortOrder: 1 });
  const forwenMainFace   = await upsertButtress(buttRepo, { name: 'Main Face',    crag: forwen, cragId: forwen.id, sortOrder: 2 });
  const forwenRightSector = await upsertButtress(buttRepo, { name: 'Right Sector', crag: forwen, cragId: forwen.id, sortOrder: 3 });
  await routeRepo.save([
    sportRoute('Forwen Groove', '6a', forwenMainFace,
      { height: 15, description: 'The accessible classic of Craig y Forwen — a pleasant groove with good holds and well-spaced bolts. The ideal introduction to this cliff.', sortOrder: 1 }),
    sportRoute('Limestone Cowboy', '6b+', forwenMainFace,
      { height: 17, description: 'A popular mid-grade classic — sustained pocket pulling up the main face with a tricky crux near the top.', sortOrder: 2 }),
    sportRoute('Dyserth Direct', '6c', forwenMainFace,
      { height: 17, description: 'A direct line up the steepest part of the main face — powerful moves between good holds with a strenuous crux.', sortOrder: 3 }),
    sportRoute('Waterfall Wall', '5+', forwenLeftWall,
      { height: 12, description: 'The beginner-friendly route on the left wall — accessible climbing on good holds with reliable protection.', sortOrder: 1 }),
    sportRoute('Left Arete Sport', '6a+', forwenLeftWall,
      { height: 14, description: 'Takes the left arête of the wall — balancy and technical with a crux sequence at half height.', sortOrder: 2 }),
    sportRoute('Forwen Flake', '6b', forwenLeftWall,
      { height: 14, description: 'Up the left wall via a flake feature — juggy initially then more technical above the flake.', sortOrder: 3 }),
    sportRoute('North Wales Limestone', '7a', forwenRightSector,
      { height: 18, description: 'The technical jewel of the right sector — intricate footwork on small limestone pockets with a balancy crux.', sortOrder: 1 }),
    sportRoute('Forwen Overhang', '7b', forwenRightSector,
      { height: 18, description: 'Powers through the slight overhang at the right end of the crag — dynamic and powerful with a long reach crux.', sortOrder: 2 }),
    sportRoute('Dyserth Crack', '6c+', forwenRightSector,
      { height: 16, description: 'A crack-and-face combination on the right sector — varied climbing with a technical crux.', sortOrder: 3 }),
    sportRoute('Sunnyside Up', '5+', forwenLeftWall,
      { height: 12, description: 'A sunny warm-up route on the left wall — pleasant easy-angled limestone.', sortOrder: 4 }),
    sportRoute('The Forwen Project', '7c', forwenMainFace,
      { height: 20, description: 'The hardest sustained route on the cliff — fingery cruxes linked by powerful movement on excellent compact limestone.', sortOrder: 4 }),
    sportRoute('Grey Walls', '6a', forwenRightSector,
      { height: 15, description: 'A pleasant outing on the grey right sector walls — steady climbing with good rests between crux sections.', sortOrder: 4 }),
    sportRoute('Pocket Heaven', '6b', forwenMainFace,
      { height: 16, description: 'Beautiful pocket pulling up the centre of the main face — the ideal second route after warming up on Forwen Groove.', sortOrder: 5 }),
    sportRoute('Steep Dreams', '7a+', forwenRightSector,
      { height: 17, description: 'Powerful climbing on the steeper right sector — a good link-up challenge for those who have ticked the mid-grade routes.', sortOrder: 5 }),
    sportRoute('Forwen Slab', '5+', forwenMainFace,
      { height: 14, description: 'A slab finish variant giving easier climbing on the lower-angled section of the main face.', sortOrder: 6 }),
  ]);

  // ── Pen yr Ole Wen — South Buttress ───────────────────────────────────────
  const penYrOleWen = await upsertCrag(cragRepo, {
    name: 'Pen yr Ole Wen', region: ogwen, regionId: ogwen.id,
    latitude: 53.1185, longitude: -4.0290, rockType: RockType.OTHER,
    description: 'The south-facing buttresses of Pen yr Ole Wen above the Ogwen Valley. A series of tiered rhyolite buttresses giving good routes from D to E2 in a commanding mountain setting. Less visited than other Ogwen crags, giving a pleasantly quiet atmosphere.',
    approach: '40 min walk from the Ogwen Cottage car park. Cross the stile and follow the path up the south ridge to the buttresses.',
    parkingInfo: 'National Trust car park at Ogwen Cottage on the A5 (pay & display).',
  });
  const penwSouthButt  = await upsertButtress(buttRepo, { name: 'South Buttress',  crag: penYrOleWen, cragId: penYrOleWen.id, sortOrder: 1 });
  const penwUpperButt  = await upsertButtress(buttRepo, { name: 'Upper Buttress',  crag: penYrOleWen, cragId: penYrOleWen.id, sortOrder: 2 });
  await routeRepo.save([
    tradRoute('South Buttress Ridge', 'D', '2c', penwSouthButt,
      { pitches: 3, height: 80, description: 'The classic easy route on Pen yr Ole Wen — a pleasant ridge outing with good views over Llyn Ogwen and the Glyderau.', sortOrder: 1 }),
    tradRoute('Whitless Crack', 'VD', '3b', penwSouthButt,
      { pitches: 2, height: 55, description: 'A fine crack line up the south buttress — solid jamming on good rock with excellent protection.', sortOrder: 2 }),
    tradRoute('South Rib', 'S', '3c', penwSouthButt,
      { pitches: 3, height: 75, description: 'Takes the south rib in a direct line — good climbing on clean rhyolite with pleasing exposure on the upper section.', sortOrder: 3 }),
    tradRoute('Ole Wen Wall', 'VS', '4c', penwSouthButt,
      { pitches: 2, height: 60, description: 'Wall climbing on the south face — technical and sustained with a bold crux at two-thirds height.', sortOrder: 4 }),
    tradRoute('Ogwen Arête', 'HS', '4b', penwSouthButt,
      { pitches: 2, height: 55, description: 'The prominent arête of the south buttress — exposed and delightful climbing with superb valley views.', sortOrder: 5 }),
    tradRoute('Upper Buttress Direct', 'VD', '3b', penwUpperButt,
      { pitches: 2, height: 50, description: 'A straightforward line up the upper tier — a good continuation to lower-buttress routes.', sortOrder: 1 }),
    tradRoute('Pen Summit Rib', 'D', '2b', penwUpperButt,
      { pitches: 2, height: 45, description: 'The easiest route on the upper tier — an ideal scramble for those extending their day to the summit.', sortOrder: 2 }),
    tradRoute('Welsh Arête', 'E1', '5b', penwUpperButt,
      { pitches: 2, height: 55, description: 'A bold arête on the upper buttress — exposed and serious with sparse gear on the upper section.', sortOrder: 3 }),
    tradRoute('Cwm Lloer Buttress', 'HS', '4b', penwSouthButt,
      { pitches: 3, height: 70, description: 'Takes the line overlooking Cwm Lloer — a fine mountaineering route in a quieter position.', sortOrder: 6 }),
    tradRoute('Ole Wen Slab', 'E2', '5b', penwUpperButt,
      { pitches: 2, height: 50, description: 'Bold slab climbing on the upper tier — a serious outing with limited gear and a committing crux.', sortOrder: 4 }),
  ]);

  // ── Gogarth / South Stack additional routes ───────────────────────────────
  const gogarth = await upsertCrag(cragRepo, {
    name: 'Gogarth', region: anglesey, regionId: anglesey.id,
    latitude: 53.3085, longitude: -4.6780, rockType: RockType.QUARTZITE,
    description: 'The magnificent sea cliffs of Holy Island, Anglesey. Quartzite walls and zawns giving some of the most spectacular sea cliff routes in the UK.',
    approach: 'Park at South Stack car park. Various approaches to different sections — 10–30 min walk.',
    parkingInfo: 'South Stack RSPB car park (pay & display). North Stack car park (limited).',
  });
  const gogarZawn      = await upsertButtress(buttRepo, { name: 'Red Wall Zawn',    crag: gogarth, cragId: gogarth.id, sortOrder: 4 });
  const gogarSouthStack = await upsertButtress(buttRepo, { name: 'South Stack Area', crag: gogarth, cragId: gogarth.id, sortOrder: 5 });
  await routeRepo.save([
    tradRoute('The Needle', 'E2', '5c', gogarZawn,
      { height: 45, description: 'A fine route threading through the Red Wall Zawn — technical and sustained on compact quartzite with superb positions.', sortOrder: 1 }),
    tradRoute('Scavenger', 'E3', '5c', gogarZawn,
      { height: 50, description: 'A serious route on the walls of Red Wall Zawn — committing moves on good but sparsely protected rock.', sortOrder: 2 }),
    tradRoute('The Trojan', 'E4', '6a', gogarZawn,
      { pitches: 2, height: 60, description: 'One of the great harder routes at Gogarth — sustained technical climbing on perfect quartzite in a magnificent position.', sortOrder: 3 }),
    tradRoute('South Stack Traverse', 'HVS', '5a', gogarSouthStack,
      { pitches: 3, height: 70, description: 'A fantastic traverse of the South Stack headland — spectacular situations above the lighthouse and surging sea.', sortOrder: 1 }),
    tradRoute('Lighthouse Arête', 'VS', '4c', gogarSouthStack,
      { height: 30, description: 'A fine route on the South Stack area — excellent quartzite climbing in a dramatic position above the famous lighthouse.', sortOrder: 2 }),
    tradRoute('RSPB Wall', 'E1', '5b', gogarSouthStack,
      { height: 35, description: 'Technical wall climbing on the south-facing section — compact quartzite with interesting gear placements.', sortOrder: 3 }),
    tradRoute('Seabird Zawn', 'E2', '5b', gogarZawn,
      { height: 40, description: 'An adventurous route descending into the zawn and climbing the far wall — tidal access and atmospheric.', sortOrder: 4 }),
    tradRoute('Holy Island Wall', 'HVS', '5a', gogarSouthStack,
      { pitches: 2, height: 50, description: 'A sustained two-pitch route on the Holy Island quartzite — good climbing in a quieter part of the Gogarth complex.', sortOrder: 4 }),
    tradRoute('Stack Direct', 'E3', '6a', gogarSouthStack,
      { height: 35, description: 'A fierce direct line on the South Stack Area — short but intense with a powerful crux sequence.', sortOrder: 5 }),
    tradRoute('Guillemot Wall', 'S', '3c', gogarSouthStack,
      { height: 22, description: 'The easiest proper route on the Gogarth complex — a pleasant introduction to sea cliff climbing in spectacular surroundings.', sortOrder: 6 }),
  ]);
}
