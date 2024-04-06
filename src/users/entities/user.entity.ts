import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Order } from '../../orders/entities/order.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  email: string;

  @Column()
  password: string;

  @Column()
  phone_number: string;

  @Column()
  location: string;

  @Column({ nullable: true })
  profile_picture_url: string;

  @Column({ type: 'enum', enum: ['procurement', 'engineer'] })
  role: string;

  @OneToMany(() => Order, order => order.user)
  orders: Order[];
}
