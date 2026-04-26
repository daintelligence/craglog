import { DataSource } from 'typeorm';
import { Region } from '../../modules/crags/entities/region.entity';
import { Crag, RockType } from '../../modules/crags/entities/crag.entity';
import { Buttress } from '../../modules/crags/entities/buttress.entity';
import { Route } from '../../modules/routes/entities/route.entity';
import { findOrCreateRegion, upsertCrag, upsertButtress, tradRoute, sportRoute } from './seed-helpers';

export async function seedNorthWalesClassics(ds: DataSource) {
  const regionRepo = ds.getRepository(Region);
  const cragRepo   = ds.getRepository(Crag);
  const buttRepo   = ds.getRepository(Buttress);
  const routeRepo  = ds.getRepository(Route);

  const snowdonia = await findOrCreateRegion(regionRepo, {
    name: 'Snowdonia', country: 'Wales',
    description: 'Snowdonia — world-class trad and sport climbing on rhyolite, slate and quartzite.',
  });

  const northWales = await findOrCreateRegion(regionRepo, {
    name: 'North Wales', country: 'Wales',
    description: 'North Wales including Llanberis Pass, Tremadog, Gogarth and the Ogwen Valley.',
  });

  // ── Dinas Cromlech (expanded) ─────────────────────────────────────────────
  const cromlech = await upsertCrag(cragRepo, {
    name: 'Dinas Cromlech', region: northWales, regionId: northWales.id,
    latitude: 53.1015, longitude: -4.0735, rockType: RockType.OTHER,
    description: 'The most dramatic crag in the Llanberis Pass — a huge slabby triangle of perfect rhyolite. Cenotaph Corner, Left Wall and Right Wall are all legendary British routes.',
    approach: 'Park at the Pont Cromlech lay-by. 15 min walk up the path on the left bank.',
    parkingInfo: 'Roadside lay-by at Pont Cromlech on the A4086 (Llanberis Pass). Very limited.',
  });
  const cromLeft   = await upsertButtress(buttRepo, { name: 'Left Wall', crag: cromlech, cragId: cromlech.id, sortOrder: 1 });
  const cromCorner = await upsertButtress(buttRepo, { name: 'Cenotaph Corner', crag: cromlech, cragId: cromlech.id, sortOrder: 2 });
  const cromRight  = await upsertButtress(buttRepo, { name: 'Right Wall', crag: cromlech, cragId: cromlech.id, sortOrder: 3 });
  await routeRepo.save([
    tradRoute('Cenotaph Corner', 'E1', '5c', cromCorner, { pitches: 2, height: 35, description: 'Joe Brown\'s masterpiece — the definitive corner crack on British rock. Sustained, strenuous and always in perfect condition.', sortOrder: 1 }),
    tradRoute('Left Wall', 'E2', '5c', cromLeft, { pitches: 2, height: 35, description: 'The magnificent smooth wall to the left of Cenotaph Corner. Bold technical face climbing at its finest.', sortOrder: 1 }),
    tradRoute('Cemetery Gates', 'E1', '5b', cromLeft, { pitches: 3, height: 50, description: 'Classic route taking the crack line left of Left Wall. Sustained and well-protected.', sortOrder: 2 }),
    tradRoute('Right Wall', 'E5', '6a', cromRight, { pitches: 1, height: 35, description: 'One of the hardest pure face climbs in Wales when first climbed — bold, technical and without good gear.', sortOrder: 1 }),
    tradRoute('Flying Buttress', 'S', '3c', cromLeft, { pitches: 2, height: 45, description: 'The classic easy route on the left flank — a fine introduction to Cromlech.', sortOrder: 3 }),
    tradRoute('Sabre Cut', 'HVS', '5a', cromLeft, { pitches: 2, height: 35, description: 'A good HVS on the left wall — popular and well-protected.', sortOrder: 4 }),
    tradRoute('Ivy Sepulchre', 'E2', '5b', cromRight, { pitches: 2, height: 40, description: 'A bold route taking the right arête of the main face.', sortOrder: 2 }),
    tradRoute('The Big Groove', 'E3', '5c', cromRight, { pitches: 2, height: 40, description: 'The impressive big groove on the right side of the crag.', sortOrder: 3 }),
  ]);

  // ── Dinas Mot ─────────────────────────────────────────────────────────────
  const dinasMot = await upsertCrag(cragRepo, {
    name: 'Dinas Mot', region: northWales, regionId: northWales.id,
    latitude: 53.1022, longitude: -4.0680, rockType: RockType.OTHER,
    description: 'The imposing buttress on the north side of the Llanberis Pass facing Dinas Cromlech. Classic multi-pitch routes including the great West Rib.',
    approach: 'Park at Pont Cromlech. Cross the pass and follow the path up to the crag — 20 min.',
    parkingInfo: 'Roadside lay-by at Pont Cromlech on the A4086.',
  });
  const motW = await upsertButtress(buttRepo, { name: 'West Buttress', crag: dinasMot, cragId: dinasMot.id, sortOrder: 1 });
  const motE = await upsertButtress(buttRepo, { name: 'East Buttress', crag: dinasMot, cragId: dinasMot.id, sortOrder: 2 });
  await routeRepo.save([
    tradRoute('West Rib', 'VD', '3c', motW, { pitches: 5, height: 130, description: 'One of the finest mountaineering routes in Wales — a great slab and rib climb in a superb position.', sortOrder: 1 }),
    tradRoute('Plexus', 'E1', '5b', motW, { pitches: 4, height: 100, description: 'A sustained E1 up the main West Buttress — one of the best routes on Dinas Mot.', sortOrder: 2 }),
    tradRoute('The Direct Route', 'VD', '3b', motW, { pitches: 4, height: 110, description: 'An easier alternative to the West Rib — popular and pleasant.', sortOrder: 3 }),
    tradRoute('Diagonal', 'VS', '4c', motE, { pitches: 4, height: 100, description: 'Takes the diagonal line across the East Buttress — a fine route.', sortOrder: 1 }),
    tradRoute('Flake Crack', 'E2', '5b', motE, { pitches: 3, height: 80, description: 'A classic crack route on the East Buttress.', sortOrder: 2 }),
  ]);

  // ── Cyrn Las ──────────────────────────────────────────────────────────────
  const cyrnLas = await upsertCrag(cragRepo, {
    name: 'Cyrn Las', region: northWales, regionId: northWales.id,
    latitude: 53.0995, longitude: -4.0890, rockType: RockType.OTHER,
    description: 'The big dark crag at the top of the Llanberis Pass. Great Northern Slab is one of the finest multi-pitch climbs in Wales.',
    approach: 'Park at Pont Cromlech or Ynys Ettws. 45 min walk up steep hillside.',
    parkingInfo: 'Ynys Ettws car park (BMC hut) or lay-bys in Llanberis Pass.',
  });
  const cyrnMain = await upsertButtress(buttRepo, { name: 'Main Face', crag: cyrnLas, cragId: cyrnLas.id, sortOrder: 1 });
  await routeRepo.save([
    tradRoute('Great Northern Slab', 'VD', '3b', cyrnMain, { pitches: 6, height: 160, description: 'One of the great Welsh routes — a long slab climb in a remote position.', sortOrder: 1 }),
    tradRoute('Hammer', 'HVS', '5a', cyrnMain, { pitches: 4, height: 110, description: 'A classic HVS on the main face — sustained and well-positioned.', sortOrder: 2 }),
    tradRoute('Crucible', 'E3', '5c', cyrnMain, { pitches: 3, height: 80, description: 'A serious and bold route on the upper face.', sortOrder: 3 }),
    tradRoute('North Buttress', 'S', '4a', cyrnMain, { pitches: 5, height: 130, description: 'The original route on the crag — a classic mountain adventure.', sortOrder: 4 }),
  ]);

  // ── Clogwyn Du'r Arddu (expanded) ─────────────────────────────────────────
  const cloggy = await upsertCrag(cragRepo, {
    name: "Clogwyn Du'r Arddu", region: snowdonia, regionId: snowdonia.id,
    latitude: 53.0840, longitude: -4.0625, rockType: RockType.OTHER,
    description: 'The Black Cliff — Britain\'s most legendary mountain crag. Steep, compact and perfect rhyolite giving some of the finest traditional routes in the world.',
    approach: '1.5 hr walk from Llanberis via the Snowdon train track or Rhyd-ddu. Remote and serious approach.',
    parkingInfo: 'Llanberis car parks. Alternatively Rhyd-ddu car park on the A4085.',
  });
  const clogWest  = await upsertButtress(buttRepo, { name: 'West Buttress', crag: cloggy, cragId: cloggy.id, sortOrder: 1 });
  const clogEast  = await upsertButtress(buttRepo, { name: 'East Buttress', crag: cloggy, cragId: cloggy.id, sortOrder: 2 });
  const clogSlab  = await upsertButtress(buttRepo, { name: 'Slabs', crag: cloggy, cragId: cloggy.id, sortOrder: 3 });
  await routeRepo.save([
    tradRoute('Great Slab', 'HVS', '5a', clogSlab, { pitches: 3, height: 85, description: 'A tremendous slab route — one of the classic routes on Cloggy.', sortOrder: 1 }),
    tradRoute('White Slab', 'E1', '5b', clogSlab, { pitches: 3, height: 90, description: 'The great white slab — one of the best routes of its grade in Britain.', sortOrder: 2 }),
    tradRoute('Vember', 'E2', '5b', clogWest, { pitches: 4, height: 110, description: 'A superb sustained route on the West Buttress.', sortOrder: 1 }),
    tradRoute('Taurus', 'E2', '5b', clogWest, { pitches: 4, height: 110, description: 'The companion route to Vember — equally good.', sortOrder: 2 }),
    tradRoute('West Buttress Eliminate', 'E3', '5c', clogWest, { pitches: 3, height: 90, description: 'Hard climbing on the West Buttress — a route of great character.', sortOrder: 3 }),
    tradRoute('Pinnacle Flake', 'VS', '4c', clogWest, { pitches: 4, height: 100, description: 'A long classic VS on Cloggy — one of the easiest routes on the crag.', sortOrder: 4 }),
    tradRoute('Black Cleft', 'VD', '3c', clogWest, { pitches: 4, height: 100, description: 'The original easy route on Cloggy — a true mountaineering adventure.', sortOrder: 5 }),
    tradRoute('Woubits', 'E4', '6a', clogEast, { pitches: 3, height: 85, description: 'A hard route on the East Buttress.', sortOrder: 1 }),
    tradRoute('Octo', 'E3', '5c', clogEast, { pitches: 3, height: 85, description: 'A fine sustained route — bold and technical.', sortOrder: 2 }),
    tradRoute('Sheaf', 'E5', '6a', clogEast, { pitches: 2, height: 55, description: 'One of the hardest routes on the East Buttress.', sortOrder: 3 }),
  ]);

  // ── Tremadog (expanded) ───────────────────────────────────────────────────
  const tremd = await upsertCrag(cragRepo, {
    name: 'Tremadog', region: snowdonia, regionId: snowdonia.id,
    latitude: 52.9256, longitude: -4.1690, rockType: RockType.OTHER,
    description: 'A series of rhyolite outcrops near Portmadog giving excellent quick-drying sport and trad routes. Fingerlicker and Vector are among the most-repeated hard trad routes in Wales.',
    approach: 'Park in the Tremadog village car park. Crags are accessed from the road below the rocks.',
    parkingInfo: 'Village car park in Tremadog (pay & display). Limited roadside.',
  });
  const tremdEric   = await upsertButtress(buttRepo, { name: 'Eric\'s Buttress', crag: tremd, cragId: tremd.id, sortOrder: 1 });
  const tremdVector = await upsertButtress(buttRepo, { name: 'Vector Buttress', crag: tremd, cragId: tremd.id, sortOrder: 2 });
  const tremdCraig  = await upsertButtress(buttRepo, { name: 'Craig Bwlch y Moch', crag: tremd, cragId: tremd.id, sortOrder: 3 });
  await routeRepo.save([
    tradRoute('Vector', 'E2', '5c', tremdVector, { pitches: 3, height: 65, description: 'One of the great Welsh trad routes — sustained, technical and beautifully positioned on the Vector Buttress.', sortOrder: 1 }),
    tradRoute('Eric\'s Variation', 'E2', '5c', tremdEric, { pitches: 2, height: 45, description: 'A sustained and technical route — one of the best E2s at Tremadog.', sortOrder: 1 }),
    tradRoute('Fingerlicker', 'E3', '5c', tremdEric, { pitches: 3, height: 60, description: 'A Tremadog classic — thin and technical on perfect rhyolite.', sortOrder: 2 }),
    tradRoute('Valerie\'s Arête', 'E1', '5b', tremdEric, { pitches: 2, height: 45, description: 'The fine arête — one of the best E1s at Tremadog.', sortOrder: 3 }),
    tradRoute('Meshach', 'HVS', '5a', tremdEric, { pitches: 3, height: 60, description: 'A brilliant sustained HVS up the main face.', sortOrder: 4 }),
    tradRoute('Barbarian', 'E2', '5c', tremdVector, { pitches: 2, height: 50, description: 'Hard and technical — one of the Vector Buttress test pieces.', sortOrder: 2 }),
    tradRoute('Grim Wall', 'E4', '6a', tremdVector, { pitches: 2, height: 45, description: 'The hardest route on Vector Buttress — desperate and technical.', sortOrder: 3 }),
    tradRoute('One Step in the Clouds', 'E1', '5b', tremdVector, { pitches: 3, height: 60, description: 'A fantastic E1 — varied climbing on excellent rhyolite.', sortOrder: 4 }),
    tradRoute('Pale Rider', 'E3', '6a', tremdCraig, { pitches: 2, height: 45, description: 'A hard route on the Craig Bwlch y Moch section.', sortOrder: 1 }),
    tradRoute('Tensor', 'E2', '5c', tremdCraig, { pitches: 3, height: 60, description: 'One of the best E2s at Tremadog — bold and sustained.', sortOrder: 2 }),
  ]);

  // ── Gogarth (expanded) ────────────────────────────────────────────────────
  const gogarth = await upsertCrag(cragRepo, {
    name: 'Gogarth', region: northWales, regionId: northWales.id,
    latitude: 53.3085, longitude: -4.6780, rockType: RockType.OTHER,
    description: 'The magnificent sea cliffs of Holy Island, Anglesey. Quartzite walls and zawn s giving some of the most spectacular sea cliff routes in the UK.',
    approach: 'Park at South Stack car park. Various approaches to different sections — 10-30 min walk.',
    parkingInfo: 'South Stack RSPB car park (pay & display). North Stack car park (limited).',
  });
  const gogarNS  = await upsertButtress(buttRepo, { name: 'North Stack Wall', crag: gogarth, cragId: gogarth.id, sortOrder: 1 });
  const gogarMain = await upsertButtress(buttRepo, { name: 'Main Cliff', crag: gogarth, cragId: gogarth.id, sortOrder: 2 });
  const gogarParl = await upsertButtress(buttRepo, { name: 'Parliament House Cave', crag: gogarth, cragId: gogarth.id, sortOrder: 3 });
  await routeRepo.save([
    tradRoute('A Dream of White Horses', 'HVS', '4c', gogarMain, { pitches: 4, height: 100, description: 'One of the most celebrated routes in British rock climbing — a magnificent sea cliff adventure on Gogarth\'s Main Cliff.', sortOrder: 1 }),
    tradRoute('The Strand', 'E4', '6a', gogarMain, { pitches: 3, height: 70, description: 'A serious and sustained route on Main Cliff.', sortOrder: 2 }),
    tradRoute('Citadel', 'E5', '6b', gogarMain, { pitches: 2, height: 50, description: 'One of the hardest classic routes on Gogarth.', sortOrder: 3 }),
    tradRoute('Rat Race', 'E3', '5c', gogarMain, { pitches: 3, height: 65, description: 'A brilliant route up the central section of Main Cliff.', sortOrder: 4 }),
    tradRoute('Dinosaur', 'E3', '5c', gogarNS, { pitches: 2, height: 50, description: 'Classic wall climbing on the North Stack Wall.', sortOrder: 1 }),
    tradRoute('Positron', 'E5', '6b', gogarNS, { pitches: 2, height: 50, description: 'One of the great North Stack routes — technical and serious.', sortOrder: 2 }),
    tradRoute('T. Rex', 'E4', '6a', gogarNS, { pitches: 2, height: 50, description: 'A classic serious wall route on the North Stack.', sortOrder: 3 }),
    tradRoute('Ordinary Route', 'VD', '3b', gogarParl, { pitches: 2, height: 30, description: 'The easiest route at Gogarth — a classic sea-cliff experience.', sortOrder: 1 }),
    tradRoute('Red Wall', 'E3', '5c', gogarParl, { pitches: 2, height: 40, description: 'One of the most striking lines at Gogarth.', sortOrder: 2 }),
  ]);

  // ── Idwal Slabs (expanded) ────────────────────────────────────────────────
  const idwal = await upsertCrag(cragRepo, {
    name: 'Idwal Slabs', region: snowdonia, regionId: snowdonia.id,
    latitude: 53.1175, longitude: -3.9985, rockType: RockType.OTHER,
    description: 'Classic rhyolite slabs in the Ogwen Valley — one of the most popular and accessible mountain crags in Wales. Excellent for beginners and intermediates.',
    approach: '15 min walk from Ogwen Cottage. Follow the path to Cwm Idwal NNR.',
    parkingInfo: 'Ogwen Cottage (Bangor University Outdoor Centre) car park (pay & display). On A5.',
  });
  const idwalSlabs = await upsertButtress(buttRepo, { name: 'Main Slabs', crag: idwal, cragId: idwal.id, sortOrder: 1 });
  const idwalHope  = await upsertButtress(buttRepo, { name: 'Hope Area', crag: idwal, cragId: idwal.id, sortOrder: 2 });
  await routeRepo.save([
    tradRoute('Original Route', 'D', '2c', idwalSlabs, { pitches: 4, height: 100, description: 'The classic easy slab route on Idwal — one of the most popular in North Wales.', sortOrder: 1 }),
    tradRoute('Tennis Shoe Route', 'VD', '3a', idwalSlabs, { pitches: 4, height: 100, description: 'Another magnificent slab route — very popular with beginners.', sortOrder: 2 }),
    tradRoute('Ordinary Route (Idwal)', 'M', '2a', idwalSlabs, { pitches: 4, height: 100, description: 'The easiest route on the slabs — ideal for absolute beginners.', sortOrder: 3 }),
    tradRoute('Lazarus', 'VD', '3c', idwalSlabs, { pitches: 3, height: 75, description: 'Takes a more technical line on the right side of the slabs.', sortOrder: 4 }),
    tradRoute('Faith', 'HVS', '5a', idwalSlabs, { pitches: 3, height: 75, description: 'The hardest of the classic slab routes — thin and technical.', sortOrder: 5 }),
    tradRoute('Hope', 'VS', '4c', idwalHope, { pitches: 3, height: 75, description: 'A fine VS on the Hope area of the slabs.', sortOrder: 1 }),
    tradRoute('Charity', 'S', '4a', idwalHope, { pitches: 3, height: 70, description: 'The third of the classical trio — gentle and satisfying.', sortOrder: 2 }),
  ]);

  // ── Tryfan East Face (expanded) ───────────────────────────────────────────
  const tryfan = await upsertCrag(cragRepo, {
    name: 'Tryfan East Face', region: snowdonia, regionId: snowdonia.id,
    latitude: 53.1055, longitude: -3.9820, rockType: RockType.OTHER,
    description: 'The magnificent east face of Tryfan in the Ogwen Valley. Classic routes from Diff to E5 on excellent rhyolite.',
    approach: '45 min walk from Ogwen Cottage via Llyn Bochlwyd.',
    parkingInfo: 'Ogwen Cottage (A5) or Gwern Gof Uchaf farm track.',
  });
  const tryfNB = await upsertButtress(buttRepo, { name: 'North Buttress', crag: tryfan, cragId: tryfan.id, sortOrder: 1 });
  const tryfMilk = await upsertButtress(buttRepo, { name: 'Milestone Buttress', crag: tryfan, cragId: tryfan.id, sortOrder: 2 });
  await routeRepo.save([
    tradRoute('Grooved Arête', 'VD', '3c', tryfNB, { pitches: 6, height: 150, description: 'The finest Difficult/VD route in Wales — a long ridge with excellent views.', sortOrder: 1 }),
    tradRoute('North Buttress', 'D', '3a', tryfNB, { pitches: 5, height: 130, description: 'The classic easy mountain route on Tryfan\'s East Face.', sortOrder: 2 }),
    tradRoute('Gashed Crag', 'VD', '3b', tryfNB, { pitches: 4, height: 110, description: 'Another classic easy-grade route on the East Face.', sortOrder: 3 }),
    tradRoute('Belle Vue Bastion', 'VS', '4c', tryfNB, { pitches: 3, height: 75, description: 'A famous VS on the lower section of the East Face.', sortOrder: 4 }),
    tradRoute('Overlapping Ridge', 'VD', '3c', tryfMilk, { pitches: 4, height: 100, description: 'Classic ridge route below the Milestone Buttress.', sortOrder: 1 }),
    tradRoute('Milestone Buttress Direct', 'VD', '3c', tryfMilk, { pitches: 3, height: 80, description: 'Direct route up the lowest section of the East Face.', sortOrder: 2 }),
  ]);

  // ── Clogwyn y Grochan ─────────────────────────────────────────────────────
  const grochan = await upsertCrag(cragRepo, {
    name: 'Clogwyn y Grochan', region: northWales, regionId: northWales.id,
    latitude: 53.1078, longitude: -4.0560, rockType: RockType.OTHER,
    description: 'One of the Llanberis Pass crags facing the road. Cenotaph Slabs, Brant and Zig Zag are all classics.',
    approach: 'Park in the Llanberis Pass lay-bys. 10 min walk up the hillside.',
    parkingInfo: 'Various lay-bys in the Llanberis Pass on A4086.',
  });
  const grochanMain = await upsertButtress(buttRepo, { name: 'Main Face', crag: grochan, cragId: grochan.id, sortOrder: 1 });
  await routeRepo.save([
    tradRoute('Zig Zag', 'S', '3c', grochanMain, { pitches: 3, height: 65, description: 'The classic easy route on Clogwyn y Grochan — a fun mountain outing.', sortOrder: 1 }),
    tradRoute('Brant', 'HVS', '5a', grochanMain, { pitches: 3, height: 65, description: 'One of the best HVS routes in the Pass — sustained and well-positioned.', sortOrder: 2 }),
    tradRoute('Cenotaph Slabs', 'VD', '3b', grochanMain, { pitches: 2, height: 45, description: 'Fine slab climbing below the main crag.', sortOrder: 3 }),
    tradRoute('Spectre', 'E2', '5c', grochanMain, { pitches: 2, height: 50, description: 'A modern classic — bold face climbing.', sortOrder: 4 }),
  ]);

  // ── Carreg Wastad (expanded) ──────────────────────────────────────────────
  const carregW = await upsertCrag(cragRepo, {
    name: 'Carreg Wastad', region: northWales, regionId: northWales.id,
    latitude: 53.1109, longitude: -4.0575, rockType: RockType.OTHER,
    description: 'A compact roadside crag in the Llanberis Pass with excellent routes on perfect rhyolite.',
    approach: 'Park at the roadside lay-by directly below the crag. 5 min walk.',
    parkingInfo: 'Lay-by on A4086 in the Llanberis Pass. Often full at weekends.',
  });
  const cwMain = await upsertButtress(buttRepo, { name: 'Main Face', crag: carregW, cragId: carregW.id, sortOrder: 1 });
  await routeRepo.save([
    tradRoute('Wrinkle', 'VS', '4c', cwMain, { pitches: 2, height: 35, description: 'The classic VS on Carreg Wastad — well-worn and popular.', sortOrder: 1 }),
    tradRoute('Crackstone Rib', 'HS', '4b', cwMain, { pitches: 2, height: 30, description: 'The easiest classic on the crag — a fine rib route.', sortOrder: 2 }),
    tradRoute('Erosion Groove', 'S', '3c', cwMain, { pitches: 2, height: 30, description: 'The easiest of the classic routes — straightforward groove climbing.', sortOrder: 3 }),
    tradRoute('Allt Meurrig', 'E1', '5b', cwMain, { pitches: 2, height: 35, description: 'Technical wall climbing on good rock.', sortOrder: 4 }),
    tradRoute('Brant Direct', 'E2', '5c', cwMain, { pitches: 2, height: 35, description: 'The direct start to Brant — harder and bolder.', sortOrder: 5 }),
  ]);
}
