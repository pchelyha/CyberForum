import { Controller, Delete, Get, Post, Put, Render, Req, Res, UploadedFile, UseInterceptors } from "@nestjs/common";
import { FileInterceptor, FilesInterceptor } from "@nestjs/platform-express/multer";
import { Request, Response } from "express";
import { diskStorage } from "multer";
import { CategoryService } from "src/services.ts/categoryService";
import { editFileName, imageFileFilter } from "src/services.ts/files.service";
import { TemaInterceptor } from "src/tema-interceptor";

@UseInterceptors(TemaInterceptor)
@Controller('/')
export class CategoryController{

    constructor(private categoryService:CategoryService){}

    //Загрузка категорий
    @Get('/categorys')
    @Render('news')
    async getCategorysPage(@Req()req:Request,@Res()res:Response){
        const {darkTema}=req.body;
        try{
           const categorys= await this.categoryService.getCategorys(req);
           const numbOfUsers=(await this.categoryService.getUsers()).length
           const user= await this.categoryService.getUserById(req);
           return{categorys,darkTema,numbOfUsers,user}

        }
        catch(err){
            console.log(err);
            res.redirect('/')

        }
    }

    //Добавит категорию
    @Get('/addCategory')
    @Render('categoryCreate')
    async getCategorysCreatePage(@Req()req:Request){
        const {darkTema}=req.body;
        const user= await this.categoryService.getUserById(req);
        let noticed = '';
        return{darkTema,noticed,user}
    }

    @Delete('/deleteCategory')
    async deleteCategory(@Req()req:Request){
        console.log(req.body);
        try{
            await this.categoryService.deleteCategory(req.body[0]);
            return 200
        }
        catch(err){
            return 502
        }
    }

    @Put('/updateCategory')
    async updateCategory(@Req()req:Request){
        try{
            await this.categoryService.updateCategory(req)
        }
        catch(err){
            console.log(err)
        }
    }

    //Добавление данных в создание категории
    @Post('/categorys')
    @UseInterceptors(
        FileInterceptor('image', {
          storage: diskStorage({
            destination: './uploads',
            filename: editFileName,
          }),
          fileFilter: imageFileFilter,
        }),
      )
    //Если неверные данные
    @Render('categoryCreate')
    async addCategory(@Req() req:Request,@Res() res:Response,@UploadedFile()file){
        console.log(file);
        try{
            if(!file){
                throw new Error('Добавьте фотографию')
            }
            await this.categoryService.addCategory(req,file.filename);
            res.redirect('/categorys');

        }
        catch(err){
            const user= await this.categoryService.getUserById(req);
            const darkTema=req.cookies.tema;
            let noticed = err.message;
            return {noticed,darkTema,user}
        }
    }
}