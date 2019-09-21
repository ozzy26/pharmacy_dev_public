import { Controller, Post, Body, Get, Headers, 
    Param, UsePipes, UseGuards, 
    Req, UseInterceptors, 
    UploadedFile } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { UserService } from '../service/user.service';
import { ApiUseTags, ApiOkResponse, ApiConsumes, ApiImplicitFile } from '@nestjs/swagger';
import { AllUserDto } from '../dto/response/all-user.dto';
import { ParamAllUserDto } from '../dto/param/param-all-user.dto';
import { CreateUserDto } from '../dto/request/create-user.dto';
import { ValidationPipe } from '../pipe/validation.pipe';
import { AuthGuard } from '@nestjs/passport';
import { User } from '../decorator/user.decorator';
import { LoginDto } from '../dto/request/login.dto';
import { LogoutDto } from '../dto/request/logout.dto';


@ApiUseTags('user')
@Controller('user')
export class UserController {

    constructor(
        private readonly userService: UserService,
    ){}

    @Post('register')
    @UsePipes(new ValidationPipe())
    register(
        @Body() createUserDto: CreateUserDto,
    ) {
        return this.userService.register(createUserDto);
    }

    @Post('login')
    login(
        @Body() loginDto: LoginDto
    ) {
        return this.userService.login(loginDto);
    }

    @Get('find-all/:name/:active')
    @UseGuards(AuthGuard())
    @ApiOkResponse(
        {
            type: AllUserDto,
            description: "Retorna un listado de todos los usuario, filtrados por nombre y si estan activos o no",
        }
    )
    allByNameActive(
        @Param() paramAllUserDto: ParamAllUserDto,
        @User() user
    ) {
        console.log(user);
        return this.userService.allByNameActive(paramAllUserDto);
    }

    @Post('upload')
    @UseInterceptors(FileInterceptor('file'))
    @ApiConsumes('multipart/form-data')
    @ApiImplicitFile({ name: 'file', required: true, description: 'List of cats' })
    uploadFile(
        @UploadedFile() file
    ) {
    console.log(file);
    }

    @Post('logout')
    logout(
        @Body() logoutDto: LogoutDto
    ) {
        return this.userService.logout(logoutDto);
    }

    // @Post('validate-email')
    // validateEmail(
    //     @Body() body
    // ) {
    //     console.log(body)
    //     return this.userService.validateEmail('osca23432325rayoso2326@gmail.com')
    // }

}
