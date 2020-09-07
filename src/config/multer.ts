import multer from 'multer';
import { resolve, extname } from 'path';

const roudNumber: () => number = () =>
  Math.floor(Math.random() * 10000 + 10000);

export default {
  fileFilter: (request, file, callback) => {
    if (
      file.mimetype !== 'image/png' &&
      file.mimetype !== 'image/jpeg' &&
      file.mimetype !== 'image/jpeg'
    ) {
      callback(
        new multer.MulterError(
          'LIMIT_UNEXPECTED_FILE',
          'Tipo de arquivo inválido para o tipo png e jpeg',
        ),
      );
    }

    callback(null, true);
  },
  storage: multer.diskStorage({
    destination: (request, file, callback) => {
      callback(
        null,
        resolve(__dirname, '..', '..', process.env.FILES_STATICS_IMAGES || ''),
      );
    },
    filename: (request, file, callback) => {
      callback(
        null,
        `${Date.now()}${roudNumber()}${extname(file.originalname)}`,
      );
    },
  }),
};
