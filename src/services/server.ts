import '../config/env';
import 'reflect-metadata';
import database from '../database/index';
import app from './app';

database
  .then(() => {
    console.log(`Connection DataBase Success`);
    app.emit('ServerOn');
  })
  .catch((error) => console.log(`Bad Connetion DataBase! Error:${error}`));

app.on('ServerOn', () => {
  app.listen(process.env.PORT, () => {
    if (process.env.MODE == 'development') {
      console.log(`${process.env.BASE_URL}:${process.env.PORT}`);
    }
  });
});
