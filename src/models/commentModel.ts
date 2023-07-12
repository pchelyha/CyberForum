import { BelongsTo, Column, DataType, ForeignKey, HasMany, Model, Table } from "sequelize-typescript";
import { UserModel } from "./userModel";
import { PostModel } from "./postModel";
import { CommentLikeModel } from "./commentLikeModel";

@Table({tableName:"comments",updatedAt:false,createdAt:false})
export class CommentModel extends Model<CommentModel>{

    @Column({type: DataType.INTEGER, primaryKey: true, autoIncrement: true,unique: true})
    comment_id:number;

    @ForeignKey(()=>UserModel)
    @Column({type: DataType.INTEGER,unique: false,allowNull:false})
    user_id:number;

    @ForeignKey(()=>PostModel)
    @Column({type: DataType.INTEGER,unique: false,allowNull:false})
    post_id:number;

    @BelongsTo(()=>PostModel)
    post_comments:PostModel;

    @HasMany(()=>CommentLikeModel)
    comment_likes:CommentModel[]

    
    @BelongsTo(()=>UserModel)
    user_comments:UserModel;


    @Column({type: DataType.STRING,allowNull:false})
    comment_date:string;
    
    @Column({type: DataType.STRING(1000)})
    comment_text:string;
}