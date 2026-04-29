import { DataSource } from 'typeorm';
import { Region } from '../../modules/crags/entities/region.entity';
import { Crag, RockType } from '../../modules/crags/entities/crag.entity';
import { Buttress } from '../../modules/crags/entities/buttress.entity';
import { Route } from '../../modules/routes/entities/route.entity';
import { findOrCreateRegion, upsertCrag, upsertButtress, upsertRoute, tradRoute, sportRoute } from './seed-helpers';

export async function seedDorsetSwanageMore(ds: DataSource) {
  const regionRepo = ds.getRepository(Region);
  const cragRepo   = ds.getRepository(Crag);
  const buttRepo   = ds.getRepository(Buttress);
  const routeRepo  = ds.getRepository(Route);

  const dorset   = await findOrCreateRegion(regionRepo, { name: 'Dorset', country: 'England' });
  const purbeck  = await findOrCreateRegion(regionRepo, { name: 'Purbeck & Dorset Coast', country: 'England' });

  async function c(name: string, lat: number, lng: number, rock: RockType, desc: string, approach: string, parking: string, region: any) {
    return upsertCrag(cragRepo, { name, latitude: lat, longitude: lng, rockType: rock, description: desc, approach, parkingInfo: parking, region, regionId: region.id });
  }
  async function b(name: string, crag: Crag, order = 1) { return upsertButtress(buttRepo, { name, crag, cragId: crag.id, sortOrder: order }); }
  async function r(data: Partial<Route>) { return upsertRoute(routeRepo, data); }

  // ── Dancing Ledge ─────────────────────────────────────────────────────────
  const dancingLedge = await c('Dancing Ledge', 50.5917, -2.0042, RockType.LIMESTONE,
    'A classic Purbeck limestone sea cliff with routes from VD to E5, accessed across a dramatic rock ledge washed by the sea. One of the most scenic climbing venues on the south coast. The tidal ledge adds to the adventure and some routes require careful timing.',
    'From Langton Matravers, follow footpath to the cliff top then down to the ledge — 40 min. Check tides before descending.',
    'Langton Matravers village car park or roadside (free). National Trust land.', purbeck);
  const dancingMain  = await b('Main Wall', dancingLedge, 1);
  const dancingRight = await b('Right Sector', dancingLedge, 2);
  for (const route of [
    tradRoute('Dancing Ledge Slab',    'VD',  '3c', dancingMain,  { height: 20, description: 'The classic easy route on the main ledge — pleasant climbing above the sea.' }),
    tradRoute('Sea Wall',              'VS',  '4c', dancingMain,  { height: 22, description: 'Takes the wall above the ledge — sustained and well positioned above the English Channel.' }),
    tradRoute('Ledge Route',           'HS',  '4b', dancingMain,  { height: 20, description: 'A good moderate on the main wall — reliable gear and good holds.' }),
    tradRoute('Right Sector Crack',    'HVS', '5a', dancingRight, { height: 18, description: 'A fine crack on the right side — technical and entertaining.' }),
    tradRoute('Arachnid',              'E2',  '5c', dancingMain,  { height: 20, description: 'Bold face climbing on the main wall — small holds requiring technical footwork.' }),
    tradRoute('Channel Climb',         'E1',  '5b', dancingRight, { height: 18, description: 'An excellent route with fine exposure above the Channel.' }),
  ]) await r({ ...route, buttressId: route.buttress.id });

  // ── Tilly Whim Caves ──────────────────────────────────────────────────────
  const tillyWhim = await c('Tilly Whim Caves', 50.5842, -1.9685, RockType.LIMESTONE,
    'A classic Swanage sector with routes from S to E4 on excellent Portland limestone. An atmospheric crag in old quarry caves — the climbing is varied and the rock quality generally good. Some routes take on unusual character from the cave features.',
    'From Durlston Country Park near Swanage, follow the coastal path west to the caves — 15 min.',
    'Durlston Country Park car park, Swanage (pay & display).', purbeck);
  const tillyMain = await b('Main Cave', tillyWhim, 1);
  const tillyWall = await b('Outer Wall', tillyWhim, 2);
  for (const route of [
    tradRoute('Cave Crack',            'VS',  '4c', tillyMain, { height: 18, description: 'Takes the main cave crack — atmospheric and varied with good gear.' }),
    tradRoute('Tilly Wall',            'HS',  '4b', tillyWall, { height: 18, description: 'A pleasant route on the outer wall — solid limestone and good positions.' }),
    tradRoute('Quarryman\'s Route',    'S',   '4a', tillyWall, { height: 15, description: 'Named after the old quarry workers — a good intro to the area.' }),
    tradRoute('Cave Overhang',         'E2',  '5c', tillyMain, { height: 16, description: 'Takes the roof of the main cave — powerful and impressive.' }),
    tradRoute('Outer Cave',            'E1',  '5b', tillyWall, { height: 18, description: 'A technical route on the outer section — interesting moves.' }),
  ]) await r({ ...route, buttressId: route.buttress.id });

  // ── Blackers Hole ─────────────────────────────────────────────────────────
  const blackersHole = await c('Blackers Hole', 50.5870, -2.0720, RockType.LIMESTONE,
    'A fine sea zawn on the Purbeck coast with excellent limestone routes from S to E5. The hole itself is a dramatic collapsed cave — routes take lines through and around the overhanging walls. Partially tidal — check conditions before climbing.',
    'From Worth Matravers, follow the coastal path west to Blackers Hole — 45 min. Tidal approach in places.',
    'Worth Matravers village car park (National Trust, pay & display).', purbeck);
  const blackersMain  = await b('Main Zawn', blackersHole, 1);
  const blackersRight = await b('Right Wall', blackersHole, 2);
  for (const route of [
    tradRoute('Blackers Crack',        'HVS', '5a', blackersMain,  { height: 25, description: 'The classic Blackers route — takes the main crack in the zawn. Excellent.' }),
    tradRoute('Zawn Wall',             'E3',  '6a', blackersMain,  { height: 22, description: 'Technical face climbing in the heart of the zawn — bold and committing.' }),
    tradRoute('Right Wall Route',      'VS',  '4c', blackersRight, { height: 20, description: 'A more accessible route on the right wall — less intimidating than the main zawn.' }),
    tradRoute('Sea Arch',              'E1',  '5b', blackersMain,  { height: 22, description: 'Passes through the arch feature — a memorable and unique route.' }),
  ]) await r({ ...route, buttressId: route.buttress.id });

  // ── Durdle Door ───────────────────────────────────────────────────────────
  const durdleDoor = await c('Durdle Door', 50.6213, -2.2771, RockType.LIMESTONE,
    'The famous natural limestone arch on the Jurassic Coast gives short but scenic sea cliff routes from VS to E3. Not a major climbing destination, but the setting is extraordinary. The routes on the west side of the arch give exposed climbing above the English Channel.',
    'From the Durdle Door car park, follow the path down to the beach — 15 min. Access to the arch is tidal.',
    'Durdle Door car park near Lulworth (Lulworth Estate, pay & display). Very busy in summer.', dorset);
  const durdleMain = await b('Arch Buttress', durdleDoor, 1);
  for (const route of [
    tradRoute('Arch Route',            'VS',  '4c', durdleMain, { height: 25, description: 'Takes a line on the arch buttress — unique and atmospheric above the famous arch.' }),
    tradRoute('Jurassic Wall',         'HVS', '5a', durdleMain, { height: 22, description: 'A fine route on the Jurassic Coast limestone — technical and exposed.' }),
    tradRoute('Door Step',             'E1',  '5b', durdleMain, { height: 20, description: 'Bold face climbing on the west wall of the arch — good holds, sparse protection.' }),
  ]) await r({ ...route, buttressId: route.buttress.id });

  // ── Fisherman's Ledge ─────────────────────────────────────────────────────
  const fishermans = await c('Fisherman\'s Ledge', 50.5933, -1.9813, RockType.LIMESTONE,
    'One of the best Swanage sectors — a long limestone wall with routes from VD to E5 on compact, featured Portland limestone. Easily accessed and relatively quick to dry. The crack routes are exceptional.',
    'From Swanage seafront, walk south along the coastal path to the ledge — 25 min.',
    'Swanage seafront car park (pay & display, long stay) or Victoria Avenue car park.', purbeck);
  const fishMain   = await b('Main Wall', fishermans, 1);
  const fishSport  = await b('Sport Sector', fishermans, 2);
  for (const route of [
    tradRoute('Ledge Route',           'VD',  '3c', fishMain,  { height: 18, description: 'A classic easy route — good holds on well-featured limestone.' }),
    tradRoute('Fisherman\'s Crack',    'HVS', '5a', fishMain,  { height: 20, description: 'The definitive Fisherman\'s route — takes the main crack in fine style.' }),
    tradRoute('Limestone Wall',        'E2',  '5c', fishMain,  { height: 20, description: 'Technical face climbing on compact limestone — a modern classic.' }),
    sportRoute('Purbeck Sport',        '7a',  fishSport, { height: 22, description: 'A well-bolted sport pitch on the sport sector — technical and well-positioned.' }),
    sportRoute('Channel View',         '6c',  fishSport, { height: 20, description: 'A popular sport route with fine sea views — sustained and varied.' }),
    tradRoute('Sea Crack',             'E1',  '5b', fishMain,  { height: 18, description: 'Takes a thinner crack line — technical and satisfying.' }),
  ]) await r({ ...route, buttressId: route.buttress.id });

  console.log('  ✓ Dorset/Swanage more: Dancing Ledge, Tilly Whim Caves, Blackers Hole, Durdle Door, Fisherman\'s Ledge');
}
