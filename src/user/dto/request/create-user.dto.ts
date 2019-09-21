import { ApiModelProperty } from "@nestjs/swagger";
import { IsString, IsNotEmpty, IsInt, Length } from 'class-validator';
import { IsEmailAlreadyExist } from "../../custom-validator/is-email-already-exist";

export class CreateUserDto {

    @IsNotEmpty({ message: "no debe ser vacio" })
    @IsString({ message: "Debe ser cadena de Texto" })
    @ApiModelProperty({ description: "1er Nombre" })
    readonly firstName: String;

    @IsNotEmpty({ message: "no debe ser vacio" })
    @IsString({ message: "Debe ser Cadena de Texto" })
    @ApiModelProperty({ description: "2do Nombre" })
    readonly lastName: String;

    @IsNotEmpty({ message: "no debe ser vacio" })
    @IsString({ message: "Debe ser Cadena de Texto" })
    @IsEmailAlreadyExist({ message: "El correo ya esta siendo usado" })
    @ApiModelProperty({ description: "Correo" })
    readonly email: String;

    @IsNotEmpty({ message: "no debe ser vacio" })
    @IsString({ message: "Debe ser Cadena de Texto" })
    @Length(8, 8, { message: "Debe tener 8 digitos" })
    @ApiModelProperty({ description: "Dni" })
    readonly dni: String;

    @IsNotEmpty({ message: "no debe ser vacio" })
    @IsString({ message: "Debe ser Cadena de Texto" })
    @ApiModelProperty({ description: "Clave" })
    readonly pwd: String;

}