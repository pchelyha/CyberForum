import {Module} from "@nestjs/common";
import { PostControllers } from "../controllers/controllerPosts";
import { UsersController } from "../controllers/controllerUsers";
import { DataBaseModule } from "./DBmodule";
import { AppServicesPost } from "../services.ts/appServicesPost";
import { AppServicesUser } from "../services.ts/appServicesUser";
import { SequelizeModule } from "@nestjs/sequelize";
import { PostModel } from "src/models/postModel";
import { UserModel } from "src/models/userModel";
import { APP_FILTER } from '@nestjs/core';
import { NotFoundExceptionFilter } from "src/404err";
import { JwtModule } from "@nestjs/jwt";
import { MulterModule } from "@nestjs/platform-express";
import { MailModule } from "./mailModule";
import { CategoryModule } from "./categoryModule";
import { CategoryModel } from "src/models/categoryModel";
import { CategoryService } from "src/services.ts/categoryService";
import { LikeModel } from "src/models/likeModel";
import { CommentModel } from "src/models/commentModel";
import { CommentsModule } from "src/comments/comments.module";


@Module({
    imports:[
        DataBaseModule,
        MailModule,
        CategoryModule,
        CommentsModule,
        MulterModule.register({
            dest:'./uploads'
        }),
        SequelizeModule.forFeature([
            PostModel,
            CategoryModel,
            UserModel,
            LikeModel,
            CommentModel
        ]),
        JwtModule.register({
            secret: process.env.PRIVATE_KEY || 'SECRET',
            signOptions: {
                expiresIn: '60d'
            }
        })

    ],
    controllers:[PostControllers,UsersController],
    providers:[
        AppServicesPost,
        AppServicesUser,
        {provide: APP_FILTER, 
        useClass: NotFoundExceptionFilter}
    ],
   
})
export class AppModule {}
