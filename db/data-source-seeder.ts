require('dotenv').config();
import { DataSource, DataSourceOptions } from "typeorm";
import { SeederOptions } from "typeorm-extension";

export const dataSourceSeederOptions: DataSourceOptions & SeederOptions = {
    type: 'postgres',
    host: process.env.POSTGRES_HOST,
    port: parseInt(<string>(process.env.POSTGRES_PORT)),
    username: process.env.POSTGRES_USER,
    password: <string>process.env.POSTGRES_PASSWORD,
    database: process.env.POSTGRES_DATABASE,
    entities: [__dirname + '/../**/*.entity.ts'],
    migrations: ['dist/db/migrations/*.js'],
    seeds: ['db/seeds/**/*{.ts, .js}'],
    factories: ['db/factories/**/*{.ts, .js}']
}

const dataSourceSeeder = new DataSource(dataSourceSeederOptions);
export default dataSourceSeeder