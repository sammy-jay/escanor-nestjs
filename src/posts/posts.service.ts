import { Injectable, NotFoundException, OnApplicationShutdown, OnModuleInit } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UpdatePostDto } from './dtos/update-post.dto';
import { CreatePostDto } from './dtos/create-post.dto';
import { PostNotFoundException } from './exceptions/post-not-found.exception';

@Injectable()
export class PostsService implements OnModuleInit, OnApplicationShutdown {
  constructor(private prismaService: PrismaService) {}
 
  onModuleInit(){
    console.log("Service init...")
  }
  onApplicationShutdown(signal: string) {
    console.log(signal); // e.g. "SIGINT"
  }

  async getAllPosts() {
    return await this.prismaService.post.findMany();
  }

  async getPostById(id: number) {
    const post = await this.prismaService.post.findUnique({
      where: { id },
    });
    if (post) return post;

    throw new PostNotFoundException(id);
  }

  async createPost(post: CreatePostDto) {
    const newPost = await this.prismaService.post.create({
      data: post,
    });
    return newPost;
  }

  async replacePost(id: number, post: UpdatePostDto) {
    const updatedPost = await this.prismaService.post.update({
      where: { id },
      data: {
        title: post.title,
        content: post.content,
      },
    });
    if (updatedPost) return updatedPost;

    throw new PostNotFoundException(id);
  }

  async deletePost(id: number) {
    const deletedPost = await this.prismaService.post.delete({
      where: { id },
    });
    if (deletedPost) return;

    throw new PostNotFoundException(id);
  }
}
