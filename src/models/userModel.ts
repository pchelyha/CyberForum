import { Model ,Table,Column,DataType, HasMany} from "sequelize-typescript";
import { PostModel } from "./postModel";

@Table({tableName: "users",createdAt: false, updatedAt: false })
export class UserModel extends Model<UserModel>{
    @Column({type: DataType.INTEGER,primaryKey: true, autoIncrement: true,unique: true})
    id:number;
    @Column({type: DataType.STRING(16),unique: true,allowNull: false})
    name:string;
    @Column({type: DataType.STRING,unique: false,allowNull: true})
    birthday:string; 
    @Column({type: DataType.STRING, unique: false,allowNull: false})
    password:string; 
    @Column({type: DataType.STRING, unique: true,allowNull: true})
    email:string; 
    @Column({type: DataType.STRING, unique: false,allowNull: true})
    picturepath:string; 
    @Column({type: DataType.STRING, unique: false,allowNull: true})
    role:string; 
    @Column({type: DataType.STRING, unique: false,allowNull: true})
    gender:string; 
    
    @HasMany(()=>PostModel)
    userPost:PostModel[]
}