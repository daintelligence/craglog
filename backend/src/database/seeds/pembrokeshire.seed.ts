import { DataSource } from 'typeorm';
import { Region } from '../../modules/crags/entities/region.entity';
import { Crag } from '../../modules/crags/entities/crag.entity';
import { Buttress } from '../../modules/crags/entities/buttress.entity';
import { Route } from '../../modules/routes/entities/route.entity';
import {
  findOrCreateRegion, upsertCrag, upsertButtress, upsertRoute,
  tradRoute, sportRoute,
} from './seed-helpers';

export async function seedPembrokeshire(ds: DataSource) {
  const regionRepo   = ds.getRepository(Region);
  const cragRepo     = ds.getRepository(Crag);
  const buttressRepo = ds.getRepository(Buttress);
  const routeRepo    = ds.getRepository(Route);

  const pembrokeshire = await findOrCreateRegion(regionRepo, {
    name: 'Pembrokeshire',
    country: 'Wales',
    description: 'South-west Wales sea cliffs — limestone, gabbro and rhyolite above the Irish Sea.',
  });

  // ── Crag Helper ──────────────────────────────────────────────────────────────
  async function crag(name: string, lat: number, lng: number, rockType: string, desc: string) {
    return upsertCrag(cragRepo, {
      name, latitude: lat, longitude: lng,
      rockType: rockType as any,
      description: desc,
      regionId: pembrokeshire.id,
      isActive: true,
    });
  }

  async function buttress(name: string, cragEntity: any, order = 0) {
    return upsertButtress(buttressRepo, { name, cragId: cragEntity.id, sortOrder: order });
  }

  async function route(r: Partial<Route>) { return upsertRoute(routeRepo, r); }

  // ── Gogarth / Wen Slab equivalent — St Govan's Head ─────────────────────────
  const stGovans = await crag(
    "St Govan's Head", 51.5954, -4.9572, 'limestone',
    'Classic Pembroke limestone — steep, pocketed walls above tidal platforms. Military range; check access.',
  );
  const govansMain = await buttress('Main Wall', stGovans, 1);
  await route(tradRoute('Heaven', 'E1', '5b', govansMain, { height: 20, description: 'A brilliant route up the sustained main wall, superb pocketed limestone.' }));
  await route(tradRoute('Range East', 'VS', '4c', govansMain, { height: 18 }));
  await route(tradRoute('St Govan\'s Wall', 'HVS', '5a', govansMain, { height: 22, description: 'The classic line up the main face.' }));
  await route(sportRoute('Heaven Can Wait', '7b+', govansMain, { height: 20 }));

  // ── Stackpole Head ───────────────────────────────────────────────────────────
  const stackpole = await crag(
    'Stackpole Head', 51.6019, -4.9297, 'limestone',
    'The most impressive headland in Pembroke, with long routes on immaculate limestone.',
  );
  const merlinsZawn = await buttress("Merlin's Zawn", stackpole, 1);
  await route(tradRoute("Merlin's Wand", 'E3', '5c', merlinsZawn, { height: 35, description: 'One of Pembrokeshire\'s finest routes, weaving a spectacular line.' }));
  await route(tradRoute('The Cauldron', 'HVS', '5a', merlinsZawn, { height: 30 }));
  await route(tradRoute('Preseli', 'VS', '4c', merlinsZawn, { height: 28 }));

  const headlandWall = await buttress('Headland Wall', stackpole, 2);
  await route(tradRoute('Lighthouse Arête', 'E2', '5b', headlandWall, { height: 25 }));
  await route(sportRoute('Lost in France', '7a', headlandWall, { height: 22 }));
  await route(sportRoute('Welsh Warrior', '7c', headlandWall, { height: 23 }));

  // ── Saddle Head ──────────────────────────────────────────────────────────────
  const saddleHead = await crag(
    'Saddle Head', 51.6355, -5.0311, 'limestone',
    'Popular sea cliff venue on the St Bride\'s Bay coast. Short and accessible routes.',
  );
  const saddleMain = await buttress('Main Face', saddleHead, 1);
  await route(tradRoute('Toreador', 'VS', '4c', saddleMain, { height: 18 }));
  await route(tradRoute('The Saddle', 'HVS', '5a', saddleMain, { height: 20, description: 'The natural line up the crag.' }));
  await route(sportRoute('Pump Up the Jam', '6c+', saddleMain, { height: 15 }));

  // ── Crickmail Point ──────────────────────────────────────────────────────────
  const crickmail = await crag(
    'Crickmail Point', 51.6488, -5.1083, 'limestone',
    'Impressive overhanging limestone with excellent sport routes.',
  );
  const crickWall = await buttress('Overhanging Wall', crickmail, 1);
  await route(sportRoute('Psycho Killer', '7b', crickWall, { height: 18 }));
  await route(sportRoute('Blue Rinse', '7a+', crickWall, { height: 17 }));
  await route(sportRoute('Boneyard', '6c', crickWall, { height: 16 }));
  await route(tradRoute('The Plum', 'E4', '6a', crickWall, { height: 18, description: 'A committing route through the overhangs.' }));

  // ── Bosherston Head ──────────────────────────────────────────────────────────
  const bosherston = await crag(
    'Bosherston Head', 51.6021, -4.9134, 'limestone',
    'Quieter than St Govan\'s but with quality routes. Look out for choughs.',
  );
  const bosWall = await buttress('West Wall', bosherston, 1);
  await route(tradRoute('Diedre Sud', 'E1', '5b', bosWall, { height: 22 }));
  await route(tradRoute('Bog Standard', 'VS', '4c', bosWall, { height: 18 }));
  await route(sportRoute('Snipers', '7a', bosWall, { height: 20 }));

  // ── Mother Carey's Kitchen ───────────────────────────────────────────────────
  const motherCareys = await crag(
    "Mother Carey's Kitchen", 51.7301, -5.2811, 'limestone',
    'Remote sea cliff accessed by abseil. Committing deep-water solo territory.',
  );
  const kitchenWall = await buttress('Kitchen Wall', motherCareys, 1);
  await route(tradRoute('Kitchen Sink', 'E3', '5c', kitchenWall, { height: 30, description: 'The main event — sustained crimping above deep water.' }));
  await route(tradRoute('Gourmet', 'E2', '5b', kitchenWall, { height: 28 }));

  // ── Pembroke / Trevallen ─────────────────────────────────────────────────────
  const trevallen = await crag(
    'Trevallen Cliff', 51.6613, -4.9832, 'limestone',
    'Extensive sport and trad limestone with grades from 5 to 8b.',
  );
  const trevallenMain = await buttress('Trevallen Main', trevallen, 1);
  await route(sportRoute('Ozone', '8a', trevallenMain, { height: 22, description: 'One of Pembrokeshire\'s hardest sport routes.' }));
  await route(sportRoute('Equinox', '7b+', trevallenMain, { height: 20 }));
  await route(sportRoute('Burning Man', '7a', trevallenMain, { height: 18 }));
  await route(sportRoute('Welsh Rarebit', '6b+', trevallenMain, { height: 16 }));
  await route(tradRoute('Trevallen Wall', 'HVS', '5a', trevallenMain, { height: 18 }));

  // ── Mowing Word ──────────────────────────────────────────────────────────────
  const mowingWord = await crag(
    'Mowing Word', 51.6718, -5.1024, 'limestone',
    'Excellent quality sport climbing on the northern Pembroke coast.',
  );
  const mowingMain = await buttress('Main Wall', mowingWord, 1);
  await route(sportRoute('Walking on the Moon', '7c', mowingMain, { height: 22 }));
  await route(sportRoute('Superfly', '7b', mowingMain, { height: 20 }));
  await route(sportRoute('Pembroke Dreaming', '7a', mowingMain, { height: 18 }));
  await route(sportRoute('Easy Days', '6b', mowingMain, { height: 16 }));

  // ── Gupton Farm ─────────────────────────────────────────────────────────────
  const gupton = await crag(
    'Gupton Farm', 51.6412, -4.9611, 'limestone',
    'Gently angled limestone slabs and walls ideal for beginners and intermediates.',
  );
  const guptonSlab = await buttress('Slab Area', gupton, 1);
  await route(tradRoute('Left Route', 'S', '4a', guptonSlab, { height: 12 }));
  await route(tradRoute('Main Slab', 'VD', '3c', guptonSlab, { height: 14 }));
  await route(tradRoute('Right Arête', 'VS', '4b', guptonSlab, { height: 12 }));
}
