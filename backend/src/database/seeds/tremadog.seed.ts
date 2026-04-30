import { DataSource } from 'typeorm';
import { Region } from '../../modules/crags/entities/region.entity';
import { Crag, RockType } from '../../modules/crags/entities/crag.entity';
import { Buttress } from '../../modules/crags/entities/buttress.entity';
import { Route } from '../../modules/routes/entities/route.entity';
import { findOrCreateRegion, upsertCrag, upsertButtress, upsertRoute, tradRoute } from './seed-helpers';

export async function seedTremadog(ds: DataSource) {
  const regionRepo = ds.getRepository(Region);
  const cragRepo   = ds.getRepository(Crag);
  const buttRepo   = ds.getRepository(Buttress);
  const routeRepo  = ds.getRepository(Route);

  const region = await findOrCreateRegion(regionRepo, { name: 'North Wales', country: 'Wales' });

  async function c(name: string, lat: number, lng: number, rock: RockType, desc: string, approach: string, parking: string, region: any) {
    return upsertCrag(cragRepo, { name, latitude: lat, longitude: lng, rockType: rock, description: desc, approach, parkingInfo: parking, region, regionId: region.id });
  }
  async function b(name: string, crag: Crag, order = 1) { return upsertButtress(buttRepo, { name, crag, cragId: crag.id, sortOrder: order }); }
  async function r(data: Partial<Route>) { return upsertRoute(routeRepo, data); }

  // ── Craig Bwlch y Moch ────────────────────────────────────────────────────
  const bwlch = await c('Craig Bwlch y Moch', 52.9277, -4.1358, RockType.OTHER,
    'The centrepiece of the Tremadog crags — a vast sweep of rough rhyolite and dolerite giving some of the finest middle-grade climbing in Wales. The cliff rises in a series of clean walls and arêtes above the valley, offering excellent friction and natural lines. Vector, Meshach and One Step in the Clouds are essential British classics that attract climbers from across the country.',
    'From Tremadog village, follow the minor road towards the cliff. The path leaves the road near a small parking area and reaches the base in 5–10 minutes. Routes are spread across the full width of the cliff.',
    'Small roadside parking area below the crag on the minor road from Tremadog (free). Larger parking available in Tremadog village. Café and pub in the village.', region);
  const bwlchMain    = await b('Main Face', bwlch, 1);
  const bwlchLeft    = await b('Left Section', bwlch, 2);
  const bwlchRight   = await b('Right Section', bwlch, 3);

  for (const route of [
    tradRoute('Meshach',              'HVS', '5b', bwlchMain,  { height: 60, pitches: 2, description: 'One of the all-time Tremadog classics — sustained and well-protected climbing up the centre of the main face on magnificent rough rock. Sustained 5b slab and wall climbing with excellent protection.' }),
    tradRoute('Grim Wall',            'E4',  '6a', bwlchMain,  { height: 50, pitches: 2, description: 'A bold and serious route up the impressive wall — hard moves above good gear require commitment. One of the harder testpieces at Tremadog.' }),
    tradRoute('Zukator',              'E1',  '5b', bwlchLeft,  { height: 55, pitches: 2, description: 'A superb sustained E1 — takes a natural line up the left section. Well-protected and absorbing climbing on rough Tremadog rock.' }),
    tradRoute('Void',                 'E2',  '5c', bwlchLeft,  { height: 50, pitches: 2, description: 'A fine E2 on the left section — sustained face climbing with a technical crux on compact rhyolite. One of several excellent E2s at the crag.' }),
    tradRoute('One Step in the Clouds', 'E3', '6a', bwlchMain, { height: 60, pitches: 2, description: 'The most famous route at Tremadog — a magnificent E3 up the central wall requiring perfect footwork and bold moves. A North Wales classic that rewards commitment.' }),
    tradRoute('Barbarian',            'HS',  '4c', bwlchRight, { height: 45, pitches: 2, description: 'The classic Tremadog moderate — a fine sustained hard severe on the right section. Well protected with a good natural line on excellent rough rock.' }),
    tradRoute('Vector',               'HVS', '5a', bwlchMain,  { height: 65, pitches: 3, description: 'The definitive Tremadog HVS — a superb sustained route up the main face taking the most natural and elegant line. Outstanding route quality with memorable positions.' }),
  ]) await r({ ...route, buttressId: route.buttress.id });

  // ── Craig Pant Ifan ───────────────────────────────────────────────────────
  const pantIfan = await c('Craig Pant Ifan', 52.9300, -4.1320, RockType.OTHER,
    'A fine companion crag to Bwlch y Moch — compact rhyolite and dolerite giving excellent routes across the grades. The routes here have a more open and accessible feel than the main cliff. Shadrach and Valence are well-loved classics, while Extraction provides a testing E3 outing.',
    'Follow the path from the main Tremadog parking area northwards — 10 min walk to this crag. A well-worn path leads directly to the base.',
    'Park in Tremadog village or at the main Bwlch y Moch parking area (free). Share the approach path with the main crag.', region);
  const pantIfanMain  = await b('Main Face', pantIfan, 1);
  const pantIfanLeft  = await b('Left Wall', pantIfan, 2);
  const pantIfanRight = await b('Right Arête', pantIfan, 3);

  for (const route of [
    tradRoute('Shadrach',             'E1',  '5b', pantIfanMain,  { height: 45, pitches: 2, description: 'The Pant Ifan classic — a sustained and well-protected E1 up the main face. Technical face climbing on compact rough rock with good runners throughout.' }),
    tradRoute('Valence',              'E2',  '5c', pantIfanMain,  { height: 42, pitches: 2, description: 'A fine E2 companion to Shadrach — more sustained and technical, taking a direct line up the centre of the face. Excellent rock and protection.' }),
    tradRoute('Extraction',           'E3',  '6a', pantIfanLeft,  { height: 40, pitches: 2, description: 'A demanding E3 on the left wall — hard technical moves on the crux section require precise footwork. Committing but well-protected for the grade.' }),
    tradRoute('Pincushion',           'HS',  '4b', pantIfanRight, { height: 35, pitches: 1, description: 'The accessible classic at Pant Ifan — a lovely hard severe on the right arête giving varied and enjoyable climbing. Well-worn holds on a natural line.' }),
    tradRoute('Slick',                'VS',  '4c', pantIfanLeft,  { height: 38, pitches: 2, description: 'A quality VS on the left section — sustained bridging and face climbing on good compact rock. A fine outing for parties warming up for the harder routes.' }),
    tradRoute('Nimrod',               'HVS', '5a', pantIfanMain,  { height: 42, pitches: 2, description: 'An excellent HVS on the main face — sustained and absorbing climbing with good gear throughout. A natural companion to Shadrach.' }),
  ]) await r({ ...route, buttressId: route.buttress.id });

  // ── Craig y Gesail ────────────────────────────────────────────────────────
  const gesail = await c('Craig y Gesail', 52.9260, -4.1380, RockType.OTHER,
    'A quieter Tremadog crag sitting slightly south and west of the main crags — rough-textured rhyolite giving a selection of quality routes from VS to E2. The corner and arête lines are particularly fine. Less busy than Bwlch y Moch and a pleasant alternative on busy weekends.',
    'From Tremadog village, follow the path southwestwards to reach the crag in 10–15 minutes. Less obvious approach than the main crags — follow the ridge path.',
    'Park in Tremadog village (free on-street). The approach path starts from the south end of the village.', region);
  const gesailMain  = await b('Main Wall', gesail, 1);
  const gesailArete = await b('South Arête', gesail, 2);
  const gesailSlab  = await b('East Slab', gesail, 3);

  for (const route of [
    tradRoute('Cromlech Corner',      'VS',  '4c', gesailMain,  { height: 35, pitches: 1, description: 'The corner classic at Gesail — takes the fine open corner on the main wall. Well-protected bridging and layback climbing with a satisfying natural line.' }),
    tradRoute('Gesail Arête',         'HVS', '5a', gesailArete, { height: 32, pitches: 1, description: 'A fine arête route on the south section — sustained and balanced climbing requiring good footwork. More exposed than the corner routes.' }),
    tradRoute('Leg Slip',             'E1',  '5b', gesailMain,  { height: 30, pitches: 1, description: 'The testing E1 at Gesail — technical face moves on compact rock above good runners. Requires precise footwork to link the sequence.' }),
    tradRoute('Gesail Slab',          'S',   '4a', gesailSlab,  { height: 25, pitches: 1, description: 'A pleasant slab on the east section — friction climbing on good rough rock. An accessible route for those building confidence.' }),
    tradRoute('West Rib',             'VS',  '4b', gesailArete, { height: 30, pitches: 1, description: 'A quality VS rib route — takes the clean rib feature giving enjoyable climbing in a good position.' }),
  ]) await r({ ...route, buttressId: route.buttress.id });

  // ── The Bwlch Boulder ────────────────────────────────────────────────────
  const bwlchBoulder = await c('The Bwlch Boulder', 52.9275, -4.1370, RockType.OTHER,
    'A large roadside boulder below Craig Bwlch y Moch giving a variety of short problems on rough dolerite. Popular as a warm-up before the main crag and a fine destination in its own right. Problems from Font 4 to Font 7A on good compact rock.',
    'The boulder sits immediately below the main Bwlch y Moch crag — visible from the approach path. 5 min from the parking area.',
    'Main Tremadog parking area below the crag (free). The boulder is passed on the approach.', region);
  const boulderNorth = await b('North Face', bwlchBoulder, 1);
  const boulderSouth = await b('South Face', bwlchBoulder, 2);
  const boulderSide  = await b('Side Wall', bwlchBoulder, 3);

  for (const route of [
    tradRoute('North Face Direct',    'S',   '4a', boulderNorth, { height: 5,  description: 'The accessible line up the north side — good holds on rough dolerite. Popular warm-up problem.' }),
    tradRoute('Arête Problem',        'VS',  '4c', boulderSide,  { height: 5,  description: 'The arête on the side wall — balance and precision on good compact rock.' }),
    tradRoute('Slab Direct',          'VD',  '3c', boulderSouth, { height: 4,  description: 'An easy slab on the south face — friction and balance on rough textured dolerite.' }),
    tradRoute('Boulder High Step',    'HVS', '5a', boulderNorth, { height: 5,  description: 'A harder variation on the north face — technical moves on small holds. A fine warm-up for the E-grades above.' }),
    tradRoute('South Wall Traverse',  'HS',  '4b', boulderSouth, { height: 4,  description: 'A low traverse of the south face — good fun on good holds. Often used as a boulder circuit warm-up.' }),
  ]) await r({ ...route, buttressId: route.buttress.id });

  // ── Pencoed Pillar ────────────────────────────────────────────────────────
  const pencoed = await c('Pencoed Pillar', 52.9290, -4.1340, RockType.OTHER,
    'A fine standalone pillar of rhyolite in the Tremadog area giving a handful of well-defined routes. Excellent rough rock and natural protection. Pinnacle Route is a classic outing on the prominent pillar feature. A good destination for those seeking something a little different from the main crags.',
    'Follow the path from the main Tremadog crags eastwards for 5 minutes to reach the isolated pillar.',
    'Use the main Tremadog parking area and approach via the main crag path.', region);
  const pencoedFront = await b('Front Face', pencoed, 1);
  const pencoedSlab  = await b('East Slab', pencoed, 2);
  const pencoedNorth = await b('North Ridge', pencoed, 3);

  for (const route of [
    tradRoute('Pinnacle Route',       'VD',  '3c', pencoedFront, { height: 25, pitches: 2, description: 'The classic route on the pillar — takes the most natural line up the front face. Well-protected and enjoyable on good rough rock.' }),
    tradRoute('Slab Climb',           'S',   '4a', pencoedSlab,  { height: 20, pitches: 1, description: 'A pleasant slab on the east side — friction climbing on rough rhyolite. Accessible for those developing slab technique.' }),
    tradRoute('North Ridge',          'HS',  '4b', pencoedNorth, { height: 22, pitches: 2, description: 'A ridge route on the north side — more exposed than the front face with fine views towards the Lleyn Peninsula.' }),
    tradRoute('Direct Finish',        'VS',  '4c', pencoedFront, { height: 25, pitches: 2, description: 'A harder direct finish to the pillar — technical moves on the upper section above reliable protection.' }),
    tradRoute('East Slab Direct',     'VS',  '4c', pencoedSlab,  { height: 20, pitches: 1, description: 'A more direct line on the east slab — steeper and more technical than the normal slab climb.' }),
  ]) await r({ ...route, buttressId: route.buttress.id });

  console.log('  ✓ Tremadog: Craig Bwlch y Moch, Craig Pant Ifan, Craig y Gesail, The Bwlch Boulder, Pencoed Pillar');
}
