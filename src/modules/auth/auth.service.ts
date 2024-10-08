import { LoginFailException, SignUpFailException } from '@/exceptions'
import { User } from '@/modules/user/entities/user.entity'
import { UserService } from '@/modules/user/user.service'
import { Inject, Injectable } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { plainToInstance } from 'class-transformer'
import * as bcrypt from 'bcrypt'
import { AppConstant, RoleEnum } from '@/constants'
import {
  JwtStrategyDto,
  LoginResponseDto,
  UserLoginDto,
  UserSignUpDto,
} from './dto'
import { Logger } from 'winston'
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston'

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    @Inject(WINSTON_MODULE_NEST_PROVIDER)
    private readonly logger: Logger,
  ) {}

  async validateUser(username: string, password: string): Promise<User> {
    const user = await this.userService.findActive({ username })

    if (!user) {
      throw new LoginFailException()
    }

    const passwordValid = await bcrypt.compare(password, user.password)

    if (!passwordValid) {
      throw new LoginFailException()
    }

    return user
  }

  async signUp(data: UserSignUpDto): Promise<LoginResponseDto> {
    const existUser = await this.userService.findOneBy({
      username: data.username,
      email: data.email,
    })

    if (existUser) {
      throw new SignUpFailException()
    }

    const user: User = this.userService.createEntity({
      ...data,
      password: bcrypt.hashSync(
        data.password,
        bcrypt.genSaltSync(AppConstant.saltOrRounds),
      ),
      role: RoleEnum.NormalUser,
      createdBy: AppConstant.defaultUserId,
      updatedBy: AppConstant.defaultUserId,
    }) as User

    await this.userService.save(user)

    return this.generateToken(user)
  }

  async login(data: UserLoginDto): Promise<LoginResponseDto> {
    const { username, password } = data

    const user = await this.validateUser(username, password)

    this.logger.log('Login successful', {})

    return this.generateToken(user)
  }

  generateToken(user: User): LoginResponseDto {
    const payload: JwtStrategyDto = {
      username: user.username,
      sub: user.id,
      role: user.role,
      email: user.email,
    }
    const token = this.jwtService.sign(payload, {
      privateKey: 'secret',
      algorithm: 'HS256',
    })

    return plainToInstance(LoginResponseDto, {
      userId: user.id,
      token,
    })
  }
}
