import { Module } from '@nestjs/common';
import { CommentsController } from './comments.controller';
import { CommentsService } from './comments.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { CommentModel } from 'src/models/commentModel';
import { JwtModule } from '@nestjs/jwt';
import { CommentLikeModel } from 'src/models/commentLikeModel';

@Module({
  imports:[
    SequelizeModule.forFeature([
      CommentModel,
      CommentLikeModel
    ]),
    JwtModule.register({
      secret: process.env.PRIVATE_KEY || 'SECRET',
      signOptions: {
          expiresIn: '60d'
      }
  })
  ],
  controllers: [CommentsController],
  providers: [CommentsService],
  exports:[CommentsService]
})
export class CommentsModule {}
