import { extname } from 'path';
import { HttpException, HttpStatus } from '@nestjs/common';

//Фильтры файлов
export const imageFileFilter = (req, file, callback) => {
  console.log(file);
  if(!req.cookies.AccsesToken){
    return callback(
      new HttpException(
        'Only image authorizated users can write post',
        HttpStatus.BAD_REQUEST,
      ),
      false,
    );
  }
  if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)&&'orinalname' in file) {
    return callback(
      new HttpException(
        'Only image files are allowed!',
        HttpStatus.BAD_REQUEST,
      ),
      false,
    );
  }
  callback(null, true);
};
export const editFileName = (req, file, callback) => {
  const name = file.originalname.split('.')[0];
  const fileExtName = extname(file.originalname);
  const randomName = Array(4)
    .fill(null)
    .map(() => Math.round(Math.random() * 10).toString(10))
    .join('');
  callback(null, `${name}${randomName}${fileExtName}`);
};