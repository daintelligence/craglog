import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { User } from '../../modules/users/entities/user.entity';
import { Region } from '../../modules/crags/entities/region.entity';
import { Crag } from '../../modules/crags/entities/crag.entity';
import { Buttress } from '../../modules/crags/entities/buttress.entity';
import { Route } from '../../modules/routes/entities/route.entity';
import { Ascent } from '../../modules/ascents/entities/ascent.entity';
import { UserBadge } from '../../modules/badges/entities/user-badge.entity';
import { seedDemoAscents } from './demo-ascents.seed';
import { patchRegionCountries } from './seed-helpers';
import * as bcrypt from 'bcryptjs';

const ds = new DataSource({
  type: 'postgres',
  url: process.env.DATABASE_URL || 'postgresql://craglog:craglog_secret@localhost:5432/craglog',
  entities: [User, Region, Crag, Buttress, Route, Ascent, UserBadge],
  synchronize: true,
  logging: false,
});

async function run() {
  await ds.initialize();
  console.log('🌱 Seeding new routes and demo ascents...');

  const { seedStanageExtended } = await import('./stanage-extended.seed');
  const { seedPeakGritNewCrags } = await import('./peak-gritstone-new-crags.seed');
  const { seedLakeDistrictExtended } = await import('./lake-district-extended.seed');
  const { seedNorthWalesClassics } = await import('./north-wales-classics.seed');
  const { seedScotlandExtended } = await import('./scotland-extended.seed');
  const { seedYorkshireExtended } = await import('./yorkshire-extended.seed');
  const { seedSouthernCragsExtended } = await import('./southern-crags-extended.seed');
  const { seedPeakLimestoneSport } = await import('./peak-limestone-sport.seed');
  const { seedNorthumberlandExtended } = await import('./northumberland-extended.seed');
  const { seedWalesExtra } = await import('./wales-extra.seed');
  const { seedSouthWestExtended } = await import('./south-west-extended.seed');
  const { seedSouthEastSandstone } = await import('./south-east-sandstone.seed');
  const { seedLakeDistrictBorrowdale } = await import('./lake-district-borrowdale.seed');

  await seedStanageExtended(ds);
  await seedPeakGritNewCrags(ds);
  await seedLakeDistrictExtended(ds);
  await seedNorthWalesClassics(ds);
  await seedScotlandExtended(ds);
  await seedYorkshireExtended(ds);
  await seedSouthernCragsExtended(ds);
  await seedPeakLimestoneSport(ds);
  await seedNorthumberlandExtended(ds);
  await seedWalesExtra(ds);
  await seedSouthWestExtended(ds);
  await seedSouthEastSandstone(ds);
  await seedLakeDistrictBorrowdale(ds);
  console.log('  ✓ New routes seeded');

  const { Region } = await import('../../modules/crags/entities/region.entity');
  const regionRepo = ds.getRepository(Region);
  await patchRegionCountries(regionRepo);
  console.log('  ✓ Region countries patched');

  // Ensure demo user exists before seeding ascents
  const userRepo = ds.getRepository(User);
  const demoUser = await userRepo.findOne({ where: { email: 'demo@craglog.app' } });
  if (!demoUser) {
    await userRepo.save(userRepo.create({
      email: 'demo@craglog.app',
      name: 'Demo Climber',
      username: 'demo',
      password: await bcrypt.hash('demo1234', 12),
    }));
    console.log('  ✓ Demo user created (demo@craglog.app / demo1234)');
  }

  await seedDemoAscents(ds);
  console.log('  ✓ Demo ascents seeded');

  console.log('✅ Done!');
  await ds.destroy();
}

run().catch((err) => {
  console.error('❌ Failed:', err);
  process.exit(1);
});
