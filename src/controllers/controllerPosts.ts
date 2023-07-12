import { Controller, Delete, Get, Param, Post, Put, Render, Req, Res, UploadedFile, UploadedFiles, UseInterceptors } from "@nestjs/common";
import { AppServicesPost } from "../services.ts/appServicesPost";
import { logErrorWriter } from '../logWritter';
import { editFileName, imageFileFilter } from '../services.ts/files.service';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { TemaInterceptor } from "src/tema-interceptor";
import { Request, Response } from "express";
import { CommentsService } from "src/comments/comments.service";
import { JwtService } from "@nestjs/jwt";

@UseInterceptors(TemaInterceptor)
@Controller('/')
export class PostControllers {

  constructor(
    private appService: AppServicesPost,
    private commentService: CommentsService,
    private jwtService: JwtService,
  ) { }

  //Карусель категорий
  @Get('/')
  @Render('index')
  async getHomePage(@Req() req, @Res() res) {
    try {
      const user = await this.appService.getUserById(req)
      let latestPosts = await this.appService.getLatestPosts();
      const categorys = await this.appService.getCategorys(req);
      const { darkTema } = req.body;
      return { latestPosts, darkTema, categorys, user };
    }
    catch (err) {
      console.log(err);
    }
  }

  //Рендер новостей
  @Get('/news:id:page')
  @Render('newsposts')
  async getPostsPage(@Param() params, @Res() res, @Req() req) {
    const { darkTema } = req.body;
    try {
      const { posts, idCategory, maxPage, latestPage, nextPage, categoryName } = await this.appService.getPosts(params);
      const user = await this.appService.getUserById(req);
      return { posts, idCategory, maxPage, latestPage, nextPage, darkTema, user, categoryName };
    }
    catch (err) {
      console.error(err);
      await logErrorWriter(err);
      res.redirect('/');
    }
  }

  //Рендер открытой новости
  @Get('/posts:id')
  @Render('newspostactive')
  async getPostIdPage(@Req() req, @Res() res, @Param('id') id: string) {
    const { darkTema } = req.body;
    try {
      let post = await this.appService.getPost(Number(id.replace(/[^0-9]/g, "")));
      const comments = await this.commentService.getComments(Number(id.replace(/[^0-9]/g, "")));
      const user = await this.appService.getUserById(req)
      const pictures = post.pictures.split(',');
      return { post, pictures, comments, user,darkTema };
    }
    catch (err) {
      console.error(err);
      await logErrorWriter(err);
      return res.redirect('/');
    }
  }

  //Мзменение новости
  @Put('/posts:id')
  async addCommnet(@Req() req: Request, @Param('id') id: string, @Res() res: Response) {
    try {
      console.log(req.body);
      await this.commentService.addComment(req, Number(id.replace(/[^0-9]/g, "")))
      res.sendStatus(200);

    }
    catch (err) {
      res.sendStatus(err.status)
    }

  }

  //Страница новостей выбранного автора
  @Get('/postAuthor:id')
  @Render('mypost')
  async getPostAuthor(@Req() req: Request, @Res() res: Response, @Param('id')id) {
    const { darkTema } = req.body;
    if(!req.cookies.AccsesToken){
      res.redirect('/reg')
    }
    const idPage = Number(id.split(':')[1])
    try {
      const posts = await this.appService.getPostsByIdUser(idPage);
      const user = await this.appService.getUserById(req);
      const author = (await this.appService.getAuhtor(idPage))[0].dataValues;
      posts.sort((a,b)=>{
        return a.dataValues.id < b.dataValues.id?1:-1;
      })
      console.log(author);
      return {posts,darkTema,user,idPage,author}
    }
    catch (err) {
    }
  }

  //Рендер страницы добавления новостей
  @Get('/addpost')
  @Render('creaturenews')
  async getAddPost(@Req() req: Request, @Res() res: Response) {
    const { darkTema } = req.body;
    if (!req.cookies) {
      res.redirect('/reg');
      return;
    }
    if (!req.cookies.AccsesToken) {
      res.redirect('/reg')
      return;
    }
    try {
      const categorys = await this.appService.getCategorys(req);
      const numbOfUsers = (await this.appService.getUsers()).length;
      const user = await this.appService.getUserById(req);
      let noticed='';
      return { categorys, darkTema, numbOfUsers,noticed,user}

    }
    catch (err) {

    }
  }

