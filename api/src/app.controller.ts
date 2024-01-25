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
import { isUrlKeyValid, isValidUrl } from './utils';
import { UrlItem } from './interfaces';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get(':key')
  @Redirect(undefined, 301)
  async redirect(@Param() params: { key: string }): Promise<any> {
    if (!isUrlKeyValid(params.key))
      throw new HttpException(
        'La clé transmise est incorrecte.',
        HttpStatus.BAD_REQUEST,
      );
    const url: string = await this.appService.getLongFromShortUrl(params.key);
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
