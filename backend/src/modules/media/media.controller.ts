import {
  Controller, Post, Body, UseGuards, ServiceUnavailableException,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@ApiTags('media')
@Controller('media')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class MediaController {
  constructor(private config: ConfigService) {}

  @Post('presign')
  @ApiOperation({ summary: 'Get presigned URL for direct upload to object storage' })
  async presign(
    @CurrentUser('id') userId: string,
    @Body() body: { filename: string; contentType: string },
  ) {
    const endpoint  = this.config.get<string>('s3.endpoint');
    const accessKey = this.config.get<string>('s3.accessKey');
    const secretKey = this.config.get<string>('s3.secretKey');
    const bucket    = this.config.get<string>('s3.bucket');
    const publicUrl = this.config.get<string>('s3.publicUrl');

    if (!endpoint || !accessKey || !secretKey || !bucket || !publicUrl) {
      throw new ServiceUnavailableException('Object storage is not configured');
    }

    const ext = body.filename.split('.').pop() ?? 'bin';
    const key = `users/${userId}/${Date.now()}.${ext}`;

    const client = new S3Client({
      endpoint,
      region: 'auto',
      credentials: { accessKeyId: accessKey, secretAccessKey: secretKey },
      forcePathStyle: true,
    });

    const command = new PutObjectCommand({
      Bucket: bucket,
      Key: key,
      ContentType: body.contentType,
    });

    const uploadUrl = await getSignedUrl(client, command, { expiresIn: 300 });
    const fileUrl = `${publicUrl}/${key}`;

    return { uploadUrl, fileUrl };
  }
}
