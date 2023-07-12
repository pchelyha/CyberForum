import { Controller, Get, Post, Put, Render, Req, Res, UploadedFile, UseInterceptors} from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express/multer";
import { Request, Response } from "express";
import { diskStorage } from "multer";
import { logErrorWriter } from "src/logWritter";
import { AppServicesUser } from "src/services.ts/appServicesUser";
import { editFileName, imageFileFilter } from "src/services.ts/files.service";
import { TemaInterceptor } from "src/tema-interceptor";

@UseInterceptors(TemaInterceptor)
@Controller('/')
export class UsersController {
    constructor(private appService:AppServicesUser){}
    //Рендер страницы авторизаци
    @Render('reg')
    @Post('/auth')
    async authorization(@Req()req:Request,@Res()res:Response) {
        try{
            console.log(req.body);
            const {token} = await this.appService.authorization(req);
            res.cookie("AccsesToken",token,{maxAge:1000*60*60*24*60});
            return res.redirect("/");
        }
        catch(err){
            const {darkTema}=req.body;
            let failer = err.message
            return {failer,darkTema}
        }
    }
    //Рендер страницы регистрации
    @Render('reg')
    @Post('/reg')
    async registration(@Req()req:Request,@Res()res:Response) {
        console.log(req.body);
        try{
            const token = await this.appService.registration(req);
            res.cookie("AccsesToken",token,{maxAge:1000*60*60*24*60});
            res.redirect('/');
        }
        catch(err){
            const failer = err.message
            console.log(err);
            const isReg= true;
            const {darkTema}=req.body;
            return {failer,darkTema,isReg}
        }
    }

    //Рендер страницы профиля
    @Render('profile')
    @Get('/profile:id')
    async getProfilePage(@Req()req:Request,@Res()res:Response){
        const {darkTema}=req.body;
        try{
            const {user,isYourProfile,user_post}=await this.appService.getUserById(req);
            return{user,isYourProfile,darkTema,user_post};
        }
        catch(err){
            console.log(err);
            res.send(err.message)
        }
    }

    //изменение профиля
    @Put('/profile:id')
    async updateProfileData(@Req()req:Request,@Res()res:Response){
        console.log(req.body);
 
        try{
            await this.appService.updateUser(req);
            res.send(200)
        }
        catch(err){
            res.send(err)
        }
    }
    
   //изменение профиля по id
    @Get('/profile')
    async getMyProfile(@Req()req:Request,@Res()res:Response){
        if(req.cookies.AccsesToken){
            const {id}=await this.appService.decodeToken(req.cookies.AccsesToken);
            if(id){
                res.redirect(`/profile:${id}`);
            }
        }
        else{
            res.redirect('/reg');
        }
    }

    //изменение регистрации
    @Get('/reg')
    @Render('reg')
    async getRegPage(@Req() req,@Res()res){
        const {darkTema}=req.body;
        if(req.cookies.AccsesToken){
            res.clearCookie('AccsesToken');
        }
        let failer='';
        return {failer,darkTema}
    }

    //изменение авторизации
    @Get('/auth')
    @Render('auth')
    async getAuthPage(@Req() req){
        const {darkTema}=req.body;
        let failer='';
        return {failer,darkTema}
    }

    //Добавление аватара
    @Post('addAvatar')
    @UseInterceptors(
        FileInterceptor('image', {
          storage: diskStorage({
            destination: './uploads',
            filename: editFileName,
          }),
          fileFilter: imageFileFilter,
        }),
      )
      
    async addAvatar(@Req() req:Request,@Res()res:Response,@UploadedFile()file){
        try{
            await this.appService.addAvatar(file,req);
            res.redirect('/profile')

        }
        catch(err){
            console.log(err)
            res.redirect('/profile')

        }
    }

   //Выход из профилей
    @Get('/logout')
    async logOut(@Res() res:Response){
        res.clearCookie('AccsesToken');
        res.redirect('/')
    }

   //Работа темы
    @Get('/tema')
    async saveTema(@Req() req:Request,@Res()res:Response){
        console.log(req.cookies);
        if(req.cookies.tema){
            console.log(req.cookies);
            res.clearCookie('tema');
            res.send('Светлая тема')
        }
        else{
            res.cookie('tema',1,{maxAge:1000*60*60*24*60})
            res.send('Темная тема')
        }
    }
}