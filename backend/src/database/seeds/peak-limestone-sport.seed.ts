import { DataSource } from 'typeorm';
import { Region } from '../../modules/crags/entities/region.entity';
import { Crag, RockType } from '../../modules/crags/entities/crag.entity';
import { Buttress } from '../../modules/crags/entities/buttress.entity';
import { Route } from '../../modules/routes/entities/route.entity';
import {
  findOrCreateRegion, upsertCrag, upsertButtress, upsertRoute,
  tradRoute, sportRoute,
} from './seed-helpers';

export async function seedPeakLimestoneSport(ds: DataSource) {
  const regionRepo = ds.getRepository(Region);
  const cragRepo   = ds.getRepository(Crag);
  const buttRepo   = ds.getRepository(Buttress);
  const routeRepo  = ds.getRepository(Route);

  const peak = await findOrCreateRegion(regionRepo, {
    name: 'Peak District',
    country: 'England',
    description: 'The Peak District — UK climbing heartland. Gritstone edges and limestone dales.',
  });

  async function r(route: Partial<Route>) {
    return upsertRoute(routeRepo, route);
  }

  // ── Cheedale ─────────────────────────────────────────────────────────────────
  const cheedale = await upsertCrag(cragRepo, {
    name: 'Cheedale',
    region: peak,
    regionId: peak.id,
    latitude: 53.2540,
    longitude: -1.7680,
    rockType: RockType.LIMESTONE,
    description: 'One of the finest limestone dales in the Peak District, with world-class sport and high-quality trad routes. The overhanging Cornice and Plum Buttress walls hold some of the most sustained climbing in England. The River Wye winds below on the approach walk.',
    approach: "Park at Miller's Dale station car park (SK 138 733) on the Monsal Trail. Walk west along the disused railway, then descend to the riverside path. The Cornice section is about 1.5 km from the car park, Plum Buttress a further 300 m. Allow 25–30 min.",
    parkingInfo: "Miller's Dale Monsal Trail car park (pay & display, National Trust). Overflow in the village lay-by.",
  });

  const cheeCorn  = await upsertButtress(buttRepo, { name: 'Cheedale Cornice',    crag: cheedale, cragId: cheedale.id, sortOrder: 1 });
  const cheeUpper = await upsertButtress(buttRepo, { name: 'Cheedale Upper Tier', crag: cheedale, cragId: cheedale.id, sortOrder: 2 });
  const cheePlum  = await upsertButtress(buttRepo, { name: 'Plum Buttress',       crag: cheedale, cragId: cheedale.id, sortOrder: 3 });

  await r(sportRoute('Plumb Line',             '6b+', cheePlum,  { height: 20, description: 'The most popular route on Plum Buttress — sustained pocket pulling up the central line with a balancy crux midway.', sortOrder: 1 }));
  await r(tradRoute( 'Plumb Bob',              'E2',  '5c', cheePlum,  { height: 20, description: 'Classic trad companion to Plumb Line. Takes a crack and corner system to the right, well-protected but sustained.', sortOrder: 2 }));
  await r(sportRoute('Sirplum',                '7a+', cheePlum,  { height: 22, description: 'The outstanding Plum Buttress sport pitch — technical crimping with a long reach crux at two-thirds height.', sortOrder: 3 }));
  await r(sportRoute('Plumb Crazy',            '7b+', cheePlum,  { height: 22, description: 'Left of Sirplum. A series of hard bouldery sequences linked by rests on good side-pulls.', sortOrder: 4 }));
  await r(tradRoute( 'Mortlock\'s Arête',      'E2',  '5c', cheePlum,  { height: 18, description: 'Colin Mortlock\'s superb arête route above the river. Technical face climbing on the exposed left rib of Plum Buttress.', sortOrder: 5 }));
  await r(tradRoute( 'Cheedale Bastion',       'E1',  '5b', cheePlum,  { height: 18, description: 'Takes the right-facing corner and wall above. Well-protected climbing with an airy finish.', sortOrder: 6 }));

  await r(sportRoute('Floorshow',              '6c+', cheeCorn,  { height: 24, description: 'One of the great Cornice routes — climbs the sustained lower wall before pulling through the overhang on good holds. Classic.', sortOrder: 1 }));
  await r(sportRoute('Gone with the Wind',     '7b',  cheeCorn,  { height: 24, description: 'Technical crimping leads into a savage final roof. One of the best 7bs in the Peak.', sortOrder: 2 }));
  await r(sportRoute('No Rest for the Wicked', '7c',  cheeCorn,  { height: 24, description: 'Relentlessly sustained sport climbing up the steepest section of the Cornice. Multiple cruxes, very little rest.', sortOrder: 3 }));
  await r(sportRoute('Kellogg\'s Roof',        '8a',  cheeCorn,  { height: 22, description: 'The showstopper — a technical, powerful route through the main roof of the Cornice finishing on the big jugs above. A Peak landmark.', sortOrder: 4 }));
  await r(sportRoute('Breakfast in America',   '7a',  cheeCorn,  { height: 22, description: 'Popular mid-grade line on the Cornice section. Good pockets with a single hard move past the bulge.', sortOrder: 5 }));
  await r(sportRoute('Rising Sun',             '6c',  cheeCorn,  { height: 20, description: 'The best of the easier Cornice sport routes — well-bolted, sustained at 6c with a nice variety of holds.', sortOrder: 6 }));
  await r(sportRoute('Magnum Force',           '7a+', cheeCorn,  { height: 22, description: 'Climbs the wall left of Gone with the Wind. Fingery crux sequence on sloping edges.', sortOrder: 7 }));
  await r(sportRoute('Cornice Direct',         '6b',  cheeCorn,  { height: 20, description: 'The access route to the Cornice upper section — a good 6b with varied movement.', sortOrder: 8 }));

  await r(tradRoute( 'Prow',                   'VS',  '4c', cheeUpper, { height: 15, description: 'Takes the distinctive prow of the Upper Tier — good holds on good limestone with a fine finish. A classic VS.', sortOrder: 1 }));
  await r(tradRoute( 'Cornice Route',          'HVS', '5a', cheeUpper, { height: 16, description: 'The upper tier\'s best HVS. Climbs the wall left of centre with a committing crux and excellent rock throughout.', sortOrder: 2 }));
  await r(tradRoute( 'Central Cheedale',       'E1',  '5b', cheeUpper, { height: 16, description: 'Direct up the centre of the Upper Tier — sustained bridging and laybacking on immaculate grey limestone.', sortOrder: 3 }));
  await r(tradRoute( 'Cheedale Eliminate',     'E2',  '5c', cheeUpper, { height: 16, description: 'Takes the hardest independent line on the upper tier. Thin face climbing past a single poor rest leads to a sustained crux.', sortOrder: 4 }));
  await r(tradRoute( 'Upper Tier Arête',       'E1',  '5b', cheeUpper, { height: 14, description: 'The left arête of the Upper Tier — technical and exposed with a memorable finish.', sortOrder: 5 }));
  await r(sportRoute('Tier Pressure',          '6c',  cheeUpper, { height: 16, description: 'Well-bolted sport route on the upper wall. Powerful moves off the ground lead into sustained face climbing.', sortOrder: 6 }));
  await r(sportRoute('Top Shelf',              '7b',  cheeUpper, { height: 16, description: 'The best bolted route on the Upper Tier — very technical crimping with long reaches between small edges.', sortOrder: 7 }));
  await r(sportRoute('Finger on the Button',   '6b+', cheeUpper, { height: 14, description: 'Popular warm-up on the upper tier. Pocket climbing with a technical sequence near the anchors.', sortOrder: 8 }));

  // ── Water-cum-Jolly Dale ──────────────────────────────────────────────────────
  const wcj = await upsertCrag(cragRepo, {
    name: 'Water-cum-Jolly Dale',
    region: peak,
    regionId: peak.id,
    latitude: 53.2420,
    longitude: -1.7540,
    rockType: RockType.LIMESTONE,
    description: 'A stunning narrow gorge with vertical to overhanging sport climbs up to 8a+. The Wall of Horrors and Harmony Wall provide some of the Peak\'s most technically demanding single-pitch limestone climbing. The approach requires wading the river — bring old shoes.',
    approach: "From Cressbrook village (SK 173 731), follow the riverside path downstream. At high water the path involves wading — bring aqua shoes or old trainers. Wall of Horrors is 1 km downstream on the right bank. Allow 20–25 min.",
    parkingInfo: 'Small lay-by at Cressbrook village (free, limited to 4–5 cars). Overflow at Monsal Trail car parks.',
  });

  const wcjHarm = await upsertButtress(buttRepo, { name: 'Harmony Wall',    crag: wcj, cragId: wcj.id, sortOrder: 1 });
  const wcjWoH  = await upsertButtress(buttRepo, { name: 'Wall of Horrors', crag: wcj, cragId: wcj.id, sortOrder: 2 });

  await r(sportRoute('Joker',             '6c',  wcjHarm, { height: 18, description: 'Popular entry-level route on Harmony Wall. Nice pocket climbing with a tricky move through the slight bulge.', sortOrder: 1 }));
  await r(sportRoute('Joker Sit Start',   '7a',  wcjHarm, { height: 18, description: 'The extension of Joker with a low sit-start adding three powerful moves before joining the main route.', sortOrder: 2 }));
  await r(sportRoute('Equilibrium',       '7b',  wcjHarm, { height: 20, description: 'Harmony Wall\'s best route. Sustained technical crimping with perfect balancing moves in the upper section.', sortOrder: 3 }));
  await r(sportRoute('Harmony',           '7c',  wcjHarm, { height: 20, description: 'The headlining route — climbs through the bulge and up the steep headwall on a run of small holds. Demanding and brilliant.', sortOrder: 4 }));
  await r(sportRoute('Discord',           '7a+', wcjHarm, { height: 18, description: 'Left of Harmony — slightly easier but still very sustained. Good holds but very little rest.', sortOrder: 5 }));
  await r(sportRoute('Accord',            '6b',  wcjHarm, { height: 16, description: 'The approachable line on Harmony Wall. Technical enough to be interesting, holds throughout.', sortOrder: 6 }));
  await r(sportRoute('Minor Chord',       '6a',  wcjHarm, { height: 14, description: 'The friendliest route on the wall — well-bolted with good limestone pockets the whole way.', sortOrder: 7 }));

  await r(sportRoute('Wall of Horrors',   '8a+', wcjWoH,  { height: 24, description: 'One of the Peak\'s few 8a+ sport routes. A ferocious power-endurance test up the steepest wall in the dale. First climbed by Jerry Moffatt.', sortOrder: 1 }));
  await r(sportRoute('Horrors Minor',     '7c+', wcjWoH,  { height: 24, description: 'A more accessible companion to Wall of Horrors but still intensely steep. Long reaches on rounded pockets.', sortOrder: 2 }));
  await r(sportRoute('Terror Nova',       '7b+', wcjWoH,  { height: 22, description: 'Starts right of Horrors Minor and takes an independent line through the lower wall.', sortOrder: 3 }));
  await r(sportRoute('The Rack',          '7a',  wcjWoH,  { height: 20, description: 'Climbs the right side of the Wall of Horrors section — less overhanging but still powerful.', sortOrder: 4 }));
  await r(sportRoute('River Run',         '6c+', wcjWoH,  { height: 18, description: 'The best mid-grade route in the dale. Superb sustained pocket pulling up the wall above the riverside.', sortOrder: 5 }));
  await r(sportRoute('Deep Water',        '6b+', wcjWoH,  { height: 16, description: 'Named for its proximity to the river. Technical face climbing with a balancy crux.', sortOrder: 6 }));

  // ── Harpur Hill ───────────────────────────────────────────────────────────────
  const harpur = await upsertCrag(cragRepo, {
    name: 'Harpur Hill',
    region: peak,
    regionId: peak.id,
    latitude: 53.2410,
    longitude: -1.8860,
    rockType: RockType.LIMESTONE,
    description: 'A reclaimed industrial quarry south of Buxton offering a wide selection of sport routes from 6a to 7c+. The bolted walls are up to 25 m high on sound quarried limestone. Popular with Buxton locals and a useful venue when the valley crags are wet.',
    approach: 'From Buxton centre, take the A515 Ashbourne road south for 1.5 km, then turn east on Harpur Hill Road. Follow signs to the old quarry. 5 min walk from the access gate.',
    parkingInfo: 'Car park at the quarry entrance off Harpur Hill Road (free, locked at dusk).',
  });

  const harpurMain  = await upsertButtress(buttRepo, { name: 'Main Wall',   crag: harpur, cragId: harpur.id, sortOrder: 1 });
  const harpurRight = await upsertButtress(buttRepo, { name: 'Right Walls', crag: harpur, cragId: harpur.id, sortOrder: 2 });

  await r(sportRoute('Buxton Calling',      '6a',  harpurMain,  { height: 14, description: 'Good beginner sport route on the left side of the main wall. Well-bolted and varied.', sortOrder: 1 }));
  await r(sportRoute('Thermal Runaway',     '6b',  harpurMain,  { height: 16, description: 'Popular warm-up. Technical wall climbing with a slight reachy crux midway.', sortOrder: 2 }));
  await r(sportRoute('Hard Cheese',         '6c',  harpurMain,  { height: 18, description: 'The most popular route at Harpur Hill — sustained pocket climbing with a committing crux above the third bolt.', sortOrder: 3 }));
  await r(sportRoute('Quarry Rash',         '6c+', harpurMain,  { height: 20, description: 'Takes the central line of the main wall with technical moves low down and a balancy sequence to the anchors.', sortOrder: 4 }));
  await r(sportRoute('Chemical Reaction',   '7a',  harpurMain,  { height: 20, description: 'Powerful sequence through the main wall bulge. Good rock, steep finish.', sortOrder: 5 }));
  await r(sportRoute('Catalyst',            '7b',  harpurMain,  { height: 22, description: 'The best hard route on the main wall. A long sustained pitch with several crux sections.', sortOrder: 6 }));
  await r(sportRoute('Critical Mass',       '7c+', harpurMain,  { height: 22, description: 'Harpur Hill\'s hardest — a ferocious sequence through the steepest part of the wall on tiny crimps.', sortOrder: 7 }));

  await r(sportRoute('Derbyshire Blue',     '6a',  harpurRight, { height: 12, description: 'Short well-bolted route on good quarried limestone.', sortOrder: 1 }));
  await r(sportRoute('Limestone Cowboy',    '6b+', harpurRight, { height: 14, description: 'Technical face climbing on the right walls. Good holds with one committing step.', sortOrder: 2 }));
  await r(sportRoute('Quarrymen',           '6c',  harpurRight, { height: 15, description: 'Sustained climbing up the centre of the right walls.', sortOrder: 3 }));
  await r(sportRoute('Edge of Reason',      '7a+', harpurRight, { height: 16, description: 'Takes the slight arête feature on the right wall. Very technical, needs precise footwork.', sortOrder: 4 }));

  // ── Horseshoe Quarry ──────────────────────────────────────────────────────────
  // Note: Horseshoe Quarry may already exist from peak-district-extended.seed.ts.
  // upsertCrag will return the existing record if found.
  const horseshoe = await upsertCrag(cragRepo, {
    name: 'Horseshoe Quarry',
    region: peak,
    regionId: peak.id,
    latitude: 53.2280,
    longitude: -1.7860,
    rockType: RockType.LIMESTONE,
    description: 'The Peak District\'s most developed sport climbing venue — a three-sided quarried limestone horseshoe with well over 200 bolted routes from 4+ to 8b. Excellent for groups, beginners and experienced climbers alike. Shade available on the left and right wings.',
    approach: 'Park at Stoney Middleton village. Walk up Middleton Dale on the B6465 for 800 m, then take the signed track right to the quarry entrance. 12 min total.',
    parkingInfo: 'Stoney Middleton village street parking (free). Do not block the quarry access track.',
  });

  const horseLeft  = await upsertButtress(buttRepo, { name: 'Left Wing',       crag: horseshoe, cragId: horseshoe.id, sortOrder: 1 });
  const horseCent  = await upsertButtress(buttRepo, { name: 'Central Section', crag: horseshoe, cragId: horseshoe.id, sortOrder: 2 });
  const horseRight = await upsertButtress(buttRepo, { name: 'Right Wing',      crag: horseshoe, cragId: horseshoe.id, sortOrder: 3 });

  await r(sportRoute('Banana Finger',       '7a',  horseLeft,  { height: 14, description: 'One of the Horseshoe\'s most recognised routes — a powerful sequence on a banana-shaped pinch hold is unavoidable.', sortOrder: 3 }));
  await r(sportRoute('Fingertip Control',   '6c+', horseLeft,  { height: 14, description: 'Consistent technical climbing on the left wing. Several distinct moves rather than one big crux.', sortOrder: 4 }));
  await r(sportRoute('Yellow Peril',        '6b',  horseLeft,  { height: 12, description: 'Popular left-wing pitch on good holds. Well-protected.', sortOrder: 5 }));
  await r(sportRoute('Crystal Meth',        '7b+', horseCent,  { height: 16, description: 'The central section\'s hardest route. Crimping through a steep wall on crystalline limestone — very pure movement.', sortOrder: 4 }));
  await r(sportRoute('Middle Earth',        '7a+', horseCent,  { height: 16, description: 'A fine central section route. Long sustained movement with no single desperate move but relentless difficulty.', sortOrder: 5 }));
  await r(sportRoute('Peak Condition',      '6c',  horseCent,  { height: 15, description: 'The most popular route in the central section. Technical but reasonable, with good rests.', sortOrder: 6 }));
  await r(sportRoute('Quarry Bonus',        '5+',  horseRight, { height: 11, description: 'Ideal beginner and warm-up route. Short, well-bolted and on good rock.', sortOrder: 3 }));
  await r(sportRoute('Limestone Lottery',   '6a+', horseRight, { height: 12, description: 'Good entry-level sport on the right wing. A couple of technical sections keep you engaged.', sortOrder: 4 }));
  await r(tradRoute( 'Horseshoe Crack',     'VS',  '4c', horseRight, { height: 10, description: 'The one traditional route on the right wing — takes the obvious crack to a direct finish.', sortOrder: 5 }));

  // ── Ravensdale ────────────────────────────────────────────────────────────────
  const ravensdale = await upsertCrag(cragRepo, {
    name: 'Ravensdale',
    region: peak,
    regionId: peak.id,
    latitude: 53.2600,
    longitude: -1.8150,
    rockType: RockType.LIMESTONE,
    description: 'A quiet limestone dale north of Monsal Head with a mixture of trad and sport routes. The crag sees less traffic than Cheedale or Water-cum-Jolly and rewards those who make the effort with excellent climbing on clean rock above a beautiful stream.',
    approach: 'From Monsal Head (SK 185 715), take the footpath north into the dale. Follow the river upstream for 1.2 km. The crag is on the right bank. Allow 20 min.',
    parkingInfo: 'Monsal Head car park (pay & display, SK 185 715). Or roadside at Cressbrook village.',
  });

  const ravenMain = await upsertButtress(buttRepo, { name: 'Main Wall',        crag: ravensdale, cragId: ravensdale.id, sortOrder: 1 });
  const ravenLeft = await upsertButtress(buttRepo, { name: 'Left Wing',        crag: ravensdale, cragId: ravensdale.id, sortOrder: 2 });

  await r(tradRoute( 'Ravensdale Arête',    'VS',  '4c', ravenMain, { height: 14, description: 'The arête of the main buttress — technical friction moves on the left side give way to a fine crack finish.', sortOrder: 1 }));
  await r(tradRoute( 'Ravensdale Wall',     'E1',  '5b', ravenMain, { height: 16, description: 'The classic E1 of the dale. Direct up the centre of the main wall with a sustained sequence and good gear.', sortOrder: 2 }));
  await r(tradRoute( 'Raven\'s Crack',      'HS',  '4b', ravenMain, { height: 12, description: 'Clean crack splitting the right side of the main buttress. Good gear, excellent rock.', sortOrder: 3 }));
  await r(tradRoute( 'Black Wing',          'E2',  '5c', ravenMain, { height: 16, description: 'Takes the steeper wall right of Ravensdale Wall. A harder sequence with sparse gear in the crux.', sortOrder: 4 }));
  await r(tradRoute( 'Dalemaster',          'HVS', '5a', ravenMain, { height: 15, description: 'Excellent HVS on the right of the main wall. Sustained climbing on good limestone holds.', sortOrder: 5 }));
  await r(sportRoute('Flight Path',         '6c',  ravenMain, { height: 16, description: 'Bolted line on the main wall. Technical moves on pockets and edges.', sortOrder: 6 }));
  await r(sportRoute('Jackdaw',             '7a',  ravenMain, { height: 16, description: 'Steep and powerful sport route right of Flight Path. Good rests split the two hard sections.', sortOrder: 7 }));

  await r(tradRoute( 'Left Wing Direct',    'VD',  '3c', ravenLeft, { height: 10, description: 'The easiest route in the dale — a good introduction to limestone trad.', sortOrder: 1 }));
  await r(tradRoute( 'Wingbeat',            'S',   '4a', ravenLeft, { height: 12, description: 'Enjoyable climbing up the left wing. Good holds and gear throughout.', sortOrder: 2 }));
  await r(tradRoute( 'Pinion',              'E1',  '5b', ravenLeft, { height: 14, description: 'The best route on the left wing — takes the slight groove and wall above with a technical crux near the top.', sortOrder: 3 }));

  // ── Stoney Middleton (extended) ───────────────────────────────────────────────
  // upsertCrag will return the existing Stoney Middleton record if it was already
  // seeded by an earlier function; these routes add to the existing buttresses.
  const stoney = await upsertCrag(cragRepo, {
    name: 'Stoney Middleton',
    region: peak,
    regionId: peak.id,
    latitude: 53.2667,
    longitude: -1.6341,
    rockType: RockType.LIMESTONE,
    description: 'A compact roadside limestone dale — the birthplace of UK sport climbing. Classics at all grades with an iconic roadside atmosphere. Windhover, Our Father, and the hard sport routes on the lower walls are all-time Peak classics.',
    approach: 'Park in Stoney Middleton village (SK 229 754). The crag is visible from the road. Multiple access points along the dale bottom.',
    parkingInfo: 'Roadside in Stoney Middleton village (free, limited). Further parking up Middleton Dale.',
  });

  const stoneyExt  = await upsertButtress(buttRepo, { name: 'Stoney Extension', crag: stoney, cragId: stoney.id, sortOrder: 4 });

  await r(sportRoute('Kink',                '7a',  stoneyExt, { height: 15, description: 'The Power of Kink — a bold technical sequence on the lower wall moving left via a crescent-shaped rail.', sortOrder: 1 }));
  await r(sportRoute('Menopause',           '7a',  stoneyExt, { height: 15, description: 'Classic Stoney harder sport. Powerful boulder-problem moves on undercuts and slopers.', sortOrder: 2 }));
  await r(sportRoute('Moon Walk',           '7a+', stoneyExt, { height: 16, description: 'Climbs the wall using the moon-shaped hold sequence near the top. Sustained and technical.', sortOrder: 3 }));
  await r(tradRoute( 'Armageddon',          'E5',  '6a', stoneyExt, { height: 20, description: 'One of the hardest traditional routes at Stoney. A sustained wall with marginal gear and a powerful crux.', sortOrder: 4 }));
  await r(tradRoute( 'Sin',                 'E2',  '5b', stoneyExt, { height: 18, description: 'Classic Stoney trad — takes the wall right of centre with good gear and a sustained sequence.', sortOrder: 5 }));
  await r(tradRoute( 'Wee Doris',           'VS',  '4c', stoneyExt, { height: 14, description: 'The friendly VS of the extension area. Positive holds throughout with a slight crux on the upper wall.', sortOrder: 6 }));
  await r(sportRoute('Inertia Reel',        '6c+', stoneyExt, { height: 16, description: 'Well-bolted sport route on good grey limestone. Sustained 6c with a single harder move off the break.', sortOrder: 7 }));
  await r(sportRoute('Friction Zones',      '6b',  stoneyExt, { height: 14, description: 'Popular easy sport at Stoney. Good value at the grade with varied movement.', sortOrder: 8 }));
  await r(sportRoute('Brimstone and Treacle', '7b', stoneyExt, { height: 18, description: 'Power-endurance test on the overhanging extension wall. The best harder sport route in this section.', sortOrder: 9 }));
  await r(tradRoute( 'Stoney Crack',        'HVS', '5a', stoneyExt, { height: 16, description: 'Takes the fine crack line right of the extension bolted routes. Well-protected jamming leads to a technical wall finish.', sortOrder: 10 }));

  console.log('  ✓ Peak limestone sport: Cheedale, Water-cum-Jolly, Harpur Hill, Horseshoe Quarry (extended), Ravensdale, Stoney Middleton (extended)');
}
