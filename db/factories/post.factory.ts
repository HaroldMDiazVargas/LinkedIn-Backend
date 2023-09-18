import { FeedPostEntity } from "../../src/feed/models/post.entity";
import { setSeederFactory } from "typeorm-extension";

export default setSeederFactory(FeedPostEntity, (faker) => {
    const feedPost = new FeedPostEntity();

    feedPost.body = faker.lorem.text();

    return feedPost;
})