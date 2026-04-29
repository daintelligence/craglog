import { DataSource } from 'typeorm';
import { Region } from '../../modules/crags/entities/region.entity';
import { Crag, RockType } from '../../modules/crags/entities/crag.entity';
import { Buttress } from '../../modules/crags/entities/buttress.entity';
import { Route } from '../../modules/routes/entities/route.entity';
import { findOrCreateRegion, upsertCrag, upsertButtress, upsertRoute, tradRoute, sportRoute } from './seed-helpers';

export async function seedCreagDubhSkyeExtras(ds: DataSource) {
  const regionRepo = ds.getRepository(Region);
  const cragRepo   = ds.getRepository(Crag);
  const buttRepo   = ds.getRepository(Buttress);
  const routeRepo  = ds.getRepository(Route);

  const highlands = await findOrCreateRegion(regionRepo, { name: 'Scottish Highlands', country: 'Scotland' });
  const skye      = await findOrCreateRegion(regionRepo, { name: 'Isle of Skye', country: 'Scotland' });

  async function c(name: string, lat: number, lng: number, rock: RockType, desc: string, approach: string, parking: string, region: any) {
    return upsertCrag(cragRepo, { name, latitude: lat, longitude: lng, rockType: rock, description: desc, approach, parkingInfo: parking, region, regionId: region.id });
  }
  async function b(name: string, crag: Crag, order = 1) { return upsertButtress(buttRepo, { name, crag, cragId: crag.id, sortOrder: order }); }
  async function r(data: Partial<Route>) { return upsertRoute(routeRepo, data); }

  // ── Creag Dubh (Newtonmore) ───────────────────────────────────────────────
  const creagDubh = await c('Creag Dubh', 57.0545, -4.1428, RockType.GRANITE,
    'One of Scotland\'s most developed roadside crags — a superb schist/quartzite wall above the Spey Valley near Newtonmore with routes from HS to E7 and sport routes to 8b. The Inbred (E7) and Warlord (E6) are legendary hard trad routes. An extensive crag with something for everyone. Gets busy on good weekends.',
    'From Newtonmore village, follow the minor road south and park by the riverside. A short path leads to the crag — 10 min.',
    'Roadside layby near Newtonmore village (free). Signed from the village. Very accessible.', highlands);
  const waterfall  = await b('Waterfall Wall', creagDubh, 1);
  const slabs      = await b('Lower Slabs', creagDubh, 2);
  const upper      = await b('Upper Wall', creagDubh, 3);
  const sportWall  = await b('Sport Wall', creagDubh, 4);

  for (const route of [
    tradRoute('Inbred',               'E7',  '6c', upper,     { height: 25, description: 'The legendary Creag Dubh test piece — one of Scotland\'s most celebrated hard trad routes. Ferocious and committing.' }),
    tradRoute('Warlord',              'E6',  '6b', upper,     { height: 22, description: 'A great Scottish hard trad classic — sustained and serious above the Spey Valley.' }),
    tradRoute('Brute',                'E5',  '6b', upper,     { height: 20, description: 'A powerful route on the upper wall — an outstanding Scottish extreme.' }),
    tradRoute('Waterfall Wall',       'E2',  '5c', waterfall, { height: 22, description: 'The classic Creag Dubh E2 — takes the wall beside the waterfall on excellent rock.' }),
    tradRoute('King Cobra',           'E3',  '5c', waterfall, { height: 20, description: 'A bold and serious route beside the waterfall — well positioned and sustained.' }),
    tradRoute('Slab Route',           'VS',  '4b', slabs,     { height: 25, description: 'The classic lower slab — good friction on compact rock. A popular lower-grade outing.' }),
    tradRoute('Central Slab',         'HS',  '4b', slabs,     { height: 22, description: 'A pleasant moderate on the main slab — the best introduction to Creag Dubh.' }),
    sportRoute('Sport Wall Route',    '7a',  sportWall, { height: 18, description: 'A good sport route on the developed section — well bolted and sustained.' }),
    sportRoute('Creag Dubh Sport',    '7b+', sportWall, { height: 20, description: 'A harder sport pitch — technical and powerful above the Spey Valley.' }),
  ]) await r({ ...route, buttressId: route.buttress.id });

  // ── Binnein Shuas ─────────────────────────────────────────────────────────
  const binneinShuas = await c('Binnein Shuas', 56.9042, -4.4878, RockType.GRANITE,
    'A remote and spectacular granite crag above Loch Laggan — one of Scotland\'s finest venues for long multi-pitch routes. Routes from Difficult to E3 on excellent rough granite. Typically 5–8 pitches and 200–300m. A magnificent crag requiring a committed approach through wild Highland scenery.',
    'From Ardverikie estate on the south side of Loch Laggan, follow a long approach path through the estate — 2–2.5 hours. Permission and path details from the estate.',
    'Ardverikie estate car park near Kinloch Laggan on the A86 (free, sign in at estate).', highlands);
  const binneinMain   = await b('Main Face', binneinShuas, 1);
  const binneinSlabs  = await b('Ardverikie Wall', binneinShuas, 2);

  for (const route of [
    tradRoute('Ardverikie Wall',      'VD',  '3c', binneinSlabs, { height: 250, pitches: 6, description: 'The great Binnein Shuas classic — a magnificent long route on perfect granite above Loch Laggan. One of Scotland\'s finest mountain rock climbs.' }),
    tradRoute('Loch Laggan Wall',     'VS',  '4c', binneinMain,  { height: 200, pitches: 5, description: 'A fine sustained route on the main face — excellent rough granite in a remote and beautiful Highland setting.' }),
    tradRoute('Pincer',               'E2',  '5c', binneinMain,  { height: 180, pitches: 4, description: 'A harder route on the main face — sustained and committing with fine positions above the loch.' }),
    tradRoute('Midas Touch',          'E1',  '5b', binneinMain,  { height: 190, pitches: 4, description: 'A classic E1 on the main face — varied climbing on excellent highland granite.' }),
    tradRoute('Easy Angled Slab',     'D',   '2c', binneinSlabs, { height: 150, pitches: 4, description: 'The easiest route on the crag — a long slab outing with excellent rock and spectacular views.' }),
  ]) await r({ ...route, buttressId: route.buttress.id });

  // ── Neist Point (Isle of Skye) ────────────────────────────────────────────
  const neistPoint = await c('Neist Point', 57.4228, -6.7878, RockType.BASALT,
    'Scotland\'s most westerly point — a dramatic basalt headland on the far tip of the Duirinish peninsula with routes from VS to E5 on compact columnar basalt. The lighthouse setting is one of the most spectacular in British climbing. Views stretch to the Outer Hebrides.',
    'From Glendale on the B884, drive to the end of the road at the lighthouse car park. Follow the path to the cliff top — 20 min. Some abseils required for access.',
    'Neist Point lighthouse car park (pay & display in season). Very popular tourist spot — arrive early.', skye);
  const neistMain  = await b('Main Face', neistPoint, 1);
  const neistZawn  = await b('The Zawn', neistPoint, 2);

  for (const route of [
    tradRoute('The Promised Land',    'E3',  '5c', neistMain, { height: 45, description: 'The great Neist Point classic — a sustained route on the basalt headland with incredible Atlantic views.' }),
    tradRoute('Lighthouse Arête',     'VS',  '4c', neistMain, { height: 40, description: 'Takes the arête of the headland by the lighthouse — exposed and memorable.' }),
    tradRoute('Westernmost Wall',     'HVS', '5a', neistMain, { height: 38, description: 'A fine wall route at Scotland\'s western tip — compact basalt with small holds.' }),
    tradRoute('Zawn Route',           'E2',  '5b', neistZawn, { height: 35, description: 'A serious route in the zawn — committing above the Atlantic swell.' }),
    tradRoute('Columnar Crack',       'HS',  '4b', neistMain, { height: 35, description: 'Takes the joint between basalt columns — natural gear placements on distinctive rock.' }),
    tradRoute('Hebrides View',        'E1',  '5b', neistMain, { height: 40, description: 'A fine route with views of the Outer Hebrides — atmospheric and exposed.' }),
  ]) await r({ ...route, buttressId: route.buttress.id });

  // ── Trotternish Ridge Crags (Isle of Skye) ────────────────────────────────
  const trotternish = await c('Trotternish Ridge', 57.6480, -6.2580, RockType.BASALT,
    'The dramatic basalt escarpment running along the Trotternish peninsula gives a range of routes from VD to E3 above spectacular landscape. The Old Man of Storr and the Quiraing are nearby but climbing focuses on the less-visited wall sections. Wild and atmospheric with extraordinary scenery.',
    'Various access points along the A855 Trotternish coast road — each sector has a different approach (20–45 min from road).',
    'Multiple laybys along the A855 between Portree and Staffin (free). Old Man of Storr car park for northern sectors (pay & display).', skye);
  const storrWall  = await b('Storr Wall', trotternish, 1);
  const quiraing   = await b('Quiraing Crags', trotternish, 2);

  for (const route of [
    tradRoute('Storr Buttress',       'VS',  '4c', storrWall, { height: 60, pitches: 2, description: 'A route on the buttress below the Old Man of Storr — atmospheric basalt climbing above extraordinary scenery.' }),
    tradRoute('Quiraing Wall',        'HS',  '4b', quiraing,  { height: 50, pitches: 2, description: 'A pleasant route on the Quiraing section — good basalt in a unique geological landscape.' }),
    tradRoute('Trotternish Arête',    'HVS', '5a', storrWall, { height: 55, pitches: 2, description: 'An exposed arête on the ridge — superb views and fine basalt climbing.' }),
    tradRoute('Table Route',          'VD',  '3c', quiraing,  { height: 45, description: 'A route near the famous Table feature — accessible and atmospheric.' }),
  ]) await r({ ...route, buttressId: route.buttress.id });

  console.log('  ✓ Creag Dubh/Skye extras: Creag Dubh, Binnein Shuas, Neist Point, Trotternish Ridge');
}
