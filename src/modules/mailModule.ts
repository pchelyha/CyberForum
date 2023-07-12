import { MailerModule } from "@nestjs-modules/mailer";
import { Module } from "@nestjs/common";
import { MailController } from "src/controllers/controllerMail";
import { MailService } from "src/services.ts/mailServices";
import { DataBaseModule } from "./DBmodule";
import { SequelizeModule } from "@nestjs/sequelize";
import { UserModel } from "src/models/userModel";

@Module({
    imports:[
        DataBaseModule,
        MailerModule.forRoot({
            transport:{
              host: 'smpt.mail.ru'||process.env.MAIL_HOST,
              port: 465||Number(process.env.MAIL_PORT),
              secure: true,
              auth: {
                user: 'pchelyha@mail.ru'||process.env.MAIL_ADDRESS,
                pass: '2yjyt4p7rmWa8y2JjWP2'||process.env.MAIL_PASS,
              }
            }
          }),
        SequelizeModule.forFeature([
            UserModel
        ])
    ],
    controllers:[MailController],
    providers:[MailService]

})
export class MailModule {

}