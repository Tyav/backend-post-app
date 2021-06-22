import { IRequest } from '../app/types/express';
import aws from 'aws-sdk';


import multer from 'multer';
import multerS3 from 'multer-s3';
import stringGen from 'otp-generator';

export const s3 = new aws.S3({
  endpoint: 'https://s3.us-west-2.amazonaws.com',
  region: 'us-west-2',
});

// function getPreviousAvatar(req: IRequest, folder: string): void {
// // check if user has an avatar, set it to old
//   if (req && folder === 'avatar') {
//     const urlArray = req.user.avatar.split('/');
//     req.oldAvatar = urlArray[3] === folder ? `${urlArray[urlArray.length - 2]}/${urlArray[urlArray.length - 1]}` : ''; // get name of old avatar to automate delete purpose
//   }
// }

const options = {
  specialChars: false,
  digits: true,
  alphabets: true,
  upperCase: true,
};

export default function upload(folder: string) {
  // change bucket
  return multer({
    storage: multerS3({
      s3,
      bucket: 'testbuck-ond',
      acl: 'public-read', // access control
      key(req: IRequest, file: any, cb: Function) {
        // get previous filename from image url
        //getPreviousAvatar(req, folder);
        const extension = file.originalname?.split('.');
        req.s3 = s3; // add s3 to request body for error handling
        const stringVal = stringGen
          // @ts-ignore
          .generate(Math.ceil(Math.random() * 30), options)
          .toString();
        const fileName = `${folder}-${stringVal}-${Date.now()}.${
          extension[extension.length - 1]
        }`; // create file name if file never exist ${/*${req.user.id.slice(2, 8)}-*/}
        cb(null, `${file.fieldname}/${fileName}`); // store image in folder on S3
      },
    }),
    fileFilter(_req: IRequest, file: any, cb: Function) {
      if (
        file.fieldname === 'image' &&
        !file.originalname.match(/\.(jpg|jpeg|png)$/i)
      ) {
        return cb(new Error('File must be an image file [.png, .jpg, .jpeg]'));
      }
      cb(undefined, true);
    },
  });
}

