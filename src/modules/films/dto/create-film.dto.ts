import { IsNumber, IsString, MaxLength } from "class-validator";
import { CreateDateColumn } from "typeorm";

export class CreateFilmDto {

    @IsString()
    name: string;

    @IsNumber()
    year: number;

    @IsNumber()
    price: number;

    @IsString()
    @MaxLength(500)
    description: string;

    

}
