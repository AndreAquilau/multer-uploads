import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import User from '../models/User';
import { getRepository } from 'typeorm';

export default async function (
  request: Request | any,
  response: Response,
  next: NextFunction,
) {
  const { authorization } = request.headers;

  if (!authorization)
    return response.status(401).json({ errors: ['Token is requires'] });
  try {
    const [, token] = authorization.split(' ');

    const dados: any = await jwt.verify(token, process.env.TOKEN_SECRET || '');

    const user = await getRepository(User).findOne({
      email: dados.email,
      id: dados.id,
    });

    if (!user) {
      return response.status(204).json({
        data: ['Token expired!'],
      });
    }

    request.userId = dados.id;
    request.userEmail = dados.email;
    next();
  } catch (error) {
    response.status(401).json({
      errors: ['Token Invalid!'],
    });
  }
}
