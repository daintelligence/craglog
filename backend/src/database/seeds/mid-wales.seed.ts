import { DataSource } from 'typeorm';
import { Region } from '../../modules/crags/entities/region.entity';
import { Crag } from '../../modules/crags/entities/crag.entity';
import { Buttress } from '../../modules/crags/entities/buttress.entity';
import { Route } from '../../modules/routes/entities/route.entity';
import {
  findOrCreateRegion, upsertCrag, upsertButtress, upsertRoute,
  tradRoute, sportRoute,
} from './seed-helpers';

export async function seedMidWales(ds: DataSource) {
  const regionRepo   = ds.getRepository(Region);
  const cragRepo     = ds.getRepository(Crag);
  const buttressRepo = ds.getRepository(Buttress);
  const routeRepo    = ds.getRepository(Route);

  const midWales = await findOrCreateRegion(regionRepo, {
    name: 'Mid-Wales',
    country: 'Wales',
    description: 'Remote mountain crags and quality rhyolite/dolerite venues above the Brecon Beacons and Elan Valley.',
  });

  const wye = await findOrCreateRegion(regionRepo, {
    name: 'Wye Valley & Forest of Dean',
    country: 'England',
    description: 'Limestone sport and trad along the River Wye — Wintour\'s Leap and Symonds Yat extended.',
  });

  async function crag(name: string, lat: number, lng: number, rockType: string, desc: string, region: any) {
    return upsertCrag(cragRepo, {
      name, latitude: lat, longitude: lng,
      rockType: rockType as any,
      description: desc,
      regionId: region.id,
      isActive: true,
    });
  }
  async function b(name: string, cragEntity: any, order = 0) {
    return upsertButtress(buttressRepo, { name, cragId: cragEntity.id, sortOrder: order });
  }
  async function r(route: Partial<Route>) { return upsertRoute(routeRepo, route); }

  // ── Craig Cwm Silyn (extended) ────────────────────────────────────────────────
  const craigDdu = await crag(
    'Craig Ddu', 52.5417, -3.7921, 'other',
    'Compact dolerite crag in the Elan Valley hills. Excellent rough rock with routes from Diff to E5.',
    midWales,
  );
  const craigDduMain = await b('Main Face', craigDdu, 1);
  await r(tradRoute('Diagonal', 'VS', '4b', craigDduMain, { height: 20, description: 'The natural diagonal fault line — excellent rock and position.' }));
  await r(tradRoute('Plumbline', 'E1', '5b', craigDduMain, { height: 22, description: 'Straight up the main face — sustained and technical.' }));
  await r(tradRoute('Hardd', 'HVS', '5a', craigDduMain, { height: 20 }));
  await r(tradRoute('Easy Angled Slab', 'VD', '3b', craigDduMain, { height: 18, description: 'Pleasant introductory slab.' }));

  // ── Carnedd y Cribau ─────────────────────────────────────────────────────────
  const carnedd = await crag(
    'Carnedd y Cribau', 53.0652, -3.8711, 'other',
    'Remote rhyolite crag above the Snowdonia foothills. Long approach rewarded with excellent climbing.',
    midWales,
  );
  const carneddMain = await b('Main Buttress', carnedd, 1);
  await r(tradRoute('Cribau Ridge', 'D', '3a', carneddMain, { height: 25, pitches: 2, description: 'Long moderate ridge — a superb outing in a remote setting.' }));
  await r(tradRoute('Red Wall', 'E2', '5b', carneddMain, { height: 20, description: 'Intimidating steep wall on excellent rough rhyolite.' }));
  await r(tradRoute('Slanted Slab', 'S', '4a', carneddMain, { height: 18 }));

  // ── Pen Cerrig-calch (Brecon Beacons) ─────────────────────────────────────────
  const penCerrig = await crag(
    'Pen Cerrig-calch', 51.9052, -3.1819, 'limestone',
    'South-facing limestone escarpment on the edge of the Brecon Beacons. Excellent sport routes with mountain views.',
    midWales,
  );
  const penCerrigMain = await b('Main Wall', penCerrig, 1);
  await r(sportRoute('Beacon Route', '6b', penCerrigMain, { height: 18, description: 'The best route on the crag — sustained crimping on superb limestone.' }));
  await r(sportRoute('Beaconsfield', '6c+', penCerrigMain, { height: 20 }));
  await r(sportRoute('Brecon Beacons', '7a', penCerrigMain, { height: 18 }));
  await r(tradRoute('First Ascent Crack', 'VS', '4c', penCerrigMain, { height: 14 }));

  // ── Aber Falls ────────────────────────────────────────────────────────────────
  const aberFalls = await crag(
    'Aber Falls', 53.2301, -3.9611, 'other',
    'Dramatic 37m waterfall crag in Snowdonia. Accessible and popular with routes across the grade spectrum.',
    midWales,
  );
  const aberMain = await b('Main Cliff', aberFalls, 1);
  await r(tradRoute('Cleft Route', 'S', '3c', aberMain, { height: 30, pitches: 2, description: 'Up the left-bounding cleft — a classic easy outing at the falls.' }));
  await r(tradRoute('Central Groove', 'HVS', '5a', aberMain, { height: 30, pitches: 2, description: 'Up the prominent central groove system — exposed and excellent.' }));
  await r(tradRoute('Spray Arête', 'E1', '5b', aberMain, { height: 25, description: 'The arête right of the falls — damp in wet conditions, brilliant when dry.' }));
  await r(tradRoute('Right Wall Route', 'VS', '4c', aberMain, { height: 22 }));

  // ── Wintour's Leap ────────────────────────────────────────────────────────────
  const wintours = await crag(
    "Wintour's Leap", 51.6819, -2.6572, 'limestone',
    'Impressive 90m limestone cliff above the River Wye — the biggest limestone wall in England and Wales outside Cheddar.',
    wye,
  );

  const mainWall = await b('Main Wall', wintours, 1);
  await r(tradRoute('Great Wall', 'E3', '5c', mainWall, { height: 60, pitches: 3, description: 'The Wintour\'s masterpiece — three superb pitches up the centre of the biggest limestone face in the region.' }));
  await r(tradRoute('Lean Machine', 'E5', '6a', mainWall, { height: 50, pitches: 2, description: 'Serious and committing — not to be underestimated.' }));
  await r(tradRoute('Eastern Arête', 'HVS', '5a', mainWall, { height: 45, pitches: 2, description: 'The classic Wintour\'s route — sustained and varied with brilliant exposure.' }));
  await r(tradRoute('Diagonal Route', 'VS', '4c', mainWall, { height: 40, pitches: 2 }));
  await r(sportRoute('The Purge', '7b+', mainWall, { height: 30, description: 'One of the finest sport routes in the Wye Valley.' }));
  await r(sportRoute('Fire in the Sky', '7a', mainWall, { height: 28 }));
  await r(sportRoute('Limestone Cowboy', '6c', mainWall, { height: 25, description: 'Popular bolted route on excellent rock.' }));

  const lowerWall = await b('Lower Wall', wintours, 2);
  await r(tradRoute('Ivy Crack', 'D', '3a', lowerWall, { height: 20, description: 'Classic beginners\' route — the standard introduction to Wintour\'s.' }));
  await r(tradRoute('Overlapping Route', 'HS', '4a', lowerWall, { height: 22 }));
  await r(sportRoute('Limestone Dreaming', '6b', lowerWall, { height: 20, description: 'Excellent introductory sport route on the lower tier.' }));

  // ── Symonds Yat East ──────────────────────────────────────────────────────────
  const symondsYat = await crag(
    'Symonds Yat', 51.8413, -2.6312, 'limestone',
    'Classic limestone sport crag above the River Wye with a huge spread of grades from 5 to 8a. Peregrine falcons nest here.',
    wye,
  );

  const eastFace = await b('East Face', symondsYat, 1);
  await r(tradRoute('Krapp\'s Last Tape', 'HVS', '5a', eastFace, { height: 18, description: 'The classic Symonds Yat trad route — bold but well-protected for those who find the gear.' }));
  await r(sportRoute('Rock Atrocity', '7a+', eastFace, { height: 20, description: 'One of the signature Symonds Yat sport routes.' }));
  await r(sportRoute('Yat\'s Entertainment', '6c', eastFace, { height: 18 }));
  await r(sportRoute('Flight of the Peregrine', '6b+', eastFace, { height: 16, description: 'Named after the nesting peregrines — a local favourite.' }));
  await r(sportRoute('Rookie', '5+', eastFace, { height: 14, description: 'Excellent introduction to limestone sport climbing.' }));

  const mainCrag = await b('Main Crag', symondsYat, 2);
  await r(sportRoute('Revelation', '8a', mainCrag, { height: 22, description: 'The testpiece of Symonds Yat — powerful pocket pulling.' }));
  await r(sportRoute('Scarface', '7b', mainCrag, { height: 20 }));
  await r(sportRoute('Wye Not', '7a', mainCrag, { height: 18, description: 'Sustained and technical — one of the best 7a routes in the Wye Valley.' }));
  await r(sportRoute('Dean Machine', '6c+', mainCrag, { height: 16 }));

  // ── Forest of Dean (Shorn Cliff) ──────────────────────────────────────────────
  const shornCliff = await crag(
    'Shorn Cliff', 51.7902, -2.6244, 'sandstone',
    'Compact Dean sandstone — short, powerful routes in a peaceful forest setting.',
    wye,
  );
  const shornMain = await b('Main Face', shornCliff, 1);
  await r(tradRoute('Dean Crack', 'VS', '4c', shornMain, { height: 10, description: 'The classic Dean sandstone crack line.' }));
  await r(tradRoute('Forest Slab', 'S', '3c', shornMain, { height: 8 }));
  await r(tradRoute('Red Dean', 'E2', '5b', shornMain, { height: 10, description: 'Technical face climbing on the compact red sandstone.' }));
  await r(sportRoute('Greenwood', '6b', shornMain, { height: 10, description: 'Pleasant bolted route through the lower forest tier.' }));
}
