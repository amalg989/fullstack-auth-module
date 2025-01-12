import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    MongooseModule.forRoot(
      'mongodb+srv://amalcg989:V19Xin5XgB8W5hTt@cluster0.ezvax.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0',
      {
        authSource: 'admin',
      },
    ),
    UsersModule,
    AuthModule,
  ],
})
export class AppModule {}
