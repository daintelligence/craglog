import { DataSource } from 'typeorm';
import { Region } from '../../modules/crags/entities/region.entity';
import { Crag } from '../../modules/crags/entities/crag.entity';
import { Buttress } from '../../modules/crags/entities/buttress.entity';
import { Route } from '../../modules/routes/entities/route.entity';
import {
  findOrCreateRegion, upsertCrag, upsertButtress, upsertRoute,
  tradRoute, sportRoute,
} from './seed-helpers';

export async function seedAvonGorge(ds: DataSource) {
  const regionRepo   = ds.getRepository(Region);
  const cragRepo     = ds.getRepository(Crag);
  const buttressRepo = ds.getRepository(Buttress);
  const routeRepo    = ds.getRepository(Route);

  const bristolRegion = await findOrCreateRegion(regionRepo, {
    name: 'Avon & Bristol',
    country: 'England',
    description: 'The dramatic Avon Gorge beneath the Clifton Suspension Bridge plus other Bristol area crags.',
  });

  async function crag(name: string, lat: number, lng: number, rockType: string, desc: string) {
    return upsertCrag(cragRepo, {
      name, latitude: lat, longitude: lng,
      rockType: rockType as any,
      description: desc,
      regionId: bristolRegion.id,
      isActive: true,
    });
  }
  async function buttress(name: string, cragEntity: any, order = 0) {
    return upsertButtress(buttressRepo, { name, cragId: cragEntity.id, sortOrder: order });
  }
  async function route(r: Partial<Route>) { return upsertRoute(routeRepo, r); }

  // ── Avon Gorge (Main Gorge) ───────────────────────────────────────────────────
  const avonGorge = await crag(
    'Avon Gorge', 51.4618, -2.6242, 'limestone',
    'Dramatic 80m limestone gorge beneath Brunel\'s Clifton Suspension Bridge. Best trad limestone in the South West.',
  );

  const mainWall = await buttress('Main Wall', avonGorge, 1);
  await route(tradRoute('Central Wall', 'E2', '5b', mainWall, { height: 40, description: 'The classic Avon route — sustained and exposed on immaculate grey limestone.' }));
  await route(tradRoute('Hairless Heart', 'E4', '6a', mainWall, { height: 35, description: 'A serious outing up the steepest section of main wall.' }));
  await route(tradRoute('Suspension Bridge Arête', 'VS', '4c', mainWall, { height: 30, description: 'A superb exposed arête with the bridge as a constant backdrop.' }));
  await route(tradRoute('Malbogies', 'HVS', '5a', mainWall, { height: 32, description: 'Long and satisfying, weaving through the best rock.' }));
  await route(tradRoute('Limbo', 'E1', '5b', mainWall, { height: 28 }));

  const seagullSlab = await buttress('Seagull Slab', avonGorge, 2);
  await route(tradRoute('Seagull', 'D', '3a', seagullSlab, { height: 20, description: 'Classic beginner slab route — ideal for introducing Avon limestone.' }));
  await route(tradRoute('Pigeon', 'VD', '3b', seagullSlab, { height: 20 }));
  await route(tradRoute('Osprey', 'HS', '4b', seagullSlab, { height: 22 }));

  const hungerWall = await buttress('Hunger Wall', avonGorge, 3);
  await route(tradRoute('Hunger', 'E3', '5c', hungerWall, { height: 35, description: 'The finest E3 in the gorge — thin and technical on perfect limestone.' }));
  await route(tradRoute('Wall of Horrors', 'E5', '6b', hungerWall, { height: 35, description: 'The gorge\'s most intimidating line. Rarely repeated.' }));
  await route(tradRoute('Delicatessen', 'E2', '5c', hungerWall, { height: 30 }));

  const gibbetWall = await buttress('Gibbet Wall', avonGorge, 4);
  await route(tradRoute('Gibbet', 'E1', '5b', gibbetWall, { height: 30, description: 'Long sustained wall climbing on excellent rock.' }));
  await route(tradRoute('Scaffold', 'HVS', '5a', gibbetWall, { height: 28 }));
  await route(sportRoute('Hard Cell', '7a+', gibbetWall, { height: 25 }));
  await route(sportRoute('The Judge', '7b', gibbetWall, { height: 28, description: 'Power endurance on the steepest section.' }));

  const promenadeTier = await buttress('Promenade Tier', avonGorge, 5);
  await route(tradRoute('Nightmare Arête', 'MVS', '4b', promenadeTier, { height: 15 }));
  await route(tradRoute('Sunday Walk', 'S', '3c', promenadeTier, { height: 12 }));
  await route(sportRoute('Portway Pump', '6c', promenadeTier, { height: 18 }));

  // ── Gully Buttress ───────────────────────────────────────────────────────────
  const gully = await buttress('Gully Buttress', avonGorge, 6);
  await route(tradRoute('Crack of Dawn', 'VS', '4c', gully, { height: 25, description: 'Up the prominent crack system right of the central gully.' }));
  await route(tradRoute('Twilight', 'HS', '4b', gully, { height: 22 }));
  await route(tradRoute('Gordian Knot', 'E3', '6a', gully, { height: 20, description: 'Strenuous crack requiring good bridging technique.' }));

  // ── Sea Walls ────────────────────────────────────────────────────────────────
  const seaWalls = await crag(
    'Sea Walls', 51.4631, -2.6211, 'limestone',
    'Popular bouldering and short route venue on the lower tiers of Avon Gorge. Accessible year-round.',
  );
  const seaWallsLower = await buttress('Lower Tier', seaWalls, 1);
  await route(tradRoute('Sea Wall Traverse', 'VS', '4c', seaWallsLower, { height: 10, description: 'The classic low-level traverse.' }));
  await route(sportRoute('Portway Spider', '7a', seaWallsLower, { height: 10 }));
  await route(sportRoute('Power Rangers', '7b+', seaWallsLower, { height: 10 }));
  await route(tradRoute('Original Route', 'S', '3c', seaWallsLower, { height: 8 }));

  // ── Clifton Rocks Railway Tunnel (minor venue) ────────────────────────────────
  const cliftonTunnel = await crag(
    'Clifton Rocks', 51.4589, -2.6297, 'limestone',
    'Small but historic limestone outcrops near the gorge bottom. Good for beginners.',
  );
  const cliftonMain = await buttress('Main Face', cliftonTunnel, 1);
  await route(tradRoute('Tourist Route', 'M', '1a', cliftonMain, { height: 8, description: 'The easiest climb in the gorge.' }));
  await route(tradRoute('Beginner\'s Crack', 'D', '3a', cliftonMain, { height: 10 }));
  await route(tradRoute('Short Sharp Shock', 'HVS', '5a', cliftonMain, { height: 12 }));

  // ── Cheddar Gorge ─────────────────────────────────────────────────────────────
  const cheddar = await crag(
    'Cheddar Gorge', 51.2860, -2.7583, 'limestone',
    'Britain\'s largest gorge — 140m limestone walls above the B3135. Stiff grades on superb rock.',
  );

  const lionRock = await buttress('Lion Rock', cheddar, 1);
  await route(tradRoute('Sceptre', 'E2', '5b', lionRock, { height: 50, description: 'The classic Cheddar route — long, exposed and surprisingly steady.' }));
  await route(tradRoute('Coronation Street', 'HVS', '5a', lionRock, { height: 45, description: 'An Avon legend with tremendous exposure. One of the best HVS routes in the UK.' }));
  await route(tradRoute('Jaws', 'E4', '6a', lionRock, { height: 40, description: 'Through the roof then onto the headwall — technical and bold.' }));
  await route(tradRoute('The Climb That Dare Not Speak Its Name', 'E5', '6b', lionRock, { height: 35 }));

  const pinnacleWall = await buttress('Pinnacle Wall', cheddar, 2);
  await route(tradRoute('The Pinnacle', 'VS', '4c', pinnacleWall, { height: 35, description: 'The iconic Cheddar ridge line, scramble to the top for the full experience.' }));
  await route(tradRoute('Long Climb', 'D', '3a', pinnacleWall, { height: 60, pitches: 3, description: 'Classic beginners\' outing up the longest grade in the gorge.' }));
  await route(sportRoute('Full Power', '7c+', pinnacleWall, { height: 30, description: 'The gorge\'s benchmark sport route.' }));
  await route(sportRoute('Dawes\' Collect', '8a', pinnacleWall, { height: 28 }));

  const dovetailWall = await buttress('Dovetail Wall', cheddar, 3);
  await route(sportRoute('Dovetail', '7b', dovetailWall, { height: 35 }));
  await route(sportRoute('Wild at Heart', '7a+', dovetailWall, { height: 30 }));
  await route(sportRoute('Gorge Yourself', '6c', dovetailWall, { height: 25 }));
  await route(tradRoute('Cave Route', 'HS', '4b', dovetailWall, { height: 25, description: 'Up the cave entrance and through the overhang.' }));
}
