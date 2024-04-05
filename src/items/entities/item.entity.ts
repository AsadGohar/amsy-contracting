import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from 'typeorm';
import { Order } from '../../orders/entities/order.entity';
import { Picture } from '../../pictures/entities/picture.entity';

@Entity()
export class Item {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  description: string;

  @Column()
  quantity: number;

  @Column()
  quotation_date: Date;

  @Column({ nullable: true })
  payment_date: Date;

  @Column({ nullable: true })
  purchase_date: Date;

  @Column({ nullable: true })
  in_route_date: Date;

  @Column()
  supplier_name: string;

  @Column()
  price_category: string;

  @Column()
  supplier_contact: string;

  @ManyToOne(() => Order, order => order.items)
  order: Order;

  @OneToMany(() => Picture, picture => picture.item)
  pictures: Picture[];
}
