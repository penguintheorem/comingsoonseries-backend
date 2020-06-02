import { Injectable } from '@nestjs/common';
import * as aws from 'aws-sdk';
import * as fs from 'fs';
import { from, Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { ImageType } from '../models/image-type';

@Injectable()
export class FileUploadService {
  private readonly s3 = new aws.S3();

  constructor() {
    aws.config.setPromisesDependency(Promise);
    aws.config.update({
      accessKeyId: process.env.AWS_ACCESS_KEY,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      region: process.env.REGION,
    });
  }

  upload(
    fileName: string,
    filePath: string,
    type: ImageType,
  ): Observable<string> {
    // upload the file temporarily saved locally to S3
    return from(
      this.s3
        .upload(
          {
            Bucket: process.env.AWS_S3_BUCKET_NAME,
            Body: fs.createReadStream(filePath),
            ACL: 'public-read',
            Key: `${this.getStorageImagePath(type)}/${fileName}`,
          },
          (err, data) => {
            if (err) {
              return throwError(
                `An error occured during the upload of the file: ${fileName}: ${err.name} - ${err.message}`,
              );
            }
            if (data) {
              fs.unlinkSync(filePath); // Empty temp folder
              return data;
            }
          },
        )
        .promise(),
    ).pipe(
      map(data => {
        // return the image url
        return data.Location;
      }),
      catchError(err => {
        return throwError(err);
      }),
    );
  }

  private getStorageImagePath(type: ImageType): string {
    switch (type) {
      case ImageType.COVER:
        return 'covers';
      case ImageType.POSTER:
        return 'posters';
      case ImageType.GADGET:
        return 'gadgets';
    }
  }
}
