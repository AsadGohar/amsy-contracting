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

  @Column({ nullable: true })
  quotation_date: Date;

  @Column({ nullable: true })
  payment_date: Date;

  @Column({ nullable: true })
  purchase_date: Date;

  @Column({ nullable: true })
  in_route_date: Date;

  @Column({ nullable: true })
  supplier_name: string;

  @Column({ nullable: true })
  price_category: string;

  @Column({ nullable: true })
  supplier_contact: string;

  @ManyToOne(() => Order, order => order.items, { nullable: true})
  order: Order;

  @OneToMany(() => Picture, picture => picture.item)
  pictures: Picture[];
}
