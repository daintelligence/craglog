import { DataSource } from 'typeorm';
import { Region } from '../../modules/crags/entities/region.entity';
import { Crag, RockType } from '../../modules/crags/entities/crag.entity';
import { Buttress } from '../../modules/crags/entities/buttress.entity';
import { Route } from '../../modules/routes/entities/route.entity';
import { findOrCreateRegion, upsertCrag, upsertButtress, upsertRoute, tradRoute, sportRoute } from './seed-helpers';

export async function seedKilnseySport(ds: DataSource) {
  const regionRepo = ds.getRepository(Region);
  const cragRepo   = ds.getRepository(Crag);
  const buttRepo   = ds.getRepository(Buttress);
  const routeRepo  = ds.getRepository(Route);

  const region = await findOrCreateRegion(regionRepo, { name: 'Yorkshire Dales', country: 'England' });

  async function c(name: string, lat: number, lng: number, rock: RockType, desc: string, approach: string, parking: string, region: any) {
    return upsertCrag(cragRepo, { name, latitude: lat, longitude: lng, rockType: rock, description: desc, approach, parkingInfo: parking, region, regionId: region.id });
  }
  async function b(name: string, crag: Crag, order = 1) { return upsertButtress(buttRepo, { name, crag, cragId: crag.id, sortOrder: order }); }
  async function r(data: Partial<Route>) { return upsertRoute(routeRepo, data); }

  // ── Kilnsey Crag ──────────────────────────────────────────────────────────
  const kilnsey = await c('Kilnsey Crag', 54.0728, -2.0148, RockType.LIMESTONE,
    'The most impressive roadside limestone cliff in the Yorkshire Dales — a vast overhanging prow of pale grey limestone that dominates the upper Wharfedale skyline. The Great Overhang juts out over 9 metres, making Kilnsey one of the most recognised cliffs in northern England. Mandela (8b) is one of the hardest routes in Yorkshire; the Central Wall and Warlords walls give world-class sport routes from 7a upwards. A handful of outstanding trad routes thread through the steeper sections. An iconic destination that rewards the strong climber.',
    'Kilnsey Crag sits directly above the B6160 in Kilnsey village, visible from miles away. Park in the lay-by opposite the crag and walk straight to the base — 2 minutes. The main overhang and left wing are immediately obvious.',
    'Roadside lay-by on the B6160 opposite the crag in Kilnsey village (free). The Kilnsey Park and Trout Farm adjacent provides alternative parking and refreshments. No permit required.', region);
  const kilnseyOverhang = await b('Main Overhang', kilnsey, 1);
  const kilnseyLeft     = await b('Left Wing', kilnsey, 2);
  const kilnseyRight    = await b('Right Wing', kilnsey, 3);

  for (const route of [
    tradRoute('Old Testament',   'E3',  '5c', kilnseyOverhang, { height: 30, pitches: 1, description: 'A celebrated trad route on the overhang section — strenuous moves on good holds above bold and technical protection placements. One of the finest traditional outings at Kilnsey and a serious undertaking at the grade.' }),
    tradRoute('Great Wall',      'HVS', '5b', kilnseyLeft,     { height: 25, pitches: 1, description: 'The classic Kilnsey trad route on the left wing — sustained HVS climbing on excellent compact limestone. Well-protected with good runners and a memorable position.' }),
    sportRoute('Mandela',        '8b',  kilnseyOverhang,       { height: 20, description: 'One of the hardest sport routes in Yorkshire — a brutally powerful and sustained line through the main overhang. Demands exceptional upper-body strength and lock-off ability on pocketed limestone. A benchmark 8b.' }),
    sportRoute('Central Wall',   '7b',  kilnseyOverhang,       { height: 22, description: 'The Kilnsey classic sport route — sustained and powerful climbing through the central section of the great overhang. Well-bolted with a strenuous crux on slopers above the lip. A must-do for those at the grade.' }),
    sportRoute('Warlords',       '7c',  kilnseyOverhang,       { height: 22, description: 'A serious and sustained sport route through the main overhang — relentless lock-offs and powerful pulls on pocketed grey limestone. Technical footwork as well as brute strength required throughout.' }),
    sportRoute('Right Wing',     '6c',  kilnseyRight,          { height: 20, description: 'A fine route on the right wing of the crag — technical and sustained on excellent pocketed limestone. A good warm-up for the harder overhang routes, with a well-bolted line and positive holds.' }),
    sportRoute('The Superdirect', '8a+', kilnseyOverhang,      { height: 20, description: 'An extreme testpiece taking the most direct line through the overhang — fingery and powerful with a sequence of desperate moves linking pockets and crimps on the compact grey limestone. One of the hardest routes at the crag.' }),
    sportRoute('Kilnsey Classic', '7a', kilnseyLeft,           { height: 22, description: 'The most accessible hard sport route at Kilnsey — a sustained and well-bolted 7a on the left wing. Excellent limestone, positive pockets and a well-defined crux make this one of the most popular routes at the crag.' }),
  ]) await r({ ...route, buttressId: route.buttress.id });

  // ── Kilnsey Lower Tier ────────────────────────────────────────────────────
  const kilnseyLower = await c('Kilnsey Lower Tier', 54.0725, -2.0152, RockType.LIMESTONE,
    'The lower section of Kilnsey Crag, sitting below and left of the main overhang — a compact wall of excellent pocketed limestone giving good sport routes from 5+ to 6c. Ideal for warming up before tackling the main crag or as a standalone destination for those developing sport climbing technique on Dales limestone.',
    'Approach from the main Kilnsey lay-by — the lower tier is visible left of the main crag. 3 minutes walk.',
    'Roadside lay-by on the B6160 opposite Kilnsey Crag (free). Shared with the main crag.', region);
  const kilnseyLowerWall = await b('Lower Wall', kilnseyLower, 1);

  for (const route of [
    sportRoute('Lower Tier',     '6b',  kilnseyLowerWall, { height: 15, description: 'A good quality route on the lower tier — sustained pocketed limestone with a technical central section. Well-bolted and an excellent warm-up for the main crag above.' }),
    sportRoute('First Sport',    '6a',  kilnseyLowerWall, { height: 14, description: 'An accessible sport route on the lower wall — good holds on pocketed limestone with a well-defined line and reliable bolts throughout. A fine introductory route.' }),
    sportRoute('Beginner Crack', '5+',  kilnseyLowerWall, { height: 12, description: 'The easiest route on the lower tier — an ideal introduction to sport climbing on Dales limestone. Good holds, solid bolts and an encouraging atmosphere below the great Kilnsey overhang.' }),
    sportRoute('Lower Classic',  '6c',  kilnseyLowerWall, { height: 15, description: 'The best route on the lower tier — a sustained and technical 6c with a crux sequence on compact limestone. Excellent quality for the grade and a great lead for those developing confidence at 6c.' }),
  ]) await r({ ...route, buttressId: route.buttress.id });

  // ── Dib Scar ──────────────────────────────────────────────────────────────
  const dibScar = await c('Dib Scar', 54.0792, -2.0098, RockType.LIMESTONE,
    'A pleasant limestone scar above Wharfedale — compact grey limestone giving a selection of quality trad routes from Severe to E1. The crag sits above the road with fine views down the valley. Less visited than Kilnsey but offering well-worth-while climbing on good rock in a quieter setting.',
    'From the B6160 north of Kilnsey, follow the footpath east up the hillside to the scar — 15 min walk. The crag is visible on the hillside above.',
    'Roadside parking on the B6160 north of Kilnsey village (free, limited lay-by space). Walk up the field path to the crag.', region);
  const dibMain = await b('Main Scar', dibScar, 1);

  for (const route of [
    tradRoute('Dib Scar Direct',  'E1', '5b', dibMain, { height: 20, pitches: 1, description: 'The testing route at Dib Scar — technical face moves on compact limestone above good runners. Requires confident footwork on the crux section.' }),
    tradRoute('Cave Route',       'S',  '3c', dibMain, { height: 15, pitches: 1, description: 'An accessible route taking the line through the natural cave feature — good holds and well-defined line on rough limestone. A pleasant outing in a fine hillside setting.' }),
    tradRoute('Dib Route',        'VS', '4b', dibMain, { height: 18, pitches: 1, description: 'The classic Dib Scar VS — a sustained face and corner route on good compact limestone. Well-protected and enjoyable with fine views down Wharfedale.' }),
    tradRoute('Scar Wall',        'HS', '4a', dibMain, { height: 16, pitches: 1, description: 'A pleasant hard severe on the main scar wall — good holds and natural line on rough limestone. An ideal route for building confidence on Dales rock.' }),
  ]) await r({ ...route, buttressId: route.buttress.id });

  // ── Threshfield Quarry ────────────────────────────────────────────────────
  const threshfield = await c('Threshfield Quarry', 54.0617, -2.0265, RockType.LIMESTONE,
    'A disused limestone quarry near Grassington giving an excellent selection of sport routes on well-featured limestone walls. The quarried rock gives positive holds and good bolt placements; a popular training venue for local climbers and an accessible destination for visiting sport climbers. Routes from 6a to 7b on compact limestone.',
    'From Grassington, follow the minor road towards Threshfield. The quarry is visible on the left — 2 min walk from roadside parking.',
    'Roadside parking at Threshfield Quarry, minor road off the B6265 between Grassington and Threshfield (free). Easy access with short walk to the routes.', region);
  const threshMain = await b('Main Wall', threshfield, 1);

  for (const route of [
    sportRoute('Threshfield Classic', '7a',  threshMain, { height: 16, description: 'The best route at Threshfield — a sustained and technical 7a on positive limestone pockets. Well-bolted with a crux sequence on the upper wall. A popular tick for those at the grade.' }),
    sportRoute('Quarry Route',        '6c',  threshMain, { height: 15, description: 'A fine route on the quarried limestone wall — sustained and technical moves on good pockets above reliable bolts. A quality training route and a worthwhile destination in its own right.' }),
    sportRoute('Threshfield Sport',   '7b',  threshMain, { height: 16, description: 'The hardest route in the quarry — a powerful and technical 7b with a desperate crux on small holds. Demands precise footwork and strong fingers on the compact quarried limestone.' }),
    sportRoute('Easy Quarry',         '6a',  threshMain, { height: 14, description: 'The most accessible sport route at Threshfield — good holds on well-featured limestone with a natural line and solid bolt placements throughout. A fine introduction to quarry climbing.' }),
  ]) await r({ ...route, buttressId: route.buttress.id });

  // ── Mossdale Scar ─────────────────────────────────────────────────────────
  const mossdaleScar = await c('Mossdale Scar', 54.1068, -2.0515, RockType.LIMESTONE,
    'A remote limestone scar above the Mossdale Beck in the upper Yorkshire Dales — compact grey limestone giving a handful of quality trad routes in a wild and atmospheric setting. Rarely visited and with a true sense of remoteness, Mossdale Scar is for those who enjoy their climbing away from the crowds. Routes from Severe to E1 on good solid rock.',
    'From the B6160 near Kilnsey, follow the footpath north-west up the Mossdale Beck valley — a 45 min to 1 hour walk across open moorland to reach the scar. Navigation required in poor visibility.',
    'Roadside parking on the B6160 near the Mossdale Beck access point (free, limited). The approach crosses open access land — boots and navigation essential.', region);
  const mossdaleNorth = await b('North Face', mossdaleScar, 1);

  for (const route of [
    tradRoute('Mossdale Crack',  'VS', '4c', mossdaleNorth, { height: 20, pitches: 1, description: 'The best route at Mossdale Scar — a fine crack line on compact grey limestone. Well-protected jamming and bridging in a remote and atmospheric Dales setting.' }),
    tradRoute('North Face',      'S',  '3c', mossdaleNorth, { height: 15, pitches: 1, description: 'An accessible route on the north face — good holds and a natural line on rough limestone. A pleasant outing in a wild upper Dales setting with fine views across the moor.' }),
    tradRoute('Mossdale Route',  'HS', '4a', mossdaleNorth, { height: 18, pitches: 1, description: 'A quality hard severe on the scar — sustained face and corner climbing on good rock. Well worth the approach walk for those seeking a quieter alternative to the main Wharfedale crags.' }),
    tradRoute('Dales Limestone', 'E1', '5b', mossdaleNorth, { height: 20, pitches: 1, description: 'The testing E1 at Mossdale — technical moves on compact limestone requiring careful footwork. Bold in the remote moorland setting with a committing feel above good but spaced gear.' }),
  ]) await r({ ...route, buttressId: route.buttress.id });

  console.log('  ✓ Kilnsey & Yorkshire Dales: Kilnsey Crag, Kilnsey Lower Tier, Dib Scar, Threshfield Quarry, Mossdale Scar');
}
