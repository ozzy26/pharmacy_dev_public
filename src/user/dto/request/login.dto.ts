import { ApiModelProperty } from "@nestjs/swagger";


export class LoginDto {

    @ApiModelProperty({ description: "email", required: true })
    readonly email: String;

    @ApiModelProperty({ description: "password", required: true })
    readonly pwd: String;

} 