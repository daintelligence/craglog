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
import { seedStanageExtended } from './stanage-extended.seed';
import { seedPeakGritNewCrags } from './peak-gritstone-new-crags.seed';
import { seedLakeDistrictExtended } from './lake-district-extended.seed';
import { seedNorthWalesClassics } from './north-wales-classics.seed';
import { seedScotlandExtended } from './scotland-extended.seed';
import { seedYorkshireExtended } from './yorkshire-extended.seed';
import { seedSouthernCragsExtended } from './southern-crags-extended.seed';
import { seedPeakLimestoneSport } from './peak-limestone-sport.seed';
import { seedNorthumberlandExtended } from './northumberland-extended.seed';
import { seedWalesExtra } from './wales-extra.seed';
import { seedSouthWestExtended } from './south-west-extended.seed';
import { seedSouthEastSandstone } from './south-east-sandstone.seed';
import { seedLakeDistrictBorrowdale } from './lake-district-borrowdale.seed';
import { seedLakeDistrictMore } from './lake-district-more.seed';
import { seedScotlandMore } from './scotland-more.seed';
import { seedNorthernIreland } from './northern-ireland.seed';
import { seedNorthWalesMore } from './north-wales-more.seed';
import { seedPembrokeMore } from './pembroke-more.seed';
import { seedYorkshireLimestone } from './yorkshire-limestone.seed';
import { seedPeakSouthGritstone } from './peak-south-gritstone.seed';
import { seedPeakLimestoneMore } from './peak-limestone-more.seed';
import { seedLakeDistrictHighCrags } from './lake-district-high-crags.seed';
import { seedScotlandSkyeArran } from './scotland-skye-arran.seed';
import { seedScotlandEast } from './scotland-east.seed';
import { seedDorsetSwanageMore } from './dorset-swanage-more.seed';
import { seedSouthWalesLimestone } from './south-wales-limestone.seed';
import { seedCornwallNorthCoast } from './cornwall-north-coast.seed';
import { seedGowerMore } from './gower-more.seed';
import { seedBenNevisCrags } from './ben-nevis-crags.seed';
import { seedGlencoe } from './glencoe.seed';
import { seedCairngormsCrags } from './cairngorms-crags.seed';
import { seedCreagDubhSkyeExtras } from './creag-dubh-skye-extras.seed';
import { seedDinasCromlechCloggy } from './dinas-cromlech-cloggy.seed';
import { seedGreatOrmeSport } from './great-orme-sport.seed';
import { seedYorkshireGritClassics } from './yorkshire-grit-classics.seed';
import { seedGordaleMoreYorkshire } from './gordale-more-yorkshire.seed';
import { seedBosigramPenwith } from './bosigran-penwith.seed';
import { seedDartmoorDevon } from './dartmoor-devon.seed';
import { seedPortland } from './portland.seed';
import { seedMalhamExpanded } from './malham-expanded.seed';
import { seedOgwenValley } from './ogwen-valley.seed';
import { seedNorthWalesSlate } from './north-wales-slate.seed';
import { seedHighTorPeakMore } from './high-tor-peak-more.seed';
import { seedTorridon } from './torridon.seed';
import { seedIlkleyWharfedale } from './ilkley-wharfedale.seed';
import { seedWyeValleyShropshire } from './wye-valley-shropshire.seed';
import { seedIsleOfMan } from './isle-of-man.seed';
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

