import { ApiModelProperty } from "@nestjs/swagger";


export class AllUserDto {

    @ApiModelProperty({ description: "Pk" })
    readonly id: Number;

    @ApiModelProperty({ description: "1er - 2do Nombre" })
    readonly name: String;

    @ApiModelProperty({ description: "Correo" })
    readonly email: String;

    @ApiModelProperty({ description: "Activo" })
    readonly active: String;

}