import { Request, Response } from 'express';
import { getRepository } from 'typeorm';
import User from '../models/User';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

class LoginController {
  async store(request: Request | any, response: Response) {
    try {
      const { email, password } = request.body;

      const user = await getRepository(User).findOne({
        email,
      });

      if (!user) {
        return response.status(204).json({
          data: ['Email ou senha Inválido!'],
        });
      }
      if (!(await bcrypt.hash(password, user.password_hash))) {
        return response.status(204).json({
          data: ['Email ou senha Inválido!'],
        });
      }

      const token = jwt.sign(
        { id: user.id, email: user.email },
        process.env.TOKEN_SECRET || '',
        {
          expiresIn: process.env.TOKEN_EXPIRE_IN || '',
        },
      );

      const data = {
        id: user.id,
        email: user.email,
        token,
      };

      return response.status(201).json({
        data,
      });
    } catch (error) {
      return response.status(400).json({
        errors: [null],
      });
    }
  }
}

export default new LoginController();
