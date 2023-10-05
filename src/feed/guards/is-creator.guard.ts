import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Observable, map } from 'rxjs';
import { FeedService } from '../services/feed.service';
import { User } from './../../auth/models/user.interface';
import { FeedPost } from '../models/post.interface';

@Injectable()
export class IsCreatorGuard implements CanActivate {
  
  constructor(
    private feedService: FeedService
    ) {}
  

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {

    const { user, params }: {user: User, params : { id: number }}  =  context.switchToHttp().getRequest();

    if (!user || !params) return false;
    if (user.role === 'admin') return true;
    
    
    const userId = user.id;
    const feedId = params.id;

    // Check if logged-in user is the same as the user creator post
    return this.feedService.findPostById(feedId).pipe(
      map((feedPost: FeedPost) => {
          return feedPost.author.id === userId
      })
    )

  }
}
