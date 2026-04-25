import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { User } from '../../modules/users/entities/user.entity';
import { Region } from '../../modules/crags/entities/region.entity';
import { Crag } from '../../modules/crags/entities/crag.entity';
import { Buttress } from '../../modules/crags/entities/buttress.entity';
import { Route } from '../../modules/routes/entities/route.entity';
import { Ascent } from '../../modules/ascents/entities/ascent.entity';
import { UserBadge } from '../../modules/badges/entities/user-badge.entity';
import { seedUKCrags } from './uk-crags.seed';
import { seedPeakDistrictExtended } from './peak-district-extended.seed';
import { seedLakeDistrict } from './lake-district.seed';
import { seedYorkshire } from './yorkshire.seed';
import { seedNorthWalesExtended } from './north-wales-extended.seed';
import { seedScotland } from './scotland.seed';
import { seedSouthWest } from './south-west.seed';
import { seedEnglandOtherRegions } from './england-other-regions.seed';
import { seedPembrokeshire } from './pembrokeshire.seed';
import { seedAvonGorge } from './avon-gorge.seed';
import { seedPeakDistrictClassic } from './peak-district-classic.seed';
import { seedMidWales } from './mid-wales.seed';
import * as bcrypt from 'bcryptjs';

const ds = new DataSource({
  type: 'postgres',
  url: process.env.DATABASE_URL || 'postgresql://craglog:craglog_secret@localhost:5432/craglog',
  entities: [User, Region, Crag, Buttress, Route, Ascent, UserBadge],
  synchronize: true,
  logging: false,
});

async function seed() {
  await ds.initialize();
  console.log('🌱 Starting database seed...');

  // Enable PostGIS
  await ds.query(`CREATE EXTENSION IF NOT EXISTS postgis`);
  console.log('  ✓ PostGIS extension enabled');

  // Seed crags / routes
  await seedUKCrags(ds);
  console.log('  ✓ Original UK crags seeded');

  await seedPeakDistrictExtended(ds);
  console.log('  ✓ Peak District extended seeded');

  await seedLakeDistrict(ds);
  console.log('  ✓ Lake District seeded');

  await seedYorkshire(ds);
  console.log('  ✓ Yorkshire seeded');

  await seedNorthWalesExtended(ds);
  console.log('  ✓ North Wales extended seeded');

  await seedScotland(ds);
  console.log('  ✓ Scotland seeded');

  await seedSouthWest(ds);
  console.log('  ✓ South West England seeded');

  await seedEnglandOtherRegions(ds);
  console.log('  ✓ England other regions seeded');

  await seedPembrokeshire(ds);
  console.log('  ✓ Pembrokeshire seeded');

  await seedAvonGorge(ds);
  console.log('  ✓ Avon Gorge & Cheddar seeded');

  await seedPeakDistrictClassic(ds);
  console.log('  ✓ Peak District classic crags seeded (Roaches, Millstone, Stoney, Black Rocks)');

  await seedMidWales(ds);
  console.log('  ✓ Mid-Wales and Wye Valley seeded');

  // Seed demo user
  const userRepo = ds.getRepository(User);
  const existing = await userRepo.findOne({ where: { email: 'demo@craglog.app' } });
  if (!existing) {
    const user = userRepo.create({
      email: 'demo@craglog.app',
      name: 'Demo Climber',
      username: 'demo',
      password: await bcrypt.hash('demo1234', 12),
    });
    await userRepo.save(user);

    // Seed some sample ascents for the demo user
    const ascentRepo = ds.getRepository(Ascent);
    const routeRepo = ds.getRepository(Route);
    const cragRepo = ds.getRepository(Crag);

    const routes = await routeRepo.find({ relations: ['buttress', 'buttress.crag'] });
    const stanage = await cragRepo.findOne({ where: { name: 'Stanage Edge' } });

    if (routes.length && stanage) {
      const sampleAscents = routes.slice(0, 8).map((r, i) => ({
        userId: user.id,
        routeId: r.id,
        cragId: r.buttress?.cragId || stanage.id,
        ascentType: ['onsight', 'redpoint', 'flash', 'second', 'onsight', 'redpoint', 'onsight', 'redpoint'][i] as any,
        date: new Date(Date.now() - i * 7 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10),
        notes: i === 0 ? 'First visit — absolutely loved it!' : undefined,
        partner: i % 2 === 0 ? 'Jane Smith' : undefined,
        starRating: Math.floor(Math.random() * 2) + 4,
        attempts: Math.ceil(Math.random() * 3),
      }));
      await ascentRepo.save(sampleAscents);
    }

    console.log('  ✓ Demo user created: demo@craglog.app / demo1234');
  } else {
    console.log('  ℹ Demo user already exists');
  }

  await ds.destroy();
  console.log('✅ Seed complete!');
}

seed().catch((err) => {
  console.error('❌ Seed failed:', err);
  process.exit(1);
});
