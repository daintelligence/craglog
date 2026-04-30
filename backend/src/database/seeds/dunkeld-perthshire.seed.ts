import { DataSource } from 'typeorm';
import { Region } from '../../modules/crags/entities/region.entity';
import { Crag, RockType } from '../../modules/crags/entities/crag.entity';
import { Buttress } from '../../modules/crags/entities/buttress.entity';
import { Route } from '../../modules/routes/entities/route.entity';
import { findOrCreateRegion, upsertCrag, upsertButtress, upsertRoute, tradRoute, sportRoute } from './seed-helpers';

export async function seedDunkeldPerthshire(ds: DataSource) {
  const regionRepo = ds.getRepository(Region);
  const cragRepo   = ds.getRepository(Crag);
  const buttRepo   = ds.getRepository(Buttress);
  const routeRepo  = ds.getRepository(Route);

  const region = await findOrCreateRegion(regionRepo, { name: 'Perthshire', country: 'Scotland' });

  async function c(name: string, lat: number, lng: number, rock: RockType, desc: string, approach: string, parking: string, region: any) {
    return upsertCrag(cragRepo, { name, latitude: lat, longitude: lng, rockType: rock, description: desc, approach, parkingInfo: parking, region, regionId: region.id });
  }
  async function b(name: string, crag: Crag, order = 1) { return upsertButtress(buttRepo, { name, crag, cragId: crag.id, sortOrder: order }); }
  async function r(data: Partial<Route>) { return upsertRoute(routeRepo, data); }

  // ── Polney Crag ────────────────────────────────────────────────────────────
  const polney = await c('Polney Crag', 56.5562, -3.5875, RockType.LIMESTONE,
    'Scotland\'s premier sport climbing venue — a superb limestone crag above Dunkeld in Highland Perthshire. The compact, featured limestone gives routes of extraordinary quality from 6b to 8a+ and the venue has hosted the development of some of Scotland\'s hardest sport routes. Saber Dance (8a) and Romeo\'s Return (7c) are landmark Scottish sport routes. The crag faces south, dries quickly, and enjoys a sheltered woodland setting above the cathedral town of Dunkeld.',
    'From Dunkeld town centre, cross the Thomas Telford bridge and follow the footpath along the north bank of the Tay. Take the path uphill through Birnam Wood to the crag — 20 min.',
    'Dunkeld town car park off the A9 near the cathedral (pay & display). Also the Birnam Institute car park. Regular trains on the Perth to Inverness line.', region);
  const polneyMain  = await b('Main Wall', polney, 1);
  const polneyUpper = await b('Upper Tier', polney, 2);
  const polneyLeft  = await b('Left Wing', polney, 3);

  for (const route of [
    sportRoute('Romeo\'s Return',  '7c',  polneyMain,  { height: 18, description: 'The classic Polney testpiece — a sustained and technically demanding 7c on the main wall. One of Scotland\'s most coveted sport redpoints.' }),
    sportRoute('Wee Stinker',      '7b',  polneyMain,  { height: 18, description: 'A popular hard route on the main wall — technical limestone climbing on compact rock. An excellent stepping stone to the harder lines.' }),
    sportRoute('Polney Classic',   '6c',  polneyMain,  { height: 16, description: 'The accessible classic of the venue — a sustained 6c on excellent limestone that showcases all that makes Polney Scotland\'s premier sport crag.' }),
    sportRoute('Sport Route',      '7a',  polneyMain,  { height: 18, description: 'A fine mid-grade route on the main wall — technical and sustained on featured limestone with good bolt spacing.' }),
    sportRoute('Upper Wall',       '7b+', polneyUpper, { height: 20, description: 'A demanding route on the upper tier — the crux sequence requires powerful moves on compact Perthshire limestone.' }),
    sportRoute('Left Wing',        '6b',  polneyLeft,  { height: 14, description: 'An accessible route on the left wing — a good introduction to Polney limestone for those building up to the harder main wall routes.' }),
    sportRoute('Polney Direct',    '8a+', polneyUpper, { height: 22, description: 'The hardest route at Polney — a direct and uncompromising line through the upper sector. A serious Scottish sport climbing undertaking.' }),
    sportRoute('Saber Dance',      '8a',  polneyMain,  { height: 20, description: 'The Polney masterpiece — Scotland\'s most celebrated sport route and a benchmark 8a on superb compact limestone. Sustained and technical throughout.' }),
  ]) await r({ ...route, buttressId: route.buttress.id });

  // ── Dunkeld Upper Crag ─────────────────────────────────────────────────────
  const dunkeldUpper = await c('Dunkeld Upper Crag', 56.5570, -3.5868, RockType.LIMESTONE,
    'The upper limestone tier above Dunkeld — a separate section of rock above Polney Crag with its own character and harder routes. Generally steeper than the lower crag with routes from 6c+ to 8a. A quieter sector that rewards those who make the slightly longer approach. The rock is compact Highland limestone with excellent friction and varied holds.',
    'Continue up the hillside from Polney Crag following the faint path through birch woodland — 5 min above the main crag.',
    'As for Polney Crag — Dunkeld town car park off the A9 (pay & display).', region);
  const upperWall = await b('Upper Wall', dunkeldUpper, 1);

  for (const route of [
    sportRoute('Upper Classic',    '6c+', upperWall, { height: 16, description: 'A fine accessible route on the upper tier — excellent limestone climbing with varied moves and good bolt protection.' }),
    sportRoute('Hard Classic',     '8a',  upperWall, { height: 20, description: 'A serious undertaking on the upper wall — powerful and sustained on the steepest part of the upper tier.' }),
    sportRoute('Top Tier Route',   '7c',  upperWall, { height: 18, description: 'A fine technical route on the upper wall — demanding footwork on compact limestone high above the River Tay.' }),
    sportRoute('Upper Dunkeld',    '7b',  upperWall, { height: 18, description: 'A sustained route on the upper crag — technical limestone climbing with a crux sequence in the upper half.' }),
  ]) await r({ ...route, buttressId: route.buttress.id });

  // ── Dunkeld Lower Crag ─────────────────────────────────────────────────────
  const dunkeldLower = await c('Dunkeld Lower Crag', 56.5548, -3.5882, RockType.LIMESTONE,
    'The beginner and intermediate sector of the Dunkeld limestone complex — a gentler section of crag below Polney with routes from 5+ to 6b on well-featured limestone. An excellent venue for those being introduced to sport climbing or working on movement skills. Close to the path and easily identified from below. Some of the most used routes in the Dunkeld area.',
    'Follow the path from Dunkeld bridge along the Tay then uphill — the lower crag is encountered before Polney, clearly visible from the path below.',
    'Dunkeld town car park off the A9 (pay & display). Regular trains from Perth and Inverness.', region);
  const lowerWall = await b('Lower Wall', dunkeldLower, 1);

  for (const route of [
    sportRoute('Easy Route',      '5+', lowerWall, { height: 12, description: 'The most accessible route at Dunkeld — a perfect introduction to sport climbing on well-featured limestone with generous bolt protection.' }),
    sportRoute('Lower Dunkeld',   '6a', lowerWall, { height: 14, description: 'A popular route for those stepping up — sustained climbing on the lower limestone cliff with excellent rock quality.' }),
    sportRoute('First Sport',     '6b', lowerWall, { height: 14, description: 'A fine progression route — slightly harder than the other lower crag routes but still well protected on excellent limestone.' }),
    sportRoute('Lower Classic',   '6c', lowerWall, { height: 16, description: 'The top-end lower crag route — a sustained 6c providing a good stepping stone towards the main wall at Polney above.' }),
  ]) await r({ ...route, buttressId: route.buttress.id });

  // ── Newtyle Quarry ─────────────────────────────────────────────────────────
  const newtyle = await c('Newtyle Quarry', 56.6260, -3.1395, RockType.LIMESTONE,
    'A compact limestone sport quarry near Blairgowrie in Perthshire — an excellent local venue with routes from 6b to 7c+ on vertical to slightly overhanging walls. Less well-known than Polney but with high quality rock and reliable protection. A popular training venue for Dundee and Perth sport climbers. Quick to dry and accessible from the A93 Blairgowrie road.',
    'From Blairgowrie town centre, follow the A923 towards Coupar Angus then take the minor road to Newtyle village. The quarry is visible from the village — 5 min walk.',
    'Newtyle village roadside parking (free). Also accessible from Coupar Angus with a longer walk.', region);
  const newtyleMain = await b('Main Quarry', newtyle, 1);

  for (const route of [
    sportRoute('Newtyle Classic',  '7a',  newtyleMain, { height: 16, description: 'The benchmark route of the quarry — a sustained technical 7a on compact Perthshire limestone. Well bolted and a fine outing.' }),
    sportRoute('Hard Quarry',      '7c',  newtyleMain, { height: 18, description: 'The testpiece of Newtyle — powerful moves on the steepest part of the main wall. A serious Perthshire sport climbing undertaking.' }),
    sportRoute('Sport Quarry',     '6c+', newtyleMain, { height: 16, description: 'A popular route on the main wall — sustained face climbing on featured limestone. A good link between the easier and harder routes.' }),
    sportRoute('Top Route',        '7b',  newtyleMain, { height: 16, description: 'A fine route on the upper section — technical limestone climbing with a demanding crux sequence near the chains.' }),
    sportRoute('Quarry Direct',    '7a+', newtyleMain, { height: 18, description: 'A direct line through the steeper part of the quarry — uncompromising technical climbing on well-featured Perthshire limestone.' }),
  ]) await r({ ...route, buttressId: route.buttress.id });

  // ── Binnein Shuas ──────────────────────────────────────────────────────────
  const binnein = await c('Binnein Shuas', 56.9283, -4.4880, RockType.GRANITE,
    'A remote granite crag in the Ardverikie Estate above Loch Laggan in the central Highlands — famous as the filming location for Monarch of the Glen. Routes from VD to VS on sound rough pink granite with extraordinary Highland views. The Ardverikie Wall routes offer some of the finest and most remote moderate granite climbing in Scotland. A true wilderness venue requiring a long approach.',
    'From the A86 near Laggan, follow the Ardverikie Estate track along Loch Laggan to the estate buildings. Continue on the track to Loch an Bhealaich. The crag is above the loch on the east flank — 4 hours walk in.',
    'Small roadside parking area off the A86 at Ardverikie Estate gates (free, estate permission required for the track).', region);
  const binneinMain  = await b('Main Face', binnein, 1);
  const binneinSlabs = await b('Upper Slabs', binnein, 2);

  for (const route of [
    tradRoute('Ardverikie Wall',    'VS',  '4c', binneinMain,  { height: 100, pitches: 5, description: 'The great Ardverikie experience — a long expedition route on remote Highland granite. Magnificent mountain scenery in one of Scotland\'s most beautiful glens.' }),
    tradRoute('Highland Slab',      'HS',  '4b', binneinSlabs, { height: 80,  pitches: 4, description: 'A sustained slab route on the upper granite slabs — friction climbing on rough pink granite high in the central Highlands.' }),
    tradRoute('Rough Bounds',       'E1',  '5b', binneinMain,  { height: 60,  pitches: 3, description: 'A harder route on the main face — technical climbing on excellent remote Highland granite with committing moves.' }),
    tradRoute('Ardverikie Direct',  'HVS', '5a', binneinMain,  { height: 70,  pitches: 3, description: 'The direct line up the main face — sustained and bold on sound pink granite above Loch Laggan.' }),
    tradRoute('Glen Arkaig Route',  'S',   '4a', binneinSlabs, { height: 60,  pitches: 3, description: 'A pleasant route on the upper slabs — natural gear and good holds on granite typical of the Ardverikie hills.' }),
  ]) await r({ ...route, buttressId: route.buttress.id });

  console.log('  ✓ Dunkeld & Perthshire: Polney Crag, Dunkeld Upper Crag, Dunkeld Lower Crag, Newtyle Quarry, Binnein Shuas');
}
