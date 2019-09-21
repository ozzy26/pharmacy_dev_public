import { Pool }  from 'pg';
import { IDBConnection } from '../interface/interface-db-connection';


export const databaseProvider = [
    {
        provide: 'DBPharmaToken',
        useFactory: (iDBConnection: IDBConnection) => {
            const { user, host, database, password, port } = iDBConnection;
            return new Pool({
                user: user,
                host: host,
                database: database,
                password: password,
                port: port,
            })
        },
        inject: ['readDbConnectionToken']
    }
]