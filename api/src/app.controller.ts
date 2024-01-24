import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Redirect,
} from '@nestjs/common';
import { AppService } from './app.service';
import { isValidUrl, URL_KEY_LENGTH } from './utils';
import { UrlItem } from './interfaces';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get(':shortUrl')
  @Redirect(undefined, 301)
  async redirect(@Param() params: { shortUrl: string }): Promise<any> {
    if (params.shortUrl?.length != URL_KEY_LENGTH)
      throw new HttpException(
        'La clé transmise est incorrecte.',
        HttpStatus.BAD_REQUEST,
      );
    const url = await this.appService.getLongFromShortUrl(params.shortUrl);
    if (!url)
      throw new HttpException('La clé est introuvable.', HttpStatus.NOT_FOUND);
    return { url };
  }

  @Post('shorten')
  async shorten(@Body() data: { url: string }): Promise<UrlItem> {
    const { url } = data;
    if (!isValidUrl(url))
      throw new HttpException(
        "L'URL transmis est incorrecte.",
        HttpStatus.BAD_REQUEST,
      );
    return await this.appService.shortenUrl(url);
  }
}
