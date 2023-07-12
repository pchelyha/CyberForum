import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { UserModel } from "src/models/userModel";
import { InjectModel } from '@nestjs/sequelize';
import {JwtService} from "@nestjs/jwt";
import { Request } from "express";
import { PostModel } from "src/models/postModel";
import { LikeModel } from "src/models/likeModel";
import { CommentModel } from "src/models/commentModel";

@Injectable()
export class AppServicesUser{
  
    constructor (
        @InjectModel(UserModel)private userDB:typeof UserModel, 
        private jwtService: JwtService,
        @InjectModel(PostModel)private postDB:typeof PostModel
        ) {};
    //Авторизация
    async authorization(req:Request) {
        const {email, password} = req.body;
        console.log(req.body);
        const user = await this.userDB.findOne({where:{email}})
        .catch((err)=>{
            console.log(err);
            throw new HttpException('Неккоректный запрос',HttpStatus.BAD_REQUEST);
        });
        if(!user) {
            throw new Error('Пользователи не найдены');
        }
        if( password==user.password && email==user.email) {
            let token = await this.generateToken(user);
            return {user,token};
        }
        else{
            throw new Error('Неправильный email или пароль');
        }
    }

    //Есть ли пользователь
    async getUsers(id?:number): Promise<UserModel[]>{
        if(id){
            return await this.userDB.findAll({where:{id:id}})
        }
        const users = await this.userDB.findAll();
        if(!users){
            throw new Error('No user found');
        }
        return users;
    }

    //Получить одного полььзователей по id
    async getUser(req:Request){
        if(!req.cookies.AccsesToken){
            return false;
        }
        const {id}=await this.decodeToken(req.cookies.AccsesToken);
        return this.userDB.findOne({where:{id:id}})
    }

    //Получить одного полььзователей по id
    async getUserById(req:Request){
        const idUser=req.params.id.split(':')[1];
        let isYourProfile,id;
        if(!req.cookies.AccsesToken){
            isYourProfile = false;
            id=0;
        }
        else{
            id = (await this.decodeToken(req.cookies.AccsesToken)).id
        }
        const user = await this.userDB.findOne({where:{id:idUser}});
        const user_post=await this.postDB.findAll({where:{user_id:idUser},include:[{model:LikeModel},{model:CommentModel}]})
        isYourProfile=id===user.id?true:false;
        return {user,isYourProfile,user_post};
    }
    
    //Регистрация
    async registration(req:Request){
        const{email,name,password} = req.body;
        if(email==''||name==''||password==''){
            throw new Error('Неккоректные данные')
        }
        const user = await this.userDB.findOne({where:{email}});
        if(user){
            throw new Error('Почта или имя уже заняты')
        }
        req.body.role='Пользователь';
        req.body.picturepath="default_user_image.png";
        const newUser: UserModel = await this.userDB.create(req.body).catch(()=>{
            throw new Error('Имя уже занято')
        });
        let token = await this.generateToken(newUser);
        if(Object.keys(newUser).length==0){
            throw new Error('Cannot conncet to database, pls retry ut request')
        }
        else return token;
    }

    //Изменение инфомации о пользователе
    async updateUser(req: Request){
        console.log(req.body);
        const {id}=await this.decodeToken(req.cookies.AccsesToken);
        const{userName,gender,birthday}=req.body;
        if(userName.replaceAll(' ','')==''){
            throw new HttpException('Имя не может быть пустым',400)
        }
        await this.userDB.update(
          {
            name:userName,
            gender:gender,
            birthday:birthday,
            
          },
        {
            where:{id:id}
        }).catch((err)=>{throw new HttpException('Имя уже занято!',400)})
    }
    
    async generateToken(user:UserModel){
        const tokenData={email:user.email,nickName:user.name,role:user.role,id:user.id}
        return this.jwtService.sign(tokenData);
    }

    async decodeToken(token:string):Promise<any>{
        return JSON.parse(JSON.stringify(this.jwtService.decode(token)));
    }

    //Добавление аватара
    async addAvatar(file, request:Request){
        const {id}= await this.decodeToken(request.cookies.AccsesToken)
        await this.userDB.update({picturepath:file.filename},{where:{id:id}})
           .catch(err=>{throw new HttpException("Не удалось обноваить аватар",HttpStatus.BAD_GATEWAY)})

    }  
}