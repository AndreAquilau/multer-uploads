import { Request, Response } from 'express';
import { getRepository } from 'typeorm';
import Photo from '../models/Photo';
import multer from 'multer';
import multerConfig from '../config/multer';
import fs from 'fs';
import { resolve } from 'path';

const uploads = multer(multerConfig).single('foto');

class PhotoController {
  async index(request: Request, response: Response) {
    try {
      const photos = await getRepository(Photo).find();

      if (photos.length == 0) {
        return response.status(204).json({
          data: 'User not found!',
        });
      }

      return response.status(200).json({
        data: photos,
      });
    } catch (error) {
      return response.status(400).json({
        errors: [null],
      });
    }
  }

  async show(request: Request | any, response: Response) {
    try {
      const photo = await getRepository(Photo).findOne({
        fkIdUser: request.userId,
        nome: request.params.nome,
      });

      if (!photo) {
        return response.status(204).json({
          data: ['Photo not found!'],
        });
      }

      return response.status(200).json({
        data: photo,
      });
    } catch (error) {
      return response.status(400).json({
        errors: [null],
      });
    }
  }

  async store(request: Request | any, response: Response) {
    return uploads(request, response, async (error) => {
      console.log(error);
      if (error) {
        return response.status(400).json({
          errors: error.code,
        });
      }
      try {
        const { filename, originalname } = request.file;
        const { nome } = request.body;

        const repository = getRepository(Photo);

        const photo = repository.create({
          filename,
          originalname,
          nome,
          fkIdUser: request.userId,
        });

        const res = await repository.save(photo);
        return response.status(200).json({
          data: res,
        });
      } catch (error) {
        return response.status(400).json({
          errors: [null],
        });
      }
    });
  }

  async update(request: Request | any, response: Response) {
    try {
      if (!request.userId || !request.userEmail) {
        return response.status(400).json({
          errors: ['Id and Email is required'],
        });
      }

      const photoUpdate = await getRepository(Photo).findOne({
        fkIdUser: request.userId,
        nome: request.params.nome,
      });

      if (!photoUpdate) {
        return response.status(204).json({
          data: ['Photo not found!'],
        });
      }

      const photo = await getRepository(Photo).update(
        {
          fkIdUser: request.userId,
          nome: request.params.nome,
        },
        request.body,
      );

      return response.status(200).json({
        data: photo,
      });
    } catch (error) {
      return response.status(400).json({
        errors: [null],
      });
    }
  }

  async delete(request: Request | any, response: Response) {
    try {
      if (!request.userId || !request.userEmail) {
        return response.status(400).json({
          errors: ['Id and Email is required'],
        });
      }

      const photoDelete = await getRepository(Photo).findOne({
        fkIdUser: request.userId,
        nome: request.params.nome,
      });

      if (!photoDelete) {
        return response.status(400).json({
          data: ['Photo not found!'],
        });
      }

      const photo = await getRepository(Photo).delete({
        fkIdUser: request.userId,
        nome: request.params.nome,
      });

      if (photo.affected == 1) {
        await fs.promises.unlink(
          resolve(
            __dirname,
            '..',
            '..',
            process.env.FILES_STATICS_IMAGES || '',
            photoDelete.filename,
          ),
        );
      } else {
        return response.status(400).json({
          errors: [null],
        });
      }

      return response.status(200).json({
        data: photo,
      });
    } catch (error) {
      return response.status(400).json({
        errors: [null],
      });
    }
  }
}

export default new PhotoController();
