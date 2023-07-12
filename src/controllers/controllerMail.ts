import { Controller, Get, Post, Render, Req, Res, UseInterceptors } from "@nestjs/common";
import { Request, Response } from "express";
import { MailService } from "src/services.ts/mailServices";
import { TemaInterceptor } from "src/tema-interceptor";

@UseInterceptors(TemaInterceptor)
@Controller('')
export class MailController {
    constructor(private mailService:MailService){}

    //Отправка обратной связи
    @Post('/feedback')
    async getFeedback(@Req() req:Request,@Res()res:Response){
        try{
            console.log(req.body);
            await this.mailService.getFeedback(req);
            res.redirect('/');
            
        }
        catch(err){
            res.redirect('/');
            console.log(err);
        }
    }

    //Загрузка странциы забыли пароль
    @Get('/forgotpass')
    @Render('forgotpassword')
    async getForgotPass(@Req()req){
        const{darkTema}=req.body;
        let noticed = '';
        let success=false;
        return{darkTema,noticed,success }
    }

    //Рендер страницы забыли пароль
    @Render('forgotpassword')
    @Post('/forgotpass')
    async sendPassword(@Req()req:Request,@Res()res:Response){
        console.log(req.body);
        const{darkTema}=req.body;
        try{
            await this.mailService.sendPassword(req);
            let success = true;
            let noticed = '';
            return {noticed,success,darkTema}
        }
        catch(err){
            let success=false;
            let noticed = err.message;
            return{noticed,darkTema,success}
        }
    }

}