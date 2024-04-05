import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Item } from '../../items/entities/item.entity';

@Entity()
export class Order {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  delivery_date: Date;

  @Column()
  project_name: string;

  @Column()
  delivery_address: string;

  @Column()
  order_type: string;

  @Column({ type: 'enum', enum: ['confirmed', 'pending'] })
  status: string;

  @Column({ nullable: true })
  note: string;

  @ManyToOne(() => User, user => user.orders)
  user: User;

  @OneToMany(() => Item, item => item.order)
  items: Item[];
}
