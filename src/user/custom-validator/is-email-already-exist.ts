import {registerDecorator, ValidationOptions, 
    ValidatorConstraint, ValidatorConstraintInterface, 
    ValidationArguments} from "class-validator";
import { UserService } from '../service/user.service';
import { Injectable } from "@nestjs/common";


@ValidatorConstraint({ name: "isEmailAlreadyExistConstraint", async: true })
@Injectable()
export class IsEmailAlreadyExistConstraint implements ValidatorConstraintInterface {

    constructor(
        private readonly userService: UserService
    ){
    }
    async validate(value: any, args: ValidationArguments) {
        let validateEmail = await this.userService.validateEmail(value);
        return validateEmail;
    }

}

export function IsEmailAlreadyExist(validationOptions?: ValidationOptions) {

    return function (object: Object, propertyName: string) {
        registerDecorator({
            target: object.constructor,
            propertyName: propertyName,
            options: validationOptions,
            constraints: [],
            validator: IsEmailAlreadyExistConstraint
        })
    }
}