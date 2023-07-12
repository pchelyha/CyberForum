//Запуск сайта
import { NestFactory } from "@nestjs/core";
import { AppModule } from "./modules/appModule";
import { join } from 'path';
import { NestExpressApplication } from '@nestjs/platform-express';
import * as cookieParser from 'cookie-parser';

async function startApp() {
    const PORT = process.env.PORT||3000;
    const app = await NestFactory.create<NestExpressApplication>(AppModule);
    app.use(cookieParser());
    app.useStaticAssets(join(__dirname, '..', 'client'));
    app.setBaseViewsDir(join(__dirname, '..', 'client'));
    app.setViewEngine('ejs');
    try{
        app.listen(PORT, () => {console.log(`Server started on port ${PORT}`)});
    }
    catch(err)
    {
        console.error(err);
    };
    
}
startApp();