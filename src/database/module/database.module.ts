import { Module } from '@nestjs/common';
import { databaseProvider } from '../provider/database.provider';
import { readDbConnectionProvider } from '../provider/read-db-connection.provider';

@Module({
    providers: [
        ...readDbConnectionProvider,
        ...databaseProvider
    ],
    exports: [
        ...databaseProvider
    ]
})
export class DatabaseModule {}
