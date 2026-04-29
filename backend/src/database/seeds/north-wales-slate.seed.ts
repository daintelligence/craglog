import { DataSource } from 'typeorm';
import { Region } from '../../modules/crags/entities/region.entity';
import { Crag, RockType } from '../../modules/crags/entities/crag.entity';
import { Buttress } from '../../modules/crags/entities/buttress.entity';
import { Route } from '../../modules/routes/entities/route.entity';
import { findOrCreateRegion, upsertCrag, upsertButtress, upsertRoute, tradRoute, sportRoute } from './seed-helpers';

export async function seedNorthWalesSlate(ds: DataSource) {
  const regionRepo = ds.getRepository(Region);
  const cragRepo   = ds.getRepository(Crag);
  const buttRepo   = ds.getRepository(Buttress);
  const routeRepo  = ds.getRepository(Route);

  const snowdonia = await findOrCreateRegion(regionRepo, { name: 'Snowdonia', country: 'Wales' });

  async function c(name: string, lat: number, lng: number, rock: RockType, desc: string, approach: string, parking: string, region: any) {
    return upsertCrag(cragRepo, { name, latitude: lat, longitude: lng, rockType: rock, description: desc, approach, parkingInfo: parking, region, regionId: region.id });
  }
  async function b(name: string, crag: Crag, order = 1) { return upsertButtress(buttRepo, { name, crag, cragId: crag.id, sortOrder: order }); }
  async function r(data: Partial<Route>) { return upsertRoute(routeRepo, data); }

  // ── Vivian Quarry (Dinorwig) ──────────────────────────────────────────────
  const vivian = await c('Vivian Quarry', 53.1225, -4.1188, RockType.OTHER,
    'The most developed of the Dinorwig slate quarries — a flooded quarry above Llanberis giving unique sport and trad routes from E1 to E7 on compact purple-grey slate. The routes are technical and friction-dependent — a completely different experience from any other British crag. Australia (E3) and Comes the Dervish (E5) are celebrated classics. Unique industrial atmosphere.',
    'From Llanberis, follow the minor road up towards the Dinorwig Quarries. The flooded quarry is visible — 10 min walk.',
    'Roadside parking near Vivian Quarry on the Dinorwig road, Llanberis (free).', snowdonia);
  const vivianMain    = await b('Main Face', vivian, 1);
  const vivianAus     = await b('Australia', vivian, 2);
  const vivianLeft    = await b('Left Side', vivian, 3);

  for (const route of [
    tradRoute('Australia',            'E3',  '5c', vivianAus,  { height: 30, description: 'The great Vivian classic — a brilliant technical route on perfect compact slate. Requires precise footwork and confidence on friction holds.' }),
    tradRoute('Comes the Dervish',    'E5',  '6b', vivianMain, { height: 28, description: 'A celebrated Welsh slate extreme — powerful and technical on the main face. One of the most significant slate routes.' }),
    tradRoute('Pure Space',           'E4',  '6a', vivianMain, { height: 25, description: 'A bold route on the compact slate — serious and technical in the quarry atmosphere.' }),
    tradRoute('Colossus',             'E2',  '5c', vivianAus,  { height: 30, description: 'A fine Vivian route — takes a direct line on the Australia section on perfect slate.' }),
    tradRoute('Rainbow Slab',         'E1',  '5b', vivianLeft, { height: 28, description: 'The classic Vivian moderate — a delicate route on the left side requiring careful footwork.' }),
    tradRoute('Quarry Wall',          'HVS', '5a', vivianLeft, { height: 25, description: 'A fine HVS — takes the wall feature with good gear on less-polished slate.' }),
    tradRoute('Vivian Direct',        'E6',  '6b', vivianMain, { height: 25, description: 'A very serious route on the main face — extremely bold and technical on highly polished slate.' }),
  ]) await r({ ...route, buttressId: route.buttress.id });

  // ── California (Dinorwig) ─────────────────────────────────────────────────
  const california = await c('California', 53.1240, -4.1215, RockType.OTHER,
    'A distinct slate sector of the Dinorwig Quarries with sport and trad routes from E1 to E6. The California sector has a more open aspect than Vivian and some of the best-sustained slate routes in the complex. Manic Street Preacher and similar long routes are considered Welsh sport classics.',
    'Adjacent to Vivian Quarry — follow the quarry road slightly further — 12 min from Llanberis.',
    'Roadside parking near Vivian Quarry on the Dinorwig road (free).', snowdonia);
  const calMain  = await b('California Main', california, 1);
  const calSport = await b('Sport Sector', california, 2);

  for (const route of [
    sportRoute('Manic Street Preacher', '7b', calSport, { height: 30, description: 'The famous California sport route — sustained technical climbing on polished slate. A must-do for any sport climber in the quarries.' }),
    tradRoute('California Dreamin\'',  'E3',  '5c', calMain,  { height: 28, description: 'A fine California trad route — bold and technical on compact purple slate.' }),
    sportRoute('Quarry Sport',         '7a',  calSport, { height: 25, description: 'A well-bolted sport route — sustained on the characteristic Dinorwig slate.' }),
    tradRoute('California Wall',       'E2',  '5c', calMain,  { height: 25, description: 'A good E2 on the main face — technical and committing on compact slate.' }),
    sportRoute('Slate Sport',          '6c',  calSport, { height: 22, description: 'A more accessible sport route — good introduction to slate sport climbing technique.' }),
  ]) await r({ ...route, buttressId: route.buttress.id });

  // ── Rainbow Slab (Llanberis) ──────────────────────────────────────────────
  const rainbowSlab = await c('Rainbow Slab', 53.1198, -4.1155, RockType.OTHER,
    'A large slate slab in the Dinorwig complex giving some of the most technical friction climbing in the UK. Routes from HVS to E7 on highly polished slate — balance, footwork and nerve are the key skills. Maximum Exposure (E3) is considered one of the scariest well-known routes in Wales.',
    'Follow the path up through the Dinorwig Quarries from Llanberis — 20 min to the slab.',
    'Llanberis village parking (pay & display) or roadside near the quarry access.', snowdonia);
  const rainbowMain = await b('Main Slab', rainbowSlab, 1);

  for (const route of [
    tradRoute('Maximum Exposure',     'E3',  '6a', rainbowMain, { height: 80,  pitches: 2, description: 'One of the most notorious routes in Wales — a vast commitment on polished slate with minimal protection. Not for the faint-hearted. Pure nerve required.' }),
    tradRoute('Rainbow Slab Direct',  'E5',  '6b', rainbowMain, { height: 70,  pitches: 2, description: 'A serious route up the most polished section — extremely bold and technical. Brings out the best and worst in climbers.' }),
    tradRoute('Slab Route',           'HVS', '5a', rainbowMain, { height: 60,  pitches: 2, description: 'The most accessible Rainbow Slab route — a fine outing requiring careful footwork and composure on the polished slate.' }),
    tradRoute('Coloured Rain',        'E2',  '5c', rainbowMain, { height: 65,  pitches: 2, description: 'A good intermediate route — technical friction climbing with sparse gear on the rainbow-coloured slab.' }),
  ]) await r({ ...route, buttressId: route.buttress.id });

  // ── Twll Mawr (Dinorwig) ──────────────────────────────────────────────────
  const twllMawr = await c('Twll Mawr', 53.1260, -4.1230, RockType.OTHER,
    'The Great Pit of the Dinorwig Quarries — a massive circular amphitheatre of slate giving long routes from VS to E6. The scale is extraordinary — the walls drop 100m in places. Slate routes of 3–5 pitches giving a full mountain climbing experience in an industrial landscape.',
    'From Llanberis, walk through the quarry complex to the Great Pit — 25 min.',
    'Llanberis village parking or Electric Mountain car park (pay & display).', snowdonia);
  const twllMain = await b('Main Wall', twllMawr, 1);
  const twllLeft = await b('Left Tier', twllMawr, 2);

  for (const route of [
    tradRoute('Colosseum',            'VS',  '4c', twllMain, { height: 100, pitches: 3, description: 'The great Twll Mawr classic — a magnificent three-pitch route in the pit. Scale and atmosphere unlike any other British crag.' }),
    tradRoute('Arena Wall',           'E2',  '5c', twllMain, { height: 90,  pitches: 3, description: 'A sustained route up the main pit wall — serious commitment on compact slate in an extraordinary setting.' }),
    tradRoute('Left Tier Route',      'HVS', '5a', twllLeft, { height: 70,  pitches: 2, description: 'A fine HVS on the left tier — good gear placements on the less polished section.' }),
    tradRoute('Pit Route',            'E4',  '6a', twllMain, { height: 85,  pitches: 2, description: 'A bold route on the main wall — serious and committing in the Twll Mawr amphitheatre.' }),
  ]) await r({ ...route, buttressId: route.buttress.id });

  console.log('  ✓ North Wales Slate: Vivian Quarry, California, Rainbow Slab, Twll Mawr');
}
