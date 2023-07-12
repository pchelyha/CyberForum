import { BelongsTo, Column, DataType, ForeignKey, Model, Table } from "sequelize-typescript";
import { PostModel } from "./postModel";
import { UserModel } from "./userModel";

@Table({tableName:"likes",createdAt:false,updatedAt:false})
export class LikeModel extends Model<LikeModel> {
    @Column({type:DataType.INTEGER,primaryKey:true,unique:true,autoIncrement:true})
    like_id:number;

    @ForeignKey(()=>PostModel)
    @Column({type:DataType.INTEGER})
    post_id:number;

    @ForeignKey(()=>UserModel)
    @Column({type:DataType.INTEGER})
    user_id:number;

    
    @BelongsTo(()=>PostModel)
    news_likes:PostModel

}