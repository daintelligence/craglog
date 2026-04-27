import { DataSource } from 'typeorm';
import { Region } from '../../modules/crags/entities/region.entity';
import { Crag, RockType } from '../../modules/crags/entities/crag.entity';
import { Buttress } from '../../modules/crags/entities/buttress.entity';
import { Route } from '../../modules/routes/entities/route.entity';
import { findOrCreateRegion, upsertCrag, upsertButtress, upsertRoute, tradRoute, sportRoute, boulderRoute } from './seed-helpers';

export async function seedNorthWalesMore(ds: DataSource) {
  const regionRepo = ds.getRepository(Region);
  const cragRepo   = ds.getRepository(Crag);
  const buttRepo   = ds.getRepository(Buttress);
  const routeRepo  = ds.getRepository(Route);

  const snowdonia = await findOrCreateRegion(regionRepo, { name: 'Snowdonia', country: 'Wales' });
  const ogwen     = await findOrCreateRegion(regionRepo, { name: 'Ogwen Valley', country: 'Wales' });

  async function c(name: string, lat: number, lng: number, rock: RockType, desc: string, approach: string, parking: string, region: any) {
    return upsertCrag(cragRepo, { name, latitude: lat, longitude: lng, rockType: rock, description: desc, approach, parkingInfo: parking, region, regionId: region.id });
  }
  async function b(name: string, crag: Crag, order = 1) { return upsertButtress(buttRepo, { name, crag, cragId: crag.id, sortOrder: order }); }
  async function r(data: Partial<Route>) { return upsertRoute(routeRepo, data); }

  // ── Lliwedd ───────────────────────────────────────────────────────────────
  const lliwedd = await c('Lliwedd', 53.0728, -4.0285, RockType.OTHER,
    'A vast dark cliff above Llyn Llydaw — one of the great Welsh mountain crags with a serious and atmospheric character. Routes from Very Difficult to E5 on rhyolite. The home of some of the oldest rock climbs in Wales.',
    'From Pen y Pass car park (SH 647 556), follow Miners\' Track to Llyn Llydaw then scramble up to the cliff — 90 min.',
    'Pen y Pass NPA car park (pay & display). Very busy in summer — book or arrive early.', snowdonia);
  const lliweddWest  = await b('West Buttress', lliwedd, 1);
  const lliweddEast  = await b('East Buttress', lliwedd, 2);
  const lliweddCent  = await b('Central Gully', lliwedd, 3);
  for (const route of [
    tradRoute('Avalanche / Red Wall / Continuation', 'VD', '3c', lliweddWest, { height: 260, pitches: 7, description: 'The most popular route on Lliwedd — a magnificent mountaineering outing combining three classic lines.' }),
    tradRoute('Slanting Buttress',     'VD',  '3c', lliweddWest, { height: 240, pitches: 6, description: 'An excellent mountaineering route with good rock and superb situations.' }),
    tradRoute('Shallow Gully',         'M',   '2',  lliweddCent, { height: 200, pitches: 5, description: 'Easy but entertaining mountain scramble — the standard descent route.' }),
    tradRoute('Mallory\'s Slab',       'S',   '4a', lliweddEast, { height: 200, pitches: 5, description: 'Named after George Mallory, who pioneered routes here. Classic sustained climbing.' }),
    tradRoute('Central Gully Direct',  'HS',  '4b', lliweddCent, { height: 250, pitches: 6, description: 'Takes the direct line up the central gully — a fine mountaineering route.' }),
    tradRoute('Rake End Wall',         'VS',  '4c', lliweddEast, { height: 200, pitches: 4, description: 'Excellent wall climbing on Lliwedd\'s east side.' }),
    tradRoute('Sword of Damocles',     'HVS', '5a', lliweddEast, { height: 180, pitches: 4, description: 'A bold and technical route taking the cleanest face on the East Buttress.' }),
  ]) await r({ ...route, buttressId: route.buttress.id });

  // ── Craig yr Ysfa ─────────────────────────────────────────────────────────
  const craigYr = await c('Craig yr Ysfa', 53.1755, -3.8820, RockType.OTHER,
    'A high mountain crag on the Carneddau with a wild and remote atmosphere. Routes from Severe to E4 on good rhyolite. The classic Great Gully gives an outstanding mountaineering route.',
    'Park at Ogwen Cottage (SH 649 604). Approach via Cwm Ffynnon — 90 min to crag.',
    'Ogwen Cottage NPA car park (pay & display) or roadside near Llyn Ogwen.', ogwen);
  const craigYrMain  = await b('Great Gully Wall', craigYr, 1);
  const craigYrRight = await b('Right Buttress',   craigYr, 2);
  for (const route of [
    tradRoute('Amphitheatre Buttress', 'VD',  '3c', craigYrMain,  { height: 250, pitches: 7, description: 'The greatest route on Craig yr Ysfa — a Carneddau classic with brilliant rock.' }),
    tradRoute('Great Gully',           'S',   '4a', craigYrMain,  { height: 250, pitches: 6, description: 'Classic mountain gully — serious in bad conditions but magnificent in the dry.' }),
    tradRoute('Pinnacle Wall',         'VS',  '4c', craigYrRight, { height: 150, pitches: 4, description: 'Excellent wall and crack climbing on the right buttress — varied and sustained.' }),
    tradRoute('Corner and Arête',      'HVS', '5a', craigYrRight, { height: 120, pitches: 3, description: 'Technical route on the cleanest section of the crag.' }),
  ]) await r({ ...route, buttressId: route.buttress.id });

  // ── Llech Ddu ─────────────────────────────────────────────────────────────
  const llechDdu = await c('Llech Ddu', 53.1720, -3.8560, RockType.OTHER,
    'A dark, steep crag in a remote cwm high on the Carneddau. Serious climbing on good rock in a genuinely wild setting. One of the least-visited major Welsh crags.',
    'Approach from Ogwen Cottage or Gerlan via Cwm Llafar — 90 min.',
    'Ogwen Cottage NPA car park or roadside at Gerlan (free).', ogwen);
  const llechMain = await b('Central Wall', llechDdu, 1);
  for (const route of [
    tradRoute('Kirkus Direct',   'VD',  '3c', llechMain, { height: 150, pitches: 5, description: 'Colin Kirkus\'s classic route — one of the great Welsh Diffs.' }),
    tradRoute('Overhanging Wall','HVS', '5a', llechMain, { height: 130, pitches: 4, description: 'Bold climbing on the steep central section — the crux pitch is committing.' }),
    tradRoute('Black Wall',      'E2',  '5c', llechMain, { height: 120, pitches: 3, description: 'The hardest route on Llech Ddu — technical face climbing on good rock.' }),
  ]) await r({ ...route, buttressId: route.buttress.id });

  // ── Bochlwyd Buttress ─────────────────────────────────────────────────────
  const bochlwyd = await c('Bochlwyd Buttress', 53.1152, -3.9924, RockType.OTHER,
    'A fine rhyolite buttress above Llyn Bochlwyd with excellent short routes and some multi-pitch classics. Quick to reach from Ogwen and popular with guided parties.',
    'Park at Ogwen Cottage (SH 649 604). Follow path to Llyn Bochlwyd — 30 min.',
    'Ogwen Cottage NPA car park (pay & display).', ogwen);
  const bochMain = await b('Main Buttress', bochlwyd, 1);
  for (const route of [
    tradRoute('Bochlwyd Eliminate', 'VS',  '4c', bochMain, { height: 60, pitches: 2, description: 'The classic Bochlwyd route — a good line with varied moves.' }),
    tradRoute('Nea',                'HVS', '5a', bochMain, { height: 55, pitches: 2, description: 'An excellent technical route — one of the best in Ogwen at this grade.' }),
    tradRoute('Chimney Route',      'VD',  '3c', bochMain, { height: 50, pitches: 2, description: 'Good holds throughout — fine intro to rhyolite climbing above Ogwen.' }),
  ]) await r({ ...route, buttressId: route.buttress.id });

  // ── Clogwyn y Ddysgl ─────────────────────────────────────────────────────
  const clogDdysgl = await c('Clogwyn y Ddysgl', 53.0722, -4.0602, RockType.OTHER,
    'A crag above Cwm Glas with big, serious mountain routes. Remote atmosphere and excellent rock. The cliff holds snow long into spring.',
    'From Pen y Pass, follow Pyg Track then branch off to Cwm Glas — 60 min.',
    'Pen y Pass NPA car park (pay & display).', snowdonia);
  const ddysglMain = await b('Main Cliff', clogDdysgl, 1);
  for (const route of [
    tradRoute('Schoolmaster',      'VS',  '4c', ddysglMain, { height: 120, pitches: 4, description: 'One of the great Snowdon mountain crags routes — taking excellent lines up the main face.' }),
    tradRoute('Mur y Niwl',        'HVS', '5a', ddysglMain, { height: 130, pitches: 4, description: 'Wall of Mist — atmospheric and sustained climbing in a remote cwm.' }),
    tradRoute('Spectre',           'E2',  '5c', ddysglMain, { height: 110, pitches: 3, description: 'Technical and serious — a genuine mountain E2 in a committing position.' }),
  ]) await r({ ...route, buttressId: route.buttress.id });

  // ── Porth Ysgo ────────────────────────────────────────────────────────────
  const porthYsgo = await c('Porth Ysgo', 52.8018, -4.6352, RockType.GRANITE,
    'A hidden gem on the Llŷn Peninsula — crystalline pink granite sea cliffs with routes from VS to E4. Excellent rock quality and a delightful beach setting. Tidal in places.',
    'Park near Porth Ysgo farm (SH 208 268). Footpath to the beach — 15 min.',
    'Small car park at Mynytho Common or roadside near farm (free/donations).', snowdonia);
  const porthMain  = await b('Main Wall', porthYsgo, 1);
  const porthRight = await b('Right Zawn', porthYsgo, 2);
  for (const route of [
    tradRoute('Seagull',         'VS',  '4c', porthMain,  { height: 20, description: 'Classic intro to the Porth Ysgo granite — fine holds and a great position.' }),
    tradRoute('Jaws',            'HVS', '5a', porthMain,  { height: 25, description: 'Takes the obvious line on the main wall — sustained and enjoyable.' }),
    tradRoute('Pink Panther',    'E1',  '5b', porthRight, { height: 22, description: 'Technical wall climbing on perfect pink granite — one of the best routes here.' }),
    tradRoute('Shear Wall',      'E2',  '5c', porthRight, { height: 20, description: 'Bold arête above the zawn — requires commitment at the crux.' }),
    tradRoute('Marble Arch',     'HS',  '4b', porthMain,  { height: 18, description: 'A pleasant route through the natural arch feature at sea level.' }),
  ]) await r({ ...route, buttressId: route.buttress.id });

  console.log('  ✓ North Wales more: Lliwedd, Craig yr Ysfa, Llech Ddu, Bochlwyd, Clogwyn y Ddysgl, Porth Ysgo');
}
