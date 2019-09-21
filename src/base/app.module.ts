import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database/module/database.module';
import { UserModule } from '../user/module/user.module';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    DatabaseModule, 
    UserModule, 
    AuthModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
