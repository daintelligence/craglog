import { DataSource } from 'typeorm';
import { User } from '../../modules/users/entities/user.entity';
import { Ascent, AscentType } from '../../modules/ascents/entities/ascent.entity';
import { Route } from '../../modules/routes/entities/route.entity';
import { Crag } from '../../modules/crags/entities/crag.entity';

type AscentInput = {
  routeName: string;
  cragName: string;
  ascentType: AscentType;
  date: string;
  notes?: string;
  partner?: string;
  starRating?: number;
};

const ASCENTS: AscentInput[] = [
  // ── Stanage Edge — Visit 1 (Jun 2025) ─────────────────────────────────────
  { routeName: 'Flying Buttress Direct', cragName: 'Stanage Edge', ascentType: AscentType.ONSIGHT, date: '2025-06-15', notes: 'First visit to Stanage — what a crag!', partner: 'Tom W', starRating: 5 },
  { routeName: 'Goliath\'s Groove',       cragName: 'Stanage Edge', ascentType: AscentType.ONSIGHT, date: '2025-06-15', partner: 'Tom W', starRating: 4 },
  { routeName: 'High Neb Buttress',       cragName: 'Stanage Edge', ascentType: AscentType.ONSIGHT, date: '2025-06-15', partner: 'Tom W', starRating: 3 },
  { routeName: 'The Right Unconquerable', cragName: 'Stanage Edge', ascentType: AscentType.ONSIGHT, date: '2025-06-15', partner: 'Tom W', starRating: 5 },
  { routeName: 'Count\'s Buttress',       cragName: 'Stanage Edge', ascentType: AscentType.ONSIGHT, date: '2025-06-15', partner: 'Tom W', starRating: 4 },

  // ── Stanage Edge — Visit 2 (Aug 2025) ─────────────────────────────────────
  { routeName: 'Inverted V',              cragName: 'Stanage Edge', ascentType: AscentType.ONSIGHT, date: '2025-08-03', partner: 'Sarah K', starRating: 3 },
  { routeName: 'Heaven Crack',            cragName: 'Stanage Edge', ascentType: AscentType.ONSIGHT, date: '2025-08-03', partner: 'Sarah K', starRating: 4 },
  { routeName: 'Quietus',                 cragName: 'Stanage Edge', ascentType: AscentType.ONSIGHT, date: '2025-08-03', notes: 'E1 onsight! Delighted.', partner: 'Sarah K', starRating: 5 },
  { routeName: 'Black Hawk Hell Crack',   cragName: 'Stanage Edge', ascentType: AscentType.REDPOINT, date: '2025-08-03', notes: 'Fought hard for this E2. Took 3 goes on the crux.', partner: 'Sarah K', starRating: 5 },

  // ── Stanage Edge — Visit 3 (Oct 2025) ─────────────────────────────────────
  { routeName: 'Goliath\'s Groove',       cragName: 'Stanage Edge', ascentType: AscentType.REPEAT,   date: '2025-10-18', partner: 'Alex B', starRating: 4 },
  { routeName: 'Stanage Bannister',       cragName: 'Stanage Edge', ascentType: AscentType.REDPOINT, date: '2025-10-18', notes: 'E3 in the bag after 4 sessions!', partner: 'Alex B', starRating: 5 },
  { routeName: 'The Right Unconquerable', cragName: 'Stanage Edge', ascentType: AscentType.REPEAT,   date: '2025-10-18', partner: 'Alex B', starRating: 5 },

  // ── Malham Cove (May 2025) ─────────────────────────────────────────────────
  { routeName: 'Cave Route Right-Hand',   cragName: 'Malham Cove',  ascentType: AscentType.ONSIGHT, date: '2025-05-24', notes: 'First multi-pitch! Brilliant position.', partner: 'Emma J', starRating: 5 },
  { routeName: 'Raindogs',                cragName: 'Malham Cove',  ascentType: AscentType.ONSIGHT, date: '2025-05-24', notes: 'First sport onsight. Loved the moves.', partner: 'Emma J', starRating: 4 },
  { routeName: 'Wired for Sound',         cragName: 'Malham Cove',  ascentType: AscentType.ONSIGHT, date: '2025-05-24', partner: 'Emma J', starRating: 4 },
  { routeName: 'Zoolook',                 cragName: 'Malham Cove',  ascentType: AscentType.REDPOINT, date: '2025-05-24', notes: '7a redpoint after a couple of hangs. Getting there!', partner: 'Emma J', starRating: 5 },

  // ── Froggatt Edge (Jul 2025) ───────────────────────────────────────────────
  { routeName: 'Great Slab',              cragName: 'Froggatt Edge', ascentType: AscentType.ONSIGHT, date: '2025-07-05', partner: 'Tom W', starRating: 3 },
  { routeName: 'Valkyrie',               cragName: 'Froggatt Edge', ascentType: AscentType.ONSIGHT, date: '2025-07-05', partner: 'Tom W', starRating: 5 },
  { routeName: 'Strapadictomy',           cragName: 'Froggatt Edge', ascentType: AscentType.REDPOINT, date: '2025-07-05', notes: 'E1 crux was spicy!', partner: 'Tom W', starRating: 4 },
  { routeName: 'Downhill Racer',          cragName: 'Froggatt Edge', ascentType: AscentType.REDPOINT, date: '2025-07-05', partner: 'Tom W', starRating: 5 },
  { routeName: 'Tody\'s Wall',            cragName: 'Froggatt Edge', ascentType: AscentType.REDPOINT, date: '2025-07-05', notes: 'Amazing E3. This is proper climbing.', partner: 'Tom W', starRating: 5 },

  // ── Gordale Scar (Aug 2025) ────────────────────────────────────────────────
  { routeName: 'Zig-Zag',                 cragName: 'Gordale Scar',  ascentType: AscentType.ONSIGHT, date: '2025-08-23', notes: 'Multi-pitch through the gorge. Incredible!', partner: 'Sarah K', starRating: 5 },
  { routeName: 'John Sheard\'s Route',    cragName: 'Gordale Scar',  ascentType: AscentType.REDPOINT, date: '2025-08-23', partner: 'Sarah K', starRating: 4 },
  { routeName: 'La Corniche',             cragName: 'Gordale Scar',  ascentType: AscentType.REDPOINT, date: '2025-08-23', notes: '7b — hardest redpoint to date!', partner: 'Sarah K', starRating: 5 },

  // ── Raven Tor (Sep 2025) ───────────────────────────────────────────────────
  { routeName: 'Superdirect',             cragName: 'Raven Tor',     ascentType: AscentType.ONSIGHT,  date: '2025-09-13', notes: '6c onsight. Short but brutal.', partner: 'Alex B', starRating: 4 },
  { routeName: 'Tequila Mockingbird',     cragName: 'Raven Tor',     ascentType: AscentType.ONSIGHT,  date: '2025-09-13', partner: 'Alex B', starRating: 5 },
  { routeName: 'Indecent Exposure',       cragName: 'Raven Tor',     ascentType: AscentType.REDPOINT, date: '2025-09-13', partner: 'Alex B', starRating: 5 },
  { routeName: 'Mecca',                   cragName: 'Raven Tor',     ascentType: AscentType.DOG,      date: '2025-09-13', notes: 'Way too hard for me right now. Watched the project.', partner: 'Alex B' },

  // ── Cheedale (Sep 2025) ────────────────────────────────────────────────────
  { routeName: 'Plumb Line',              cragName: 'Cheedale',      ascentType: AscentType.ONSIGHT,  date: '2025-09-28', partner: 'Emma J', starRating: 4 },
  { routeName: 'Gone with the Wind',      cragName: 'Cheedale',      ascentType: AscentType.REDPOINT, date: '2025-09-28', notes: '7b — felt strong today!', partner: 'Emma J', starRating: 5 },
  { routeName: 'Mortlock\'s Arête',       cragName: 'Cheedale',      ascentType: AscentType.REDPOINT, date: '2025-09-28', partner: 'Emma J', starRating: 4 },

  // ── Stoney Middleton (Nov 2025) ────────────────────────────────────────────
  { routeName: 'Wee Doris',               cragName: 'Stoney Middleton', ascentType: AscentType.ONSIGHT,  date: '2025-11-08', partner: 'Tom W', starRating: 3 },
  { routeName: 'Sin',                     cragName: 'Stoney Middleton', ascentType: AscentType.ONSIGHT,  date: '2025-11-08', partner: 'Tom W', starRating: 4 },
  { routeName: 'Windhover',               cragName: 'Stoney Middleton', ascentType: AscentType.ONSIGHT,  date: '2025-11-08', notes: '6c onsight!', partner: 'Tom W', starRating: 4 },
  { routeName: 'Kink',                    cragName: 'Stoney Middleton', ascentType: AscentType.REDPOINT, date: '2025-11-08', partner: 'Tom W', starRating: 5 },
  { routeName: 'Menopause',               cragName: 'Stoney Middleton', ascentType: AscentType.REDPOINT, date: '2025-11-08', partner: 'Tom W', starRating: 5 },
  { routeName: 'Moon Walk',               cragName: 'Stoney Middleton', ascentType: AscentType.REDPOINT, date: '2025-11-08', partner: 'Tom W', starRating: 4 },

  // ── Curbar Edge (Dec 2025) ─────────────────────────────────────────────────
  { routeName: 'The File',                cragName: 'Curbar Edge',   ascentType: AscentType.ONSIGHT,  date: '2025-12-07', notes: 'Proper winter gritstone session. Cold but crisp.', partner: 'Sarah K', starRating: 4 },
  { routeName: 'Profit of Doom',          cragName: 'Curbar Edge',   ascentType: AscentType.REDPOINT, date: '2025-12-07', partner: 'Sarah K', starRating: 5 },
  { routeName: 'Hairless Heart',          cragName: 'Curbar Edge',   ascentType: AscentType.SECOND,   date: '2025-12-07', notes: 'Seconded Sarah on E5 — never again!', partner: 'Sarah K' },

  // ── Bamford Edge (Jan 2026) ────────────────────────────────────────────────
  { routeName: 'Bamford Crack',           cragName: 'Bamford Edge',  ascentType: AscentType.ONSIGHT,  date: '2026-01-11', partner: 'Alex B', starRating: 3 },
  { routeName: 'Broken Crack',            cragName: 'Bamford Edge',  ascentType: AscentType.ONSIGHT,  date: '2026-01-11', partner: 'Alex B', starRating: 3 },
  { routeName: 'Slab and Crack',          cragName: 'Bamford Edge',  ascentType: AscentType.ONSIGHT,  date: '2026-01-11', partner: 'Alex B', starRating: 4 },
  { routeName: 'Reservoir Wall',          cragName: 'Bamford Edge',  ascentType: AscentType.ONSIGHT,  date: '2026-01-11', partner: 'Alex B', starRating: 4 },

  // ── Cheddar Gorge (Feb 2026) ───────────────────────────────────────────────
  { routeName: 'Long Climb',              cragName: 'Cheddar Gorge', ascentType: AscentType.ONSIGHT,  date: '2026-02-22', notes: 'Amazing 3-pitch adventure through the gorge.', partner: 'Emma J', starRating: 5 },
  { routeName: 'Gorge Yourself',          cragName: 'Cheddar Gorge', ascentType: AscentType.ONSIGHT,  date: '2026-02-22', notes: '6c onsight — psyched!', partner: 'Emma J', starRating: 4 },
  { routeName: 'Sceptre',                 cragName: 'Cheddar Gorge', ascentType: AscentType.REDPOINT, date: '2026-02-22', partner: 'Emma J', starRating: 4 },
  { routeName: 'Wild at Heart',           cragName: 'Cheddar Gorge', ascentType: AscentType.REDPOINT, date: '2026-02-22', notes: '7a+ — new personal best sport grade!', partner: 'Emma J', starRating: 5 },
];

