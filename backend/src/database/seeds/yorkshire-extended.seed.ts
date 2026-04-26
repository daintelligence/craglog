import { DataSource } from 'typeorm';
import { Region } from '../../modules/crags/entities/region.entity';
import { Crag, RockType } from '../../modules/crags/entities/crag.entity';
import { Buttress } from '../../modules/crags/entities/buttress.entity';
import { Route } from '../../modules/routes/entities/route.entity';
import { findOrCreateRegion, upsertCrag, upsertButtress, tradRoute, sportRoute } from './seed-helpers';

export async function seedYorkshireExtended(ds: DataSource) {
  const regionRepo = ds.getRepository(Region);
  const cragRepo   = ds.getRepository(Crag);
  const buttRepo   = ds.getRepository(Buttress);
  const routeRepo  = ds.getRepository(Route);

  const yorkshireDales = await findOrCreateRegion(regionRepo, {
    name: 'Yorkshire Dales', country: 'England',
    description: 'Yorkshire limestone sport and trad classics.',
  });
  const yorkshire = await findOrCreateRegion(regionRepo, {
    name: 'Yorkshire', country: 'England',
    description: 'Yorkshire gritstone edges and limestone crags.',
  });

  // ── Kilnsey Crag (expanded) ───────────────────────────────────────────────
  const kilnsey = await upsertCrag(cragRepo, {
    name: 'Kilnsey Crag', region: yorkshireDales, regionId: yorkshireDales.id,
    latitude: 54.0630, longitude: -2.0120, rockType: RockType.LIMESTONE,
    description: 'The most impressive overhanging limestone cliff in the North of England. The 10-metre roof overhang is unmistakable. Excellent sport routes and hard trad.',
    approach: '2 min walk from the village. The cliff is roadside.',
    parkingInfo: 'Small car park at the cliff base in Kilnsey village (B6160). Overflow on verges.',
  });
  const kilnseyMain = await upsertButtress(buttRepo, { name: 'Main Overhang', crag: kilnsey, cragId: kilnsey.id, sortOrder: 1 });
  const kilnseyLeft = await upsertButtress(buttRepo, { name: 'Left Wing', crag: kilnsey, cragId: kilnsey.id, sortOrder: 2 });
  await routeRepo.save([
    tradRoute('Original Route', 'HVS', '5a', kilnseyLeft, { pitches: 2, height: 35, description: 'The classic trad route at Kilnsey — takes the pillar left of the main overhang.', sortOrder: 1 }),
    tradRoute('Kilnsey Crack', 'E1', '5b', kilnseyLeft, { pitches: 2, height: 30, description: 'A direct crack up the left wing.', sortOrder: 2 }),
    sportRoute('Diedre du Sommet', '7a', kilnseyMain, { height: 25, description: 'The classic sport route through the main overhang.', sortOrder: 1 }),
    sportRoute('Cut-Throat', '7b', kilnseyMain, { height: 28, description: 'Hard sport route up the overhanging section.', sortOrder: 2 }),
    sportRoute('Big John', '7c', kilnseyMain, { height: 28, description: 'Through the biggest section of the overhang.', sortOrder: 3 }),
    sportRoute('Northern Lights', '6c', kilnseyMain, { height: 22, description: 'One of the more accessible sport routes here.', sortOrder: 4 }),
    sportRoute('Mandela', '7a+', kilnseyMain, { height: 26, description: 'A popular hard route up the main crag.', sortOrder: 5 }),
    sportRoute('The Dawgfather', '8a', kilnseyMain, { height: 28, description: 'One of the hardest routes at Kilnsey.', sortOrder: 6 }),
    tradRoute('Directissima', 'E3', '5c', kilnseyMain, { height: 30, description: 'A bold trad route through the overhang — one of the great trad adventures.', sortOrder: 7 }),
  ]);

  // ── Gordale Scar (expanded) ───────────────────────────────────────────────
  const gordale = await upsertCrag(cragRepo, {
    name: 'Gordale Scar', region: yorkshireDales, regionId: yorkshireDales.id,
    latitude: 54.0671, longitude: -2.1125, rockType: RockType.LIMESTONE,
    description: 'A spectacular overhanging limestone gorge near Malham. Excellent sport and trad routes on the towering walls, plus the famous Gordale Direct entry pitch.',
    approach: '15 min walk from Malham village car park. Follow the path upstream.',
    parkingInfo: 'National Park car park in Malham village (pay & display).',
  });
  const gordaleMain = await upsertButtress(buttRepo, { name: 'Main Gorge', crag: gordale, cragId: gordale.id, sortOrder: 1 });
  const gordaleLeft = await upsertButtress(buttRepo, { name: 'Left Wall', crag: gordale, cragId: gordale.id, sortOrder: 2 });
  await routeRepo.save([
    tradRoute('Gordale Scar (Zig-Zag)', 'VS', '4c', gordaleMain, { pitches: 2, height: 50, description: 'The original route through the gorge — a classic adventure route.', sortOrder: 1 }),
    tradRoute('John Sheard\'s Route', 'E1', '5b', gordaleMain, { pitches: 3, height: 60, description: 'Takes the main wall above the waterfall — sustained and well-protected.', sortOrder: 2 }),
    tradRoute('La Corniche', 'E4', '6a', gordaleMain, { pitches: 2, height: 45, description: 'The great overhanging corner — a classic hard route in the gorge.', sortOrder: 3 }),
    sportRoute('Black Mamba', '7b+', gordaleLeft, { height: 25, description: 'Classic sport route on the left wall.', sortOrder: 1 }),
    sportRoute('Reef Madness', '7a', gordaleLeft, { height: 22, description: 'An excellent sport route on the left wall.', sortOrder: 2 }),
    sportRoute('Aquamarine', '6c+', gordaleLeft, { height: 20, description: 'Good sport climbing on perfect limestone.', sortOrder: 3 }),
    tradRoute('Cave Route Right', 'HVS', '5a', gordaleMain, { pitches: 2, height: 40, description: 'Takes the right-hand exit from the cave — dramatic.', sortOrder: 4 }),
  ]);

  // ── Malham Cove (expanded) ────────────────────────────────────────────────
  const malham = await upsertCrag(cragRepo, {
    name: 'Malham Cove', region: yorkshireDales, regionId: yorkshireDales.id,
    latitude: 54.0703, longitude: -2.1537, rockType: RockType.LIMESTONE,
    description: 'The magnificent curved amphitheatre of Malham Cove — one of Britain\'s most spectacular natural features. Excellent sport climbing and classic trad multi-pitch.',
    approach: '20 min walk from Malham village. Follow the well-signed National Park path.',
    parkingInfo: 'National Park car park in Malham village (pay & display, toilets available).',
  });
  const malhamL = await upsertButtress(buttRepo, { name: 'Left Wing', crag: malham, cragId: malham.id, sortOrder: 1 });
  const malhamC = await upsertButtress(buttRepo, { name: 'Central Wall', crag: malham, cragId: malham.id, sortOrder: 2 });
  const malhamR = await upsertButtress(buttRepo, { name: 'Right Wing', crag: malham, cragId: malham.id, sortOrder: 3 });
  await routeRepo.save([
    tradRoute('Wired for Sound', 'HVS', '5a', malhamL, { pitches: 2, height: 60, description: 'A sustained HVS up the left wing — excellent positions.', sortOrder: 1 }),
    sportRoute('Raindogs', '7a', malhamC, { height: 25, description: 'One of the classic sport routes at Malham — popular and well-travelled.', sortOrder: 1 }),
    sportRoute('Zoolook', '7a', malhamC, { height: 25, description: 'A technical sport route on perfect limestone.', sortOrder: 2 }),
    sportRoute('Predator', '7b', malhamC, { height: 26, description: 'Hard sustained sport climbing on the central wall.', sortOrder: 3 }),
    sportRoute('Planet Earth', '7c+', malhamC, { height: 28, description: 'One of the hardest routes at Malham — sustained throughout.', sortOrder: 4 }),
    sportRoute('Obsession', '7a+', malhamR, { height: 24, description: 'Popular sport route on the right wing.', sortOrder: 1 }),
    sportRoute('Transporter', '6c', malhamR, { height: 22, description: 'A classic 6c — one of the more accessible sport routes.', sortOrder: 2 }),
    tradRoute('Cave Route Right-Hand', 'VS', '4c', malhamC, { pitches: 3, height: 80, description: 'The classic trad multi-pitch taking the cave and right-hand exit — an adventure.', sortOrder: 5 }),
    tradRoute('Midnight Cowboy', 'E2', '5c', malhamC, { pitches: 2, height: 55, description: 'Bold trad climbing on the central wall.', sortOrder: 6 }),
  ]);

  // ── Almscliff Crag (expanded) ─────────────────────────────────────────────
  const alms = await upsertCrag(cragRepo, {
    name: 'Almscliff Crag', region: yorkshire, regionId: yorkshire.id,
    latitude: 53.9595, longitude: -1.5815, rockType: RockType.GRITSTONE,
    description: 'The premier gritstone crag of West Yorkshire — a compact outcrop giving routes from VD to E5 on rough, featured gritstone. Low Man and High Man have classic routes.',
    approach: '5 min walk from the road near North Rigton village.',
    parkingInfo: 'Roadside parking near North Rigton or Huby village. Park considerately.',
  });
  const almsLow  = await upsertButtress(buttRepo, { name: 'Low Man', crag: alms, cragId: alms.id, sortOrder: 1 });
  const almsHigh = await upsertButtress(buttRepo, { name: 'High Man', crag: alms, cragId: alms.id, sortOrder: 2 });
  await routeRepo.save([
    tradRoute('Ordinary Route', 'D', '2c', almsLow, { height: 8, description: 'The easiest route on Low Man — a gentle introduction to Almscliff.', sortOrder: 1 }),
    tradRoute('Low Man Arête', 'VS', '4c', almsLow, { height: 8, description: 'Classic arête on the low outcrop.', sortOrder: 2 }),
    tradRoute('Western Front', 'HVS', '5a', almsLow, { height: 9, description: 'Technical wall on the west side of Low Man.', sortOrder: 3 }),
    tradRoute('Long Layback', 'VS', '4c', almsLow, { height: 8, description: 'Fine layback crack — one of the classics.', sortOrder: 4 }),
    tradRoute('Great Wall', 'E3', '5c', almsHigh, { height: 12, description: 'The great route on High Man — bold and technical face climbing.', sortOrder: 1 }),
    tradRoute('Sentry Box', 'E2', '5b', almsHigh, { height: 11, description: 'A fine route taking the niche and wall above.', sortOrder: 2 }),
    tradRoute('High Man Direct', 'E1', '5b', almsHigh, { height: 12, description: 'Direct line up the High Man face.', sortOrder: 3 }),
    tradRoute('Whisky Crack', 'HVS', '5a', almsHigh, { height: 10, description: 'Classic crack route — well-protected and satisfying.', sortOrder: 4 }),
    tradRoute('Crack of Doom', 'E4', '6b', almsHigh, { height: 11, description: 'The hardest route on Almscliff — a desperately fingery crack.', sortOrder: 5 }),
  ]);

  // ── Brimham Rocks (expanded) ──────────────────────────────────────────────
  const brimham = await upsertCrag(cragRepo, {
    name: 'Brimham Rocks', region: yorkshire, regionId: yorkshire.id,
    latitude: 54.0790, longitude: -1.7030, rockType: RockType.GRITSTONE,
    description: 'A spectacular moorland tor on the edge of Nidderdale. Fantastic rock sculptures with many short routes — a popular family destination as well as a climbing venue.',
    approach: 'Walk from the National Trust car park — most rocks are within 5-10 min.',
    parkingInfo: 'National Trust Brimham Rocks car park (pay & display, B6265 near Summerbridge).',
  });
  const brimMain = await upsertButtress(buttRepo, { name: 'Main Area', crag: brimham, cragId: brimham.id, sortOrder: 1 });
  const brimSmig = await upsertButtress(buttRepo, { name: 'Smarties Buttress', crag: brimham, cragId: brimham.id, sortOrder: 2 });
  await routeRepo.save([
    tradRoute('Smarties Wall', 'E2', '5c', brimSmig, { height: 9, description: 'Technical face climbing — one of the best routes at Brimham.', sortOrder: 1 }),
    tradRoute('Dancing Bear', 'HVS', '5a', brimMain, { height: 8, description: 'Classic route on the Dancing Bear tor.', sortOrder: 1 }),
    tradRoute('Oyster Wall', 'E3', '6a', brimMain, { height: 9, description: 'Desperate fingery climbing — a Brimham test piece.', sortOrder: 2 }),
    tradRoute('Lover\'s Leap', 'HS', '4b', brimMain, { height: 8, description: 'The classic HS at Brimham.', sortOrder: 3 }),
    tradRoute('Twin Chimneys', 'D', '2c', brimMain, { height: 7, description: 'The easy classic on the twin chimney feature.', sortOrder: 4 }),
    tradRoute('Sentinel Arête', 'VS', '4c', brimMain, { height: 9, description: 'The classic VS on the Sentinel tor.', sortOrder: 5 }),
    tradRoute('Needle Crack', 'E1', '5b', brimMain, { height: 8, description: 'Fine crack on one of the needle tors.', sortOrder: 6 }),
  ]);

  // ── Crookrise Crag ────────────────────────────────────────────────────────
  const crookrise = await upsertCrag(cragRepo, {
    name: 'Crookrise Crag', region: yorkshire, regionId: yorkshire.id,
    latitude: 53.9865, longitude: -2.0700, rockType: RockType.GRITSTONE,
    description: 'A fine gritstone edge above Skipton with excellent routes on high-quality rock. Less well-known than its neighbours but well worth the visit.',
    approach: 'Park at Embsay Reservoir. 25 min walk up the moor.',
    parkingInfo: 'Small car park at Embsay Reservoir or roadside in Embsay village.',
  });
  const crookMain = await upsertButtress(buttRepo, { name: 'Main Face', crag: crookrise, cragId: crookrise.id, sortOrder: 1 });
  await routeRepo.save([
    tradRoute('Crookrise Groove', 'VS', '4c', crookMain, { height: 12, description: 'The main classic on Crookrise — a satisfying groove.', sortOrder: 1 }),
    tradRoute('Ariel', 'HVS', '5a', crookMain, { height: 12, description: 'Bold wall climbing on Crookrise.', sortOrder: 2 }),
    tradRoute('The Overhanging Crack', 'E2', '5c', crookMain, { height: 11, description: 'Strenuous crack — the hardest route on the crag.', sortOrder: 3 }),
    tradRoute('Sunset Arête', 'HS', '4b', crookMain, { height: 10, description: 'A pleasant arête in a good position.', sortOrder: 4 }),
    tradRoute('Long Crack', 'S', '4a', crookMain, { height: 10, description: 'Classic crack splitting the main face.', sortOrder: 5 }),
  ]);

  // ── Simon's Seat (expanded) ───────────────────────────────────────────────
  const simonSeat = await upsertCrag(cragRepo, {
    name: 'Simon\'s Seat', region: yorkshireDales, regionId: yorkshireDales.id,
    latitude: 54.0185, longitude: -1.9540, rockType: RockType.GRITSTONE,
    description: 'A moorland tor summit above Wharfedale. The outcrop routes are short but the situation is magnificent, with views over the Dales.',
    approach: '45 min walk from Appletreewick village or Bolton Abbey.',
    parkingInfo: 'Small car park at Howgill Lane, Appletreewick, or Bolton Abbey car park (pay & display).',
  });
  const simonMain = await upsertButtress(buttRepo, { name: 'Main Tor', crag: simonSeat, cragId: simonSeat.id, sortOrder: 1 });
  await routeRepo.save([
    tradRoute('Simons\' Original', 'D', '2c', simonMain, { height: 7, description: 'The easiest route to the summit — a popular walk-and-scramble.', sortOrder: 1 }),
    tradRoute('Central Route', 'VS', '4c', simonMain, { height: 8, description: 'Takes the central crack of the main face.', sortOrder: 2 }),
    tradRoute('Right Arête', 'HS', '4b', simonMain, { height: 8, description: 'The right arête of the tor — fine positions.', sortOrder: 3 }),
    tradRoute('Simon\'s Wall', 'E1', '5b', simonMain, { height: 8, description: 'Bold wall climbing — the test piece of the crag.', sortOrder: 4 }),
  ]);
}
