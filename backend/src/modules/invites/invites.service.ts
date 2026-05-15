import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { randomUUID } from 'crypto';
import { Invite } from './entities/invite.entity';
import { CreateInviteDto } from './dto/create-invite.dto';
import { MailService } from '../mail/mail.service';
import { UsersService } from '../users/users.service';

@Injectable()
export class InvitesService {
  constructor(
    @InjectRepository(Invite) private repo: Repository<Invite>,
    private mail: MailService,
    private users: UsersService,
  ) {}

  async create(dto: CreateInviteDto, createdById: string): Promise<Invite> {
    const invite = this.repo.create({
      token: randomUUID(),
      email: dto.email ?? null,
      note: dto.note ?? null,
      createdById,
      // 30-day expiry
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    });
    const saved = await this.repo.save(invite);

    if (dto.email) {
      const inviter = await this.users.findById(createdById);
      await this.mail.sendInvite(dto.email, inviter?.name ?? 'A friend', saved.token, dto.note ?? undefined);
    }

    return saved;
  }

  findAll(createdById: string): Promise<Invite[]> {
    return this.repo.find({
      where: { createdById },
      relations: ['usedBy'],
      order: { createdAt: 'DESC' },
    });
  }

  async validate(token: string): Promise<Invite> {
    const invite = await this.repo.findOne({ where: { token } });
    if (!invite) throw new NotFoundException('Invite not found');
    if (invite.usedById) throw new BadRequestException('Invite already used');
    if (invite.expiresAt && invite.expiresAt < new Date()) {
      throw new BadRequestException('Invite has expired');
    }
    return invite;
  }

  async tryValidate(token: string): Promise<Invite | null> {
    try {
      return await this.validate(token);
    } catch {
      return null;
    }
  }

  async markUsed(token: string, userId: string): Promise<void> {
    await this.repo.update({ token }, { usedById: userId });
  }

  async revoke(id: string, createdById: string): Promise<void> {
    const invite = await this.repo.findOne({ where: { id, createdById } });
    if (!invite) throw new NotFoundException('Invite not found');
    await this.repo.delete(id);
  }
}
