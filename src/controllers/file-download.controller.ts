// Copyright IBM Corp. and LoopBack contributors 2020. All Rights Reserved.
// Node module: @loopback/example-file-transfer
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

import {inject} from '@loopback/core';
import {
  get,
  HttpErrors,
  oas,
  param,
  Response,
  RestBindings,
} from '@loopback/rest';
import fs from 'fs';
import path from 'path';
import {promisify} from 'util';
import {STORAGE_DIRECTORY} from '../keys';

const readdir = promisify(fs.readdir);

/**
 * A controller to handle file downloads using multipart/form-data media type
 */
export class FileDownloadController {
  constructor(@inject(STORAGE_DIRECTORY) private storageDirectory: string) {}
  @get('/files', {
    responses: {
      200: {
        content: {
          // string[]
          'application/json': {
            schema: {
              type: 'array',
              items: {
                type: 'string',
              },
            },
          },
        },
        description: 'A list of files',
      },
    },
  })
  async listFiles() {
    const files = await readdir(this.storageDirectory);
    return files;
  }

  @get('/files/{filename}')
  @oas.response.file()
  downloadFile(
    @param.path.string('filename') fileName: string,
    @inject(RestBindings.Http.RESPONSE) response: Response,
  ) {
    const file = this.validateFileName(fileName);
    // console.log({file})
    // response.download(file, fileName);
    const filePath = path.join(__dirname, `.sandbox/${fileName}`);
// console.log({filePath})
    fs.readFile(file, (err, data) => {
        if (err) {
            response.status(500).send('Error reading file');
          return;
        }
  
        response.setHeader('Content-Type', 'application/octet-stream'); // Set the appropriate MIME type
        response.setHeader('Content-Disposition', `inline; filename=${fileName}`); // 'inline' to view in browser
        response.send(data);
      });
    
    return response;
  }

  
  @get('/upload/property_listing/{filename}')
  @oas.response.file()
  viewFile(
    @param.path.string('filename') fileName: string,
    @inject(RestBindings.Http.RESPONSE) response: Response,
  ) {
    const file = this.validateFileName(fileName);
    // console.log({file})
    // response.download(file, fileName);
    const filePath = path.join(__dirname, `.sandbox/${fileName}`);
// console.log({filePath})
    fs.readFile(file, (err, data) => {
        if (err) {
            response.status(500).send('Error reading file');
          return;
        }
  
        response.setHeader('Content-Type', 'application/octet-stream'); // Set the appropriate MIME type
        response.setHeader('Content-Disposition', `inline; filename=${fileName}`); // 'inline' to view in browser
        response.send(data);
      });
    
    return response;
  }


  /**
   * Validate file names to prevent them goes beyond the designated directory
   * @param fileName - File name
   */
  private validateFileName(fileName: string) {
    const resolved = path.resolve(this.storageDirectory, fileName);
    if (resolved.startsWith(this.storageDirectory)) return resolved;
    // The resolved file is outside sandbox
    throw new HttpErrors.BadRequest(`Invalid file name: ${fileName}`);
  }
}