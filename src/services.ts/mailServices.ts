import { MailerService } from "@nestjs-modules/mailer";
import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { Request } from "express";
import { UserModel } from "src/models/userModel";

@Injectable()
export class MailService{

    constructor(
        private mailService:MailerService,
        @InjectModel(UserModel)private userDB:typeof UserModel,
        ){}
//Обратная связь
    async getFeedback(req:Request){
        const {name,email,message}=req.body;
        await this.mailService.sendMail({
            to: 'pchelyha@mail.ru',
            from: `pchelyha@mail.ru`,
            subject: `Обратная связь`,
            text:`${name}\n${message}\n${email}\n`
        }).catch((err)=>{throw err})
    }
//Восстановление пароля
    async sendPassword(req:Request){
        const{email}=req.body;
        const user=await this.userDB.findOne({where:{email:email}})
        if(!user)throw new Error("Аккаунт с такой почтой не найден")
        await this.mailService.sendMail({
            to: email,
            from: `pchelyha@mail.ru`,
            subject: `Восстановление пароля`,
            text:`Ваш пароль:\n${user.password}`
        }).catch((err)=>{"Непредвиденная ошибка повторите позже"})
    }
}