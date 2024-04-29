import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsString } from "class-validator";

export class LoginRequestBody {
    @ApiProperty({
        description: 'Email do usuário',
        example: 'email@email.com',
    })
    @IsEmail()
    email: string;


    @ApiProperty({
        description: 'Senha do usuário',
        example: 'MinhaSenha123',
    })
    @IsString()
    password: string;
}