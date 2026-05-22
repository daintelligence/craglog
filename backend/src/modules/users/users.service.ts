import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private dataSource: DataSource,
  ) {}

  async create(data: Partial<User>): Promise<User> {
    const user = this.userRepository.create(data);
    return this.userRepository.save(user);
  }

  async findById(id: string): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.userRepository.findOne({ where: { email } });
  }

  async findByUsername(username: string): Promise<User | null> {
    return this.userRepository.findOne({ where: { username } });
  }

  async update(id: string, data: Partial<User>): Promise<User> {
    await this.userRepository.update(id, data);
    return this.findById(id);
  }

  async findByResetToken(tokenHash: string): Promise<User | null> {
    return this.userRepository.findOne({ where: { resetTokenHash: tokenHash } });
  }

  async getPublicProfile(username: string) {
    const user = await this.findByUsername(username);
    if (!user || !user.isPublic) throw new NotFoundException('Profile not found');

    const [statsRows, recentRows, gradeRow] = await Promise.all([
      this.dataSource.query<{ total_ascents: string; unique_crags: string }[]>(
        `SELECT COUNT(*) as total_ascents, COUNT(DISTINCT crag_id) as unique_crags
         FROM ascents WHERE user_id = $1`,
        [user.id],
      ),
      this.dataSource.query<any[]>(
        `SELECT a.id, a.ascent_type, a.date,
                COALESCE(r.name, a.free_grade, 'Unknown') as route_name,
                COALESCE(r.grade, a.free_grade) as grade,
                COALESCE(r.grade_system, 'font') as grade_system,
                c.name as crag_name,
                (SELECT COUNT(*)::int FROM kudos k WHERE k.ascent_id = a.id) as kudos_count
         FROM ascents a
         LEFT JOIN routes r ON a.route_id = r.id
         LEFT JOIN crags c ON a.crag_id = c.id
         WHERE a.user_id = $1
         ORDER BY a.date DESC, a.created_at DESC
         LIMIT 10`,
        [user.id],
      ),
      this.dataSource.query<{ grade: string }[]>(
        `SELECT r.grade FROM ascents a
         JOIN routes r ON a.route_id = r.id
         WHERE a.user_id = $1
         ORDER BY r.grade_difficulty DESC LIMIT 1`,
        [user.id],
      ),
    ]);

    const stats = statsRows[0];
    return {
      id: user.id,
      name: user.name,
      username: user.username,
      avatarUrl: user.avatarUrl,
      bio: user.bio,
      createdAt: user.createdAt,
      totalAscents: parseInt(stats?.total_ascents ?? '0', 10),
      uniqueCrags: parseInt(stats?.unique_crags ?? '0', 10),
      hardestGrade: gradeRow[0]?.grade ?? null,
      recentAscents: recentRows,
    };
  }
}
