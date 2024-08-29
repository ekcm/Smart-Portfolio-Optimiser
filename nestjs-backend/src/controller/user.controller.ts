import { Controller, Get, Post, Put, Delete, Body, Param } from '@nestjs/common';
import { UserService } from '../service/user.service';
import { UserDto } from '../dto/user.dto';
import { User } from '../model/user.model';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('User Service')
@Controller('user')
export class UserController {
    constructor(private readonly userService: UserService) {}

    @Get()
    async getAll(): Promise<User[]> {
        return await this.userService.getAll();
    }

    @Get(':id')
    async getById(@Param('id') id: string): Promise<User> {
        return await this.userService.getById(id);
    }

    @Post()
    async create(@Body() userDto: UserDto): Promise<User> {
        return await this.userService.create(userDto);
    }

    @Put(':id')
    async update(@Param('id') id: string, @Body() userDto: UserDto): Promise<User> {
        return await this.userService.update(id, userDto);
    }

    @Delete(':id')
    async delete(@Param('id') id: string): Promise<void> {
        await this.userService.delete(id);
    }
}