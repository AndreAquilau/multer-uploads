import { Request, Response } from 'express';
import { getRepository } from 'typeorm';
import User from '../models/User';
import valiator from 'class-validator';

class UserController {
  async index(request: Request, response: Response) {
    try {
      const users = await getRepository(User).find();

      if (users.length == 0) {
        return response.status(204).json({
          data: ['User not found!'],
        });
      }

      return response.status(200).json({
        data: users,
      });
    } catch (error) {
      return response.status(400).json({
        errors: [null],
      });
    }
  }

  async show(request: Request | any, response: Response) {
    try {
      const user = await getRepository(User).findOne({
        id: request.userId,
        email: request.userEmail,
      });

      if (!user) {
        return response.status(204).json({
          data: ['User not found!'],
        });
      }

      return response.status(200).json({
        data: user,
      });
    } catch (error) {
      return response.status(400).json({
        errors: [null],
      });
    }
  }

  async store(request: Request | any, response: Response) {
    try {
      const { nome, email, password } = request.body;
      const repository = getRepository(User);
      const user = new User();

      user.nome = nome;
      user.email = email;
      user.password = password;

      const errors = await valiator?.validate(user);

      if (errors?.length > 0) {
        return response.status(400).json({
          errors: errors.map((key) => key.constraints),
        });
      }

      const res = await repository.save(user);

      return response.status(201).json({
        data: res,
      });
    } catch (error) {
      return response.status(400).json({
        errors: error.message,
      });
    }
  }

  async update(request: Request | any, response: Response) {
    try {
      if (!request.userId || !request.userEmail) {
        return response.status(400).json({
          errors: ['Id and Email is required'],
        });
      }
      const res = await getRepository(User).update(
        {
          id: request.userId,
          email: request.userEmail,
        },
        request.body,
      );

      return response.status(201).json({
        data: res,
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
      const res = await getRepository(User).delete({
        id: request.userId,
        email: request.userEmail,
      });

      return response.status(201).json({
        data: res,
      });
    } catch (error) {
      return response.status(400).json({
        errors: [null],
      });
    }
  }
}

export default new UserController();
