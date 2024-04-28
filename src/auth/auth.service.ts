import { Injectable } from '@nestjs/common';
import { UsersService } from 'src/modules/users/users.service';
import * as bcrypt from 'bcrypt';
import { Users } from 'src/modules/users/entities/users.entity';
import { UserPayload } from './models/user-payload';
import { JwtService } from '@nestjs/jwt';
import { UserToken } from './models/user-token';

@Injectable()
export class AuthService {

    constructor(
        private readonly userService: UsersService,
        private readonly jwtService: JwtService
    ) {}

    login(users: Users) : UserToken {
        const payload : UserPayload = {
            sub: users.id,
            email: users.email,
            name: users.name
        }

        const jwtToken = this.jwtService.sign(payload)

        return {
            accessToken: jwtToken
        }
    }


    async validateUser(email: string, password: string) {
        const user = await this.userService.findByEmail(email)

        if(user) {
            const isPasswordValid = await bcrypt.compare(password, user.password)

            if(isPasswordValid) {
                return {
                    ...user,
                    password: undefined,
                }
            }
        }
        throw new Error('Email or password is incorrect.');
    }
}
