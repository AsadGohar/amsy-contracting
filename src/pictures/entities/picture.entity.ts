import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Item } from '../../items/entities/item.entity';

@Entity()
export class Picture {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  file_uploaded_name: string;

  @Column({ nullable: true })
  original_name: string;

  @Column()
  url: string;

  @ManyToOne(() => Item, (item) => item.pictures, { onDelete: 'CASCADE' })
  item: Item;
}
