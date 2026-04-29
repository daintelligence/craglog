import { DataSource } from 'typeorm';
import { Region } from '../../modules/crags/entities/region.entity';
import { Crag, RockType } from '../../modules/crags/entities/crag.entity';
import { Buttress } from '../../modules/crags/entities/buttress.entity';
import { Route } from '../../modules/routes/entities/route.entity';
import { findOrCreateRegion, upsertCrag, upsertButtress, upsertRoute, tradRoute, sportRoute } from './seed-helpers';

export async function seedGordaleMoreYorkshire(ds: DataSource) {
  const regionRepo = ds.getRepository(Region);
  const cragRepo   = ds.getRepository(Crag);
  const buttRepo   = ds.getRepository(Buttress);
  const routeRepo  = ds.getRepository(Route);

  const yorkshireDales = await findOrCreateRegion(regionRepo, { name: 'Yorkshire Dales', country: 'England' });

  async function c(name: string, lat: number, lng: number, rock: RockType, desc: string, approach: string, parking: string, region: any) {
    return upsertCrag(cragRepo, { name, latitude: lat, longitude: lng, rockType: rock, description: desc, approach, parkingInfo: parking, region, regionId: region.id });
  }
  async function b(name: string, crag: Crag, order = 1) { return upsertButtress(buttRepo, { name, crag, cragId: crag.id, sortOrder: order }); }
  async function r(data: Partial<Route>) { return upsertRoute(routeRepo, data); }

  // ── Gordale Scar ──────────────────────────────────────────────────────────
  const gordaleScar = await c('Gordale Scar', 54.0678, -2.1167, RockType.LIMESTONE,
    'One of the most dramatic natural amphitheatres in Britain — a spectacular gorge with overhanging limestone walls giving serious routes from VS to E6. The main trad routes require confidence on steep ground; the sport routes push into 7c+. The waterfalls through the gorge add to the extraordinary atmosphere. A truly iconic venue.',
    'From Malham village, follow the lane east for 1.5 km to the gorge entrance — 20 min walk. The Scar is unmissable.',
    'Malham National Park car park (pay & display). Very busy in summer. Arrive early for a parking space.', yorkshireDales);
  const gordaleMain  = await b('Main Gorge', gordaleScar, 1);
  const gordaleRight = await b('Right Wall', gordaleScar, 2);
  const gordaleLeft  = await b('Left Wall', gordaleScar, 3);

  for (const route of [
    tradRoute('Gordale Crack',        'E1',  '5b', gordaleMain,  { height: 40, pitches: 2, description: 'The main crack route through the gorge — serious and sustained through dramatic overhanging limestone.' }),
    tradRoute('Face Route',           'VS',  '4c', gordaleMain,  { height: 35, pitches: 2, description: 'A classic VS through the gorge — sustained on the main face with a memorable gorge atmosphere.' }),
    tradRoute('Central Wall',         'HVS', '5a', gordaleMain,  { height: 40, pitches: 2, description: 'Takes the central section of the gorge wall — committing moves in an extraordinary setting.' }),
    tradRoute('Overhanging Wall',     'E4',  '6a', gordaleLeft,  { height: 35, pitches: 2, description: 'A serious and bold route on the overhanging left wall — one of the best hard trad routes in the Dales.' }),
    tradRoute('Right Wall Direct',    'E2',  '5c', gordaleRight, { height: 30, pitches: 2, description: 'Direct on the right wall — technical and sustained above the stream.' }),
    sportRoute('Lycra Lout',          '7c',  gordaleLeft,  { height: 30, description: 'The hard sport route on the left wall — one of the steepest and most powerful in Yorkshire.' }),
    sportRoute('Gordale Sport',       '7a',  gordaleMain,  { height: 25, description: 'A well-bolted sport route through the gorge — sustained crimping on excellent limestone.' }),
    sportRoute('Scar Wall',           '6c',  gordaleRight, { height: 25, description: 'A popular sport route on the right wall — sustained with good holds and spectacular scenery.' }),
  ]) await r({ ...route, buttressId: route.buttress.id });

  // ── Twistleton Scar End ───────────────────────────────────────────────────
  const twistleton = await c('Twistleton Scar End', 54.1747, -2.4380, RockType.LIMESTONE,
    'A south-facing limestone scar at the northern end of Chapel-le-Dale with routes from HS to E2 on excellent rock. A quieter Dales limestone venue with fine views over Ribblesdale. The crag catches plenty of sunshine and dries quickly after rain.',
    'From Ribblehead, follow the lane south through Chapel-le-Dale and take the footpath up to the scar — 20 min.',
    'Ribblehead viaduct car park (pay & display) or roadside near Chapel-le-Dale church (free).', yorkshireDales);
  const twistMain = await b('Main Scar', twistleton, 1);

  for (const route of [
    tradRoute('Twistleton Crack',     'VS',  '4c', twistMain, { height: 20, description: 'The main crack route on the scar — a good natural line with excellent gear.' }),
    tradRoute('Chapel Wall',          'HS',  '4b', twistMain, { height: 18, description: 'A pleasant wall route above Chapel-le-Dale — good holds and fine Dales views.' }),
    tradRoute('Scar Direct',          'HVS', '5a', twistMain, { height: 20, description: 'A more direct line — technical on compact Dales limestone.' }),
    tradRoute('Ribblesdale View',     'VD',  '3c', twistMain, { height: 15, description: 'An accessible route with views of Ribblesdale and Whernside.' }),
  ]) await r({ ...route, buttressId: route.buttress.id });

  // ── Moughton Scar ─────────────────────────────────────────────────────────
  const moughton = await c('Moughton Scar', 54.1650, -2.4580, RockType.LIMESTONE,
    'A long low limestone scar on the flanks of Moughton above Crummackdale with routes from HS to E2. A remote and atmospheric venue — no crowds, just limestone and Dales scenery. The rock is typical Craven limestone — compact and well-featured.',
    'From Austwick village, follow the footpath up Crummackdale to Moughton Scar — 45–60 min.',
    'Austwick village roadside parking (free). Narrow lanes — drive carefully.', yorkshireDales);
  const moughtonMain = await b('Main Scar', moughton, 1);

  for (const route of [
    tradRoute('Moughton Wall',        'HVS', '5a', moughtonMain, { height: 22, description: 'The main route on the scar — sustained technical climbing in a wild Crummackdale setting.' }),
    tradRoute('Crummackdale Crack',   'VS',  '4c', moughtonMain, { height: 20, description: 'A good crack route — natural protection and varied climbing above the dale.' }),
    tradRoute('Dales Slab',           'S',   '4a', moughtonMain, { height: 18, description: 'A pleasant slab route — friction on clean compact limestone.' }),
    tradRoute('Moughton Direct',      'E1',  '5b', moughtonMain, { height: 20, description: 'A bold direct line — small holds requiring precision on compact limestone.' }),
  ]) await r({ ...route, buttressId: route.buttress.id });

  // ── Pot Scar ──────────────────────────────────────────────────────────────
  const potScar = await c('Pot Scar', 54.1500, -2.4250, RockType.LIMESTONE,
    'A compact limestone scar near Horton-in-Ribblesdale with routes from VS to E3. Good quality rock in a typical Dales limestone setting. A useful alternative when the better-known venues are crowded.',
    'From Horton-in-Ribblesdale, follow the footpath north-west up the hillside to the scar — 20 min.',
    'Horton-in-Ribblesdale village car park (small fee in season) or roadside.', yorkshireDales);
  const potMain = await b('Main Wall', potScar, 1);

  for (const route of [
    tradRoute('Pot Wall Route',       'VS',  '4c', potMain, { height: 18, description: 'A good route on the compact limestone — natural gear and varied climbing.' }),
    tradRoute('Ribblesdale Crack',    'HVS', '5a', potMain, { height: 18, description: 'A sustained crack route — well protected on good Dales limestone.' }),
    tradRoute('Scar Wall',            'E1',  '5b', potMain, { height: 20, description: 'A technical face route — small holds on compact limestone above Ribblesdale.' }),
  ]) await r({ ...route, buttressId: route.buttress.id });

  // ── Nappa Scar ────────────────────────────────────────────────────────────
  const nappaScar = await c('Nappa Scar', 54.2850, -2.0300, RockType.LIMESTONE,
    'A small but excellent limestone scar in upper Wensleydale with routes from VD to E2. One of the quieter Dales limestone venues — rarely crowded and with fine valley views. A pleasant afternoon venue.',
    'From Bainbridge village in Wensleydale, follow the footpath up the hillside to the scar — 20 min.',
    'Bainbridge village car park (free) or roadside near the village.', yorkshireDales);
  const nappaMain = await b('Main Scar', nappaScar, 1);

  for (const route of [
    tradRoute('Wensleydale Wall',     'VS',  '4c', nappaMain, { height: 18, description: 'A good route on the Wensleydale limestone — natural gear and pleasant climbing.' }),
    tradRoute('Nappa Crack',          'HS',  '4b', nappaMain, { height: 16, description: 'A classic crack route — the best of the easier routes on the scar.' }),
    tradRoute('Dales Arête',          'HVS', '5a', nappaMain, { height: 18, description: 'An exposed arête with fine views over upper Wensleydale.' }),
  ]) await r({ ...route, buttressId: route.buttress.id });

  console.log('  ✓ Gordale & Yorkshire Dales: Gordale Scar, Twistleton Scar, Moughton Scar, Pot Scar, Nappa Scar');
}
