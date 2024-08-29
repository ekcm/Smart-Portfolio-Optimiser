import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UserDto } from '../dto/user.dto';
import { User } from '../model/user.model';

@Injectable()
export class UserService {
    constructor(@InjectModel(User.name) private userModel: Model<User>) { }

    async getAll(): Promise<User[]> {
        return new Promise((resolve) => {
            setTimeout(async () => {
                const users = await this.userModel.find().exec();
                resolve(users);
            }, 1000);
        });
    }

    async getById(id: string): Promise<User> {
        return new Promise((resolve) => {
            setTimeout(async () => {
                const user = await this.userModel.findById(id).exec();
                resolve(user);
            }, 1000);
        });
    }

    async create(userDto: UserDto): Promise<User> {
        return new Promise((resolve) => {
            setTimeout(async () => {
                const createdUser = new this.userModel(userDto);
                resolve(await createdUser.save());
            }, 1000);
        });
    }

    async update(id: string, userDto: UserDto): Promise<User> {
        return new Promise((resolve, reject) => {
            setTimeout(async () => {
                const existingUser = await this.userModel.findByIdAndUpdate(
                    id,
                    userDto,
                    { new: true }
                );
                if (!existingUser) {
                    reject(new NotFoundException(`${id} does not exist`));
                } else {
                    resolve(existingUser);
                }
            }, 1000);
        });
    }

    async delete(id: string): Promise<void> {
        return new Promise((resolve, reject) => {
            setTimeout(async () => {
                const user = await this.userModel.findByIdAndDelete(id);
                if (!user) {
                    reject(new NotFoundException(`${id} does not exist`));
                } else {
                    resolve();
                }
            }, 1000);
        });
    }
}