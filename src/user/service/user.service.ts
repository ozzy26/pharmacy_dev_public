import { Injectable, Inject, HttpException } from '@nestjs/common';
import { Pool } from 'pg';
import { Observable, from, throwError, of } from 'rxjs';
import { catchError, map, switchMap, filter, concatMap, tap } from 'rxjs/operators';
import { ParamAllUserDto } from '../dto/param/param-all-user.dto';
import { CreateUserDto } from '../dto/request/create-user.dto';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken'; 
import * as momentTZ from 'moment-timezone';
import { secreteKey } from '../../const/constant';
import { LoginDto } from '../dto/request/login.dto';
import { LogoutDto } from '../dto/request/logout.dto';



@Injectable()
export class UserService {

    constructor(
        @Inject('DBPharmaToken')
        private readonly dbPharma: Pool 
    ){}

    register(createUserDto: CreateUserDto):  Observable<any> {

        let cloneBody;
        let txtQuery;
        let objFunct;
        let valueArr = [];
        const { pwd } = createUserDto;
        let tokenJwt;
        cloneBody = Object.assign(createUserDto);

        for ( let key in createUserDto ) {
            valueArr.push(createUserDto[key])
        }

        txtQuery = `SELECT registeruser($1, $2, $3, $4, $5, $6)`;

        let genPwdBcrypt = (pwd): Observable<any> => {
            return from(
                bcrypt.hash(pwd, 12)
            ).pipe(
                catchError(err => {
                    throw new HttpException(err, 400)
                })
            )
        }

        let createUser = (txtQuery, valueArr): Observable<any> => {
            return from(
                this.dbPharma.query(txtQuery, valueArr)
            ).pipe(
                catchError(err => {
                    throw new HttpException(err, 400)
                }),
            )
        }

        return from(genPwdBcrypt(pwd))
            .pipe(
                map( res => {
                    cloneBody.hashPwd = res
                    valueArr.push(res)
                })
            )
            .pipe(
                map( () => {
                    cloneBody.tokenJwt = jwt.sign(cloneBody, secreteKey.key)
                    cloneBody.dateCreated = momentTZ().tz("America/Lima").format('MM-DD-YYYY HH:mm:ss'); 
                    valueArr.push(tokenJwt)
                    valueArr.splice(4, 1)
                    console.log(valueArr)
                    objFunct = {
                        txtQuery: txtQuery,
                        valueArr: valueArr
                    };
                    return objFunct;
                }),
                switchMap( ({ txtQuery, valueArr }) => 
                    from(createUser(txtQuery, valueArr))
                        .pipe(
                            map( res => {
                                return res.rows[0].registeruser;
                            })
                        )
                )
            )
    }

    allByNameActive(paramAllUserDto: ParamAllUserDto): Observable<any> {

        let txtQuery: string;
        let valueArr = [];
        let { name, active } = paramAllUserDto;

        if( name === '0' ) {
            name = ''
        }

        valueArr.push(name, active)
        txtQuery = `SELECT listuserjson($1, $2);`;


        let listUser = (txtQuery, valueArr): Observable<any> => {
            return from(
                this.dbPharma.query(txtQuery, valueArr)
            ).pipe(
                catchError(err => {
                    throw new HttpException(err, 400)
                })
            )
        } 

        return from(listUser(txtQuery , valueArr))
            .pipe(
                map( res => {
                    return res.rows[0].listuserjson
                })
            )

    }

    async validateEmail(email: string) {

        let txtQuery: string;
        let valueArr = [];

        valueArr.push(email)
        txtQuery = `SELECT validateemail($1);`;

        try {
            let valEmail = await this.dbPharma.query(txtQuery, valueArr);
            if( valEmail.rows[0]['validateemail'] === null || valEmail.rows[0]['validateemail'] === undefined ){
                return true
            } else {
                return false
            }

        } catch(er) {
            return er
        }

    }

    async login (loginDto: LoginDto) {

        const { email, pwd } = loginDto;

        let txtQuery: string;
        let valueArr = [];
        let resQuery;
        let objRes;

        valueArr.push(email);
        txtQuery = `SELECT login($1);`;

        let loginWithEmail = (txtQuery, valueArr): Observable<any> => {
            return from(
                this.dbPharma.query(txtQuery, valueArr)
            ).pipe(
                catchError(err => {
                    throw new HttpException(err, 400)
                })
            )
        }

        let comparePwd = (pwd, pwd_has): Observable<any> => {
            return from(
                bcrypt.compare(pwd, pwd_has)
            ).pipe(
                catchError(err => {
                    console.log(err)
                    throw new HttpException(err, 400)
                })
            )
        }

        return from(loginWithEmail(txtQuery, valueArr))
            .pipe(
                map( record => { 
                    // console.log(record.rows[0]['login'][0]);
                    return record 
                }),
                concatMap( valcrd => {
                    return  valcrd.rows[0]['login'] === null?
                        throwError(new HttpException({ message: 'Valida su Email/Clave' }, 400)):
                        of(valcrd)
                })
            ).pipe(
                tap( (val) =>  {
                    resQuery = Object.assign(Object.assign(val.rows[0]['login'][0]))
                    resQuery.pwd = pwd
                    resQuery.dateCreated = momentTZ().tz("America/Lima").format('MM-DD-YYYY HH:mm:ss');
                }),
                map( () => resQuery),
                concatMap( ({pwd, pwd_has} ) =>
                    from(comparePwd(pwd, pwd_has))
                        .pipe(
                            map( valBln => valBln),
                            switchMap( vBln => {
                                return vBln != true?
                                    throwError(new HttpException({ message: 'Valida su Email/Clave' }, 400)):
                                    of(vBln)
                            })
                        )
                ),
                map( () =>  resQuery),
                switchMap( ({ token_jwt, first_name, last_name, email, dni, pwd_has, dateCreated }) => {
                    objRes = {
                        first_name: first_name,
                        last_name: last_name,
                        email: email,
                        dni: dni,
                        pwd_has: pwd_has,
                        dateCreated: dateCreated
                    }
                    return token_jwt === null?
                        of({ token: jwt.sign(objRes, secreteKey.key) }): // reemplazar por una promesa/guarda la nueva token generado
                        of({ token: token_jwt })
                })

            )
        
    }

    async logout(logoutDto: LogoutDto) {

        const { tokenJwt } = logoutDto;

        let txtQuery: string;
        let valueArr = [];
        let logoutByJwt;

        valueArr.push(tokenJwt);
        txtQuery = `SELECT logoutuser($1);`

        logoutByJwt = (txtQuery, valueArr): Observable<any> => {
            return from(
                this.dbPharma.query(txtQuery, valueArr)
            ).pipe(
                catchError(err => {
                    console.log(err)
                    throw new HttpException(err, 400)
                })
            )
        }

        return from(logoutByJwt(txtQuery, valueArr))
            .pipe(
                map( val => val )
            )


    }

}
