//Логи ошибок
import {appendFile}from 'fs';
import {join} from 'path';
import { post, user } from './types';

export async function logErrorWriter(error:Error): Promise<void> {
    await appendFile(join(__dirname, '../logs/logError.txt'), new Date().toLocaleDateString()+" "+error.message+'\n',(err:Error) => {
      if(err){
        throw err;
      }
    });
}
export async function logUserWriter(user:user): Promise<void> {
  await appendFile(join(__dirname, '../logs/users.txt'), new Date().toLocaleDateString()+" "+user.id,(err:Error) => {
    if(err){
      throw err;
    }
  });
}
export async function logPostWriter(post:post): Promise<void> {
  await appendFile(join(__dirname, '../logs/posts.txt'), new Date().toLocaleDateString()+" "+post.id,(err:Error) => {
    if(err){
      throw err;
    }
  });
}