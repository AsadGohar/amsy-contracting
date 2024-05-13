import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn
} from 'typeorm';
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

  @Column({ nullable: true, default: 0 })
  price: number;

  @Column({ nullable: true })
  supplier_contact: string;

  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;

  @ManyToOne(() => Order, (order) => order.items, {
    nullable: true,
    onDelete: 'CASCADE',
  })
  order: Order;

  @OneToMany(() => Picture, (picture) => picture.engineer_item)
  pictures: Picture[];

  @OneToMany(() => Picture, (picture) => picture.procurement_item)
  procurement_pictures: Picture[];

  
}
