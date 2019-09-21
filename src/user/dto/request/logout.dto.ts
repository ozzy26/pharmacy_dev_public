import { ApiModelProperty } from "@nestjs/swagger";


export class LogoutDto {

    @ApiModelProperty({ description: "Token", required: true })
    readonly tokenJwt: String

}