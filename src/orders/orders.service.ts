import { Injectable } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { PartialOrderDto } from './dto/partial-order.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { In, Repository } from 'typeorm';
import { Order } from './entities/order.entity';
import { Item } from 'src/items/entities/item.entity';
import { Picture } from 'src/pictures/entities/picture.entity';
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Item)
    private readonly itemRepository: Repository<Item>,
    @InjectRepository(Picture)
    private readonly pictureRepository: Repository<Picture>,
  ) {}

  async create(createOrderDto: CreateOrderDto, user_id: number) {
    const {
      delivery_date,
      project_name,
      delivery_address,
      order_type,
      note,
      item_ids,
    } = createOrderDto;

    console.log(
      delivery_date,
      project_name,
      delivery_address,
      order_type,
      note,
    );

    const find_user = await this.userRepository.findOne({
      where: {
        id: user_id,
      },
    });

    const create_order = this.orderRepository.create({
      delivery_address,
      delivery_date,
      project_name,
      order_type,
      note,
      user: find_user,
    });

    const new_order = await this.orderRepository.save(create_order);

    await this.itemRepository
      .createQueryBuilder()
      .update(Item)
      .set({ order: new_order })
      .whereInIds(item_ids)
      .execute();

    return {
      success: true,
    };
  }

  async findAll() {
    return await this.orderRepository.find();
  }

  async findOne(id: number) {
    return await this.orderRepository.findOne({
      relations: ['items'],
      where: {
        id,
      },
    });
  }

  async findByUserId(user_id: number) {
    return await this.orderRepository.find({
      relations: ['user'],
      where: {
        user: {
          id: user_id,
        },
      },
    });
  }

  async getOrderByStatus(dto: PartialOrderDto) {
    return await this.orderRepository.find({
      where: {
        status: dto.status,
      },
    });
  }

 async update(id: number, updateOrderDto: PartialOrderDto) {
    return await this.orderRepository.update(id,{
      ...updateOrderDto
    })
  }

  remove(id: number) {
    return `This action removes a #${id} order`;
  }
}
