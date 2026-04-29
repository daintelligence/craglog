import { DataSource } from 'typeorm';
import { Region } from '../../modules/crags/entities/region.entity';
import { Crag, RockType } from '../../modules/crags/entities/crag.entity';
import { Buttress } from '../../modules/crags/entities/buttress.entity';
import { Route } from '../../modules/routes/entities/route.entity';
import { findOrCreateRegion, upsertCrag, upsertButtress, upsertRoute, tradRoute, sportRoute } from './seed-helpers';

export async function seedYorkshireLimestone(ds: DataSource) {
  const regionRepo = ds.getRepository(Region);
  const cragRepo   = ds.getRepository(Crag);
  const buttRepo   = ds.getRepository(Buttress);
  const routeRepo  = ds.getRepository(Route);

  const dales   = await findOrCreateRegion(regionRepo, { name: 'Yorkshire Dales', country: 'England' });
  const craven  = await findOrCreateRegion(regionRepo, { name: 'Craven Limestone', country: 'England' });

  async function c(name: string, lat: number, lng: number, rock: RockType, desc: string, approach: string, parking: string, region: any) {
    return upsertCrag(cragRepo, { name, latitude: lat, longitude: lng, rockType: rock, description: desc, approach, parkingInfo: parking, region, regionId: region.id });
  }
  async function b(name: string, crag: Crag, order = 1) { return upsertButtress(buttRepo, { name, crag, cragId: crag.id, sortOrder: order }); }
  async function r(data: Partial<Route>) { return upsertRoute(routeRepo, data); }

  // ── Kilnsey Crag ─────────────────────────────────────────────────────────
  const kilnsey = await c('Kilnsey Crag', 54.0642, -2.0068, RockType.LIMESTONE,
    'The most impressive limestone crag in Yorkshire — a massive 50m overhanging wall above Wharfedale. A mecca for sport climbing with routes from 6b to 8b+, plus serious trad on the main wall. The Main Overhang is one of the most recognisable features in UK climbing.',
    'From the car park on the B6160 below the crag. The crag is visible from the road — 5 min walk.',
    'Large car park at the base of the crag on B6160 Grassington road (pay & display in season).', dales);
  const kilnseyMain  = await b('Main Overhang', kilnsey, 1);
  const kilnseyRight = await b('Right Side', kilnsey, 2);
  const kilnseyLeft  = await b('Left Wall', kilnsey, 3);
  for (const route of [
    tradRoute('Cleft Route',          'HVS', '5a', kilnseyMain,  { height: 45, pitches: 2, description: 'The classic trad route — takes a dramatic line through the overhangs. Sustained and committing.' }),
    tradRoute('Diedre',               'HVS', '5a', kilnseyMain,  { height: 40, pitches: 2, description: 'A fine diedre giving sustained wall and corner climbing — one of the best trad routes at the grade.' }),
    tradRoute('Central Wall',         'E2',  '5c', kilnseyMain,  { height: 40, pitches: 1, description: 'Bold face climbing on the central section — powerful moves on good holds.' }),
    tradRoute('Original Route',       'VS',  '4c', kilnseyRight, { height: 35, pitches: 1, description: 'The easiest way up Kilnsey — still a serious proposition in the imposing setting.' }),
    sportRoute('Directissima',        '7c',  kilnseyMain,  { height: 45, description: 'The overhanging testpiece — continuous powerful climbing through the roof. A major Yorkshire tick.' }),
    sportRoute('Niblick Wall',        '7a',  kilnseyRight, { height: 35, description: 'Excellent sustained face climbing on the right side — good for those moving onto 7a.' }),
    sportRoute('Main Overhang Direct','8a',  kilnseyMain,  { height: 50, description: 'The route that made Kilnsey famous — thundering through the main overhang. Strenuous and spectacular.' }),
    sportRoute('New Dawn',            '7b+', kilnseyLeft,  { height: 38, description: 'Technical wall climbing leading into sustained upper headwall — classic at the grade.' }),
    sportRoute('Kilnsey Dawgs',       '6c',  kilnseyRight, { height: 32, description: 'A popular introduction to sport climbing at Kilnsey — good holds and a clear line.' }),
  ]) await r({ ...route, buttressId: route.buttress.id });

  // ── Attermire Scar ────────────────────────────────────────────────────────
  const attermire = await c('Attermire Scar', 54.0880, -2.2520, RockType.LIMESTONE,
    'A long limestone escarpment above Settle giving traditional climbing from Severe to E3. The cliff faces south and dries quickly. Varied routes on good limestone with panoramic views over Ribblesdale.',
    'From Settle town centre, follow footpath past Sugar Loaf Hill to the scar — 30 min walk.',
    'Roadside parking in Settle town centre or at the Settle station car park (pay & display).', craven);
  const attMain = await b('Main Scar', attermire, 1);
  const attRight = await b('Right Wing', attermire, 2);
  for (const route of [
    tradRoute('Attermire Crack',     'VS',  '4c', attMain, { height: 25, description: 'Takes the obvious crack line on the main face — good protection and varied climbing.' }),
    tradRoute('Scar Route',          'S',   '4a', attMain, { height: 20, description: 'The standard route — a pleasant outing on good holds with fine views.' }),
    tradRoute('Limestone Wall',      'HS',  '4b', attMain, { height: 22, description: 'Technical face climbing left of the main crack — delicate footwork required.' }),
    tradRoute('Cave Route',          'E1',  '5b', attRight, { height: 20, description: 'Takes the cave feature on the right wing — exciting and slightly strenuous.' }),
    tradRoute('Direct Finish',       'E2',  '5c', attMain, { height: 18, description: 'The hardest line on Attermire — direct through the bulge on the upper wall.' }),
    tradRoute('Settle Route',        'VD',  '3c', attMain, { height: 18, description: 'The most accessible route on the scar — a good introduction to Yorkshire limestone.' }),
  ]) await r({ ...route, buttressId: route.buttress.id });

  // ── Giggleswick Scar ──────────────────────────────────────────────────────
  const giggleswick = await c('Giggleswick Scar', 54.0747, -2.2936, RockType.LIMESTONE,
    'A classic roadside limestone crag near Settle with quick drying routes from Severe to E4. A Dales institution with a friendly atmosphere and good quality rock. Some of the best short single-pitch sport in the Dales.',
    '5 min walk from the B6480 roadside layby — the crag is clearly visible from the road.',
    'Roadside layby on the B6480 north of Giggleswick village (free).', craven);
  const gigMain  = await b('Main Wall', giggleswick, 1);
  const gigRight = await b('Right Buttress', giggleswick, 2);
  for (const route of [
    tradRoute('Scar Lane',           'VS',  '4c', gigMain, { height: 18, description: 'The popular classic — takes the main wall on good holds with a tricky crux.' }),
    tradRoute('Belle Vue Crack',     'HS',  '4b', gigMain, { height: 16, description: 'A satisfying crack route — excellent holds and reliable protection.' }),
    tradRoute('Overhang Route',      'E1',  '5b', gigMain, { height: 15, description: 'Takes the prominent overhang direct — powerful and exciting.' }),
    sportRoute('Giggleswick Sport',  '7a',  gigRight, { height: 18, description: 'The modern test piece — continuous technical climbing on the right buttress.' }),
    sportRoute('Roadside Attraction','6b',  gigMain,  { height: 16, description: 'A good warm-up or introduction — well bolted and fun moves throughout.' }),
    tradRoute('North Wall Route',    'E2',  '5c', gigRight, { height: 18, description: 'Bold climbing on the north-facing section — harder than it looks from below.' }),
  ]) await r({ ...route, buttressId: route.buttress.id });

  // ── Winskill Stones ────────────────────────────────────────────────────────
  const winskill = await c('Winskill Stones', 54.0968, -2.2770, RockType.LIMESTONE,
    'A remote limestone pavement and outcrop above Langcliffe with excellent trad climbing from VS to E4. Superb position overlooking Ribblesdale. Some of the finest naturally sculpted limestone features in the Dales.',
    'From Langcliffe village, follow farm track and footpath to the stones — 40 min walk.',
    'Limited roadside parking at Langcliffe village (free, please respect local access).', craven);
  const winskillMain = await b('Main Pavement', winskill, 1);
  for (const route of [
    tradRoute('Winskill Wall',       'VS',  '4c', winskillMain, { height: 15, description: 'A satisfying route up the main face — good rock and excellent positions above the valley.' }),
    tradRoute('Pavement Crack',      'HVS', '5a', winskillMain, { height: 14, description: 'Technical crack climbing on the edge of the limestone pavement — delicate and technical.' }),
    tradRoute('Stone Edge',          'E2',  '5b', winskillMain, { height: 14, description: 'The hardest Winskill route — committing face climbing with sparse protection.' }),
    tradRoute('Ribblesdale View',    'S',   '4a', winskillMain, { height: 12, description: 'A pleasant easier route with outstanding views — a good introduction to the crag.' }),
  ]) await r({ ...route, buttressId: route.buttress.id });

  // ── Blue Scar ─────────────────────────────────────────────────────────────
  const blueScar = await c('Blue Scar', 54.0830, -2.0520, RockType.LIMESTONE,
    'An excellent off-the-beaten-track limestone crag near Grassington. Clean white rock giving trad routes from Severe to E3. Quieter than the more popular Wharfedale crags with some hidden gems.',
    'Follow the footpath from Grassington towards Grass Wood — crag is reached in 30 min.',
    'Grassington National Park car park (pay & display).', dales);
  const blueScarMain = await b('Main Face', blueScar, 1);
  for (const route of [
    tradRoute('Blue Wall',           'VS',  '4b', blueScarMain, { height: 20, description: 'A nice face route on the cleanest section — well worth the walk.' }),
    tradRoute('Scar Crack',          'HS',  '4b', blueScarMain, { height: 18, description: 'The prominent crack on the left — solid holds and reliable gear.' }),
    tradRoute('Wharfedale Route',    'S',   '4a', blueScarMain, { height: 16, description: 'The standard route, a good intro to the crag.' }),
    tradRoute('Grey Wall',           'E1',  '5b', blueScarMain, { height: 18, description: 'Technical sustained climbing on the grey wall section.' }),
  ]) await r({ ...route, buttressId: route.buttress.id });

  console.log('  ✓ Yorkshire limestone: Kilnsey Crag, Attermire Scar, Giggleswick Scar, Winskill Stones, Blue Scar');
}
