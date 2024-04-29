import { ApiProperty } from "@nestjs/swagger";

export class FilmsResponseDto {
    @ApiProperty({
        description: 'Nome do filme',
        example: 'Filme',
    })
    id: string;
    @ApiProperty({
        description: 'Nome do filme',
        example: 'Filme',
    })
    name: string;
    @ApiProperty({
        description: 'Nome do filme',
        example: 'Filme',
    })
    year: number;
    @ApiProperty({
        description: 'Nome do filme',
        example: 'Filme',
    })
    price: number;
    @ApiProperty({
        description: 'Nome do filme',
        example: 'Filme',
    })
    description: string;
    @ApiProperty({
        description: 'Nome do filme',
        example: 'Filme',
    })
    createdAt: string;
    @ApiProperty({
        description: 'Nome do filme',
        example: 'Filme',
    })
    updatedAt: string;
    @ApiProperty({
        description: 'Nome do filme',
        example: 'Filme',
    })
    ownerId?: string;

}