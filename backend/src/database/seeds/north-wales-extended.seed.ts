import { DataSource } from 'typeorm';
import { Region } from '../../modules/crags/entities/region.entity';
import { Crag, RockType } from '../../modules/crags/entities/crag.entity';
import { Buttress } from '../../modules/crags/entities/buttress.entity';
import { Route } from '../../modules/routes/entities/route.entity';
import {
  findOrCreateRegion, upsertCrag, upsertButtress, upsertRoute, tradRoute, sportRoute,
} from './seed-helpers';

export async function seedNorthWalesExtended(ds: DataSource) {
  const regionRepo = ds.getRepository(Region);
  const cragRepo   = ds.getRepository(Crag);
  const buttRepo   = ds.getRepository(Buttress);
  const routeRepo  = ds.getRepository(Route);

  const snowdonia = await findOrCreateRegion(regionRepo, {
    name: 'Snowdonia', country: 'UK',
    description: 'The mountain crags and sea cliffs of Snowdonia and Anglesey. Some of the most famous and serious trad climbing in the world.',
  });
  const anglesey = await findOrCreateRegion(regionRepo, {
    name: 'Anglesey', country: 'UK',
    description: 'Anglesey sea cliffs — Gogarth and the South Stack area. World-class sea cliff climbing on quartzite and schist.',
  });

  // ── Clogwyn Du'r Arddu (Cloggy) ─────────────────────────────────────────
  const cloggy = await upsertCrag(cragRepo, {
    name: 'Clogwyn Du\'r Arddu', region: snowdonia, regionId: snowdonia.id,
    latitude: 53.0869, longitude: -4.0648, rockType: RockType.OTHER,
    description: 'The greatest mountain crag in Wales — perhaps the UK. Dark, brooding and serious. Cloggy has witnessed some of the most significant first ascents in British climbing history. Routes range from VS to E9.',
    approach: '1.5hr walk from Llanberis via the Snowdon Ranger path, or via Cwm Glas Mawr. The crag sits below the summit railway.',
    parkingInfo: 'Llanberis car parks. Take the Snowdon Ranger path from the Llanberis side.',
  });
  const cloggyWest   = await upsertButtress(buttRepo, { name: 'West Buttress',  crag: cloggy, cragId: cloggy.id, sortOrder: 1 });
  const cloggyEast   = await upsertButtress(buttRepo, { name: 'East Buttress',  crag: cloggy, cragId: cloggy.id, sortOrder: 2 });
  const cloggyFar    = await upsertButtress(buttRepo, { name: 'Far East Buttress', crag: cloggy, cragId: cloggy.id, sortOrder: 3 });
  await routeRepo.save([
    await upsertRoute(routeRepo, tradRoute('Longland\'s Climb', 'VD', '3c', cloggyWest,
      { pitches: 5, height: 150, description: 'The route that opened Cloggy to the climbing world in 1928. A magnificent mountain expedition with excellent situations.', sortOrder: 1 })),
    await upsertRoute(routeRepo, tradRoute('Curving Arête', 'VS', '4c', cloggyWest,
      { pitches: 4, height: 130, description: 'One of the finest VS routes on any mountain crag. Superb situations on the sweeping west buttress.', sortOrder: 2 })),
    await upsertRoute(routeRepo, tradRoute('White Slab', 'E1', '5b', cloggyWest,
      { pitches: 4, height: 120, description: 'A Cloggy masterpiece on the pale streak of the West Buttress. Long, sustained and magnificent.', sortOrder: 3 })),
    await upsertRoute(routeRepo, tradRoute('Vember', 'E2', '5c', cloggyEast,
      { pitches: 3, height: 100, description: 'A Cloggy classic — committing traverse pitch leads to sustained upper walls. Joe Brown at his finest.', sortOrder: 1 })),
    await upsertRoute(routeRepo, tradRoute('Woubits', 'E4', '6a', cloggyEast,
      { pitches: 3, height: 100, description: 'A landmark route in the history of British climbing. Steep, technical and bold.', sortOrder: 2 })),
    await upsertRoute(routeRepo, tradRoute('Great Wall', 'E4', '6a', cloggyFar,
      { pitches: 2, height: 80, description: 'Peter Crew\'s masterpiece — one of the hardest routes in Britain when first climbed. Thin, technical and exposed.', sortOrder: 1 })),
  ]);

  // ── Dinas Cromlech ────────────────────────────────────────────────────────
  const dinasC = await upsertCrag(cragRepo, {
    name: 'Dinas Cromlech', region: snowdonia, regionId: snowdonia.id,
    latitude: 53.1157, longitude: -4.0423, rockType: RockType.OTHER,
    description: 'The iconic rhyolite crag in the Llanberis Pass. Home to Cenotaph Corner, often cited as the finest VS in Britain, and Cemetery Gates. Steep walls, great crack lines and a magnificent setting.',
    approach: '20 min walk from roadside parking in Llanberis Pass. Follow the path up to the obvious crag above the road.',
    parkingInfo: 'Lay-bys on the A4086 in the Llanberis Pass below the crag.',
  });
  const dinasLeft   = await upsertButtress(buttRepo, { name: 'Left Wall',     crag: dinasC, cragId: dinasC.id, sortOrder: 1 });
  const dinasCenotaph = await upsertButtress(buttRepo, { name: 'Cenotaph Corner Area', crag: dinasC, cragId: dinasC.id, sortOrder: 2 });
  const dinasRight  = await upsertButtress(buttRepo, { name: 'Right Wall',    crag: dinasC, cragId: dinasC.id, sortOrder: 3 });
  await routeRepo.save([
    await upsertRoute(routeRepo, tradRoute('Cenotaph Corner', 'VS', '4c', dinasCenotaph,
      { height: 35, description: 'The most famous VS in Britain. A perfect diedre cleaving the centre of the crag — continuous bridging and jamming. First climbed by Joe Brown in 1952.', sortOrder: 1 })),
    await upsertRoute(routeRepo, tradRoute('Cemetery Gates', 'E1', '5b', dinasCenotaph,
      { height: 40, description: 'The companion to Cenotaph Corner — a technically demanding route up the right arête with superb exposure.', sortOrder: 2 })),
    await upsertRoute(routeRepo, tradRoute('Left Wall', 'E2', '5c', dinasLeft,
      { height: 38, description: 'A compelling line up the steep left wall — technical face climbing on rounded holds with a bold crux.', sortOrder: 1 })),
    await upsertRoute(routeRepo, tradRoute('Resurrection', 'E4', '6a', dinasLeft,
      { height: 40, description: 'An exceptional route taking the overhanging left side of the crag. Very sustained and technically demanding.', sortOrder: 2 })),
    await upsertRoute(routeRepo, tradRoute('Right Wall', 'E5', '6a', dinasRight,
      { height: 40, description: 'Ron Fawcett\'s masterpiece — one of the hardest routes in Wales when climbed. Sustained wall climbing with minimal gear.', sortOrder: 1 })),
  ]);

  // ── Idwal Slabs ───────────────────────────────────────────────────────────
  const idwal = await upsertCrag(cragRepo, {
    name: 'Idwal Slabs', region: snowdonia, regionId: snowdonia.id,
    latitude: 53.1238, longitude: -4.0218, rockType: RockType.OTHER,
    description: 'Vast, open rhyolite slabs above Llyn Idwal — one of the most beautiful settings in Wales. Ideal for VS and below, with long, delicate friction routes. A perfect introduction to multi-pitch mountain climbing.',
    approach: '25 min walk from the Ogwen Valley car park along the Idwal path.',
    parkingInfo: 'National Trust car park at Ogwen Cottage on the A5 in the Ogwen Valley (pay & display).',
  });
  const idwalSlabs  = await upsertButtress(buttRepo, { name: 'Main Slabs',    crag: idwal, cragId: idwal.id, sortOrder: 1 });
  const idwalHollow = await upsertButtress(buttRepo, { name: 'Idwal Hollow',  crag: idwal, cragId: idwal.id, sortOrder: 2 });
  await routeRepo.save([
    await upsertRoute(routeRepo, tradRoute('Tennis Shoe', 'VD', '3b', idwalSlabs,
      { pitches: 3, height: 120, description: 'The classic of Idwal — a delightful friction route up the pale slab. A Welsh rite of passage since the 1920s.', sortOrder: 1 })),
    await upsertRoute(routeRepo, tradRoute('Ordinary Route', 'D', '2b', idwalSlabs,
      { pitches: 3, height: 110, description: 'The easiest way up the slabs — a perfect multi-pitch introduction to mountain climbing.', sortOrder: 2 })),
    await upsertRoute(routeRepo, tradRoute('Rowan Route', 'S', '3c', idwalSlabs,
      { pitches: 3, height: 115, description: 'A popular middle-grade outing on the main slabs — delicate footwork and lovely situations.', sortOrder: 3 })),
    await upsertRoute(routeRepo, tradRoute('Hope', 'VS', '4c', idwalHollow,
      { pitches: 2, height: 70, description: 'Sustained slab climbing up the steeper Idwal Hollow section — excellent technical test.', sortOrder: 1 })),
    await upsertRoute(routeRepo, tradRoute('Charity', 'HS', '4b', idwalHollow,
      { pitches: 2, height: 65, description: 'A fine slab route — one of a trio with Hope and Faith. Delicate and rewarding.', sortOrder: 2 })),
  ]);

  // ── Carreg Wastad ─────────────────────────────────────────────────────────
  const carregWastad = await upsertCrag(cragRepo, {
    name: 'Carreg Wastad', region: snowdonia, regionId: snowdonia.id,
    latitude: 53.1076, longitude: -4.0476, rockType: RockType.OTHER,
    description: 'A compact, friendly crag in the upper Llanberis Pass offering excellent climbing in the HVS–E2 range. Very quick to get to from the road, making it a popular choice for a short day.',
    approach: '5 min walk from roadside parking in the upper Llanberis Pass.',
    parkingInfo: 'Lay-bys on the A4086 in the upper Llanberis Pass, near Pen-y-Pass.',
  });
  const carregMain = await upsertButtress(buttRepo, { name: 'Main Crag',   crag: carregWastad, cragId: carregWastad.id, sortOrder: 1 });
  const carregRight = await upsertButtress(buttRepo, { name: 'Right Side', crag: carregWastad, cragId: carregWastad.id, sortOrder: 2 });
  await routeRepo.save([
    await upsertRoute(routeRepo, tradRoute('Crackstone Rib', 'VS', '4c', carregMain,
      { height: 25, description: 'A Pass classic — a sharp arête with an exposed and technical crux. Often cited as the finest VS in Llanberis Pass.', sortOrder: 1 })),
    await upsertRoute(routeRepo, tradRoute('Overlapping Wall', 'HVS', '5a', carregMain,
      { height: 25, description: 'Sustained wall climbing above the overlap — bold with an interesting gear placement crux.', sortOrder: 2 })),
    await upsertRoute(routeRepo, tradRoute('Genuine Article', 'E2', '5b', carregRight,
      { height: 22, description: 'A fine technical outing on the right sector — sustained climbing on excellent holds.', sortOrder: 1 })),
    await upsertRoute(routeRepo, tradRoute('Direct Route', 'HS', '4b', carregMain,
      { height: 20, description: 'The accessible classic — a satisfying line up the centre of the crag.', sortOrder: 3 })),
  ]);

  // ── Gogarth (Main Cliff) ───────────────────────────────────────────────────
  const gogarth = await upsertCrag(cragRepo, {
    name: 'Gogarth', region: anglesey, regionId: anglesey.id,
    latitude: 53.3225, longitude: -4.6541, rockType: RockType.QUARTZITE,
    description: 'Wales\'s finest sea cliff — arguably the best sea cliff in Britain. Huge quartzite walls above the Irish Sea give routes up to 100 m long in an atmosphere unmatched anywhere. Gogarth, Wen Slab, Yellow Wall and more.',
    approach: 'Park at South Stack RSPB car park and walk along the coastal path. Various sectors 5–25 min walk.',
    parkingInfo: 'RSPB South Stack car park (small charge). Alternatively, roadside near the South Stack lighthouse road.',
  });
  const gogarMainCliff = await upsertButtress(buttRepo, { name: 'Main Cliff',   crag: gogarth, cragId: gogarth.id, sortOrder: 1 });
  const gogarWenSlab   = await upsertButtress(buttRepo, { name: 'Wen Slab',     crag: gogarth, cragId: gogarth.id, sortOrder: 2 });
  const gogarNorth     = await upsertButtress(buttRepo, { name: 'North Stack Wall', crag: gogarth, cragId: gogarth.id, sortOrder: 3 });
  await routeRepo.save([
    await upsertRoute(routeRepo, tradRoute('A Dream of White Horses', 'HVS', '5a', gogarMainCliff,
      { pitches: 4, height: 120, description: 'The most celebrated sea cliff route in Britain. A magnificent traverse above crashing Atlantic seas — technically moderate but enormously atmospheric and committing.', sortOrder: 1 })),
    await upsertRoute(routeRepo, tradRoute('Gogarth', 'E1', '5b', gogarMainCliff,
      { pitches: 4, height: 110, description: 'The route that gave the cliff its reputation. Big, bold and committing with the full atmosphere of Gogarth.', sortOrder: 2 })),
    await upsertRoute(routeRepo, tradRoute('Wen', 'E3', '5c', gogarWenSlab,
      { pitches: 3, height: 100, description: 'A great slab climb up Wen Slab — technical, sustained and serious with the sea below.', sortOrder: 1 })),
    await upsertRoute(routeRepo, tradRoute('The Cad', 'E4', '6a', gogarMainCliff,
      { pitches: 3, height: 90, description: 'A Gogarth masterpiece — technical wall climbing with minimal protection and a stunning position.', sortOrder: 3 })),
    await upsertRoute(routeRepo, tradRoute('Positron', 'E5', '6b', gogarNorth,
      { pitches: 2, height: 70, description: 'One of the classic hard routes on the North Stack Wall. Technical, serious and uncompromising — a major achievement.', sortOrder: 1 })),
  ]);

  // ── Dinorwic Quarry ───────────────────────────────────────────────────────
  const dinorwic = await upsertCrag(cragRepo, {
    name: 'Dinorwic Quarry', region: snowdonia, regionId: snowdonia.id,
    latitude: 53.1336, longitude: -4.1325, rockType: RockType.OTHER,
    description: 'Huge disused slate quarry above Llanberis — now a world-renowned climbing venue. Slabs, walls and overhangs on superb friction slate. Primus Inter Pares and the Rainbow Slab are legendary.',
    approach: '20 min walk from Llanberis via the slate path. The quarry is clearly visible above the town.',
    parkingInfo: 'Llanberis village car parks. Walk up via the Dinorwic path from the village.',
  });
  const dinoRainbow = await upsertButtress(buttRepo, { name: 'Rainbow Slab',   crag: dinorwic, cragId: dinorwic.id, sortOrder: 1 });
  const dinoAustralia = await upsertButtress(buttRepo, { name: 'Australia',    crag: dinorwic, cragId: dinorwic.id, sortOrder: 2 });
  const dinoTwistWall = await upsertButtress(buttRepo, { name: 'Twisting Gully Wall', crag: dinorwic, cragId: dinorwic.id, sortOrder: 3 });
  await routeRepo.save([
    await upsertRoute(routeRepo, tradRoute('Rainbow of Recalcitrance', 'E3', '5c', dinoRainbow,
      { height: 40, description: 'The classic of Rainbow Slab — intricate slab climbing on perfect slate with minimal gear. A must-do experience.', sortOrder: 1 })),
    await upsertRoute(routeRepo, tradRoute('Colossus', 'E4', '6a', dinoRainbow,
      { height: 45, description: 'A bold direct line up the Rainbow Slab — technically demanding with bold run-outs between poor gear.', sortOrder: 2 })),
    await upsertRoute(routeRepo, tradRoute('Comes the Dervish', 'E5', '6b', dinoAustralia,
      { height: 35, description: 'Classic quarry slate at its finest — sustained technical climbing on perfect friction holds.', sortOrder: 1 })),
    await upsertRoute(routeRepo, tradRoute('Primus Inter Pares', 'E6', '6b', dinoTwistWall,
      { height: 40, description: 'Johnny Dawes\'s masterpiece — one of the most iconic routes in UK climbing. The ultimate slate slab experience.', sortOrder: 1 })),
    await upsertRoute(routeRepo, tradRoute('Master of the Universe', 'E5', '6a', dinoAustralia,
      { height: 35, description: 'A formidable quarry classic on the Australia walls — powerful moves and bold run-outs on perfect slate.', sortOrder: 2 })),
  ]);

  // ── Tryfan East Face ──────────────────────────────────────────────────────
  const tryfan = await upsertCrag(cragRepo, {
    name: 'Tryfan East Face', region: snowdonia, regionId: snowdonia.id,
    latitude: 53.1160, longitude: -3.9995, rockType: RockType.OTHER,
    description: 'The dramatic east face of Tryfan, one of Snowdonia\'s most iconic peaks. Superb rhyolite routes up to 200 m long in a magnificent mountain setting. The classic Grooved Arête is the finest medium-grade route in Wales.',
    approach: '30 min walk from the A5 Ogwen Valley. Start at Gwern Gof Uchaf farm and follow the path to the east face.',
    parkingInfo: 'Lay-bys on the A5 near Gwern Gof Uchaf, Ogwen Valley.',
  });
  const tryfanEast   = await upsertButtress(buttRepo, { name: 'East Face',   crag: tryfan, cragId: tryfan.id, sortOrder: 1 });
  const tryfanNorth  = await upsertButtress(buttRepo, { name: 'North Ridge', crag: tryfan, cragId: tryfan.id, sortOrder: 2 });
  await routeRepo.save([
    await upsertRoute(routeRepo, tradRoute('Grooved Arête', 'VD', '3b', tryfanEast,
      { pitches: 6, height: 180, description: 'The finest mountain VD in Wales — a classic expedition up the full length of the east face. Exposed arête climbing with amazing views. A Welsh mountaineering pilgrimage.', sortOrder: 1 })),
    await upsertRoute(routeRepo, tradRoute('Gashed Crag', 'VD', '3a', tryfanNorth,
      { pitches: 4, height: 120, description: 'A pleasant route up the northern aspect — a good introduction to Tryfan climbing.', sortOrder: 1 })),
    await upsertRoute(routeRepo, tradRoute('Belle Vue Bastion', 'VS', '4c', tryfanEast,
      { pitches: 3, height: 100, description: 'A classic of the grade — bold, open face climbing with superb exposure and excellent rock.', sortOrder: 2 })),
    await upsertRoute(routeRepo, tradRoute('Munich Climb', 'S', '3c', tryfanEast,
      { pitches: 4, height: 130, description: 'A long, wandering classic following the line of least resistance up the east face.', sortOrder: 3 })),
  ]);

  // ── Cwm Silyn ─────────────────────────────────────────────────────────────
  const cwmSilyn = await upsertCrag(cragRepo, {
    name: 'Cwm Silyn', region: snowdonia, regionId: snowdonia.id,
    latitude: 52.9925, longitude: -4.3045, rockType: RockType.OTHER,
    description: 'A remote and serious mountain crag on the Nantlle Ridge. Great Wall is one of the finest E1s in Wales. The setting is wild and committing — a full mountain day.',
    approach: '1.5hr approach from Rhyd Ddu or Nantlle. Serious mountain route-finding required.',
    parkingInfo: 'Rhyd Ddu or Nantlle village car parks.',
  });
  const cwmSilynMain = await upsertButtress(buttRepo, { name: 'Main Buttress', crag: cwmSilyn, cragId: cwmSilyn.id, sortOrder: 1 });
  const cwmSilynFar  = await upsertButtress(buttRepo, { name: 'Outside Edge',  crag: cwmSilyn, cragId: cwmSilyn.id, sortOrder: 2 });
  await routeRepo.save([
    await upsertRoute(routeRepo, tradRoute('Great Wall', 'E1', '5b', cwmSilynMain,
      { pitches: 3, height: 90, description: 'The great route of Cwm Silyn — a sustained and serious climb on excellent rock in a remote mountain setting. One of the finest E1s in North Wales.', sortOrder: 1 })),
    await upsertRoute(routeRepo, tradRoute('Outside Edge Route', 'VD', '3b', cwmSilynFar,
      { pitches: 4, height: 110, description: 'The mountaineering classic of Cwm Silyn — a long ridge route with magnificent views over the Nantlle valley.', sortOrder: 1 })),
    await upsertRoute(routeRepo, tradRoute('Kirkus\'s Route', 'VS', '4c', cwmSilynMain,
      { pitches: 3, height: 85, description: 'Colin Kirkus\'s route from the 1930s — an elegant and sustained line up the main buttress.', sortOrder: 2 })),
  ]);

  // ── Holyhead Mountain ──────────────────────────────────────────────────────
  const holyheadMtn = await upsertCrag(cragRepo, {
    name: 'Holyhead Mountain', region: anglesey, regionId: anglesey.id,
    latitude: 53.3079, longitude: -4.6561, rockType: RockType.QUARTZITE,
    description: 'North Stack and the quartzite outcrops of Holyhead Mountain. Shorter and more accessible than Gogarth, but still serious coastal climbing. Brilliant routes in the HS–E3 range.',
    approach: '15 min walk from roadside parking near North Stack, or the coastal path from South Stack.',
    parkingInfo: 'RSPB South Stack car park, or roadside near North Stack.',
  });
  const holyheadMain = await upsertButtress(buttRepo, { name: 'Main Face',   crag: holyheadMtn, cragId: holyheadMtn.id, sortOrder: 1 });
  const holyheadNorth = await upsertButtress(buttRepo, { name: 'North Buttress', crag: holyheadMtn, cragId: holyheadMtn.id, sortOrder: 2 });
  await routeRepo.save([
    await upsertRoute(routeRepo, tradRoute('Tension', 'HS', '4b', holyheadMain,
      { height: 25, description: 'The friendly classic of Holyhead Mountain — well-protected crack climbing on good quartzite.', sortOrder: 1 })),
    await upsertRoute(routeRepo, tradRoute('Holyhead Mountain Slab', 'VS', '4b', holyheadMain,
      { height: 22, description: 'A pleasant friction slab with superb views across the Irish Sea to Dublin.', sortOrder: 2 })),
    await upsertRoute(routeRepo, tradRoute('Storm Warning', 'E2', '5b', holyheadNorth,
      { height: 28, description: 'Bold quartzite climbing on the North Buttress — atmospheric position above the sea.', sortOrder: 1 })),
    await upsertRoute(routeRepo, tradRoute('Skye Wall', 'E3', '5c', holyheadNorth,
      { height: 28, description: 'A serious outing on the north side — thin technical moves above sparse gear. A destination route.', sortOrder: 2 })),
  ]);
}
