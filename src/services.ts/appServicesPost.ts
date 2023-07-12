import { HttpException, Injectable, Req } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { PostModel } from 'src/models/postModel';
import { post } from '../types';
import { Request } from 'express';
import { AppServicesUser } from './appServicesUser';
import { CategoryModel } from 'src/models/categoryModel';
import { UserModel } from 'src/models/userModel';
import { LikeModel } from 'src/models/likeModel';
import { CommentModel } from 'src/models/commentModel';

@Injectable()
export class AppServicesPost {
   
    private readonly NUMBER_OF_POST_IN_PAGE = 10;

    constructor(
        @InjectModel(PostModel) private postDB: typeof PostModel,
        @InjectModel(CategoryModel) private categoryDB: typeof CategoryModel,
        @InjectModel(LikeModel) private likeDB: typeof LikeModel,
        @InjectModel(CommentModel) private commentDB: typeof CommentModel,
        private userService: AppServicesUser,
    ) { };

    //Получение новости
    async getPosts(params) {
        const idCategory = params.page.split(':')[0];
        let idPage = params.page.split(':')[1];
        const categoryName = (await this.categoryDB.findOne({where:{category_id:idCategory}})).category_name;
        const posts: PostModel[] = [];
        const allPosts = await this.postDB.findAll(
            {
                where: { category_id: idCategory, status: "Проверено" },
                include: [{
                    model: UserModel
                },
                {
                    model: LikeModel
                },
                {
                    model: CommentModel
                }
                ]
            })
            .catch(err => { throw err });
        let latestPage: number = Number(idPage) - 1;
        let nextPage: number = Number(idPage) + 1;
        allPosts.sort((a, b) => {
            if (a.dataValues.id < b.dataValues.id) {
                return 1
            }
            else {
                return -1;
            }
        })
        for (let i = ((idPage - 1) * this.NUMBER_OF_POST_IN_PAGE); i < idPage * this.NUMBER_OF_POST_IN_PAGE; i++) {
            if (i >= allPosts.length) break;
            posts.push(allPosts[i]);
        }
        const maxPage = Math.floor(allPosts.length / this.NUMBER_OF_POST_IN_PAGE) + 1;
        if (allPosts.length == 0) {
            idPage = Math.floor(allPosts.length / this.NUMBER_OF_POST_IN_PAGE) + 1;
        }
        if (maxPage == idPage) {
            nextPage--;
        }
        else if (idPage <= 1) {
            idPage = 1;
            latestPage = 1;
            latestPage = idPage;
        }
        if (idPage == 1) latestPage = 1;
        return { posts, maxPage, idPage, idCategory, latestPage, nextPage, categoryName };
    }

    //Добавление новости
    async addPost(req, file = { filename: 'default_news_picture.png' }, request: Request) {
        const { newsTitle, newsCategorys, newsMessage } = request.body;
        console.log (request.body)
        if(!newsCategorys){
            throw new Error("Выберите категорию!")
        }
        if(newsCategorys.replaceAll(' ','')==''){
            throw new Error("Выберите категорию!")
        }
        if(newsTitle.replaceAll(' ','')==''||newsMessage.replaceAll(' ','')==''){
            throw new Error("Заполните заголовок и сообщение!")
        }

        const writed = new Date().toLocaleDateString() + " " + new Date().toLocaleTimeString();
        const { id, role } = (await this.userService.decodeToken(request.cookies.AccsesToken));
        let status: string;
        const category = newsCategorys.split(";")[0];
        role == "Администратор" ? status = "Проверено" : status = "Проверить";
        const post = await this.postDB.create({
            status: status,
            title: newsTitle,
            pictures: file.filename,
            views: 0,
            text: newsMessage,
            writed: writed,
            user_id: id,
            category_id: category
        }).catch(()=>{throw new Error("Заполните заголовок и сообщение!")});
        if (!post) {
            throw new Error("Сannot add to database");
        }
        return { post, category };
    }
    //Автор новости
    async getAuhtor(idPage: number) {
        return await this.userService.getUsers(idPage);
      }

  //Получение отдельной новости
    async getPost(id: number) {
        const post = await this.postDB.findOne({ where: { id }, include: [{ model: LikeModel }, { model: UserModel },{model:CategoryModel}] });
        await post.increment('views', { by: 1 })
        if (!post) {
            throw new Error("Post with this id is not found");
        }
        return post.dataValues;
    }

    //Получение фото новости
    async getPostImage(req: Request): Promise<string> {
        const pictures = (req.url.split(':')[1]);
        const post = await this.postDB.findOne({ where: { pictures } });
        if (!post) {
            throw new Error("Post with this id is not found");
        }
        return post.pictures;
    }

    async deletePost(idPost: number) {
        await this.postDB.destroy({ where: { id: idPost } })
    }

    //Последние новости на главной странице
    async getLatestPosts(): Promise<PostModel[]> {
        const posts: PostModel[] = await this.postDB.findAll(
            {
                include: { model: CategoryModel },
                where: { status: "Проверено" }
            }
        );
        posts.sort((a, b) => a.id - b.id);
        const latestPosts: PostModel[] = [];
        for (let i = posts.length - 1; i >= 0; i--) {
            latestPosts.push(posts[i]);
            if (latestPosts.length >= 8) break;
        }
        return latestPosts;
    }

    //Получение неподтвержденных новостей
    async getNotVerufyNews(categoryId: number): Promise<PostModel[]> {
        return await this.postDB.findAll({ where: { status: "Проверить", category_id: categoryId }, include: { model: UserModel } })
    }

    async updatePost(req: Request) {
        const { id, title, text } = req.body
        if(title.replaceAll(' ','')==''||text.replaceAll(' ','')==''){
            throw new HttpException("Заголовок и текст не могут быть пустыми!",400)
        }
        await this.postDB.update({title,text}, { where: { id: id } })
    }

    //Получение статуса новости
    async updatePostStatus(req) {
        await this.postDB.update(
            {
                status: "Проверено",
            },
            {
                where: { id: req.body[0] }
            }
        ).catch(err => { throw err })
    }

    async getCategorys(req: Request) {
        return await this.categoryDB.findAll().catch(err => { throw err });
    }

    async getUsers() {
        return await this.userService.getUsers();
    }

    //Получение пользоателя по id
    async getUserById(req: Request) {
        return await this.userService.getUser(req);
    }

    //Получение новости по id пользователя (ваши новости)
    async getPostsByIdUser(userId:number): Promise<PostModel[]> {
        console.log(userId);
        return await this.postDB.findAll(
            {
                where: {user_id: userId },
                include: [
                    { model: UserModel },
                    { model: LikeModel },
                    { model: CommentModel }
                ]
            }
        ).catch(() => {
            throw new HttpException("Непредвиденная ошибка сервера", 502)

        })
    }
    //Добавления лайка новсти
    async addLike(req: Request) {
        const post_id = req.body[0]
        const user_id = (await this.userService.decodeToken(req.cookies.AccsesToken)).id;
        const isLiked = await this.likeDB.findOne({ where: { user_id: user_id, post_id: post_id } });
        if (isLiked) {
            await this.likeDB.destroy({
                where: { post_id: post_id, user_id: user_id }
            })
        }
        else {
            await this.likeDB.create({
                post_id: post_id,
                user_id: user_id,
            })
        }
    }

    //Добавления комментариев
    async getComments(params) {
        const idCategory = params.page.split(':')[0];
        let idPage = params.page.split(':')[1];
        return await this.commentDB.findAll({ where: { post_id: idPage }, include: { model: UserModel } })
    }
}