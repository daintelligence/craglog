import { DataSource } from 'typeorm';
import { Region } from '../../modules/crags/entities/region.entity';
import { Crag, RockType } from '../../modules/crags/entities/crag.entity';
import { Buttress } from '../../modules/crags/entities/buttress.entity';
import { Route } from '../../modules/routes/entities/route.entity';
import { findOrCreateRegion, upsertCrag, upsertButtress, upsertRoute, tradRoute, sportRoute } from './seed-helpers';

export async function seedPembrokeMore(ds: DataSource) {
  const regionRepo = ds.getRepository(Region);
  const cragRepo   = ds.getRepository(Crag);
  const buttRepo   = ds.getRepository(Buttress);
  const routeRepo  = ds.getRepository(Route);

  const pembroke = await findOrCreateRegion(regionRepo, { name: 'Pembrokeshire', country: 'Wales' });

  async function c(name: string, lat: number, lng: number, desc: string, approach: string, parking: string) {
    return upsertCrag(cragRepo, { name, latitude: lat, longitude: lng, rockType: RockType.LIMESTONE, description: desc, approach, parkingInfo: parking, region: pembroke, regionId: pembroke.id });
  }
  async function b(name: string, crag: Crag, order = 1) { return upsertButtress(buttRepo, { name, crag, cragId: crag.id, sortOrder: order }); }
  async function r(data: Partial<Route>) { return upsertRoute(routeRepo, data); }

  // ── Huntsman's Leap ───────────────────────────────────────────────────────
  const huntsmans = await c("Huntsman's Leap", 51.6000, -4.9690,
    'A narrow slot canyon cleft in the Pembroke coastline — one of the most dramatic venues in Britain. Deep water at the bottom. Excellent technical trad routes on both walls of the zawn.',
    "Park at St Govan's car park. Walk west along coast path for 10 min to the Leap.",
    "St Govan's Head car park (pay — note MOD range hours).");
  const huntMain  = await b('East Wall', huntsmans, 1);
  const huntWest  = await b('West Wall', huntsmans, 2);
  for (const route of [
    tradRoute('Samson', 'HVS', '5a', huntMain, { height: 30, description: 'The Huntsman\'s classic — sustained fingery climbing on the east wall of the zawn.' }),
    tradRoute('Delilah', 'VS', '4c', huntMain, { height: 28, description: 'Follows the obvious crack system — well protected and very popular.' }),
    tradRoute('Leap of Faith', 'E2', '5c', huntWest, { height: 32, description: 'Bold wall climbing on the west side — committing moves above deep water.' }),
    tradRoute('Zawn Bound', 'E1', '5b', huntWest, { height: 30, description: 'Fine technical climbing — the crux feels very exposed over the drop.' }),
    tradRoute('Left Wall', 'E3', '6a', huntMain, { height: 32, description: 'The hardest regular route at Huntsman\'s — short but intense.' }),
    tradRoute('Standard Route', 'S', '4a', huntMain, { height: 25, description: 'The easiest line — still requires care with the approach.' }),
  ]) await r({ ...route, buttressId: route.buttress.id });

  // ── Stennis Head ──────────────────────────────────────────────────────────
  const stennis = await c('Stennis Head', 51.6090, -4.9320,
    'A fine headland with excellent sport and trad climbing. The Main Wall gives some of the best sport routes in Pembroke at 7a–8a on immaculate limestone.',
    "Walk east from St Govan's car park, or west from Bosherton — 15 min.",
    "St Govan's Head car park or Bosherston village car park.");
  const stennisMain  = await b('Main Wall', stennis, 1);
  const stennisRight = await b('Right Wall', stennis, 2);
  for (const route of [
    sportRoute('Unchained Melody', '7b',  stennisMain,  { height: 22, description: 'One of the best 7b routes in Wales — long, sustained, and beautifully positioned.' }),
    sportRoute('Wailing Wall',     '7c',  stennisMain,  { height: 20, description: 'Steep and powerful — one of the fine Stennis testpieces.' }),
    sportRoute('Solid Ayre',       '7a+', stennisMain,  { height: 18, description: 'Technical and sustained — the standard challenging route at Stennis.' }),
    sportRoute('Stennis Ford',     '6c',  stennisRight, { height: 16, description: 'Popular moderate — good holds and sustained moves.' }),
    sportRoute('Head Games',       '8a',  stennisMain,  { height: 18, description: 'Fingery and pumpy — the hardest route at the head.' }),
    tradRoute('Sea Shanty',        'HVS', '5a', stennisRight, { height: 20, description: 'Classic trad route on the right wall — well protected crack climbing.' }),
  ]) await r({ ...route, buttressId: route.buttress.id });

  // ── Stackpole Head (extended) ─────────────────────────────────────────────
  const stackpole = await upsertCrag(cragRepo, { name: 'Stackpole Head', regionId: pembroke.id });
  const stackMain = await upsertButtress(buttRepo, { name: 'Main Cliff', crag: stackpole, cragId: stackpole.id, sortOrder: 1 });
  for (const route of [
    sportRoute('Mango Groove',  '7a',  stackMain, { height: 20, description: 'The Stackpole classic — long, sustained sport climbing above the sea.' }),
    sportRoute('Summer Holiday','6c+', stackMain, { height: 18, description: 'Popular route with excellent sustained moves.' }),
    sportRoute('Blue Lagoon',   '7b',  stackMain, { height: 22, description: 'Steep and pumpy — sustained moves through a small roof.' }),
    tradRoute('Stackpole Wall', 'E1',  '5b', stackMain, { height: 22, description: 'The trad line on the main wall — bold and sustained.' }),
  ]) await r({ ...route, buttressId: route.buttress.id });

  // ── St Bride's Haven ─────────────────────────────────────────────────────
  const stBrides = await c("St Bride's Haven", 51.7230, -5.0730,
    'A peaceful cove with a variety of sport and trad routes on excellent limestone. Less frequented than the south Pembroke crags — a good venue for a quiet day.',
    'Drive to St Bride\'s Haven on St Bride\'s Bay. Crags visible from beach.',
    'St Bride\'s Haven beach car park (free). Limited spaces.');
  const stBridesMain = await b('Main Wall', stBrides, 1);
  for (const route of [
    sportRoute('Haven Wall',    '6b+', stBridesMain, { height: 15, description: 'Classic route at the haven — technical and sustained on good limestone.' }),
    sportRoute('St Bride\'s',   '6a',  stBridesMain, { height: 12, description: 'An excellent introduction to Haven climbing.' }),
    tradRoute('Bride\'s Crack', 'HS',  '4b', stBridesMain, { height: 15, description: 'The best trad line at the haven — solid crack with good gear.' }),
  ]) await r({ ...route, buttressId: route.buttress.id });

  // ── Elegug Stacks area ────────────────────────────────────────────────────
  const elegug = await c('Elegug Stacks', 51.6208, -4.9525,
    'Sea stacks and walls near the famous Elegug Stacks bird colony. A mixture of sport and trad routes with outstanding seabird atmosphere. Check range times.',
    "Walk west from St Govan's car park along coast path — 20 min.",
    "St Govan's Head car park (MOD range hours apply — check before visiting).");
  const elegugMain = await b('Stack Walls', elegug, 1);
  for (const route of [
    sportRoute('Razorbill',      '7a',  elegugMain, { height: 18, description: 'Named after the colonies above — sustained sport route on good rock.' }),
    sportRoute('Guillemot',      '6c',  elegugMain, { height: 16, description: 'Classic mid-grade sport route beside the stacks.' }),
    tradRoute('Stack Attack',    'VS',  '4c', elegugMain, { height: 20, description: 'A varied trad route close to the stacks — great position.' }),
    tradRoute('Chough Wall',     'HVS', '5a', elegugMain, { height: 22, description: 'Bold wall climbing with good rock and excellent exposure.' }),
  ]) await r({ ...route, buttressId: route.buttress.id });

  console.log("  ✓ Pembroke more: Huntsman's Leap, Stennis Head, Stackpole extended, St Bride's Haven, Elegug Stacks");
}
