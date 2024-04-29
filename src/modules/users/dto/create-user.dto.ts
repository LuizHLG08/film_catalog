import { ApiProperty } from "@nestjs/swagger";
import { hashSync } from "bcrypt";
import { Transform } from "class-transformer";
import { IsEmail, IsString, Matches, MinLength } from "class-validator";

export class CreateUserDto {
    @ApiProperty({
        description: 'Nome do usuário',
        example: 'Luiz',
    })
    @IsString()
    name: string;

    @ApiProperty({
        description: 'Email do usuário',
        example: 'email@email.com',
    })
    @IsEmail()
    email: string;

    @ApiProperty({
        description: 'Senha do usuário (Mínimo 4 caracteres, com letras maiúsculas, minúsculas e números)',
        example: 'MinhaSenha123',
    })
    @IsString()
    @MinLength(4)
    @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
        message: 'password too weak',
    })
    @Transform(({value}: {value:string}) => hashSync(value, 10), {groups: ['transform']})
    password: string;
}
