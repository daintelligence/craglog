import { DataSource } from 'typeorm';
import { Region } from '../../modules/crags/entities/region.entity';
import { Crag, RockType } from '../../modules/crags/entities/crag.entity';
import { Buttress } from '../../modules/crags/entities/buttress.entity';
import { Route } from '../../modules/routes/entities/route.entity';
import { findOrCreateRegion, upsertCrag, upsertButtress, tradRoute, sportRoute } from './seed-helpers';

export async function seedSouthernCragsExtended(ds: DataSource) {
  const regionRepo = ds.getRepository(Region);
  const cragRepo   = ds.getRepository(Crag);
  const buttRepo   = ds.getRepository(Buttress);
  const routeRepo  = ds.getRepository(Route);

  const dorset  = await findOrCreateRegion(regionRepo, { name: 'Dorset', country: 'England', description: 'Jurassic Coast limestone sport and trad climbing.' });
  const cornwall = await findOrCreateRegion(regionRepo, { name: 'Cornwall', country: 'England', description: 'Granite sea cliffs and inland crags of West Cornwall.' });
  const gower   = await findOrCreateRegion(regionRepo, { name: 'Gower Peninsula', country: 'Wales', description: 'Limestone sea cliffs of the Gower Peninsula.' });
  const avon    = await findOrCreateRegion(regionRepo, { name: 'Avon & Bristol', country: 'England', description: 'Avon Gorge and surrounding crags.' });
  const pembroke = await findOrCreateRegion(regionRepo, { name: 'Pembrokeshire', country: 'Wales', description: 'Sea cliffs of Pembrokeshire.' });

  // ── Swanage (expanded) ────────────────────────────────────────────────────
  const swanage = await upsertCrag(cragRepo, {
    name: 'Swanage', region: dorset, regionId: dorset.id,
    latitude: 50.6058, longitude: -1.9820, rockType: RockType.LIMESTONE,
    description: 'Jurassic limestone sea cliffs giving long sport and trad routes in the finest setting on the South Coast. Subluminal, Marmolata and Primal Scream are legendary hard routes.',
    approach: 'Various approaches from the coast path and Dancing Ledge.',
    parkingInfo: 'Langton Matravers car park or Worth Matravers (pay & display). Or Swanage town.',
  });
  const swanBSlab  = await upsertButtress(buttRepo, { name: 'Boulder Ruckle', crag: swanage, cragId: swanage.id, sortOrder: 1 });
  const swanBlind  = await upsertButtress(buttRepo, { name: 'Blind Man\'s Zawn', crag: swanage, cragId: swanage.id, sortOrder: 2 });
  const swanConning = await upsertButtress(buttRepo, { name: 'Conner Cove', crag: swanage, cragId: swanage.id, sortOrder: 3 });
  await routeRepo.save([
    tradRoute('Subluminal', 'E6', '6b', swanBSlab, { pitches: 2, height: 40, description: 'One of the hardest traditional routes in Britain — a desperate and serious face climb on the Ruckle.', sortOrder: 1 }),
    tradRoute('Primal Scream', 'E7', '6c', swanBSlab, { height: 35, description: 'Martin Crocker\'s fearsome route — one of the boldest at Swanage.', sortOrder: 2 }),
    tradRoute('Marmolata', 'E2', '5c', swanBSlab, { pitches: 3, height: 50, description: 'Classic sustained trad route — one of the best at Swanage.', sortOrder: 3 }),
    tradRoute('Finale Groove', 'E1', '5b', swanBSlab, { pitches: 2, height: 40, description: 'A fine E1 — exposed and varied.', sortOrder: 4 }),
    sportRoute('Blind Man\'s Route', '7a', swanBlind, { height: 22, description: 'Popular sport route in the zawn.', sortOrder: 1 }),
    sportRoute('Flash Zawn', '7b+', swanBlind, { height: 25, description: 'Hard sport climbing in the zawn.', sortOrder: 2 }),
    tradRoute('Tom Tom', 'HVS', '5a', swanConning, { pitches: 2, height: 35, description: 'Classic route — one of the better HVS options at Swanage.', sortOrder: 1 }),
    tradRoute('Cormorant', 'VS', '4c', swanConning, { pitches: 2, height: 30, description: 'Fine VS sea cliff route.', sortOrder: 2 }),
  ]);

  // ── Portland (expanded) ───────────────────────────────────────────────────
  const portland = await upsertCrag(cragRepo, {
    name: 'Portland Bill', region: dorset, regionId: dorset.id,
    latitude: 50.5140, longitude: -2.4570, rockType: RockType.LIMESTONE,
    description: 'An excellent limestone sport climbing venue on the Isle of Portland. Cave Hole, White Hole and Blacknor offer a huge range of sport routes.',
    approach: 'Walk from Portland Bill car park. Various sectors along the coastal path.',
    parkingInfo: 'Portland Bill car park (pay & display). Various other car parks on the island.',
  });
  const portlandCave = await upsertButtress(buttRepo, { name: 'Cave Hole', crag: portland, cragId: portland.id, sortOrder: 1 });
  const portlandWH   = await upsertButtress(buttRepo, { name: 'White Hole', crag: portland, cragId: portland.id, sortOrder: 2 });
  const portlandBlack = await upsertButtress(buttRepo, { name: 'Blacknor South', crag: portland, cragId: portland.id, sortOrder: 3 });
  await routeRepo.save([
    sportRoute('Groove is in the Heart', '7a', portlandCave, { height: 18, description: 'Classic Portland sport route — well polished and popular.', sortOrder: 1 }),
    sportRoute('Boof Crack', '6c', portlandCave, { height: 15, description: 'A good sport route suitable for intermediate climbers.', sortOrder: 2 }),
    sportRoute('Screaming Dream', '7b+', portlandCave, { height: 20, description: 'One of Cave Hole\'s classics.', sortOrder: 3 }),
    sportRoute('White Gold', '7a+', portlandWH, { height: 18, description: 'An excellent sport route on White Hole.', sortOrder: 1 }),
    sportRoute('Limestone Cowboy', '6b+', portlandWH, { height: 16, description: 'A popular mid-grade sport route.', sortOrder: 2 }),
    sportRoute('Blacknor Classic', '6c+', portlandBlack, { height: 18, description: 'Classic sport route at Blacknor.', sortOrder: 1 }),
    sportRoute('Snapper', '7b', portlandBlack, { height: 20, description: 'A quality sport route at Blacknor South.', sortOrder: 2 }),
    tradRoute('White Ledge Route', 'HS', '4b', portlandWH, { height: 14, description: 'Traditional route on the white ledge section.', sortOrder: 3 }),
  ]);

  // ── Gower (expanded) ──────────────────────────────────────────────────────
  const gowerMain = await upsertCrag(cragRepo, {
    name: 'Pennard Cliffs', region: gower, regionId: gower.id,
    latitude: 51.5680, longitude: -4.1060, rockType: RockType.LIMESTONE,
    description: 'The limestone sea cliffs of the Gower Peninsula above Three Cliffs Bay. Classic trad routes with stunning coastal settings.',
    approach: 'Walk from the car park at Southgate or Pennard Castle. Various routes 5-20 min.',
    parkingInfo: 'Southgate car park or roadside near Pennard Castle. Busy in summer.',
  });
  const pennardMain = await upsertButtress(buttRepo, { name: 'Main Cliff', crag: gowerMain, cragId: gowerMain.id, sortOrder: 1 });
  await routeRepo.save([
    tradRoute('Deep Space', 'E2', '5c', pennardMain, { pitches: 2, height: 35, description: 'Superb route taking the orange wall above the sea.', sortOrder: 1 }),
    tradRoute('Fine Limit', 'E3', '5c', pennardMain, { pitches: 2, height: 35, description: 'One of the best Gower routes — serious and technical.', sortOrder: 2 }),
    tradRoute('Zero', 'E1', '5b', pennardMain, { pitches: 2, height: 30, description: 'Classic E1 on Pennard Cliffs.', sortOrder: 3 }),
    tradRoute('Long Climb', 'VD', '3b', pennardMain, { pitches: 3, height: 60, description: 'The classic easy outing on the Gower cliffs.', sortOrder: 4 }),
    tradRoute('Great Wall', 'VS', '4c', pennardMain, { pitches: 2, height: 35, description: 'A fine VS in an exposed coastal position.', sortOrder: 5 }),
  ]);

  const mewslade = await upsertCrag(cragRepo, {
    name: 'Mewslade Bay', region: gower, regionId: gower.id,
    latitude: 51.5568, longitude: -4.2150, rockType: RockType.LIMESTONE,
    description: 'Sea cave and cliff climbing in a spectacular bay on the south Gower coast.',
    approach: 'Walk from Pitton village or Mewslade car park (1 km walk through fields).',
    parkingInfo: 'Small car park at Pitton. Walk through the farm to the coast.',
  });
  const mewMain = await upsertButtress(buttRepo, { name: 'Main Cliff', crag: mewslade, cragId: mewslade.id, sortOrder: 1 });
  await routeRepo.save([
    tradRoute('Fall Bay', 'VD', '3b', mewMain, { pitches: 2, height: 40, description: 'Classic easy route on the main Mewslade cliffs.', sortOrder: 1 }),
    tradRoute('A Likely Story', 'E1', '5b', mewMain, { pitches: 2, height: 35, description: 'A fine E1 in a spectacular position.', sortOrder: 2 }),
    tradRoute('Blue Horizon', 'HVS', '5a', mewMain, { pitches: 2, height: 35, description: 'Classic HVS above the bay.', sortOrder: 3 }),
  ]);

  // ── Bosigran (expanded) ───────────────────────────────────────────────────
  const bosigran = await upsertCrag(cragRepo, {
    name: 'Bosigran', region: cornwall, regionId: cornwall.id,
    latitude: 50.1640, longitude: -5.6200, rockType: RockType.GRANITE,
    description: 'The finest cliff in West Penwith — a long granite face giving multi-pitch trad routes. Count Dracula, Suicide Wall and Kamikaze are all-time Cornish classics.',
    approach: 'Park at Carn Galver or the Coast Path car park. 15-25 min walk along the coast path.',
    parkingInfo: 'Car park near Rosemergy farm on B3306. Alternatively Zennor car park.',
  });
  const bosMain = await upsertButtress(buttRepo, { name: 'Main Face', crag: bosigran, cragId: bosigran.id, sortOrder: 1 });
  const bosRight = await upsertButtress(buttRepo, { name: 'Porthmoina Cove', crag: bosigran, cragId: bosigran.id, sortOrder: 2 });
  await routeRepo.save([
    tradRoute('Count Dracula', 'E2', '5c', bosMain, { pitches: 3, height: 65, description: 'The Bosigran E2 classic — a sustained and well-protected route on excellent granite.', sortOrder: 1 }),
    tradRoute('Suicide Wall', 'E1', '5b', bosMain, { pitches: 3, height: 60, description: 'One of the finest multi-pitch routes in Cornwall — atmospheric and gripping.', sortOrder: 2 }),
    tradRoute('Commando Ridge', 'VD', '3c', bosMain, { pitches: 4, height: 90, description: 'The classic easy ridge on Bosigran — fine climbing on rough granite.', sortOrder: 3 }),
    tradRoute('Doorpost', 'VS', '4c', bosMain, { pitches: 3, height: 65, description: 'A classic VS — one of the best at this grade in Cornwall.', sortOrder: 4 }),
    tradRoute('Little Brown Jug', 'HVS', '5a', bosMain, { pitches: 3, height: 60, description: 'Strenuous jamming crack — a major Bosigran classic.', sortOrder: 5 }),
    tradRoute('Bosigran Ridge', 'D', '3a', bosMain, { pitches: 4, height: 80, description: 'The long, easy ridge — a classic rambling route.', sortOrder: 6 }),
    tradRoute('Ledge Route', 'D', '2c', bosMain, { pitches: 3, height: 60, description: 'Easy climbing along the ledge line.', sortOrder: 7 }),
    tradRoute('Kamikaze', 'E3', '5c', bosRight, { pitches: 2, height: 45, description: 'One of Bosigran\'s harder routes — bold and technical.', sortOrder: 1 }),
    tradRoute('Black Slab', 'VS', '4c', bosRight, { pitches: 2, height: 40, description: 'Classic VS on the right section of the cliff.', sortOrder: 2 }),
  ]);

  // ── St Govan's Head (expanded) ────────────────────────────────────────────
  const stGovans = await upsertCrag(cragRepo, {
    name: 'St Govan\'s Head', region: pembroke, regionId: pembroke.id,
    latitude: 51.5987, longitude: -4.9595, rockType: RockType.LIMESTONE,
    description: 'Classic sport and trad climbing on the Pembrokeshire sea cliffs around St Govan\'s Chapel and Mewsford Point.',
    approach: 'Park at St Govan\'s car park (restricted access when MOD ranges active). 5 min walk.',
    parkingInfo: 'St Govan\'s car park (free, but check MOD access at pembrokeshirecoast.org).',
  });
  const govMain = await upsertButtress(buttRepo, { name: 'Main Cliff', crag: stGovans, cragId: stGovans.id, sortOrder: 1 });
  await routeRepo.save([
    sportRoute('Ben Whetton\'s Route', '6b', govMain, { height: 18, description: 'Classic sport route on the main cliff.', sortOrder: 1 }),
    sportRoute('Supernova', '7a', govMain, { height: 20, description: 'Hard sport route at St Govan\'s.', sortOrder: 2 }),
    tradRoute('Left Edge', 'VS', '4c', govMain, { height: 20, description: 'Classic VS on the left side of the main cliff.', sortOrder: 3 }),
    tradRoute('Direct Route', 'HVS', '5a', govMain, { height: 22, description: 'Fine HVS up the main wall.', sortOrder: 4 }),
    tradRoute('Mewsford Point', 'E2', '5c', govMain, { height: 25, description: 'One of the better trad routes at St Govan\'s Head.', sortOrder: 5 }),
  ]);

  // ── Avon Gorge (expanded) ─────────────────────────────────────────────────
  const avonGorge = await upsertCrag(cragRepo, {
    name: 'Avon Gorge', region: avon, regionId: avon.id,
    latitude: 51.4621, longitude: -2.6290, rockType: RockType.LIMESTONE,
    description: 'Urban limestone in the spectacular Avon Gorge below Brunel\'s Suspension Bridge. Main Wall and Suspension Bridge Buttress give classic multi-pitch adventures.',
    approach: 'Access from Clifton Suspension Bridge end or Hotwells. 5-10 min from parking.',
    parkingInfo: 'Clifton Downs car park or Brunel Way car park. Limited and busy.',
  });
  const avonMain = await upsertButtress(buttRepo, { name: 'Main Wall', crag: avonGorge, cragId: avonGorge.id, sortOrder: 1 });
  const avonSBB  = await upsertButtress(buttRepo, { name: 'Suspension Bridge Buttress', crag: avonGorge, cragId: avonGorge.id, sortOrder: 2 });
  await routeRepo.save([
    tradRoute('Malbogies', 'E5', '6b', avonMain, { pitches: 3, height: 70, description: 'One of the hardest routes in the Avon Gorge — a bold and technical masterpiece.', sortOrder: 1 }),
    tradRoute('Suspension Bridge Buttress', 'VD', '3b', avonSBB, { pitches: 3, height: 60, description: 'The classic easy route on the Avon Gorge — a unique urban climbing experience.', sortOrder: 1 }),
    tradRoute('Inaccessible Pinnacle', 'HS', '4b', avonMain, { pitches: 2, height: 45, description: 'Takes the prominent pinnacle feature on the main wall.', sortOrder: 2 }),
    sportRoute('Main Overhang', '7b', avonMain, { height: 25, description: 'Hard sport route through the main overhang section.', sortOrder: 3 }),
    tradRoute('Lime Street', 'VS', '4c', avonMain, { pitches: 2, height: 40, description: 'A classic VS on the main wall — well-protected.', sortOrder: 4 }),
    tradRoute('Direct Route', 'E1', '5b', avonMain, { pitches: 2, height: 40, description: 'Fine direct line on the Avon Gorge limestone.', sortOrder: 5 }),
  ]);

  // ── Chair Ladder (expanded) ───────────────────────────────────────────────
  const chairLadder = await upsertCrag(cragRepo, {
    name: 'Chair Ladder', region: cornwall, regionId: cornwall.id,
    latitude: 50.0395, longitude: -5.6730, rockType: RockType.GRANITE,
    description: 'The finest granite sea cliff in Cornwall. A tiered cliff above Porthgwarra Cove giving long multi-pitch routes in a superb coastal setting.',
    approach: 'Park at Porthgwarra. 20 min walk to the cliff-top abseil descent.',
    parkingInfo: 'Porthgwarra car park (small, limited spaces). Arrive early in summer.',
  });
  const clMain = await upsertButtress(buttRepo, { name: 'Main Face', crag: chairLadder, cragId: chairLadder.id, sortOrder: 1 });
  const clSunset = await upsertButtress(buttRepo, { name: 'Sunset Face', crag: chairLadder, cragId: chairLadder.id, sortOrder: 2 });
  await routeRepo.save([
    tradRoute('Bishop\'s Rib', 'VD', '3c', clMain, { pitches: 4, height: 90, description: 'The classic easy route on Chair Ladder — a long granite adventure.', sortOrder: 1 }),
    tradRoute('Chair Ladder Ordinary', 'D', '3a', clMain, { pitches: 4, height: 80, description: 'The original route — takes the easiest line up the cliff.', sortOrder: 2 }),
    tradRoute('Terrier\'s Tooth', 'S', '3c', clMain, { pitches: 3, height: 65, description: 'A classic route taking the prominent tooth feature.', sortOrder: 3 }),
    tradRoute('Demo Route', 'VS', '4c', clMain, { pitches: 3, height: 70, description: 'A fine VS on excellent granite.', sortOrder: 4 }),
    tradRoute('Carn Boel', 'HVS', '5a', clSunset, { pitches: 3, height: 65, description: 'Technical wall climbing on the Sunset Face.', sortOrder: 1 }),
    tradRoute('Pendulum', 'E2', '5c', clSunset, { pitches: 2, height: 50, description: 'One of the hardest classics on Chair Ladder.', sortOrder: 2 }),
  ]);
}
