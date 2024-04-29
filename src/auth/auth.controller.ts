import { Controller, HttpCode, HttpStatus, Post, Request, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { AuthRequest } from './models/auth.request';
import { IsPublic } from './decorators/is-public.decorator';
import { ApiBody, ApiResponse, ApiTags } from '@nestjs/swagger';
import { LoginRequestBody } from './models/login-request-body';

@ApiTags('login')
@Controller()
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @IsPublic()
    @Post('login')
    @HttpCode(HttpStatus.OK)
    @UseGuards(LocalAuthGuard)
    @ApiBody({
        type: LoginRequestBody
    })
    @ApiResponse({
        status: HttpStatus.OK,
        schema: {
            type: 'object',
            properties: {
                accessToken: {
                    type: 'string',
                    example: 'userToken3021820564567567753',
                    description: 'User token'
                }
            }
        }
    })
    @ApiResponse({
        status: HttpStatus.UNAUTHORIZED,
        description: 'Email or password is incorrect.'
    })
    @ApiResponse({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        description: 'Internal server error.'
    })
    login(@Request() req : AuthRequest) {
        return this.authService.login(req.user)
    }
}
