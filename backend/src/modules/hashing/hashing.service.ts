import { Injectable } from '@nestjs/common';
import { hash, compare } from 'bcrypt';

@Injectable()
export class HashingService {
  private readonly rounds = 10;

  public async hash(data: string | Buffer): Promise<string> {
    return hash(data, this.rounds);
  }

  public async compare(data: string | Buffer, hash: string): Promise<boolean> {
    return compare(data, hash);
  }
}
