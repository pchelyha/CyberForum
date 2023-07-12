import { BelongsTo, Column, DataType, ForeignKey, Model, Table } from "sequelize-typescript";
import { PostModel } from "./postModel";
import { UserModel } from "./userModel";
import { CommentModel } from "./commentModel";

@Table({tableName:"likesComment",createdAt:false,updatedAt:false})
export class CommentLikeModel extends Model<CommentLikeModel> {
    @Column({type:DataType.INTEGER,primaryKey:true,unique:true,autoIncrement:true})
    like_id:number;

    @ForeignKey(()=>CommentModel)
    @Column({type:DataType.INTEGER})
    comment_id:number;

    @ForeignKey(()=>UserModel)
    @Column({type:DataType.INTEGER})
    user_id:number;

    
    @BelongsTo(()=>CommentModel)
    comment_likes:CommentModel

}