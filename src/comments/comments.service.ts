import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/sequelize';
import { Request } from 'express';
import { CommentLikeModel } from 'src/models/commentLikeModel';
import { CommentModel } from 'src/models/commentModel';
import { UserModel } from 'src/models/userModel';

@Injectable()
export class CommentsService {
    
    constructor(
        @InjectModel(CommentModel)private commentDB:typeof CommentModel,
        @InjectModel(CommentLikeModel)private commentLikeDB:typeof CommentLikeModel,
        private jwtService: JwtService
        ){}

    //Добавление комментария
    async addComment(req:Request, postID:number){
        if(!req.cookies){
            throw new HttpException("Не можете оставить комментарий не войдя в форум",HttpStatus.BAD_REQUEST)
        }
        if(!req.cookies.AccsesToken){
            throw new HttpException("Не можете оставить комментарий не войдя в форум",HttpStatus.BAD_REQUEST)
        }
        const {id}= JSON.parse(JSON.stringify(await this.jwtService.decode(req.cookies.AccsesToken)))
        const writed=new Date().toLocaleDateString()+" "+new Date().toLocaleTimeString();
        await this.commentDB.create({
            post_id:postID,
            comment_text:req.body.NewNewsName,
            user_id:id,
            comment_date:writed,
        })
    }

    //Получение комментария для отдельного поста
    async getComments(postID:number){
        const comments =  await this.commentDB.findAll({where:{post_id:postID},include:[{model:UserModel},{model:CommentLikeModel}]});
        comments.sort((a, b) => {
            if (a.dataValues.comment_id > b.dataValues.comment_id) {
                return 1
            }
            else {
                return -1;
            }
        })
        return comments;
    }

    
    //Добавление лайка для комментария
    async addLike(req: Request) {
        const comment_id = req.body[0]
        const {id}= JSON.parse(JSON.stringify(await this.jwtService.decode(req.cookies.AccsesToken)))
        const isLiked = await this.commentLikeDB.findOne({ where: { user_id: id, comment_id:comment_id } });
        if (isLiked) {
            await this.commentLikeDB.destroy({
                where: { comment_id:  comment_id, user_id: id }
            })
        }
        else {
            await this.commentLikeDB.create({
                comment_id: comment_id,
                user_id: id,
            })
        }
    }

    async deleteComment(req:Request){
        const idComm = req.body[0]
        await this.commentDB.destroy({where:{comment_id:idComm}})
    }

    async updateComment(req:Request){
        const{id,text}= req.body;
        if(text.replaceAll(' ','')==''){
            throw new HttpException('Текст не может быть пусутым',400)
        }
        await this.commentDB.update(
            {comment_text:text},
            {where:{comment_id:id}}
        )
    }
}
