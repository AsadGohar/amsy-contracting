import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { getApps } from 'firebase-admin/app';
import admin from 'firebase-admin';
import { firebase_config } from 'src/utils/firebase.util';

@Injectable()
export class FirebaseService {
  private readonly frebase_admin =
    getApps().length == 0 ? admin.initializeApp(firebase_config) : null;

  constructor() {}

  async sendNotification(tokens: string[], title: string, body: string) {
    try {
      const message = {
        notification: {
          title,
          body,
        },
        tokens,
      };
      if (this.frebase_admin) {
        const send_notification = await this.frebase_admin
          .messaging()
          .sendEachForMulticast(message);
        console.log(send_notification, 'nooot')
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
      }
    } catch (error) {
      throw new InternalServerErrorException(
        error.message || 'failed to create user',
      );
    }
  }
}
