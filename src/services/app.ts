import express, { Application } from 'express';
import morgan from 'morgan';
import helmet from 'helmet';
import cors from 'cors';
import { json, urlencoded } from 'body-parser';
import authorization from '../middleware/authorization';
import routes from '../routes/index';
import { resolve } from 'path';
import { getRepository } from 'typeorm';
import Photo from '../models/Photo';

class App {
  app: Application;

  constructor() {
    this.app = express();
    this.middleware();
    this.routes();
  }

  middleware() {
    this.app.use(morgan('dev'));
    this.app.use(helmet());
    this.app.use(cors());
    this.app.use(urlencoded({ extended: true }));
    this.app.use(json());
    this.app.use(
      `/${process.env.FILES_STATICS_IMAGES}/:filename?`,
      authorization,
      async (request: any, response, next) => {
        try {
          const photo = await getRepository(Photo).findOne({
            fkIdUser: request.userId,
            filename: request.params.filename,
          });

          if (!photo) {
            return response.status(200).json({
              data: ['Photo not found!'],
            });
          }
          next();
        } catch (error) {
          return response.status(400).json({
            errors: [null],
          });
        }
      },
    );
    this.app.use(
      `/${process.env.FILES_STATICS_IMAGES}`,
      express.static(
        resolve(__dirname, '..', '..', process.env.FILES_STATICS_IMAGES || ''),
      ),
    );
  }
  routes() {
    this.app.use(routes);
  }
}

export default new App().app;
