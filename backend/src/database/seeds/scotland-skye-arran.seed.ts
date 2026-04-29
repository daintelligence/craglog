import { DataSource } from 'typeorm';
import { Region } from '../../modules/crags/entities/region.entity';
import { Crag, RockType } from '../../modules/crags/entities/crag.entity';
import { Buttress } from '../../modules/crags/entities/buttress.entity';
import { Route } from '../../modules/routes/entities/route.entity';
import { findOrCreateRegion, upsertCrag, upsertButtress, upsertRoute, tradRoute } from './seed-helpers';

export async function seedScotlandSkyeArran(ds: DataSource) {
  const regionRepo = ds.getRepository(Region);
  const cragRepo   = ds.getRepository(Crag);
  const buttRepo   = ds.getRepository(Buttress);
  const routeRepo  = ds.getRepository(Route);

  const skye  = await findOrCreateRegion(regionRepo, { name: 'Isle of Skye', country: 'Scotland' });
  const arran = await findOrCreateRegion(regionRepo, { name: 'Isle of Arran', country: 'Scotland' });

  async function c(name: string, lat: number, lng: number, rock: RockType, desc: string, approach: string, parking: string, region: any) {
    return upsertCrag(cragRepo, { name, latitude: lat, longitude: lng, rockType: rock, description: desc, approach, parkingInfo: parking, region, regionId: region.id });
  }
  async function b(name: string, crag: Crag, order = 1) { return upsertButtress(buttRepo, { name, crag, cragId: crag.id, sortOrder: order }); }
  async function r(data: Partial<Route>) { return upsertRoute(routeRepo, data); }

  // ── Cioch Buttress, Skye ──────────────────────────────────────────────────
  const cioch = await c('Cioch Buttress', 57.2147, -6.2215, RockType.BASALT,
    'The finest climbing venue on the Isle of Skye — a series of gabbro buttresses below the iconic Cioch pinnacle in Coire Lagan. Routes from VD to E5 on supremely rough gabbro. The Cioch itself is a unique pinnacle giving unique exposure. An alpine experience in Scotland.',
    'From the Glenbrittle campsite, follow the well-worn path up into Coire Lagan — 90 min approach with 450m ascent.',
    'Glenbrittle campsite car park, Isle of Skye (fee). Alternatively the Glenbrittle Memorial Hut.', skye);
  const ciochMain   = await b('Main Buttress', cioch, 1);
  const ciochPillar = await b('Eastern Buttress', cioch, 2);
  const ciochDirect = await b('Cioch Direct', cioch, 3);
  for (const route of [
    tradRoute('Cioch Direct',          'VD',  '3c', ciochDirect, { height: 80,  pitches: 3, description: 'The celebrated classic — takes the Cioch itself by its most direct line. Superb rough gabbro and an incredible summit perch.' }),
    tradRoute('Integrity',             'HVS', '5a', ciochMain,   { height: 100, pitches: 4, description: 'One of the great Skye routes — sustained climbing on the main buttress with a magnificent position.' }),
    tradRoute('Slab Routes',           'VD',  '3b', ciochMain,   { height: 120, pitches: 5, description: 'The slabs below Coire Lagan give ideal introductory multi-pitch on perfect rough gabbro.' }),
    tradRoute('Trophy Crack',          'E1',  '5b', ciochPillar, { height: 60,  pitches: 2, description: 'Takes the prominent crack on the Eastern Buttress — sustained and excellent.' }),
    tradRoute('Crack of Dawn',         'E3',  '6a', ciochMain,   { height: 80,  pitches: 3, description: 'A serious modern addition — technical climbing on the steepest section of the main buttress.' }),
    tradRoute('Archer Thomson\'s Route', 'D', '3a', ciochMain,   { height: 150, pitches: 6, description: 'The historic classic first done in 1907 — a mountaineering outing on good rock in a superb setting.' }),
  ]) await r({ ...route, buttressId: route.buttress.id });

  // ── Sligachan Slabs, Skye ─────────────────────────────────────────────────
  const sligachan = await c('Sligachan Slabs', 57.2932, -6.1660, RockType.BASALT,
    'Extensive gabbro slabs above the Sligachan Hotel — the most accessible climbing on Skye. Routes from Moderate to E2 on excellent rough gabbro. A fantastic introduction to Skye climbing without the full Coire Lagan commitment.',
    'From Sligachan Hotel, follow the path towards the Red Cuillin — slabs visible above. 30 min approach.',
    'Sligachan Hotel car park (free for patrons, small fee otherwise).', skye);
  const sligMain = await b('Main Slabs', sligachan, 1);
  for (const route of [
    tradRoute('Sligachan Slab',        'M',   '2',  sligMain, { height: 50,  pitches: 2, description: 'An easy but satisfying outing on perfectly rough gabbro — great introduction to Skye.' }),
    tradRoute('Red Cuillin Route',     'VD',  '3b', sligMain, { height: 60,  pitches: 3, description: 'Follows the ridge to a fine viewpoint — varied and pleasant.' }),
    tradRoute('Gabbro Slab',           'S',   '4a', sligMain, { height: 55,  pitches: 2, description: 'Takes the main slab by its most natural line — friction and balance on superb rock.' }),
    tradRoute('Sligachan Direct',      'HVS', '5a', sligMain, { height: 50,  pitches: 2, description: 'A more direct line up the main slab — requires commitment on the crux.' }),
  ]) await r({ ...route, buttressId: route.buttress.id });

  // ── Cir Mhor, Arran ───────────────────────────────────────────────────────
  const cirMhor = await c('Cir Mhor', 55.6462, -5.3156, RockType.GRANITE,
    'The finest mountain on Arran — a perfect granite peak with superb climbing from VS to E5 on the north face and east ridge. Rosa Pinnacle gives one of the best VS routes in Scotland. The coarse pink granite is outstanding and the setting is alpine in character.',
    'From Brodick, bus or cycle to Glen Rosa, then walk up Glen Rosa to the coire — 2 hours.',
    'Glen Rosa car park or roadside on the B880 (free). Bus from Brodick to Shiskine (limited service).', arran);
  const cirMain  = await b('North Face', cirMhor, 1);
  const cirRosa  = await b('Rosa Pinnacle', cirMhor, 2);
  const cirSouth = await b('South Ridge', cirMhor, 3);
  for (const route of [
    tradRoute('South Ridge Direct',    'VS',  '4c', cirSouth,  { height: 200, pitches: 6, description: 'The classic Arran route — a magnificent mountaineering outing up the south ridge with excellent rock throughout.' }),
    tradRoute('Caliban\'s Creep',      'VS',  '4c', cirRosa,   { height: 120, pitches: 4, description: 'One of the greatest VS routes in Scotland — takes the Rosa Pinnacle by a sustained and exposed line.' }),
    tradRoute('Minotaur',              'HVS', '5a', cirMain,   { height: 100, pitches: 4, description: 'A bold and technical route on the north face — serious and committing in the mountain setting.' }),
    tradRoute('North Face Route',      'VD',  '3c', cirMain,   { height: 150, pitches: 5, description: 'The standard mountaineering route — a good intro to Cir Mhor. Fine views throughout.' }),
    tradRoute('Arran Wall',            'E3',  '5c', cirMain,   { height: 80,  pitches: 3, description: 'Technical climbing on the steepest section of the north face — a serious proposition.' }),
    tradRoute('Rosa Pinnacle East',    'HS',  '4b', cirRosa,   { height: 90,  pitches: 3, description: 'The easier Rosa Pinnacle route — still a fantastic outing on perfect granite.' }),
  ]) await r({ ...route, buttressId: route.buttress.id });

  // ── Witch's Step, Arran ───────────────────────────────────────────────────
  const witchsStep = await c('Witch\'s Step', 55.6368, -5.2980, RockType.GRANITE,
    'A dramatic notch and buttress on the ridge between Caisteal Abhail and Cir Mhor — giving short, high-quality granite routes from VS to E4. One of the most atmospheric venues on Arran with a truly wild setting.',
    'Approach via Glen Sannox or Glen Rosa — both take approximately 2 hours with significant ascent.',
    'Glen Sannox car park (free) or Glen Rosa (free).', arran);
  const witchMain = await b('Main Buttress', witchsStep, 1);
  for (const route of [
    tradRoute('Witches\' Groove',      'VS',  '4c', witchMain, { height: 40, pitches: 2, description: 'Takes the fine groove feature — sustained and well protected on good granite.' }),
    tradRoute('Step Direct',           'HVS', '5a', witchMain, { height: 35, pitches: 2, description: 'Direct up the buttress — the crux is the move onto the headwall.' }),
    tradRoute('Notch Route',           'VD',  '3c', witchMain, { height: 30, pitches: 2, description: 'The easier route threading through the notch — memorable positions.' }),
    tradRoute('Arran Arête',           'E2',  '5b', witchMain, { height: 35, pitches: 2, description: 'Bold arête climbing above Glen Sannox — a serious proposition.' }),
  ]) await r({ ...route, buttressId: route.buttress.id });

  console.log('  ✓ Scotland Skye & Arran: Cioch Buttress, Sligachan Slabs, Cir Mhor, Witch\'s Step');
}
