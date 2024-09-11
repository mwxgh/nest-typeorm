import { BaseStatusEnum, EntityConstant } from '@/constants'
import { EnumField, StringField } from '@/shared/decorators'

export class CreateTagDto {
  @StringField({ maxLength: EntityConstant.EntityNameLength })
  readonly name: string

  @EnumField(() => BaseStatusEnum)
  readonly status: BaseStatusEnum
}
