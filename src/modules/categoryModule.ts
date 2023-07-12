import { Module, } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { SequelizeModule } from "@nestjs/sequelize";
import { CategoryController } from "src/controllers/categoryController";
import { CategoryModel } from "src/models/categoryModel";
import { CommentModel } from "src/models/commentModel";
import { PostModel } from "src/models/postModel";
import { UserModel } from "src/models/userModel";
import { CategoryService } from "src/services.ts/categoryService";

@Module({
    imports:[
        SequelizeModule.forFeature([
            CategoryModel,
            PostModel,
            UserModel,
            CommentModel
        ]),
        JwtModule.register({
            secret: process.env.PRIVATE_KEY || 'SECRET',
            signOptions: {
                expiresIn: '60d'
            }
        })
    ],
    controllers:[CategoryController],
    providers:[CategoryService],
})
export class CategoryModule {}