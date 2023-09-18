import { Seeder, SeederFactoryManager } from "typeorm-extension";
import { DataSource } from "typeorm";
import { FeedPostEntity } from "../../src/feed/models/post.entity";


export default class FeedPostSeeder implements Seeder {
    public async run(
        dataSource: DataSource,
        factoryManager: SeederFactoryManager
    ): Promise<any> {
        // const repository = dataSource.getRepository(FeedPostEntity);
        // const data = {
        //     body: 'Feed post text'
        // };
        // await repository.insert([
        //     data
        // ]);
        const feedPostFactory = await factoryManager.get(FeedPostEntity);
        await feedPostFactory.saveMany(10);
    }
} 