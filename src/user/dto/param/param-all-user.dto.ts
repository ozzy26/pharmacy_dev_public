import { ApiModelProperty } from "@nestjs/swagger";

export class ParamAllUserDto {

    @ApiModelProperty(
        { 
            description: "Nombre [ 1er / 2do ], ponga 0 si en caso no tiene un nombre en particular", 
            required: true 
        }
    )
    readonly name: String

    @ApiModelProperty({ description: "Si esta Activo | Inactivo " })
    readonly active: Boolean

}