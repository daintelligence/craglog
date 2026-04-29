import { DataSource } from 'typeorm';
import { Region } from '../../modules/crags/entities/region.entity';
import { Crag, RockType } from '../../modules/crags/entities/crag.entity';
import { Buttress } from '../../modules/crags/entities/buttress.entity';
import { Route } from '../../modules/routes/entities/route.entity';
import { findOrCreateRegion, upsertCrag, upsertButtress, upsertRoute, tradRoute } from './seed-helpers';

export async function seedCairngormsCrags(ds: DataSource) {
  const regionRepo = ds.getRepository(Region);
  const cragRepo   = ds.getRepository(Crag);
  const buttRepo   = ds.getRepository(Buttress);
  const routeRepo  = ds.getRepository(Route);

  const cairngorms = await findOrCreateRegion(regionRepo, { name: 'Cairngorms', country: 'Scotland' });

  async function c(name: string, lat: number, lng: number, rock: RockType, desc: string, approach: string, parking: string, region: any) {
    return upsertCrag(cragRepo, { name, latitude: lat, longitude: lng, rockType: rock, description: desc, approach, parkingInfo: parking, region, regionId: region.id });
  }
  async function b(name: string, crag: Crag, order = 1) { return upsertButtress(buttRepo, { name, crag, cragId: crag.id, sortOrder: order }); }
  async function r(data: Partial<Route>) { return upsertRoute(routeRepo, data); }

  // ── Shelter Stone Crag ───────────────────────────────────────────────────
  const shelterStone = await c('Shelter Stone Crag', 57.0582, -3.6455, RockType.GRANITE,
    'One of the great high mountain crags of Britain — a 300m granite wall above Loch Avon in the heart of the Cairngorms. Remote, serious, and requiring a long approach, but rewarding with some of Scotland\'s finest hard rock routes. The Needle, Citadel and Thor are legendary. A true mountaineering destination.',
    'From Cairngorm Ski Centre, walk via the Goat Track or via Loch Avon approaches — 3–4 hours. Very remote and exposed. Mountain skills and navigation essential.',
    'Cairngorm Ski Centre car park, Aviemore (pay & display). Longest approach of any major UK crag.', cairngorms);
  const shelterMain  = await b('Main Wall', shelterStone, 1);
  const shelterLeft  = await b('Left Wing', shelterStone, 2);
  const shelterRight = await b('Right Wing', shelterStone, 3);

  for (const route of [
    tradRoute('The Needle',           'E3',  '5c', shelterMain,  { height: 280, pitches: 6, description: 'The Shelter Stone classic — a magnificent sustained route up one of Britain\'s most remote great walls. An unforgettable Scottish experience.' }),
    tradRoute('Citadel',              'E1',  '5b', shelterMain,  { height: 260, pitches: 5, description: 'The most accessible of the major Shelter Stone routes — a wonderful long climb on excellent granite above Loch Avon.' }),
    tradRoute('Thor',                 'E4',  '6a', shelterMain,  { height: 270, pitches: 5, description: 'A powerful and sustained route up the central section — one of the hardest classic mountain rock climbs in Scotland.' }),
    tradRoute('Cupid\'s Bow',         'VS',  '4c', shelterLeft,  { height: 180, pitches: 4, description: 'The classic lower-grade Shelter Stone route — takes the curved feature on the left wing. A remote and rewarding outing.' }),
    tradRoute('The Run of the Arrow', 'E2',  '5c', shelterRight, { height: 220, pitches: 4, description: 'A bold and impressive line on the right wing — committed granite climbing in a wilderness setting.' }),
    tradRoute('The Steeple',          'HVS', '5a', shelterMain,  { height: 200, pitches: 4, description: 'A fine easier route on the main wall — well sustained on good Cairngorm granite.' }),
  ]) await r({ ...route, buttressId: route.buttress.id });

  // ── Hell's Lum Crag ──────────────────────────────────────────────────────
  const hellsLum = await c('Hell\'s Lum Crag', 57.0572, -3.6365, RockType.GRANITE,
    'A superb granite crag immediately above Loch Avon — shorter than Shelter Stone but with more accessible routes. The crag dries quickly and gives excellent routes from VS to E4 on perfect coarse granite. Often combined with Shelter Stone on a multi-day Cairngorm trip.',
    'From Cairngorm Ski Centre, follow the Goat Track path to Loch Avon then contour to the crag — 2.5 hours. Easier approach than Shelter Stone.',
    'Cairngorm Ski Centre car park, Aviemore (pay & display).', cairngorms);
  const hellsMain = await b('Main Face', hellsLum, 1);
  const hellsSlab = await b('East Slab', hellsLum, 2);

  for (const route of [
    tradRoute('Hell\'s Lum',          'VS',  '4c', hellsMain, { height: 100, pitches: 3, description: 'The namesake route — the classic Hell\'s Lum outing on excellent Cairngorm granite above Loch Avon.' }),
    tradRoute('Deep Throat',          'E3',  '5c', hellsMain, { height: 90,  pitches: 2, description: 'The hard classic on Hell\'s Lum — sustained and serious on compact granite.' }),
    tradRoute('East Slab',            'HS',  '4b', hellsSlab, { height: 80,  pitches: 2, description: 'A classic easier route on the east slab — friction on perfect coarse granite.' }),
    tradRoute('Pluto',                'E2',  '5b', hellsMain, { height: 95,  pitches: 2, description: 'A bold face route — good climbing above the Loch Avon basin.' }),
    tradRoute('Raeburn\'s Groove',    'VS',  '4c', hellsSlab, { height: 75,  pitches: 2, description: 'Named after the great Scottish pioneer — a good moderate route in an outstanding setting.' }),
  ]) await r({ ...route, buttressId: route.buttress.id });

  // ── Coire an t-Sneachda (Northern Corries) ────────────────────────────────
  const northernCorries = await c('Northern Corries Crags', 57.1132, -3.6895, RockType.GRANITE,
    'The most accessible of the Cairngorm high crags — the granite cliffs of the Northern Corries (Coire an t-Sneachda and Coire an Lochain) are reached by path from the ski centre. Excellent granite routes from Difficult to E4. Aladdin\'s Mirror is a famous slab route.',
    'From the Cairngorm Ski Centre, follow the path into Coire an t-Sneachda — 45 min to the crags. The quickest approach to high Cairngorm climbing.',
    'Cairngorm Ski Centre car park, Aviemore (pay & display). Cable car option in season.', cairngorms);
  const aladdinSlab  = await b('Aladdin\'s Mirror', northernCorries, 1);
  const fiacaillButt = await b('Fiacaill Buttress', northernCorries, 2);
  const lochain      = await b('Coire an Lochain Walls', northernCorries, 3);

  for (const route of [
    tradRoute('Aladdin\'s Mirror',    'D',   '2c', aladdinSlab,  { height: 120, pitches: 3, description: 'The famous Cairngorm slab — a wonderful outing on huge sheets of perfect granite. A Northern Corries classic.' }),
    tradRoute('Aladdin\'s Couloir',   'HS',  '4b', aladdinSlab,  { height: 110, pitches: 2, description: 'The couloir route alongside the mirror — scrambling and climbing on excellent granite.' }),
    tradRoute('Fiacaill Buttress',    'VD',  '3c', fiacaillButt, { height: 100, pitches: 2, description: 'Takes the prominent buttress feature — a pleasant route accessible from the corrie path.' }),
    tradRoute('The Haston Line',      'E4',  '6a', lochain,      { height: 80,  pitches: 2, description: 'The hardest route in the Northern Corries — a bold and powerful line on the Lochain walls.' }),
    tradRoute('Ewen Buttress',        'VS',  '4c', lochain,      { height: 85,  pitches: 2, description: 'A fine route on the Coire an Lochain walls — varied climbing on good granite.' }),
    tradRoute('Savage Slit',          'S',   '4a', fiacaillButt, { height: 70,  pitches: 2, description: 'A classic Cairngorm moderate — good climbing in a spectacular corrie setting.' }),
  ]) await r({ ...route, buttressId: route.buttress.id });

  // ── Stac an Fharaidh ─────────────────────────────────────────────────────
  const stacFharaidh = await c('Stac an Fharaidh', 57.0602, -3.6330, RockType.GRANITE,
    'A compact granite crag near the head of Loch Avon with good routes from HS to E2. Not as imposing as Shelter Stone but dries faster and is less serious. A fine venue for a day\'s rock climbing in the heart of the Cairngorms.',
    'From Cairngorm via the Goat Track, descend to Loch Avon and follow the shore to the crag — 2.5 hours.',
    'Cairngorm Ski Centre car park, Aviemore (pay & display).', cairngorms);
  const stacMain = await b('Main Crag', stacFharaidh, 1);

  for (const route of [
    tradRoute('Fharaidh Crack',       'VS',  '4c', stacMain, { height: 55, pitches: 2, description: 'The main crack line — good gear and enjoyable climbing in a remote setting.' }),
    tradRoute('Stac Route',           'HS',  '4b', stacMain, { height: 50, pitches: 2, description: 'The standard route — a pleasant outing on good Cairngorm granite.' }),
    tradRoute('Avon Arête',           'HVS', '5a', stacMain, { height: 60, pitches: 2, description: 'An exposed arête above Loch Avon — fine positions and good climbing.' }),
    tradRoute('Loch Avon Wall',       'E1',  '5b', stacMain, { height: 55, pitches: 2, description: 'A sustained wall route — technical moves on compact granite above the loch.' }),
  ]) await r({ ...route, buttressId: route.buttress.id });

  console.log('  ✓ Cairngorms: Shelter Stone Crag, Hell\'s Lum, Northern Corries, Stac an Fharaidh');
}
