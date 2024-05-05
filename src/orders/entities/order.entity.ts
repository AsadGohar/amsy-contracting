import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Item } from '../../items/entities/item.entity';
import { OrderStatus } from 'src/types/order.types';
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

  @Column({ type: 'enum', enum: OrderStatus, default: OrderStatus.InProgress })
  status: string;

  @Column({ nullable: true })
  note: string;

  @Column({ nullable: true })
  unit_of_measure: string;

  @Column({ nullable: true })
  expected_date: Date;

  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;

  @ManyToOne(() => User, (user) => user.orders, { onDelete: 'CASCADE' })
  user: User;

  @OneToMany(() => Item, (item) => item.order)
  items: Item[];
}
