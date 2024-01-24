import { Injectable } from '@nestjs/common';
import { Database } from './database';
import { generateUrlKey } from './utils';
import { UrlItem } from './interfaces';

@Injectable()
export class AppService {
  constructor(private database: Database) {}
  async getLongFromShortUrl(key: string): Promise<string | null> {
    const result = await this.database.getUrlItemFromKey(key);
    return !!result ? result.value : null;
  }

  async shortenUrl(longUrl: string): Promise<UrlItem> {
    const existingUrl = await this.database.getUrlItemFromValue(longUrl);
    if (existingUrl) return existingUrl;
    let isNewKeyExists: boolean = true;
    let newKey: string | null = null;
    while (isNewKeyExists) {
      newKey = generateUrlKey();
      isNewKeyExists = !!(await this.database.getUrlItemFromKey(newKey));
    }
    return await this.database.insertUrl(longUrl, newKey as string);
  }
}
