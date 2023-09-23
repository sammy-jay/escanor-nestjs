import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class CreatePostDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  title: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  content: string;

  @ApiProperty()
  @IsInt()
  @IsNotEmpty()
  userId: number;
}
