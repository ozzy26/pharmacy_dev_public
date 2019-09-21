import { Injectable, Inject, HttpException } from '@nestjs/common';
import { Pool } from 'pg';

@Injectable()
export class AuthService {

    constructor(
        @Inject('DBPharmaToken')
        private readonly dbPharmaAuth: Pool 
    ){}

    async findOneByToken(token: string): Promise<any> {

        try {
            let user;

            user = await this.dbPharmaAuth.query(`SELECT validatetoken('${token}')`)
            // console.log(user.rows[0].validatetoken[0]);
            return user.rows[0].validatetoken[0];
            
        } catch (e) {
            throw new HttpException(e, 400)
        }

    }

    async validateUser(token: string): Promise<any> {
        return await this.findOneByToken(token);
    }
    
}