async function seed() {
  await ds.initialize();
  console.log('🌱 Starting database seed...');

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

  await seedStanageExtended(ds);
  console.log('  ✓ Stanage & Peak grit expanded');

  await seedPeakGritNewCrags(ds);
  console.log('  ✓ New Peak gritstone crags seeded');

  await seedLakeDistrictExtended(ds);
  console.log('  ✓ Lake District extended (Wildcat, Napes, Pillar, etc.)');

  await seedNorthWalesClassics(ds);
  console.log('  ✓ North Wales classics seeded');

  await seedScotlandExtended(ds);
  console.log('  ✓ Scotland extended seeded');

  await seedYorkshireExtended(ds);
  console.log('  ✓ Yorkshire extended seeded');

  await seedSouthernCragsExtended(ds);
  console.log('  ✓ Southern crags extended seeded');

  await seedPeakLimestoneSport(ds);
  console.log('  ✓ Peak limestone sport crags seeded (Cheedale, Water-cum-Jolly, Harpur Hill, Horseshoe Quarry, Ravensdale, Stoney Middleton extended)');

  await seedNorthumberlandExtended(ds);
  console.log('  ✓ Northumberland extended seeded (Simonside, Bowden Doors, Kyloe, Crag Lough, Sandy Crag, Great Wanney)');

  await seedWalesExtra(ds);
  console.log('  ✓ Wales extra seeded (Rhoscolyn, Holyhead Mountain, Cwm Silyn, Craig y Forwen, Pen yr Ole Wen, Gogarth South Stack)');

  await seedSouthWestExtended(ds);
  console.log('  ✓ South West extended seeded (Baggy Point, Lundy Island, Hartland Quay, Dewerstone, Carn Brea, Sennen Cove)');

  await seedSouthEastSandstone(ds);
  console.log("  ✓ South East Sandstone seeded (Harrison's, High Rocks, Stone Farm, Bowles, Eridge Green, Cheddar Gorge supplementary)");

  await seedLakeDistrictBorrowdale(ds);
  console.log("  ✓ Lake District Borrowdale seeded (Shepherd's Crag, Castle Rock, Hodge Close, Falcon Crag, Buckstone How)");

  await seedLakeDistrictMore(ds);
  console.log('  ✓ Lake District more seeded (Grey Crag, Raven Crag Thirlmere, Chapel Head Scar, Dow Crag, St Bees Head, Buckbarrow)');

  await seedScotlandMore(ds);
  console.log('  ✓ Scotland more seeded (Reiff, Diabaig, Etive Slabs, Dumbarton extended, Glenmore Boulders, Carn Dearg)');

  await seedNorthernIreland(ds);
  console.log('  ✓ Northern Ireland seeded (Fair Head, Binnian, Binnian South Tor, Malin Head)');

  await seedNorthWalesMore(ds);
  console.log('  ✓ North Wales more seeded (Lliwedd, Craig yr Ysfa, Llech Ddu, Bochlwyd, Clogwyn y Ddysgl, Porth Ysgo)');

  await seedPembrokeMore(ds);
  console.log("  ✓ Pembroke more seeded (Huntsman's Leap, Stennis Head, Stackpole extended, St Bride's Haven, Elegug Stacks)");

  await seedYorkshireLimestone(ds);
  await seedPeakSouthGritstone(ds);
  await seedPeakLimestoneMore(ds);
  await seedLakeDistrictHighCrags(ds);
  await seedScotlandSkyeArran(ds);
  await seedScotlandEast(ds);
  await seedDorsetSwanageMore(ds);
  await seedSouthWalesLimestone(ds);
  await seedCornwallNorthCoast(ds);
  await seedGowerMore(ds);

  await seedBenNevisCrags(ds);
  await seedGlencoe(ds);
  await seedCairngormsCrags(ds);
  await seedCreagDubhSkyeExtras(ds);
  await seedDinasCromlechCloggy(ds);
  await seedGreatOrmeSport(ds);
  await seedYorkshireGritClassics(ds);
  await seedGordaleMoreYorkshire(ds);
  await seedBosigramPenwith(ds);
  await seedDartmoorDevon(ds);

  await seedPortland(ds);
  await seedMalhamExpanded(ds);
  await seedOgwenValley(ds);
  await seedNorthWalesSlate(ds);
  await seedHighTorPeakMore(ds);
  await seedTorridon(ds);
  await seedIlkleyWharfedale(ds);
  await seedWyeValleyShropshire(ds);
  await seedIsleOfMan(ds);

  // Patch region countries (UK → England/Wales/Scotland)
  const regionRepo = ds.getRepository(Region);
  await patchRegionCountries(regionRepo);
  console.log('  ✓ Region countries patched');

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
    console.log('  ✓ Demo user created: demo@craglog.app / demo1234');
  } else {
    console.log('  ℹ Demo user already exists');
  }

  await seedDemoAscents(ds);
  console.log('  ✓ Demo ascents seeded');

  await ds.destroy();
  console.log('✅ Seed complete!');
}

seed().catch((err) => {
  console.error('❌ Seed failed:', err);
  process.exit(1);
});
