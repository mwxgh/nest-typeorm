import { ApiProperty } from '@nestjs/swagger'
import { Expose } from 'class-transformer'
import { RoleList, UserLockedList, BaseStatusList } from '@/constants'
import { User } from '../entities/user.entity'
import { AbstractDtoWithCU } from '@/shared/common/dto'

export class UserDto extends AbstractDtoWithCU {
  @Expose()
  @ApiProperty()
  username: string

  @Expose()
  @ApiProperty()
  name: string

  @Expose()
  @ApiProperty()
  email: string

  @Expose()
  @ApiProperty()
  role: string

  @Expose()
  @ApiProperty()
  isLocked: string

  @Expose()
  @ApiProperty()
  status: string

  @Expose()
  @ApiProperty()
  createdAt: Date

  @Expose()
  @ApiProperty()
  updatedAt: Date

  constructor(user: User) {
    super(user)

    this.username = user.username
    this.email = user.email
    this.name = user.firstName + ' ' + user.lastName
    this.role = RoleList[user.role]
    this.status = BaseStatusList[user.status]
    this.isLocked = UserLockedList[user.isLocked]
  }

  static toSimplifiedProfileDto(user: User): Partial<UserDto> {
    return {
      id: user.id,
      username: user.username,
      name: `${user.firstName} ${user.lastName}`,
      email: user.email,
      role: RoleList[user.role],
      isLocked: UserLockedList[user.isLocked],
      status: BaseStatusList[user.status],
    }
  }
}
