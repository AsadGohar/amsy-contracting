import { Injectable, UnauthorizedException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { PartialUserDto } from './dto/partial-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
    createUserDto.password = hashedPassword;
    let create_user = this.userRepository.create(createUserDto);
    const new_user = await this.userRepository.save(create_user);

    const payload = { user_id: new_user.id, email: new_user.email };
    const access_token = this.jwtService.sign(payload, {
      secret: process.env.JWT_SECRET,
      expiresIn: '1d',
    });

    return {
      message: 'signup successfull',
      access_token,
    };
  }

  async login(dto: PartialUserDto) {
    const { email, password } = dto;
    const user = await this.userRepository.findOne({
      relations: [],
      where: { email },
    });
    const passwordMatched = await bcrypt.compare(password, user.password);
    if (!passwordMatched) {
      throw new UnauthorizedException('Invalid Credentials');
    }
    const payload = {
      user_id: user.id,
      email: user.email,
      role: user.role,
    };
    const access_token = this.jwtService.sign(payload, {
      secret: process.env.JWT_SECRET,
      expiresIn: '1d',
    });
    return { user, access_token, message: 'login successfull' };
  }

  async findAll() {
    const find_all_users =  await this.userRepository.find();
    return {
      users: find_all_users,
      message:'find all users'
    }
  }

  async findOne(id: number) {
    const find_user = await this.userRepository.findOne({
      where: {
        id,
      },
    });
    return {
      user:find_user,
      message:'found user successfully'
    }
  }

  async update(id: number, updateUserDto: PartialUserDto) {
    const update_user = await this.userRepository.update(id, {
      ...updateUserDto,
    });
    return {
      user: update_user,
      message: 'updated user successfully',
    };
  }

  async remove(id: number) {
    await this.userRepository.delete(id);
    return {
      message: 'deleted user successfully',
    };
  }
}
