### Documentação de como usar o multer para uploads

#### Install multer
~~~~bash
yarn add multer && yarn add -D @types/multer

or

npm install multer && npm install --save-dev multer
~~~~

#### Criar variavel de ambiente
~~~env
FILES_STATICS_IMAGES = uploads/images
FILES_STATICS = uploads
~~~

#### Adicionar arquivos státicos da API no express
App.ts
~~~ts
this.app.use(
  `/${process.env.FILES_STATICS_IMAGES}`,
  express.static(
  resolve(__dirname, '..', '..', process.env.FILES_STATICS_IMAGES || ''),
  ),
);
~~~

#### Configurando multer.ts
config/multer.ts
~~~ts
import multer from 'multer';
import { resolve, extname } from 'path';

// Gerar um numero aleatorio para concatenar com o nome original
const roudNumber: () => number = () =>
  Math.floor(Math.random() * 10000 + 10000);

export default {
  fileFilter: (request, file, callback) => {
    //fazer o teste nos formatos de arquivos de entrada, caso seja diferente sera gerar um error
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
  //Caso passe no erro acima não sera passado nenhum erro no callback e true pra ir para o proximo middeware
    callback(null, true);
  },
  storage: multer.diskStorage({
    destination: (request, file, callback) => {
      // para o callback passar null e o diretorio de uploads
      callback(
        null,
        resolve(__dirname, '..', '..', process.env.FILES_STATICS_IMAGES || ''),
      );
    },
    filename: (request, file, callback) => {
      // para o callback passar null e o nome do arquivo que sera salvo nome+formato
      callback(
        null,
        `${Date.now()}${roudNumber()}${extname(file.originalname)}`,
      );
    },
  }),
};
~~~

#### Utilizando multer no controller
~~~ts
import multer from 'multer';
import multerConfig from '../config/multer';

const uploads = multer(multerConfig).single('foto');

class PhotoController {
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
}
~~~

