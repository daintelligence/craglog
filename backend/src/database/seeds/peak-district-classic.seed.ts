import { DataSource } from 'typeorm';
import { Region } from '../../modules/crags/entities/region.entity';
import { Crag } from '../../modules/crags/entities/crag.entity';
import { Buttress } from '../../modules/crags/entities/buttress.entity';
import { Route } from '../../modules/routes/entities/route.entity';
import {
  findOrCreateRegion, upsertCrag, upsertButtress, upsertRoute,
  tradRoute, sportRoute,
} from './seed-helpers';

export async function seedPeakDistrictClassic(ds: DataSource) {
  const regionRepo   = ds.getRepository(Region);
  const cragRepo     = ds.getRepository(Crag);
  const buttressRepo = ds.getRepository(Buttress);
  const routeRepo    = ds.getRepository(Route);

  const peakDistrict = await findOrCreateRegion(regionRepo, {
    name: 'Peak District',
    country: 'England',
    description: 'Gritstone edges and limestone dales — the birthplace of modern British climbing.',
  });

  async function crag(name: string, lat: number, lng: number, desc: string) {
    return upsertCrag(cragRepo, {
      name, latitude: lat, longitude: lng,
      rockType: 'gritstone' as any,
      description: desc,
      regionId: peakDistrict.id,
      isActive: true,
    });
  }
  async function limeCrag(name: string, lat: number, lng: number, desc: string) {
    return upsertCrag(cragRepo, {
      name, latitude: lat, longitude: lng,
      rockType: 'limestone' as any,
      description: desc,
      regionId: peakDistrict.id,
      isActive: true,
    });
  }
  async function b(name: string, cragEntity: any, order = 0) {
    return upsertButtress(buttressRepo, { name, cragId: cragEntity.id, sortOrder: order });
  }
  async function r(route: Partial<Route>) { return upsertRoute(routeRepo, route); }

  // ── The Roaches ───────────────────────────────────────────────────────────────
  const roaches = await crag(
    'The Roaches', 53.1627, -2.0022,
    'Staffordshire\'s most famous edge — a three-tiered gritstone escarpment rising above the moorland. Home to the legendary Sloth.',
  );

  const lowerTier = await b('Lower Tier', roaches, 1);
  await r(tradRoute('Valkyrie', 'HVS', '5a', lowerTier, { height: 18, description: 'The classic lower tier route — brilliant wall climbing on perfect gritstone.' }));
  await r(tradRoute('Technical Slab', 'VS', '4c', lowerTier, { height: 14 }));
  await r(tradRoute('Crack and Corner', 'D', '3a', lowerTier, { height: 12, description: 'Excellent beginner route on the lower tier.' }));
  await r(tradRoute('Flake Crack', 'S', '4a', lowerTier, { height: 14 }));
  await r(tradRoute('Niblick', 'HS', '4b', lowerTier, { height: 15 }));

  const upperTier = await b('Upper Tier', roaches, 2);
  await r(tradRoute('The Sloth', 'HVS', '5b', upperTier, { height: 20, description: 'The most famous route on the Roaches — a spectacular traverse on the great roof. A must-do HVS.' }));
  await r(tradRoute('Matinée', 'E1', '5b', upperTier, { height: 18, description: 'Sustained and excellent, taking the steepest section of the upper tier.' }));
  await r(tradRoute('Saul\'s Crack', 'VS', '4c', upperTier, { height: 16 }));
  await r(tradRoute('Jeffcoat\'s Pinnacle', 'D', '3b', upperTier, { height: 18, description: 'Classic moderate through the notch in the pinnacle.' }));
  await r(tradRoute('Five Finger Exercise', 'E3', '6a', upperTier, { height: 15, description: 'Technical wall climbing on small holds — a gritstone masterclass.' }));
  await r(tradRoute('Black and Tans', 'E2', '5c', upperTier, { height: 16 }));
  await r(tradRoute('The Mincer', 'E4', '6a', upperTier, { height: 14, description: 'Fierce and technical — one of the harder test-pieces on the upper tier.' }));

  const skylineButtress = await b('Skyline Buttress', roaches, 3);
  await r(tradRoute('Skyline', 'MVS', '4b', skylineButtress, { height: 18, description: 'Airy arête climbing with superb views across the Staffordshire moorland.' }));
  await r(tradRoute('Inverted V', 'HS', '4b', skylineButtress, { height: 16 }));

  // ── Hen Cloud ─────────────────────────────────────────────────────────────────
  const henCloud = await crag(
    'Hen Cloud', 53.1581, -2.0072,
    'Hen Cloud stands alone above the valley — shorter than the Roaches but with superb quality routes on compact gritstone.',
  );

  const henMainFace = await b('Main Face', henCloud, 1);
  await r(tradRoute('Saul\'s Crack', 'VS', '4c', henMainFace, { height: 15, description: 'The classic Hen Cloud VS — a sustained crack line up the main face.' }));
  await r(tradRoute('Central Route', 'HS', '4b', henMainFace, { height: 14 }));
  await r(tradRoute('Flying Buttress Direct', 'HVS', '5a', henMainFace, { height: 16, description: 'Up the flying buttress feature direct — excellent exposure.' }));
  await r(tradRoute('Right Hand Route', 'S', '4a', henMainFace, { height: 14 }));
  await r(tradRoute('Enigma', 'E2', '5c', henMainFace, { height: 15, description: 'Bold face climbing on the slab — well-protected but committing.' }));
  await r(tradRoute('The Fin', 'E1', '5b', henMainFace, { height: 14 }));

  // ── Millstone Edge ────────────────────────────────────────────────────────────
  const millstone = await crag(
    'Millstone Edge', 53.3201, -1.5937,
    'The home of gritstone jamming — great dihedral grooves and wide cracks above the Derwent Valley. An E-grade paradise.',
  );

  const greatSlab = await b('Great Slab', millstone, 1);
  await r(tradRoute('Green Death', 'E3', '5c', greatSlab, { height: 28, description: 'The Millstone classic — a superb, sustained groove requiring perfect footwork.' }));
  await r(tradRoute('London Wall', 'E5', '6b', greatSlab, { height: 25, description: 'One of the Peak\'s hardest test-pieces when first climbed. Thin and serious.' }));
  await r(tradRoute('Master\'s Edge', 'E7', '6c', greatSlab, { height: 22, description: 'Britain\'s first E7 — Ron Fawcett\'s masterpiece. Seldom repeated.' }));

  const keyhole = await b('Keyhole Cave Area', millstone, 2);
  await r(tradRoute('Regent Street', 'E2', '5c', keyhole, { height: 25, description: 'The big central groove — long, sustained and one of the finest E2s in the Peak.' }));
  await r(tradRoute('Bond Street', 'E1', '5b', keyhole, { height: 24, description: 'A magnificent companion to Regent Street — better protected.' }));
  await r(tradRoute('Oxford Street', 'HVS', '5a', keyhole, { height: 22, description: 'The great groove system — brilliant jamming on perfect rock.' }));

  const edgeLane = await b('Edge Lane', millstone, 3);
  await r(tradRoute('Edge Lane', 'VS', '4c', edgeLane, { height: 20, description: 'The perfect introduction to Millstone — a classic crack and slab combination.' }));
  await r(tradRoute('Embankment Route 2', 'HS', '4b', edgeLane, { height: 18 }));
  await r(tradRoute('Censor', 'E4', '6a', edgeLane, { height: 20, description: 'Hard finger crack on the steepest section of Edge Lane.' }));

  // ── Stoney Middleton ──────────────────────────────────────────────────────────
  const stoney = await limeCrag(
    'Stoney Middleton', 53.2843, -1.6291,
    'Limestone roadside sport crag in the heart of the Derwent Valley — the birthplace of UK sport climbing. Compact and powerful.',
  );

  const tollBar = await b('Tollbar Area', stoney, 1);
  await r(sportRoute('Menopause', '7a', tollBar, { height: 15, description: 'The Stoney classic — powerful boulder problem moves on pockets.' }));
  await r(sportRoute('Windhover', '6c', tollBar, { height: 14, description: 'Sustained pocket pulling on immaculate limestone.' }));
  await r(sportRoute('Frisco Bay', '7b', tollBar, { height: 15, description: 'A savage sequence through the steepest limestone.' }));
  await r(tradRoute('Scoop Wall', 'HVS', '5a', tollBar, { height: 12, description: 'Classic trad route on the accessible upper walls.' }));

  const frenchConnection = await b('French Connection', stoney, 2);
  await r(sportRoute('The Lichi', '7c', frenchConnection, { height: 18, description: 'The hardest route on the crag — sustained and very technical.' }));
  await r(sportRoute('Circe', '7a+', frenchConnection, { height: 16 }));
  await r(sportRoute('Sin', '6b+', frenchConnection, { height: 14, description: 'Popular introduction to Stoney sport climbing.' }));
  await r(sportRoute('Wee Doris', '6a', frenchConnection, { height: 12 }));

  const aquarius = await b('Aquarius', stoney, 3);
  await r(tradRoute('Dextrose', 'E3', '5c', aquarius, { height: 18, description: 'The great trad route at Stoney — a wild finish above the roof.' }));
  await r(tradRoute('Brimstone', 'E2', '5b', aquarius, { height: 16 }));
  await r(sportRoute('Kink', '7a', aquarius, { height: 18 }));

  // ── Black Rocks ───────────────────────────────────────────────────────────────
  const blackRocks = await crag(
    'Black Rocks', 53.1037, -1.5483,
    'Dramatic gritstone tor above Cromford with a concentration of desperate crack problems. The Promontory Traverse is legendary.',
  );

  const mainTor = await b('Main Tor', blackRocks, 1);
  await r(tradRoute('Lean Man\'s Superdirect', 'E3', '5c', mainTor, { height: 12, description: 'The most famous route at Black Rocks — a fiercely technical crack.' }));
  await r(tradRoute('Promontory Traverse', 'VS', '4c', mainTor, { height: 10, description: 'The classic traverse of the main tor — superb exposure and position.' }));
  await r(tradRoute('Birch Tree Wall', 'E1', '5b', mainTor, { height: 12 }));
  await r(tradRoute('Demon Rib', 'HVS', '5a', mainTor, { height: 10, description: 'Fingery arête climbing — bold and technical.' }));
  await r(tradRoute('Stonnis Crack', 'HS', '4b', mainTor, { height: 10, description: 'Classic crack — a rite of passage at Black Rocks.' }));
}
