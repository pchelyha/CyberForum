import { Column, DataType, HasMany, Model, Table } from "sequelize-typescript";
import { PostModel } from "./postModel";

@Table({tableName: "category", createdAt: false, updatedAt: false })
export class CategoryModel extends Model<CategoryModel>{

    @Column({type: DataType.INTEGER, primaryKey: true, autoIncrement: true,unique: true})
    category_id:number;

    @Column({type: DataType.STRING,unique: true,allowNull:true})
    category_img:string;

    @Column({type: DataType.STRING,unique: true,allowNull:false})
    category_name:string;

    @Column({type: DataType.STRING(1000),unique: false,allowNull:true})
    category_text:string;

    @HasMany(()=>PostModel)
    post_category:PostModel[];

}