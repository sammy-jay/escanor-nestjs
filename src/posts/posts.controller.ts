import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Patch,
  Delete,
  HttpCode,
  Req,
  Res,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import { HttpStatus } from '@nestjs/common/enums';
import { CreatePostDto } from './dtos/create-post.dto';
import { UpdatePostDto } from './dtos/update-post.dto';
import { PostsService } from './posts.service';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';
import { ApiTags, ApiResponse } from '@nestjs/swagger';

@ApiTags('Posts')
@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Get()
  getAllPosts() {
    return this.postsService.getAllPosts();
  }

  @Get(':id')
  getPostById(@Param('id', ParseIntPipe) id: number) {
    return this.postsService.getPostById(Number(id));
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  @ApiResponse({
    status: 201,
    description: 'The post has been successfully created.',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  createPost(@Body() createPostData: CreatePostDto) {
    return this.postsService.createPost(createPostData);
  }

  @UseGuards(JwtAuthGuard)
  @Patch()
  replacePost(
    @Param('id', ParseIntPipe) id: number,
    @Body() updatePostData: UpdatePostDto,
  ) {
    return this.postsService.replacePost(Number(id), updatePostData);
  }

  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete()
  deletePost(@Param('id', ParseIntPipe) id: number) {
    return this.postsService.deletePost(Number(id));
  }
}
