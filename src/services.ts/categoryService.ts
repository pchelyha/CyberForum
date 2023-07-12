import { HttpException, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { Request } from "express";
import { CategoryModel } from "src/models/categoryModel";
import { PostModel } from "src/models/postModel";
import { AppServicesUser } from "./appServicesUser";
import { JwtService } from "@nestjs/jwt";
import { UserModel } from "src/models/userModel";
import { CommentModel } from "src/models/commentModel";


@Injectable()
export class CategoryService {

    constructor(
        @InjectModel(CategoryModel)private categoryDB:typeof CategoryModel,
        @InjectModel(UserModel)private userDB:typeof UserModel,
        @InjectModel(CommentModel)private commentDB:typeof CommentModel,
        private jwtServie:JwtService
        ){}
    //Добавление категории
    async addCategory(req: Request,filename:string){
        console.log(req.body)
        const {category_text,category_name}=req.body;
        if(category_name.replaceAll(' ','')==''){
            throw new Error('Название категории не может быть пустым')
        }
        await this.categoryDB.create({
            category_text: category_text,
            category_name:category_name,
            category_img: filename
        }).catch(err=>{throw err}); 
    }

    async deleteCategory(idCategory:number){
        console.log(idCategory)
        await this.categoryDB.destroy({where:{category_id:idCategory}})
    }

    async updateCategory(req:Request){
        const{id,title,text}=req.body;
        if(title.replaceAll(' ','')==''){
            throw new HttpException("Заголовок не может быть пустым",400)
        }
        await this.categoryDB.update({
            category_name:title,
            category_text:text,
        },
        {where:{
            category_id:id
        }})
    }

    async getCategorys(req: Request) {
       return await this.categoryDB.findAll({include:{model:PostModel}})
                .catch(err=>{throw err});
    }
    
    //Получить всех пользователей
    async getUsers(): Promise<UserModel[]>{
        const users = await this.userDB.findAll();
        if(!users){
            throw new Error('No user found');
        }
        return users;
    }

    //Получить одного полььзователей по id
    async getUserById(req:Request){
        if(!req.cookies.AccsesToken){
            return false;
        }
        const {id} = JSON.parse(JSON.stringify(this.jwtServie.decode(req.cookies.AccsesToken)))
        return await this.userDB.findOne({where:{id:id}})
    }

    //Получить всех комментариев
    async getComments(postID:number){
        return await this.commentDB.findAll({where:{post_id:postID},include:{model:UserModel}})
    }
}