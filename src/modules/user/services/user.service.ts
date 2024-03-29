import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { User } from '../entities/user.entity'
import { FindOptionsWhere, Repository, SelectQueryBuilder } from 'typeorm'
import {
  AppConstant,
  Direction,
  UserLockedEnum,
  UserStatusEnum,
} from '@/constants'
import { AbstractService } from '@/shared/services/abstract.service'
import {
  CreateUserDto,
  UpdateUserDto,
  UserDto,
  UsersPageOptionsDto,
} from '../dto'
import { PageDto } from '@/shared/common/dto'
import * as bcrypt from 'bcrypt'

@Injectable()
export class UserService extends AbstractService<User> {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {
    super(userRepository)
  }

  async createUser({ userId, body }: { userId: number; body: CreateUserDto }) {
    const existUser = await this.existsBy({
      username: body.username,
    })

    if (existUser) {
      throw new ConflictException('ID exist in system')
    }

    await this.save({
      ...body,
      password: bcrypt.hashSync(
        AppConstant.defaultPassword,
        bcrypt.genSaltSync(AppConstant.saltOrRounds),
      ),
      createdBy: userId,
      updatedBy: userId,
    })
  }

  async findUserActive(
    conditions: FindOptionsWhere<User>,
  ): Promise<User | null> {
    return await this.findOneBy({
      ...conditions,
      isLocked: UserLockedEnum.Unlocked,
      status: UserStatusEnum.Active,
    })
  }

  async findUserById(id: number): Promise<User> {
    const user = await this.findOneBy({ id })

    if (!user) {
      throw new NotFoundException(`User not found by id ${id}`)
    }

    return user
  }

  private buildQueryList(
    pageOptionsDto: UsersPageOptionsDto,
  ): SelectQueryBuilder<User> {
    const { role, email } = pageOptionsDto

    const queryBuilder: SelectQueryBuilder<User> =
      this.userRepository.createQueryBuilder('user')

    if (role) queryBuilder.where({ role })
    if (email) queryBuilder.andWhere({ email })

    return queryBuilder.orderBy('user.createdAt', Direction.DESC)
  }

  async getUsersPaginate(
    pageOptionsDto: UsersPageOptionsDto,
  ): Promise<PageDto<UserDto>> {
    const queryBuilder: SelectQueryBuilder<User> =
      this.buildQueryList(pageOptionsDto)

    const [users, pageMeta] = await queryBuilder.paginate(pageOptionsDto)

    return users.toPageDto(pageMeta)
  }

  async getUserById(id: number): Promise<UserDto> {
    return (await this.findUserById(id)).toDto()
  }

  async updateUserById({
    id,
    userId,
    body,
  }: {
    id: number
    userId: number
    body: UpdateUserDto
  }): Promise<void> {
    const user = await this.findUserById(id)

    await this.updateBy(user.id, { ...body, updatedBy: userId })
  }

  async deleteUserById({ id }: { id: number }): Promise<void> {
    const user = await this.findUserById(id)

    await this.softDelete(user.id)
  }
}
