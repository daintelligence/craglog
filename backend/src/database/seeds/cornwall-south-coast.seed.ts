import { DataSource } from 'typeorm';
import { Region } from '../../modules/crags/entities/region.entity';
import { Crag, RockType } from '../../modules/crags/entities/crag.entity';
import { Buttress } from '../../modules/crags/entities/buttress.entity';
import { Route } from '../../modules/routes/entities/route.entity';
import { findOrCreateRegion, upsertCrag, upsertButtress, upsertRoute, tradRoute, sportRoute } from './seed-helpers';

export async function seedCornwallSouthCoast(ds: DataSource) {
  const regionRepo = ds.getRepository(Region);
  const cragRepo   = ds.getRepository(Crag);
  const buttRepo   = ds.getRepository(Buttress);
  const routeRepo  = ds.getRepository(Route);

  const region = await findOrCreateRegion(regionRepo, { name: 'Cornwall', country: 'England' });

  async function c(name: string, lat: number, lng: number, rock: RockType, desc: string, approach: string, parking: string, region: any) {
    return upsertCrag(cragRepo, { name, latitude: lat, longitude: lng, rockType: rock, description: desc, approach, parkingInfo: parking, region, regionId: region.id });
  }
  async function b(name: string, crag: Crag, order = 1) { return upsertButtress(buttRepo, { name, crag, cragId: crag.id, sortOrder: order }); }
  async function r(data: Partial<Route>) { return upsertRoute(routeRepo, data); }

  // ── Kynance Cove ───────────────────────────────────────────────────────────
  const kynance = await c('Kynance Cove', 49.9759, -5.2415, RockType.OTHER,
    'A uniquely beautiful crag on the Lizard Peninsula — the dramatic dark-green and purple serpentinite rock at Kynance Cove is unlike anything else in Britain. The rock is composed of serpentinite (metamorphosed oceanic mantle) and provides a distinctive and unusual climbing experience on compact, featured surfaces. Routes from VD to E2 above turquoise Atlantic waters in one of the most photographed coves in England. A National Trust site of exceptional natural beauty.',
    'From the National Trust car park at Kynance, follow the path down to the cove — 10 min. Routes are on the north and south faces of the main promontory. Tidal — check tides before descending.',
    'Kynance Cove National Trust car park on the Lizard Peninsula road (pay & display, NT members free). Very busy in summer — arrive early or visit off-season.', region);
  const kynanceNorth  = await b('North Face', kynance, 1);
  const kynanceSea    = await b('Sea Wall', kynance, 2);
  const kynanceSouth  = await b('South Buttress', kynance, 3);

  for (const route of [
    tradRoute('Kynance Crack',    'HVS', '5a', kynanceNorth, { height: 20, description: 'The classic Kynance route — a sustained crack on the distinctive dark serpentinite of the Lizard. Unique rock in an extraordinary setting above turquoise Atlantic water.' }),
    tradRoute('Serpentine Wall',  'VS',  '4c', kynanceSea,   { height: 18, description: 'Takes the sea wall on compact serpentinite — good holds on the unusual green and purple rock with fine views towards Mullion.' }),
    tradRoute('Dark Rock',        'E1',  '5b', kynanceNorth, { height: 18, description: 'A technical route on the dark serpentinite — precise footwork required on the compact but slippery rock when not dry.' }),
    tradRoute('Green Slab',       'S',   '3c', kynanceSouth, { height: 15, description: 'A pleasant slab route on the south buttress — the green-tinged serpentinite gives superb friction when dry. A fine moderate.' }),
    tradRoute('Cove Route',       'VD',  '3b', kynanceSea,   { height: 14, description: 'The most accessible route at Kynance — a pleasant outing on the sea wall above the beautiful turquoise cove.' }),
    tradRoute('Kynance Direct',   'E2',  '5c', kynanceNorth, { height: 20, description: 'A bold direct line on the north face — technical and committing on the compact serpentinite. One of the finest harder routes on the Lizard.' }),
    tradRoute('Sea Wall Arête',   'HVS', '5a', kynanceSea,   { height: 18, description: 'Takes the arête of the sea wall — exposed and technical on the distinctive Lizard rock with the cove below.' }),
  ]) await r({ ...route, buttressId: route.buttress.id });

  // ── Poldu Cliff ────────────────────────────────────────────────────────────
  const poldu = await c('Poldu Cliff', 50.0218, -5.2415, RockType.GRANITE,
    'A fine granite sea cliff above Poldu Cove on the south coast of the Lizard Peninsula — sound coarse granite with routes from S to E1. Less visited than the famous Penwith crags to the west but with good quality rock and a pleasant atmosphere. The approach along the South West Coast Path is straightforward and the cliff dries quickly after rain. Fine views across Mount\'s Bay towards Penzance.',
    'From Poldu Cove, follow the South West Coast Path south along the cliff top to the main face — 10 min.',
    'Poldu Cove National Trust car park (pay & display). Accessible via minor roads from Mullion village.', region);
  const polduMain = await b('Main Face', poldu, 1);
  const polduWest = await b('West Wall', poldu, 2);

  for (const route of [
    tradRoute('Poldu Route',           'VS',  '4c', polduMain, { height: 25, description: 'The main route at Poldu — a fine line on coarse granite above the south Cornish coast. Well protected and sustained at the grade.' }),
    tradRoute('West Wall',             'HVS', '5a', polduWest, { height: 22, description: 'Takes the west wall directly — technical face climbing on compact granite with fine views across Mount\'s Bay.' }),
    tradRoute('Cliff Traverse',        'E1',  '5b', polduMain, { height: 20, description: 'A fine traversing route along the cliff — technical and well positioned on coarse Cornish granite above the Atlantic.' }),
    tradRoute('Sea Face',              'S',   '3c', polduMain, { height: 20, description: 'A pleasant moderate on the sea face — good holds on rough granite with easy descent and a fine coastal atmosphere.' }),
    tradRoute('Lizard Peninsula Route','HS',  '4a', polduWest, { height: 18, description: 'A worthwhile route on the west wall — varied climbing on sound granite typical of the south Cornish coast.' }),
  ]) await r({ ...route, buttressId: route.buttress.id });

  // ── Cadgwith Cove ──────────────────────────────────────────────────────────
  const cadgwith = await c('Cadgwith Cove', 49.9867, -5.1894, RockType.OTHER,
    'Short but atmospheric serpentinite routes above the picturesque fishing village of Cadgwith on the eastern side of the Lizard Peninsula. The village is one of the last working thatched fishing villages in England and the rock is the same distinctive dark green serpentinite found throughout the Lizard. Routes are short but characterful with excellent rock when dry. An unusual climbing experience in an extraordinary setting.',
    'From Cadgwith village, follow the coastal path south then the path down to the base of the cliff — 15 min. Some sections are tidal.',
    'Cadgwith village car park (pay & display) or roadside above the village. The village lanes are narrow — park at the top.', region);
  const cadgwithMain = await b('Village Wall', cadgwith, 1);

  for (const route of [
    tradRoute('Cadgwith Crack',     'VS',  '4c', cadgwithMain, { height: 15, description: 'The classic Cadgwith route — a fine crack on the serpentinite above the fishing village. Unique rock in a memorable setting.' }),
    tradRoute('Fishing Village Wall','HS',  '4a', cadgwithMain, { height: 14, description: 'A pleasant wall route on the distinctive Lizard serpentinite — good holds and an extraordinary thatched village backdrop.' }),
    tradRoute('Serpentine Arête',   'HVS', '5a', cadgwithMain, { height: 15, description: 'Takes the arête of the village wall — technical on the compact serpentinite with fine views along the south Lizard coast.' }),
    tradRoute('Cove Wall',          'E1',  '5b', cadgwithMain, { height: 14, description: 'A bold route on the cove wall — technical and committing on the unusual green serpentinite above the Atlantic.' }),
  ]) await r({ ...route, buttressId: route.buttress.id });

  // ── Pen Olver ──────────────────────────────────────────────────────────────
  const penOlver = await c('Pen Olver', 49.9820, -5.2165, RockType.OTHER,
    'A compact serpentinite headland on the south coast of the Lizard — the same distinctive green and black rock as Kynance Cove with routes from S to E1 on the south-facing cliffs. A quieter alternative to Kynance with less tourist traffic but equally unusual rock. The headland position gives fine views in both directions along the Lizard coast. Tidal access — check times before descending.',
    'From the Lizard village, follow the South West Coast Path west to Pen Olver — 20 min. Descend via fixed stakes to the base of the south face.',
    'The Lizard village car park (pay & display). Also accessible from Kynance Cove car park via the coast path heading east.', region);
  const penOlverMain = await b('South Face', penOlver, 1);

  for (const route of [
    tradRoute('Pen Olver',     'VS',  '4c', penOlverMain, { height: 18, description: 'The main route of the headland — a fine line on compact serpentinite above the south Lizard coast. Well protected on the unusual dark rock.' }),
    tradRoute('South Face',    'S',   '3c', penOlverMain, { height: 16, description: 'An accessible moderate on the south face — good holds on rough serpentinite with a straightforward descent.' }),
    tradRoute('Direct Route',  'HVS', '5a', penOlverMain, { height: 18, description: 'A direct line up the south face — technical and sustained on compact serpentinite. One of the finer HVS routes on the south Lizard.' }),
    tradRoute('Olver Arête',   'E1',  '5b', penOlverMain, { height: 18, description: 'A bold arête route on the headland — exposed and committing on the distinctive Lizard rock above Atlantic waters.' }),
  ]) await r({ ...route, buttressId: route.buttress.id });

  // ── The Lizard ─────────────────────────────────────────────────────────────
  const theLizard = await c('The Lizard', 49.9600, -5.1920, RockType.OTHER,
    'The southernmost point of mainland Britain — dramatic serpentinite cliffs at the tip of the Lizard Peninsula with routes from S to E2. The unusual dark green and black rock is serpentinite throughout and routes range from short single-pitch lines to more serious undertakings above deep Atlantic water. One of the most geologically distinctive and atmospherically powerful climbing venues in England. A true end-of-the-world setting.',
    'From the Lizard Point car park, follow the South West Coast Path to the cliff top. Descend via fixed anchors — tidal, check carefully before descending.',
    'Lizard Point National Trust car park (pay & display, NT members free). The southernmost car park on mainland Britain. Very busy in summer.', region);
  const lizardCliff = await b('Cliff Face', theLizard, 1);
  const lizardStack = await b('Sea Stack', theLizard, 2);

  for (const route of [
    tradRoute('Lizard Route',       'E1',  '5b', lizardCliff, { height: 25, description: 'The main route of the Lizard cliffs — a serious and atmospheric route on serpentinite at the southernmost point of Britain. Extraordinary position.' }),
    tradRoute('Corner Crack',       'VS',  '4c', lizardCliff, { height: 22, description: 'A well-protected crack route on the main cliff — good jams on compact serpentinite above the deep Atlantic water.' }),
    tradRoute('South Stack',        'S',   '4a', lizardStack, { height: 20, description: 'Takes the sea stack at the southern tip — an adventurous approach and a unique position at the bottom of mainland Britain.' }),
    tradRoute('Lizard Direct',      'E2',  '5c', lizardCliff, { height: 25, description: 'A bold direct line on the main cliff — serious and committing on compact serpentinite. The hardest route at the Lizard Point.' }),
    tradRoute('Southernmost Wall',  'HVS', '5a', lizardCliff, { height: 22, description: 'A sustained wall route at the southernmost point of England — technical climbing on compact serpentinite with an unforgettable ocean backdrop.' }),
  ]) await r({ ...route, buttressId: route.buttress.id });

  console.log('  ✓ Cornwall South Coast: Kynance Cove, Poldu Cliff, Cadgwith Cove, Pen Olver, The Lizard');
}
