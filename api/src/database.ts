import { Injectable } from '@nestjs/common';
import { addRxPlugin, createRxDatabase } from 'rxdb';
import { getRxStorageMemory } from 'rxdb/plugins/storage-memory';
import { RxDatabase } from 'rxdb/dist/types/types';
import { RxDBMigrationPlugin } from 'rxdb/plugins/migration-schema';
import { RxDBJsonDumpPlugin } from 'rxdb/plugins/json-dump';
import { RxDBQueryBuilderPlugin } from 'rxdb/plugins/query-builder';
import { UrlItem } from './interfaces';

@Injectable()
export class Database {
  private db: RxDatabase;
  private numberOfUrls: number = 0;

  constructor() {
    this.initDb();
    process.on('SIGINT', async () => {
      if (this.db) await this.db.destroy();
      process.exit();
    });
  }

  private async initDb(): Promise<void> {
    addRxPlugin(RxDBMigrationPlugin);
    addRxPlugin(RxDBJsonDumpPlugin);
    addRxPlugin(RxDBQueryBuilderPlugin);
    this.db = await createRxDatabase({
      name: 'url_shortener',
      storage: getRxStorageMemory(),
      ignoreDuplicate: true,
    });

    const urlSchema = {
      title: 'url',
      version: 1,
      primaryKey: 'key',
      type: 'object',
      properties: {
        date: {
          type: 'number',
        },
        value: {
          type: 'string',
        },
        key: {
          type: 'string',
          maxLength: 8,
        },
      },
    };
    await this.db.addCollections({
      url: {
        schema: urlSchema,
      },
    });
  }

  async insertUrl(value: string, key: string): Promise<UrlItem> {
    this.numberOfUrls++;
    return (
      await this.db.url.insert({
        date: Date.now(),
        value,
        key,
      })
    )?._data;
  }

  async getUrlItemFromValue(value: string): Promise<UrlItem> {
    return (await this.db.url.findOne().where('value').eq(value).exec())?._data;
  }

  async getUrlItemFromKey(key: string): Promise<UrlItem> {
    return (await this.db.url.findOne().where('key').eq(key).exec())?._data;
  }

  async getUrlCollection(): Promise<UrlItem[]> {
    const urls = await this.db.url.exportJSON();
    return urls.docs.map((url) => ({
      date: url.date,
      value: url.value,
      key: url.key,
    }));
  }
}
