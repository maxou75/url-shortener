import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { Database } from './database';
import * as request from 'supertest';
import { UrlItem } from 'app/src/interfaces';

describe('AppController', () => {
  let app: any;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [AppService, Database],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  const validData1 = { url: 'https://github.com/nick-keller/url-shortener' };
  const validData2 = {
    url: 'https://stoikio.notion.site/URL-Shortener-27660127622d489db8dd53b8fc93df6c',
  };
  const invalidData1 = { toto: 'https://github.com/nick-keller/url-shortener' };
  const invalidData2 = { url: 'httpsgithub.com/nick-keller/url-shortener' };
  let resultData1: UrlItem;
  let resultData2: UrlItem;

  describe('Post shorten url', () => {
    it('should return error for invalid data 1', () => {
      return request(app.getHttpServer())
        .post('/shorten')
        .send(invalidData1)
        .expect(400);
    });

    it('should return shorten url item', () => {
      return request(app.getHttpServer())
        .post('/shorten')
        .send(invalidData2)
        .expect(400);
    });

    it('should return shorten url item for valid data', () => {
      return request(app.getHttpServer())
        .post('/shorten')
        .send(validData1)
        .expect(201)
        .expect(({ body }) => {
          resultData1 = body;
          ['date', 'key', 'value'].forEach((p: string) => {
            expect(resultData1).toHaveProperty(p);
          });
        });
    });

    it('should return new shorten url item for an other url', () => {
      return request(app.getHttpServer())
        .post('/shorten')
        .send(validData2)
        .expect(201)
        .expect(({ body }) => {
          resultData2 = body;
          ['date', 'key', 'value'].forEach((p: string) => {
            expect(resultData1).toHaveProperty(p);
          });
          expect(body.key).not.toBe(resultData1.key);
        });
    });

    it('should return the same shorten url item for the same url', () => {
      return request(app.getHttpServer())
        .post('/shorten')
        .send(validData1)
        .expect(201)
        .expect(({ body }) => {
          ['date', 'key', 'value'].forEach((p: string) => {
            expect(resultData1).toHaveProperty(p);
          });
          expect(body.key).toBe(resultData1.key);
        });
    });
  });

  describe('Get short url', () => {
    const invalidKey = 'toto';
    const keyNotFound = '708cbbc4';

    it('should return error if key is invalid', () => {
      return request(app.getHttpServer()).get(`/${invalidKey}`).expect(400);
    });

    it('should not redirect with key is not found', () => {
      return request(app.getHttpServer()).get(`/${keyNotFound}`).expect(404);
    });

    it('should redirect if key is found for url 1', () => {
      return request(app.getHttpServer())
        .get(`/${resultData1.key}`)
        .expect(301)
        .expect(({ header }) => {
          expect(header.location).toBe(validData1.url);
        });
    });

    it('should redirect if key is found for url 2', () => {
      return request(app.getHttpServer())
        .get(`/${resultData2.key}`)
        .expect(301)
        .expect(({ header }) => {
          expect(header.location).toBe(validData2.url);
        });
    });
  });
});
