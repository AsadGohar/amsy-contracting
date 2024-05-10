import { Controller, Get, Post, Body } from '@nestjs/common';
import { AppService } from './app.service';
import admin from 'firebase-admin';
import { firebase_config } from './utils/firebase.util';

@Controller()
export class AppController {
  private readonly frebase_admin = admin.initializeApp({
    credential: admin.credential.cert(firebase_config),
  });

  constructor(private readonly appService: AppService) {}

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

      const message = {
        notification: {
          title,
          body,
        },
        tokens,
      };

      const send_notification = await this.frebase_admin
        .messaging()
        .sendEachForMulticast(message);
      if (send_notification) {
        return {
          message: 'Notification sent',
          data: message,
          error: false,
        };
      }
      return {
        message: 'Something went wrong from server side.',
        data: message,
        error: true,
      };
    } catch (error) {
      console.log(error);
    }
  }
}
