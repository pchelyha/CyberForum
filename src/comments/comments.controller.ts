import { Controller, Delete, Get, Post, Put, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';
import { CommentsService } from './comments.service';

@Controller('')
export class CommentsController {

     constructor(private commentService: CommentsService) { }

     //Добавление лайка комментария
     @Post('/addCommentLike')
     async addCommentLike(@Req() req: Request, @Res() res: Response) {
          if (!req.cookies.AccsesToken) {
               res.sendStatus(404);
               return;
          }
          try {
               await this.commentService.addLike(req)
               res.sendStatus(200);
          }
          catch (err) {

          }
     }

     @Delete('/deleteComment')
     async deleteComment(@Req() req: Request, @Res() res:Response){
          console.log(req.body)
          try{
               await this.commentService.deleteComment(req);
               res.sendStatus(200);
          }
          catch(err){
               res.send(err)
          }
     }

     @Put('/updateComment')
     async updateComment(@Req() req: Request, @Res() res:Response){
          console.log(req.body)
          try{
               await this.commentService.updateComment(req)
               res.sendStatus(200);
          }
          catch(err){
               res.send(err)
          }
     }
}
