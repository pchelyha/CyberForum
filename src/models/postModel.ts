import { Model ,Table,Column,DataType, ForeignKey, BelongsTo, HasMany} from "sequelize-typescript";
import { UserModel } from "./userModel";
import { CategoryModel } from "./categoryModel";
import { CommentModel } from "./commentModel";
import { LikeModel } from "./likeModel";

@Table({tableName: "posts", createdAt: false, updatedAt: false })
export class PostModel extends Model<PostModel>{
    @Column({type: DataType.INTEGER, primaryKey: true, autoIncrement: true,unique: true})
    id:number;
    @Column({type: DataType.STRING,unique: false,allowNull: false})
    title:string;
    @Column({type: DataType.STRING(1000),unique: false,allowNull: false})
    text:string;
    @Column({type: DataType.STRING,unique: false,allowNull: true})
    pictures:string; 
    @Column({type: DataType.STRING,unique: false,allowNull: false})
    writed:string;
    @Column({type: DataType.INTEGER,unique: false,allowNull: true})
    views:number;
    @Column({type:DataType.STRING})
    status:string;

    @ForeignKey(()=>UserModel)
    @Column({type: DataType.INTEGER,unique: false,allowNull:false})
    user_id:number;

    @ForeignKey(()=>CategoryModel)
    @Column({type: DataType.INTEGER,unique: false,allowNull:false})
    category_id:number;

    @BelongsTo(()=>UserModel)
    userPost:UserModel

    @BelongsTo(()=>CategoryModel)
    post_category:CategoryModel

    @HasMany(()=>CommentModel)
    post_comments:CommentModel[];

    @HasMany(()=>LikeModel)
    news_likes:LikeModel[];

}