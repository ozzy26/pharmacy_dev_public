import * as yml from 'yml';
const path = require('path');


export const readDbConnectionProvider = [
    {
        provide: 'readDbConnectionToken',
        useFactory: () => {
            let t = path.join(__dirname,'../'+'./conection/db-connection.yml')
            let configs = yml.load(t); 
            return configs.env_development
        },
    }
]