export async function seedDemoAscents(ds: DataSource) {
  const userRepo  = ds.getRepository(User);
  const routeRepo = ds.getRepository(Route);
  const cragRepo  = ds.getRepository(Crag);
  const ascentRepo = ds.getRepository(Ascent);

  const user = await userRepo.findOne({ where: { email: 'demo@craglog.app' } });
  if (!user) throw new Error('Demo user not found — run main seed first');

  const existing = await ascentRepo.count({ where: { userId: user.id } });
  if (existing >= 10) {
    return; // already seeded
  }

  // Delete the 8 placeholder ascents from the main seed
  await ascentRepo.delete({ userId: user.id });

  const crags = await cragRepo.find();
  const cragMap = new Map(crags.map((c) => [c.name, c]));

  const routes = await routeRepo.find({ relations: ['buttress', 'buttress.crag'] });
  const routeMap = new Map(routes.map((r) => [`${r.buttress?.crag?.name}::${r.name}`, r]));

  const ascents: Partial<Ascent>[] = [];
  for (const a of ASCENTS) {
    const route = routeMap.get(`${a.cragName}::${a.routeName}`);
    if (!route) continue;
    const crag = cragMap.get(a.cragName);
    ascents.push({
      userId: user.id,
      routeId: route.id,
      cragId: crag?.id ?? route.buttress?.cragId,
      ascentType: a.ascentType,
      date: a.date,
      notes: a.notes ?? null,
      partner: a.partner ?? null,
      starRating: a.starRating ?? null,
      attempts: a.ascentType === AscentType.REDPOINT ? Math.ceil(Math.random() * 4) + 1 : 1,
    });
  }

  await ascentRepo.save(ascents);
}
