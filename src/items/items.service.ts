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

      const response = await Promise.all(file_promises);
      // console.log(response)
      if (response) {
        for (let index = 0; index < files.length; index++) {
          const create_pic = this.picRepository.create({
            file_uploaded_name: file_names[index],
            item: new_item,
            original_name: files[index].filename,
            url: 'https://amsy-constructing.s3.amazonaws.com/' + file_names[index]
          });
          await this.picRepository.save(create_pic);
        }
      }
      return { item_id: new_item.id };
    }
  }

  async findAll() {
    return await this.itemRepository.find();
  }

  async findOne(id: number) {
    return await this.itemRepository.findOne({
      where: {
        id,
      },
    });
  }

  async update(id: number, updateItemDto: UpdateItemDto) {
    return await this.itemRepository.update(id, {
      ...updateItemDto,
    });
  }

  async remove(id: number) {
    return await this.itemRepository.delete(id);
  }
}
