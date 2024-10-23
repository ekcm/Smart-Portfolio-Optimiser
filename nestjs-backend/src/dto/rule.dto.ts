import { IsNotEmpty, IsString, IsNumber } from 'class-validator';

export class RuleDto {
    @IsNotEmpty()
    @IsString()
    type: string;

    @IsNotEmpty()
    @IsString()
    direction: string;

    @IsNotEmpty()
    @IsNumber()
    threshold: number;

    @IsNotEmpty()
    @IsString()
    name: string;

    @IsNotEmpty()
    @IsString()
    description: string;
}