import { DataSource } from 'typeorm';
import { Region } from '../../modules/crags/entities/region.entity';
import { Crag, RockType } from '../../modules/crags/entities/crag.entity';
import { Buttress } from '../../modules/crags/entities/buttress.entity';
import { Route } from '../../modules/routes/entities/route.entity';
import { findOrCreateRegion, upsertCrag, upsertButtress, upsertRoute, tradRoute, sportRoute } from './seed-helpers';

export async function seedGreatOrmeSport(ds: DataSource) {
  const regionRepo = ds.getRepository(Region);
  const cragRepo   = ds.getRepository(Crag);
  const buttRepo   = ds.getRepository(Buttress);
  const routeRepo  = ds.getRepository(Route);

  const northWales = await findOrCreateRegion(regionRepo, { name: 'North Wales', country: 'Wales' });

  async function c(name: string, lat: number, lng: number, rock: RockType, desc: string, approach: string, parking: string, region: any) {
    return upsertCrag(cragRepo, { name, latitude: lat, longitude: lng, rockType: rock, description: desc, approach, parkingInfo: parking, region, regionId: region.id });
  }
  async function b(name: string, crag: Crag, order = 1) { return upsertButtress(buttRepo, { name, crag, cragId: crag.id, sortOrder: order }); }
  async function r(data: Partial<Route>) { return upsertRoute(routeRepo, data); }

  // ── Pen Trwyn (Great Orme) ────────────────────────────────────────────────
  const penTrwyn = await c('Pen Trwyn', 53.3377, -3.8265, RockType.LIMESTONE,
    'Britain\'s premier sport climbing destination — the Sea of Tranquility wall at Pen Trwyn on the Great Orme headland holds some of the country\'s hardest sport routes. The Great Orme limestone is compact and technical with a marine atmosphere. Chris Sharma and other world-class climbers have put up routes here. Grades range from 6b to 9a+.',
    'From Llandudno seafront, follow the Marine Drive road around the Great Orme headland. Abseils access the sea-level walls.',
    'Great Orme Country Park car parks near Llandudno (pay & display). Marine Drive toll road (small fee). Follow to the climbing area.', northWales);
  const seaTranquility = await b('Sea of Tranquility', penTrwyn, 1);
  const mainWall       = await b('Main Wall', penTrwyn, 2);
  const leftSector     = await b('Left Sector', penTrwyn, 3);

  for (const route of [
    sportRoute('Statement of Youth',   '8b+', seaTranquility, { height: 25, description: 'The legendary Pen Trwyn testpiece by Jerry Moffatt — one of the most famous hard sport routes in Britain. Sustained technical climbing on impeccable limestone.' }),
    sportRoute('Powerband',            '8c',  seaTranquility, { height: 22, description: 'A ferociously powerful route on the Sea of Tranquility — world-class sport climbing on the Great Orme.' }),
    sportRoute('Pen Trwyn Classic',    '7b',  mainWall,       { height: 20, description: 'The accessible classic — a well-bolted route on excellent limestone giving sustained technical climbing.' }),
    sportRoute('Orme Direct',          '7c',  mainWall,       { height: 22, description: 'A superb sport route — technical limestone climbing in a spectacular sea cliff setting.' }),
    sportRoute('Left Sector Route',    '6b+', leftSector,     { height: 18, description: 'A more accessible route on the left sector — good for developing limestone technique.' }),
    sportRoute('Great Orme Sport',     '7a+', leftSector,     { height: 20, description: 'A popular route on the left sector — sustained and well-positioned above the sea.' }),
    sportRoute('Marine Drive Wall',    '6c',  mainWall,       { height: 18, description: 'A classic mid-grade route on the main wall — good introduction to Great Orme limestone.' }),
    tradRoute('Orme Trad',             'E3',  '6a', mainWall, { height: 20, description: 'One of the few trad routes here — a serious and bold line on the compact Great Orme limestone.' }),
  ]) await r({ ...route, buttressId: route.buttress.id });

  // ── Little Orme ───────────────────────────────────────────────────────────
  const littleOrme = await c('Little Orme', 53.3170, -3.7770, RockType.LIMESTONE,
    'A smaller but excellent limestone headland east of Llandudno with routes from VD to E4. Good quality rock with trad and sport routes. A more accessible and less crowded alternative to the Great Orme\'s harder sectors. Fine sea views.',
    'From Rhos-on-Sea, follow the coastal path to the headland — 20 min. Some routes require short abseils.',
    'Rhos-on-Sea seafront car park (pay & display) or roadside near the headland access.', northWales);
  const littleMain = await b('Main Headland', littleOrme, 1);
  const littleEast = await b('East Face', littleOrme, 2);

  for (const route of [
    tradRoute('Little Orme Classic',  'VS',  '4c', littleMain, { height: 22, description: 'The accessible classic — a fine route on quality limestone with good sea views.' }),
    tradRoute('Headland Route',       'HVS', '5a', littleMain, { height: 20, description: 'Takes the headland above the sea — technical and well positioned.' }),
    sportRoute('East Face Sport',     '6c',  littleEast, { height: 18, description: 'A well-bolted sport route on the east face — good limestone and a pleasant outlook.' }),
    tradRoute('Orme Wall',            'E2',  '5b', littleMain, { height: 20, description: 'A bold trad route — compact limestone requiring precise footwork.' }),
    tradRoute('Rhos Wall',            'S',   '4a', littleMain, { height: 18, description: 'A pleasant moderate — good introduction to the headland.' }),
  ]) await r({ ...route, buttressId: route.buttress.id });

  // ── Castell Cidwm ─────────────────────────────────────────────────────────
  const castellCidwm = await c('Castell Cidwm', 53.0382, -4.1455, RockType.OTHER,
    'An excellent roadside rhyolite crag in the Nantlle Valley below Mynydd Mawr with routes from VS to E5. Less visited than the Pass crags but with superb rock quality. Cidwm Wall and Succubus are fine routes. Quick to dry and sheltered from the prevailing westerlies.',
    'From Rhyd Ddu village on the A4085, follow the minor road to Llyn Cwellyn then the path to the crag — 15 min.',
    'Small lay-by near the approach path on the Rhyd Ddu to Beddgelert road (free).', northWales);
  const cidwmMain  = await b('Main Wall', castellCidwm, 1);
  const cidwmRight = await b('Right Section', castellCidwm, 2);

  for (const route of [
    tradRoute('Cidwm Wall',           'HVS', '5a', cidwmMain,  { height: 25, description: 'The classic Castell Cidwm route — takes the main wall on excellent compact rhyolite.' }),
    tradRoute('Succubus',             'E3',  '5c', cidwmMain,  { height: 22, description: 'A fine technical route — sustained and serious on the main face.' }),
    tradRoute('Nantlle Wall',         'VS',  '4c', cidwmRight, { height: 20, description: 'A good VS on the right section — natural gear and varied moves.' }),
    tradRoute('Cidwm Arête',          'E1',  '5b', cidwmMain,  { height: 22, description: 'Takes the arête feature — exposed and bold above the valley.' }),
    tradRoute('Valley View',          'HS',  '4b', cidwmRight, { height: 18, description: 'A pleasant moderate with views over the Nantlle Valley.' }),
  ]) await r({ ...route, buttressId: route.buttress.id });

  // ── Graig Ddu (Moelwyns) ─────────────────────────────────────────────────
  const graigDdu = await c('Graig Ddu', 52.9832, -3.9905, RockType.OTHER,
    'A good rhyolite crag in the Moelwyn Mountains between Beddgelert and Ffestiniog with routes from S to E4. A quieter alternative to the Pass crags in a fine upland setting. Graig Ddu Direct is a popular HVS.',
    'From Croesor village, follow the footpath up to the crag — 30 min through typical Moelwyn scenery.',
    'Croesor village roadside (free). Narrow road — park considerately.', northWales);
  const graigMain = await b('Main Crag', graigDdu, 1);

  for (const route of [
    tradRoute('Graig Ddu Direct',     'HVS', '5a', graigMain, { height: 30, description: 'The classic Moelwyn route — takes the direct line on compact rhyolite in a quiet mountain setting.' }),
    tradRoute('Moelwyn Wall',         'VS',  '4c', graigMain, { height: 28, description: 'A fine route on the main crag — varied climbing on good rock.' }),
    tradRoute('Croesor Crack',        'S',   '4a', graigMain, { height: 25, description: 'A pleasant moderate — the easiest route on the crag with a lovely mountain aspect.' }),
    tradRoute('Graig Direct',         'E2',  '5c', graigMain, { height: 28, description: 'A harder line — technical and committing on compact Moelwyn rhyolite.' }),
  ]) await r({ ...route, buttressId: route.buttress.id });

  console.log('  ✓ Great Orme/North Wales sport: Pen Trwyn, Little Orme, Castell Cidwm, Graig Ddu');
}
