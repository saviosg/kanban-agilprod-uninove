import {
  PipeTransform,
  Injectable,
  ArgumentMetadata,
  BadRequestException,
} from '@nestjs/common';
import { ZodTypeAny } from 'zod';

@Injectable()
export class ZodValidationPipe implements PipeTransform {
  constructor(private readonly schema: ZodTypeAny) {}

  async transform(data: any, metadata: ArgumentMetadata) {
    const validation = await this.schema.safeParseAsync(data);
    if (!validation.success) {
      throw new BadRequestException(validation.error);
    }
    return data;
  }
}
