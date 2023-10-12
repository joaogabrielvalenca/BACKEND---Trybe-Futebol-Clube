import { Request, Response, NextFunction } from 'express';
import * as jwt from 'jsonwebtoken';

export default class AuthMiddleware {
  private secret: string;

  constructor() {
    this.secret = process.env.JWT_SECRET || 'secret';
  }

  public validateToken(req: Request, res: Response, next: NextFunction): Response | undefined {
    const { authorization } = req.headers;

    if (!authorization) {
      return res.status(401).json({ message: 'Token not found' });
    }

    const token = authorization.split(' ')[1];

    if (!token) {
      return res.status(401).json({ message: 'Token must be a valid token' });
    }

    try {
      jwt.verify(token, this.secret);
      next();
    } catch (err) {
      res.status(401).json({ message: 'Token must be a valid token' });
    }
  }
}
