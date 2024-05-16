import { PartialOrderDto } from './dto/partial-order.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';
import { Order } from './entities/order.entity';
import { Item } from 'src/items/entities/item.entity';
import { Picture } from 'src/pictures/entities/picture.entity';
import { v4 as uuidv4 } from 'uuid';
import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { ConfigService } from '@nestjs/config';
import { OrderStatus } from 'src/types/order.types';
import { NotFoundException } from '@nestjs/common';
import { FirebaseService } from 'src/notification/firebase.service.utils';
import { createObjectCsvWriter } from 'csv-writer';
import * as path from 'path';

export class OrdersService {
  private readonly s3Client = new S3Client({
    region: this.configService.getOrThrow('AWS_S3_REGION'),
  });

  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Item)
    private readonly itemRepository: Repository<Item>,
    @InjectRepository(Picture)
    private readonly pictureRepository: Repository<Picture>,

    private readonly configService: ConfigService,
    private readonly firebaseService: FirebaseService,
  ) {}

  async create(createOrderDto: any, user_id: number, files: any) {
    try {
      // console.log('heeasda')
      const {
        delivery_date,
        project_name,
        delivery_address,
        order_type,
        note,
        items,
      } = createOrderDto;

      const find_user = await this.userRepository.findOne({
        where: {
          id: user_id,
        },
      });

      const create_order = this.orderRepository.create({
        delivery_address,
        delivery_date,
        project_name,
        order_type: 'single',
        note,
        status: OrderStatus.InProgress,
        user: find_user,
      });

      const new_order = await this.orderRepository.save(create_order);
      items.map(async (item, index) => {
        const create_item = this.itemRepository.create({
          name: item.name,
          description: item.description,
          quantity: item.quantity,
          order: new_order,
        });
        const saved_item = await this.itemRepository.save(create_item);
        // console.log(saved_item.id, 'itme created and saved');

        if (files[String(index)].length > 0) {
          const file_names = [];
          const file_promises = files[String(index)].map((file: any) => {
            let file_name = uuidv4() + '-' + file.fileName;
            file_names.push(file_name);
            console.log(file, 'baase');
            const buf = Buffer.from(file.base64, 'base64');
            // console.log(buf, 'dasdasds');
            return this.s3Client.send(
              new PutObjectCommand({
                Bucket: 'amsy-constructing',
                Key: file_name,
                Body: buf,
              }),
            );
          });

          console.log(file_names, 'name');

          const res = await Promise.all(file_promises);
          // console.log(res);
          if (res) {
            files[String(index)].map(async (item, index) => {
              // console.log(index, file_names[index])
              const create_pic = this.pictureRepository.create({
                file_uploaded_name: file_names[index],
                engineer_item: saved_item,
                original_name: 'name',
                url: process.env.AWS_URL + file_names[index],
              });
              // console.log(create_pic,'pic')
              const save_pic = await this.pictureRepository.save(create_pic);
              console.log(save_pic, index);
            });
          }
        }
      });

      return {
        success: true,
      };
    } catch (error) {
      console.log(error);
    }
  }

  async findAll() {
    return await this.orderRepository.find({
      relations: ['user'],
      order: {
        id: 'DESC',
      },
    });
  }

  async findOne(id: number) {
    // console.log('here');
    const res = await this.orderRepository.findOne({
      relations: [
        'items',
        'items.pictures',
        'user',
        'items.procurement_pictures',
      ],
      where: {
        id,
      },
    });

    // console.log(res.items[0], 'ressss');
    return res;
  }

  async findByUserId(user_id: number) {
    return await this.orderRepository.find({
      relations: ['user'],
      order: {
        id: 'DESC',
      },
      where: {
        user: {
          id: user_id,
        },
      },
    });
  }
  async updateOrder(id: number, updateOrderDto: PartialOrderDto) {
    try {
      await this.orderRepository.update(id, updateOrderDto);
      return {
        success: true,
        message: `Order with id ${id} updated successfully.`,
      };
    } catch (error) {
      console.error(`Error updating order with id ${id}:`, error);
      return {
        success: false,
        message: `Failed to update order with id ${id}.`,
      };
    }
  }

  async getOrderByStatus(dto: PartialOrderDto) {
    return await this.orderRepository.find({
      where: {
        status: dto.status,
      },
    });
  }

  async update(id: number, updateOrderDto: PartialOrderDto, user_id: string) {
    const find_order = await this.orderRepository.findOne({
      where: {
        id,
      },
    });
    if (!find_order) throw new NotFoundException('order not found');
    const update_order = await this.orderRepository.update(id, {
      ...updateOrderDto,
    });
    if (update_order) {
      console.log(updateOrderDto.status, 'sasa');
      if (updateOrderDto.status) {
        const find_user = await this.userRepository.findOne({
          where: {
            id: Number(user_id),
          },
        });
        console.log('afttter update');
        await this.firebaseService.sendNotification(
          [find_user.device_token],
          'Order Status',
          'Order has been updated to' + updateOrderDto.status,
        );
      }
      return await this.orderRepository.findOne({
        where: {
          id,
        },
      });
    }
  }

  remove(id: number) {
    return `This action removes a #${id} order`;
  }

  async createCSV(id: number) {
    const csvWriter = createObjectCsvWriter({
      path: '/utils/file.csv',
      header: [
        { id: 'name', title: 'NAME' },
        { id: 'lang', title: 'LANGUAGE' },
      ],
    });

    const records = [
      { name: 'Bob', lang: 'French, English' },
      { name: 'Mary', lang: 'English' },
    ];
    console.log('hereee');
    csvWriter
      .writeRecords(records)
      .then(() => {
        console.log('done');
      })
      .catch((err) => {
        console.log(err, 'in csv');
      });
  }

  async generateCsvFile(): Promise<string> {
    const orders = await this.orderRepository.find({
      relations: ['user', 'items'],
    });
    if (orders.length > 0) {
      let data = orders.map((order) => {
        return {
          delivery_date: order.delivery_date,
          project_name: order.project_name,
          order_type: order.order_type,
          status: order.status,
          note: order.note,
          procurement_note: order.procurement_note,
          unit_of_measure: order.unit_of_measure,
          expected_date: order.expected_date,
          createdAt: order.createdAt,
          updatedAt: order.updatedAt,
          user: order.user.name,
          items: order.items.map((item) => item.name).join(','),
        };
      });

      const file_path = path.join(__dirname, '../../', 'data.csv');
      const csvWriter = createObjectCsvWriter({
        path: file_path,
        header: Object.keys(data[0]).map((key) => ({ id: key, title: key })),
      });

      await csvWriter.writeRecords(data);

      return file_path;
    }
  }
}
