import {Module} from "@nestjs/common";
import { SequelizeModule } from "@nestjs/sequelize";
import {ConfigModule} from "@nestjs/config";
import { PostModel } from "../models/postModel";
import { UserModel } from "src/models/userModel";
import { CommentModel } from "src/models/commentModel";
import { LikeModel } from "src/models/likeModel";
import { CategoryModel } from "src/models/categoryModel";
import { CommentLikeModel } from "src/models/commentLikeModel";

@Module({

    imports:[
        ConfigModule.forRoot({}),
        SequelizeModule.forRoot({
          dialect : "mysql",
          host: process.env.DB_HOST,
          port: Number(process.env.DB_PORT),
          username: process.env.DB_USER,
          password: process.env.DB_PASS,
          database: process.env.DB_NAME, 
          synchronize: true,
          autoLoadModels: true,
          models:[PostModel,UserModel,CommentModel,LikeModel,CategoryModel,CommentLikeModel],
        }),
      ],
})

export class DataBaseModule {}
