import { IRequest } from '../app/types/express';
import aws from 'aws-sdk';

// import { S3 }  from '@aws-sdk/client-s3';
// import fs  from 'fs';
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
      if (file.fieldname === 'audio' && !file.originalname.match(/\.(mp3|wav)$/i)) {
        return cb(new Error('File must be an audio file'));
      }
      if (
        file.fieldname === 'video' &&
        !file.originalname.match(/\.(mp4|3gp|mvk|avi|mov|wmv|ogv)$/i)
      ) {
        return cb(new Error('File must be an video file'));
      }
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

// const aws = require('aws-sdk');
// const multer = require('multer');
// const multerSharp = require('multer-s3');
// const stringGen = require('otp-generator');
// const config = require('../config/env');

// // Use our env vars for setting credentials.
// aws.config.update({
//   secretAccessKey: config.space.secretAccessKey,
//   accessKeyId: config.space.accesskeyId,
// });

// // set s3 endpoint to Digital Ocean Space
// const spaceEndpoint = new aws.Endpoint(config.space.endpoint);
// const s3 = new aws.S3({
//   endpoint: spaceEndpoint,
// });
// /**
//  * - This function extracts user avatar and stores it as oldAvatar,
//  * a placeholder until update is complete, if error, it can be used to revert process
//  * @param {{}} req - Request object
//  * @param {string} folder - folder to store image
//  */
// function getPreviousAvatar(req, folder) {
// // check if user has an avatar, set it to old
//   if (req.user.avatar && folder === 'avatar') {
//     const urlArray = req.user.avatar.split('/');
//     req.oldAvatar = urlArray[3] === folder ? `${urlArray[urlArray.length - 2]}/${urlArray[urlArray.length - 1]}` : ''; // get name of old avatar to automate delete purpose
//   }
// }
// s3.Bucket = config.space.bucket;
// /**
//  * Function returns middleware for uplaod
//  * @param {string} folder - space storage folder for file
//  */
// function upload(folder) {
//   // Change bucket props to your file storage space name
//   return multer({
//     storage: multerSharp({
//       s3,
//       bucket: s3.Bucket,
//       acl: 'public-read', // access control
//       key(req, file, cb) {
//         // get previous filename from image url
//         getPreviousAvatar(req, folder);
//         req.s3 = s3; // add s3 to request body for error handling
//         const stringVal = stringGen.generate(Math.ceil(Math.random() * 30), { specialChars: false }).toString();
//         const imageName = `${folder}-${req.user.id.slice(2, 8)}-${stringVal}-${Date.now()}.png`;// create file name if avatar never exist
//         cb(null, `${folder}/${imageName}`); // store image in avatar folder on DO space
//       },
//       toFormat: { type: 'png' }, // format to convert image to
//       resize: [
//         { suffix: 'xlg', width: 1200, height: 1200 },
//         { suffix: 'lg', width: 800, height: 800 },
//         { suffix: 'md', width: 500, height: 500 },
//         { suffix: 'sm', width: 300, height: 300 },
//         { suffix: 'xs', width: 100 },
//         { suffix: 'original' },
//       ],
//     }),
//     // filter input files, must be jpg, jpeg, or png else rejection is done
//     fileFilter(req, file, cb) {
//       if (!file.originalname.match(/\.(png|jpg|jpeg)$/i)) {
//         return cb(new Error('File must be jpg, jpeg or png'));
//       }
//       cb(undefined, true);
//     },
//     limits: {
//       fileSize: 10000000, // file size to be uploaded must be less than 10mb
//     },
//   });
// }

// module.exports = upload;