  //Рендер страницы добавления неподтвержденных новостей
  @Get('/verifyNews:id')
  @Render('newsverification')
  async getVerifyNews(@Req() req: Request, @Res() res: Response, @Param() id) {
    if (JSON.parse(JSON.stringify(this.jwtService.decode(req.cookies.AccsesToken))).role != "Администратор") {
      res.redirect('/')
    }
    try {
      const { darkTema } = req.body;
      const categoryId = id.id.split(':')[1]
      console.log(categoryId);
      const user = await this.appService.getUserById(req);
      const newsVerify = await this.appService.getNotVerufyNews(categoryId);
      newsVerify.sort((a,b)=>{
        return a.dataValues.id > b.dataValues.id?1:-1
      })
      return { newsVerify , darkTema, user}
    }
    catch (err) {
    }
  }
  //Удаление новости
  @Delete('/deletePost')
  async deletePost(@Req() req: Request) {
      try {
          await this.appService.deletePost(req.body[0])
      }
      catch (err) {
          console.log(err)
      }
  }

  //Изменение новости
  @Put('/updatePost')
  async updatePost(@Req()req:Request){
      try{
        await this.appService.updatePost(req)
        return 200
      }
      catch(err){
        return 502
      }
  }

  //Изменение статуса новости
  @Post('/vefifyNews')
  async verifyNews(@Req() req: Request, @Res() res: Response) {
    console.log(req.body)
    if (JSON.parse(JSON.stringify(this.jwtService.decode(req.cookies.AccsesToken))).role != "Администратор") {
      res.sendStatus(400)
    }
    try {
      await this.appService.updatePostStatus(req);
      res.sendStatus(200)
    }
    catch (err) {
      console.log(err);
      res.sendStatus(400)
    }
  }

  //Изменение лайка
  @Post('/addLike')
  async addLike(@Req() req: Request, @Res() res: Response) {
    if (!req.cookies.AccsesToken) {
      res.sendStatus(404);
      return;
    }
    try {
      await this.appService.addLike(req)
      res.sendStatus(200);
    }
    catch (err) {

    }

  }

  //Отправление страницы добавления новостей
  @Render('creaturenews')
  @Post('/addpost')
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: './uploads',
        filename: editFileName,
      }),
      fileFilter: imageFileFilter,
    }),
  )

  //Добавление данных в ность
  async addPostPage(@Req() req, @Res() res, @UploadedFile() files) {
    if (req.cookies.AccsesToken) {
      try {
        const { post, category } = await this.appService.addPost(req.body, files, req);
        if (post.status == "Проверено") res.redirect(`/news:${category}:1`)
        else {
          res.redirect('/verificationPage')
        }
      }
      catch (err) {
        console.error(err);
        const darkTema = req.cookies.tema;
        await logErrorWriter(err);
        const categorys = await this.appService.getCategorys(req);
        const numbOfUsers = (await this.appService.getUsers()).length;
        const user = await this.appService.getUserById(req);
        let noticed = err.message;
        return {noticed, darkTema,categorys,numbOfUsers,user}
      }
    }
    else { 
      res.redirect('/') 
    }
  }

    
  //Получение страницы ваша новость подтверждается
  @Get('/verificationPage')
  @Render('publicationver')
  async getVerificationPage(@Req()req:Request){
      const{darkTema}=req.body;
      const user = await this.appService.getUserById(req);
      return {darkTema,user}
  }

  //Получение любой фотографии с сервера
  @Get('/images:imagename')
  getImage(@Param('imagename') image, @Res() res) {
    try {
      console.log(image);
      const response = res.sendFile(image.substring(1), { root: './uploads' });
      return {
        status: 200,
        data: response,
      };
    }
    catch (err) {
      res.send(err.message);
    }
  }
}