import { ArgumentMetadata, Injectable, PipeTransform, HttpException } from '@nestjs/common';
import { validate, Validate } from 'class-validator';
import { plainToClass } from 'class-transformer';


@Injectable()
export class ValidationPipe implements PipeTransform {
  async transform(value: any, metadata: ArgumentMetadata) {
    let arrRes= [];

    const object = plainToClass(metadata.metatype ,value);
    const errors = await validate(object);

    errors.forEach( ({property, constraints}) => {
      arrRes.push({ [property]: Object.values(constraints)[0] })
    })

    if( arrRes.length > 0 ) {
      throw new HttpException(arrRes, 400)
    }
    return value;
  }
}
