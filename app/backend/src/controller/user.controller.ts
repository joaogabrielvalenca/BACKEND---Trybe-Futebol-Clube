import { Request, Response } from 'express';
// import * as jwt from 'jsonwebtoken';
import UserService from '../services/user.service';

// const jwtSecret = 'jwt_secret';

export default class UserController {
  constructor(
    private userService = new UserService(),
  ) {}

  public async login(req: Request, res: Response): Promise<Response | undefined> {
    const { email, password } = req.body;

    const loginResponse = await this.userService.login(email, password);

    if (loginResponse.status === 'SUCCESS') {
      return res.status(200).json({ token: loginResponse.data });
    }

    if (loginResponse.status === 'UNAUTHORIZED') {
      return res.status(401).json({ message: loginResponse.message });
    }
    if (loginResponse.status === 'BAD_REQUEST') {
      return res.status(400).json({ message: loginResponse.message });
    }
  }

  public async role(req: Request, res: Response): Promise<Response | undefined> {
    const { authorization } = req.headers;
    if (!authorization) {
      return res.status(401).json({ message: 'Token not found' });
    }
    const token = authorization.split(' ')[1];
    const userResponse = await this.userService.role(token);
    if (userResponse) {
      return res.status(200).json(userResponse);
    }
    return res.status(401).json({ message: 'Token must be a valid token' });
  }
}
