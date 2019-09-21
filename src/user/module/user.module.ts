import { Module } from '@nestjs/common';
import { UserController } from '../controller/user.controller';
import { UserService } from '../service/user.service';
import { DatabaseModule } from '../../database/module/database.module';
import { AuthModule } from '../../auth/auth.module';
import { HttpStrategy } from '../strategy/http.strategy';
import { PassportModule } from '@nestjs/passport';
import { IsEmailAlreadyExistConstraint } from '../custom-validator/is-email-already-exist';


@Module({
  imports: [
    PassportModule.register(
      { 
        defaultStrategy: 'bearer', 
        session: false 
      }
    ), 
    DatabaseModule,
    AuthModule
  ],
  controllers: [
    UserController
  ],
  providers: [
    IsEmailAlreadyExistConstraint,
    UserService,
    HttpStrategy
  ]
})
export class UserModule {}
