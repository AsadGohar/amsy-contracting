import { Controller, Get, Post, Body } from '@nestjs/common';
import { AppService } from './app.service';
import { FirebaseService } from './notification/firebase.service.utils';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly firebaseService: FirebaseService,
  ) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Post('/request')
  async create(
    @Body('tokens') tokens: string[],
    @Body('title') title: string,
    @Body('body') body: string,
  ) {
    try {
      if (!tokens || !title || !body) {
        return {
          message: 'Missing Required Fields',
        };
      }

      return await this.firebaseService.sendNotification(tokens, title, body)
    } catch (error) {
      console.log(error);
    }
  }
}
