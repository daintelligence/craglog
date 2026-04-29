import { DataSource } from 'typeorm';
import { Region } from '../../modules/crags/entities/region.entity';
import { Crag, RockType } from '../../modules/crags/entities/crag.entity';
import { Buttress } from '../../modules/crags/entities/buttress.entity';
import { Route } from '../../modules/routes/entities/route.entity';
import { findOrCreateRegion, upsertCrag, upsertButtress, upsertRoute, tradRoute } from './seed-helpers';

export async function seedBosigramPenwith(ds: DataSource) {
  const regionRepo = ds.getRepository(Region);
  const cragRepo   = ds.getRepository(Crag);
  const buttRepo   = ds.getRepository(Buttress);
  const routeRepo  = ds.getRepository(Route);

  const cornwall = await findOrCreateRegion(regionRepo, { name: 'Cornwall', country: 'England' });

  async function c(name: string, lat: number, lng: number, rock: RockType, desc: string, approach: string, parking: string, region: any) {
    return upsertCrag(cragRepo, { name, latitude: lat, longitude: lng, rockType: rock, description: desc, approach, parkingInfo: parking, region, regionId: region.id });
  }
  async function b(name: string, crag: Crag, order = 1) { return upsertButtress(buttRepo, { name, crag, cragId: crag.id, sortOrder: order }); }
  async function r(data: Partial<Route>) { return upsertRoute(routeRepo, data); }

  // ── Bosigran ─────────────────────────────────────────────────────────────
  const bosigran = await c('Bosigran', 50.1595, -5.6368, RockType.GRANITE,
    'The premier Penwith granite crag — a magnificent 60m face of perfect coarse granite above the Atlantic on the far west of Cornwall. The original Penwith classic: Commando Ridge (VD), Doorpost (VS), Suicide Wall (E1) and Little Brown Jug (E2) define traditional Cornish sea cliff climbing. Excellent rock, reliable gear, and stunning scenery.',
    'From the B3306 coast road near Pendeen, follow the footpath to the cliff top — 10 min from the road.',
    'Bosigran Farm parking area on the B3306 (National Trust, pay & display). One of the most accessible Penwith crags.', cornwall);
  const bosigranMain   = await b('Main Face', bosigran, 1);
  const bosigranLeft   = await b('Left Wing', bosigran, 2);
  const bosigranRight  = await b('Right Wing', bosigran, 3);
  const commandoRidge  = await b('Commando Ridge', bosigran, 4);

  for (const route of [
    tradRoute('Doorpost',             'VS',  '4c', bosigranMain,  { height: 55, pitches: 2, description: 'The Bosigran classic — a magnificent sustained route up the main face on superb coarse granite. One of the finest VS routes in Britain.' }),
    tradRoute('Suicide Wall',         'E1',  '5b', bosigranMain,  { height: 55, pitches: 2, description: 'The serious Bosigran E1 — bold face climbing with sparse protection on perfect Atlantic-polished granite.' }),
    tradRoute('Little Brown Jug',     'E2',  '5c', bosigranMain,  { height: 50, pitches: 2, description: 'A fine technical route — sustained and varied on the main face. One of the Penwith showcase routes.' }),
    tradRoute('Ledge Climb',          'D',   '2b', bosigranLeft,  { height: 60, pitches: 3, description: 'The easiest Bosigran route — takes the obvious ledge system. A fine introduction to Penwith granite.' }),
    tradRoute('Bosigran Ridge',       'S',   '4a', bosigranRight, { height: 50, pitches: 2, description: 'A classic moderate on the right wing — good holds on superb rough granite above the Atlantic.' }),
    tradRoute('Commando Ridge',       'VD',  '3c', commandoRidge, { height: 65, pitches: 3, description: 'The great Bosigran classic — a magnificent ridge route on outstanding granite. One of the finest moderate sea cliff routes in England.' }),
    tradRoute('Thin Wall Special',    'E3',  '5c', bosigranMain,  { height: 50, pitches: 2, description: 'A harder route on the main face — technical and committing on the compact granite slab.' }),
    tradRoute('Ochre Slab',           'VD',  '3c', bosigranLeft,  { height: 45, pitches: 2, description: 'A classic slab route on the distinctive ochre-coloured granite — friction and balance.' }),
  ]) await r({ ...route, buttressId: route.buttress.id });

  // ── Chair Ladder (Porthgwarra) ────────────────────────────────────────────
  const chairLadder = await c('Chair Ladder', 50.0376, -5.6648, RockType.GRANITE,
    'A superb granite sea cliff at the far south-western tip of Cornwall near Porthgwarra — one of the most dramatically positioned crags in Britain. Routes from Severe to E5 on rough pink granite above clear Atlantic water. The Ochre Slab, Green Cormorant Face and Yo-Yo are classics.',
    'From Porthgwarra cove, follow the coastal path east then south to the cliff — 15 min. Some descent routes require fixed ropes.',
    'Porthgwarra National Trust car park (pay & display). The most south-westerly car park in England.', cornwall);
  const chairMain   = await b('Main Cliff', chairLadder, 1);
  const chairRight  = await b('Right Buttress', chairLadder, 2);
  const greenCormorant = await b('Green Cormorant Face', chairLadder, 3);

  for (const route of [
    tradRoute('Chair Ladder Crack',   'VS',  '4c', chairMain,       { height: 45, pitches: 2, description: 'The classic Chair Ladder route — a fine crack on perfect Penwith granite above the Atlantic.' }),
    tradRoute('Yo-Yo',                'HVS', '5a', chairMain,       { height: 45, pitches: 2, description: 'A classic HVS — takes the main face in fine style. Well protected and sustained.' }),
    tradRoute('Green Cormorant',      'S',   '4a', greenCormorant,  { height: 40, pitches: 2, description: 'The classic easy route on the Green Cormorant Face — good holds on distinctive green-tinged granite.' }),
    tradRoute('Porthgwarra Wall',     'E2',  '5c', chairMain,       { height: 40, pitches: 2, description: 'A fine harder route — sustained technical climbing on the main cliff above the Atlantic.' }),
    tradRoute('Right Buttress Route', 'HS',  '4b', chairRight,      { height: 35, pitches: 2, description: 'A pleasant outing on the right buttress — good holds and a fine coastal setting.' }),
    tradRoute('Granite Corner',       'E1',  '5b', chairMain,       { height: 40, pitches: 2, description: 'Takes a corner feature — sustained and well protected on excellent granite.' }),
  ]) await r({ ...route, buttressId: route.buttress.id });

  // ── Tater Du ──────────────────────────────────────────────────────────────
  const taterDu = await c('Tater Du', 50.0529, -5.5765, RockType.GRANITE,
    'A remote granite sea cliff near Lamorna Cove with routes from HS to E4 on excellent coarse granite. Less visited than Bosigran or Chair Ladder — a genuine sense of remoteness on the far west Cornish coast. The lighthouse adds atmosphere.',
    'From Lamorna Cove, follow the South West Coast Path west to Tater Du Lighthouse then to the crags — 30 min.',
    'Lamorna Cove car park (pay & display) or roadside near Lamorna village (free).', cornwall);
  const taterMain = await b('Main Cliff', taterDu, 1);

  for (const route of [
    tradRoute('Tater Du Crack',       'VS',  '4c', taterMain, { height: 35, description: 'The main crack route — good gear and excellent coarse Penwith granite.' }),
    tradRoute('Lighthouse Route',     'HS',  '4b', taterMain, { height: 30, description: 'Takes the cliff near the lighthouse — atmospheric and well positioned.' }),
    tradRoute('Lamorna Wall',         'HVS', '5a', taterMain, { height: 32, description: 'A fine wall route — technical climbing on compact granite above the Atlantic.' }),
    tradRoute('Tater Direct',         'E2',  '5b', taterMain, { height: 30, description: 'A bold direct line — serious and committing on the main face.' }),
  ]) await r({ ...route, buttressId: route.buttress.id });

  // ── Carn Les Boel ─────────────────────────────────────────────────────────
  const carnLesBoel = await c('Carn Les Boel', 50.0392, -5.7022, RockType.GRANITE,
    'A spectacular granite headland at the very south-western tip of Cornwall with routes from VS to E3. The positions are extraordinary — Atlantic on three sides. Routes include some of the most impressive sea-level traverses on Penwith granite. Access and descent are adventurous.',
    'From Porthgwarra, follow the coast path west past Gwennap Head to Carn Les Boel — 30 min.',
    'Porthgwarra National Trust car park (pay & display).', cornwall);
  const carnMain = await b('Main Headland', carnLesBoel, 1);

  for (const route of [
    tradRoute('Headland Route',       'VS',  '4c', carnMain, { height: 30, description: 'Takes the main headland in extraordinary exposed positions — three sides of Atlantic.' }),
    tradRoute('Les Boel Crack',       'HVS', '5a', carnMain, { height: 28, description: 'A fine crack route on the headland — sustained on excellent granite.' }),
    tradRoute('South West Point',     'E1',  '5b', carnMain, { height: 28, description: 'A bold route at the south-western tip of England — unforgettable positions.' }),
  ]) await r({ ...route, buttressId: route.buttress.id });

  // ── Treen Cliff (Porthcurno) ──────────────────────────────────────────────
  const treenCliff = await c('Treen Cliff', 50.0445, -5.6523, RockType.GRANITE,
    'An excellent granite cliff near the Minack Theatre at Porthcurno with routes from VS to E4. The famous open-air theatre sits above the cliff — a unique backdrop for climbing. Good quality granite with varied routes.',
    'From Porthcurno beach car park, follow the coast path west towards the Minack Theatre. The crag is below the theatre — 10 min.',
    'Porthcurno National Trust car park (pay & display). Very busy in summer — arrive early.', cornwall);
  const treenMain = await b('Main Cliff', treenCliff, 1);

  for (const route of [
    tradRoute('Minack Wall',          'VS',  '4c', treenMain, { height: 35, description: 'A fine route on the cliff below the Minack Theatre — unique and atmospheric with open-air theatre above.' }),
    tradRoute('Porthcurno Crack',     'HVS', '5a', treenMain, { height: 30, description: 'Takes the main crack on the Treen cliff — sustained on excellent coarse Penwith granite.' }),
    tradRoute('Theatre Route',        'E1',  '5b', treenMain, { height: 32, description: 'A fine route with the theatre as a backdrop — technical and well positioned above the beach.' }),
    tradRoute('Treen Arête',          'E2',  '5c', treenMain, { height: 30, description: 'A bold arête route — committing above the Atlantic with views to the Scilly Isles.' }),
  ]) await r({ ...route, buttressId: route.buttress.id });

  console.log('  ✓ Bosigran & Penwith: Bosigran, Chair Ladder, Tater Du, Carn Les Boel, Treen Cliff');
}
