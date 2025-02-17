import {
  ArrayMinSize,
  IsArray,
  IsString,
  IsUUID,
  Matches,
  MaxLength,
  MinLength,
} from '@nestjs/class-validator';

export class CreateRegisterDto {
  @IsString()
  @MinLength(6, { message: 'Tên tài khoản phải có tối thiểu 8 ký tự' })
  @MaxLength(20, { message: 'Tên tài khoản chỉ có tối đa 28 ký tự' })
  username: string;

  @IsString()
  @MinLength(8, { message: 'Mật khẩu phải có tối thiểu 8 ký tự' })
  @MaxLength(28, { message: 'Mật khẩu chỉ có tối đa 28 ký tự' })
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message: 'Mật khẩu quá yếu',
  })
  password: string;

  @IsString()
  fullname: string;

  @IsArray()
  @IsUUID(undefined, { each: true })
  @ArrayMinSize(1)
  tags: string[];
}
