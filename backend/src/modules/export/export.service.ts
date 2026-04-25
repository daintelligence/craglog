import { Injectable, BadRequestException, Logger } from '@nestjs/common';
import { AscentsService } from '../ascents/ascents.service';
import * as path from 'path';
import * as fs from 'fs';

type ExportFormat = 'dlog' | 'rci' | 'csv' | 'json';

interface ExportSchema {
  format: string;
  fields: Array<{
    target: string;
    source: string;
    required: boolean;
    fallback?: string;
    transform?: string;
    default?: string;
  }>;
  transforms?: Record<string, any>;
  validation: {
    requiredFields: string[];
    dateFormat: string;
  };
}

@Injectable()
export class ExportService {
  private readonly logger = new Logger(ExportService.name);
  private schemas: Record<string, ExportSchema> = {};

  constructor(private ascentsService: AscentsService) {
    this.schemas = this.loadSchemas();
  }

  private loadSchemas(): Record<string, ExportSchema> {
    const result: Record<string, ExportSchema> = {};
    for (const name of ['dlog', 'rci']) {
      try {
        const candidates = [
          path.join(__dirname, 'schemas', `${name}.schema.json`),
          path.join(process.cwd(), 'src', 'modules', 'export', 'schemas', `${name}.schema.json`),
        ];
        for (const p of candidates) {
          if (fs.existsSync(p)) {
            result[name] = JSON.parse(fs.readFileSync(p, 'utf-8'));
            break;
          }
        }
      } catch (e) {
        this.logger.warn(`Could not load ${name} schema`);
      }
    }
    return result;
  }

  async export(
    userId: string,
    format: ExportFormat,
    startDate?: string,
    endDate?: string,
  ): Promise<{ content: string; filename: string; mimeType: string }> {
    const ascents = await this.ascentsService.getForExport(userId, startDate, endDate);

    if (!ascents.length) {
      throw new BadRequestException('No ascents found for the selected date range');
    }

    switch (format) {
      case 'dlog': return this.renderCsv(ascents, 'dlog');
      case 'rci':  return this.renderCsv(ascents, 'rci');
      case 'csv':  return this.renderRawCsv(ascents);
      case 'json': return this.renderJson(ascents);
      default:     throw new BadRequestException(`Unsupported format: ${format}`);
    }
  }

  private renderCsv(ascents: any[], schemaKey: string) {
    const schema = this.schemas[schemaKey];
    const rows = ascents.map((a) => this.mapRow(a, schema));
    this.validateRows(rows, schema);

    const headers = schema.fields.map((f) => f.target);
    const lines = [
      headers.join(','),
      ...rows.map((row) => headers.map((h) => this.csvCell(row[h] ?? '')).join(',')),
    ];

    const date = new Date().toISOString().slice(0, 10);
    return {
      content: lines.join('\n'),
      filename: `craglog-${schemaKey}-${date}.csv`,
      mimeType: 'text/csv',
    };
  }

  private mapRow(ascent: any, schema: ExportSchema): Record<string, string> {
    const row: Record<string, string> = {};

    for (const field of schema.fields) {
      let value = this.resolvePath(ascent, field.source);

      if (value === undefined || value === null) {
        if (field.fallback) value = this.resolvePath(ascent, field.fallback);
        if (value === undefined || value === null) value = field.default || '';
      }

      if (field.transform && value) {
        value = this.applyTransform(String(value), field.transform, schema.transforms);
      }

      if (field.target === 'Date' && value) {
        value = this.formatDate(String(value), schema.validation.dateFormat);
      }

      row[field.target] = value != null ? String(value) : '';
    }

    return row;
  }

  private resolvePath(obj: any, path: string): any {
    return path.split('.').reduce((acc, key) => acc?.[key], obj);
  }

  private applyTransform(value: string, transform: string, transforms?: Record<string, any>): string {
    if (transform === 'capitalize') {
      return value.charAt(0).toUpperCase() + value.slice(1);
    }
    if (transforms?.[transform]) {
      const map = transforms[transform];
      return map[value] || value;
    }
    return value;
  }

  private formatDate(date: string, format: string): string {
    try {
      const d = new Date(date);
      if (format === 'DD/MM/YYYY') {
        return d.toLocaleDateString('en-GB');
      }
      return date;
    } catch {
      return date;
    }
  }

  private validateRows(rows: Record<string, string>[], schema: ExportSchema): void {
    const required = schema.validation.requiredFields;
    const invalids = rows.filter((r) => required.some((f) => !r[f]));
    if (invalids.length) {
      throw new BadRequestException(
        `${invalids.length} ascents are missing required fields for ${schema.format} export`,
      );
    }
  }

  private renderRawCsv(ascents: any[]) {
    const headers = ['Date', 'Crag', 'Region', 'Buttress', 'Route', 'Grade', 'GradeSystem', 'ClimbingType', 'AscentType', 'Partner', 'StarRating', 'Attempts', 'Conditions', 'Notes'];
    const rows = ascents.map((a) => [
      a.date,
      a.crag?.name || '',
      a.crag?.region?.name || '',
      a.route?.buttress?.name || '',
      a.route?.name || '',
      a.route?.grade || '',
      a.route?.gradeSystem || '',
      a.route?.climbingType || '',
      a.ascentType,
      a.partner || '',
      a.starRating || '',
      a.attempts || 1,
      a.conditions || '',
      a.notes || '',
    ]);

    const lines = [headers.join(','), ...rows.map((r) => r.map((v) => this.csvCell(v)).join(','))];
    const date = new Date().toISOString().slice(0, 10);
    return { content: lines.join('\n'), filename: `craglog-export-${date}.csv`, mimeType: 'text/csv' };
  }

  private renderJson(ascents: any[]) {
    const date = new Date().toISOString().slice(0, 10);
    return {
      content: JSON.stringify({ exported: date, count: ascents.length, ascents }, null, 2),
      filename: `craglog-export-${date}.json`,
      mimeType: 'application/json',
    };
  }

  private csvCell(value: any): string {
    const str = String(value ?? '');
    if (str.includes(',') || str.includes('"') || str.includes('\n')) {
      return `"${str.replace(/"/g, '""')}"`;
    }
    return str;
  }
}
