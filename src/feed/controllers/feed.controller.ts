import { Body, Controller, Delete, Get, Param, Post, Put, Query, Request, UseGuards } from '@nestjs/common';
import { FeedService } from '../services/feed.service';
import { FeedPost } from '../models/post.interface';
import { Observable } from 'rxjs';
import { DeleteResult, UpdateResult } from 'typeorm';
import { AuthenticatedGuard, RolesGuard } from 'src/auth/guards';
import { Roles } from 'src/auth/decorator/roles.decorator';
import { Role } from 'src/auth/models/role.enum';
import { IsCreatorGuard } from '../guards/is-creator.guard';

@Roles(Role.ADMIN, Role.PREMIUM, Role.USER)
@UseGuards(AuthenticatedGuard, RolesGuard)
@Controller('feed')
export class FeedController {
    
    constructor(private feedService: FeedService){}

    @Post()
    create(@Request() req, @Body() feedPost: FeedPost): Observable<FeedPost>{
        return this.feedService.createPost(req.user, feedPost);
    }

    // @Get()
    // findAll(): Observable<FeedPost[]>{
    //     return this.feedService.findAllPosts();
    // }

    @Get()
    findSelected(@Query('take') take: number = 1, @Query('skip') skip: number = 0): Observable<FeedPost[]>{
        take = take > 20 ? 20 : take;
        return this.feedService.findPosts(take, skip);
    }

    @UseGuards(IsCreatorGuard)
    @Put(':id')
    update(
        @Param('id') id: number,
        @Body() feedPost: FeedPost
        ): Observable<UpdateResult>{
        return this.feedService.updatePost(id, feedPost);
    }

    @UseGuards(IsCreatorGuard)
    @Delete(':id')
    deletePost(
        @Param('id') id: number
        ): Observable<DeleteResult>{
        return this.feedService.deletePost(id);
    }


}
