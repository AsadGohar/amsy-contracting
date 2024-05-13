import { Injectable } from '@nestjs/common';
import { CreateItemDto } from './dto/create-item.dto';
import { UpdateItemDto } from './dto/update-item.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Item } from './entities/item.entity';
import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { v4 as uuidv4 } from 'uuid';
import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { Picture } from 'src/pictures/entities/picture.entity';
@Injectable()
export class ItemsService {
  private readonly s3Client = new S3Client({
    region: this.configService.getOrThrow('AWS_S3_REGION'),
  });

  constructor(
    @InjectRepository(Item)
    private readonly itemRepository: Repository<Item>,
    @InjectRepository(Picture)
    private readonly picRepository: Repository<Picture>,
    private readonly configService: ConfigService,
  ) {}

  async create(
    createItemDto: CreateItemDto,
    files: Array<Express.Multer.File>,
  ) {
    const create_item = this.itemRepository.create({
      name: createItemDto.name,
      description: createItemDto.description,
      quantity: Number(createItemDto.quantity),
    });
    const new_item = await this.itemRepository.save(create_item);
    console.log('created item', new_item);

    if (files.length > 0) {
      const file_names = [];
      const file_promises = files.map((file: any) => {
        let file_name = uuidv4() + '-' + file.originalname;
        file_names.push(file_name);
        return this.s3Client.send(
          new PutObjectCommand({
            Bucket: 'amsy-constructing',
            Key: file_name,
            Body: file.buffer,
          }),
        );
      });

      await Promise.all(file_promises);

      for (let index = 0; index < files.length; index++) {
        const create_pic = this.picRepository.create({
          file_uploaded_name: file_names[index],
          engineer_item: new_item,
          original_name: files[index].filename,
          url:
            'https://amsy-constructing.s3.amazonaws.com/' + file_names[index],
        });
        await this.picRepository.save(create_pic);
      }
    }

    return { item_id: new_item.id, message: 'item created successfully' };
  }

  async findAll() {
    const items = await this.itemRepository.find({
      relations: ['order', 'pictures'],
    });
    return { items, message: 'found all items' };
  }

  async findOne(id: number) {
    const item = await this.itemRepository.findOne({
      relations: ['order', 'order.user', 'pictures', 'procurement_pictures'],
      where: { id },
    });
    if (!item) {
      throw new Error('item not found');
    }
    return { item, message: 'found item successfully' };
  }

  async update(id: number, updateItemDto: UpdateItemDto) {
    const item = await this.itemRepository.update(id, updateItemDto);
    if (item.affected > 0) {
      return { item, message: 'item updated successfully' };
    }
    return { message: 'failed to update item' };
  }

  async remove(id: number) {
    const result = await this.itemRepository.delete(id);
    if (result.affected === 0) {
      throw new Error('item not found');
    }
    return { message: 'item deleted successfully' };
  }

  async addProcurementPicsToItem(item_id: number, files: any, item_data: any) {
    try {
      const find_item = await this.itemRepository.findOne({
        where: {
          id: item_id,
        },
      });

      await this.picRepository.delete({
        procurement_item: {
          id: item_id
        }
      })

      if (files.length > 0) {
        const file_names = [];
        const file_promises = files.map((file: any) => {
          // console.log(file.fileName)
          let file_name = uuidv4();
          file_names.push(file_name);
          // console.log(file,'baase');
          const buf = Buffer.from(file.base64, 'base64');
          return this.s3Client.send(
            new PutObjectCommand({
              Bucket: 'amsy-constructing',
              Key: file_name,
              Body: buf,
            }),
          );
        });

        // console.log(file_names, 'name');

        const res = await Promise.all(file_promises);
        // console.log(res);
        if (res) {
          files.map(async (item, index) => {
            // console.log(index, file_names[index])
            const create_pic = this.picRepository.create({
              file_uploaded_name: file_names[index],
              procurement_item: find_item,
              original_name: 'name',
              url: process.env.AWS_URL + file_names[index],
            });
            // console.log(create_pic,'pic')
            const save_pic = await this.picRepository.save(create_pic);
            console.log(save_pic, index);
          });
        }
      }

      const find_item_again = await this.itemRepository.findOne({
        relations: ['procurement_pictures'],
        where: {
          id: item_id,
        },
      });

      console.log(find_item_again.procurement_pictures, 'dasas');

      const item = await this.itemRepository.update(item_id, item_data);
      if (item.affected == 0) return { message: 'failed to update item' };
      return {
        success: true,
        item: find_item_again,
      };
    } catch (error) {
      console.log(error);
    }
  }
}
