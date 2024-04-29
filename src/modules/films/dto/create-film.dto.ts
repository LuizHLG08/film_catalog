import { ApiProperty } from "@nestjs/swagger";
import { IsNumber, IsString, MaxLength } from "class-validator";
export class CreateFilmDto {

    @ApiProperty({
        description: 'Nome do filme',
        example: 'Filme',
    })
    @IsString()
    name: string;

    @ApiProperty({
        description: 'Ano do filme',
        example: 2012,
    })
    @IsNumber()
    year: number;

    @ApiProperty({
        description: 'Preço do filme',
        example: 20,
    })
    @IsNumber()
    price: number;

    @ApiProperty({
        description: 'Descrição do filme',
        example: 'Este é um bom filme',
    })
    @IsString()
    @MaxLength(500)
    description: string;

}
