// import { ModelStatic } from 'sequelize';
// import * as bcrypt from 'bcryptjs';
// import * as jwt from 'jsonwebtoken';
// import User from '../database/models/User';
// import LoginResponse from '../Interfaces/LoginResponse';

// const jwtSecret: string | undefined = process.env.JWT_SECRET;

// export default class UserService {
//   constructor(
//     private userModel: ModelStatic<User> = User,
//   ) {}

//   public async login(email: string, password: string): Promise<LoginResponse> {
//     const host = await this.userModel.findOne({ where: { email } });
//     if (!host) {
//       return {
//         status: 'UNAUTHORIZED',
//         message: 'Invalid email or password' };
//     }

//     if (!email) {
//       return {
//         status: 'BAD_REQUEST',
//         message: 'All fields must be filled'
//       };
//     }

//     const isValidPassword = await bcrypt.compare(password, host.dataValues.password);

//     if (!isValidPassword) {
//       return {
//         status: 'BAD_REQUEST',
//         message: 'All fields must be filled' };
//     }

//     const token = jwt.sign({
//       id: host.dataValues.id,
//       email: host.dataValues.email,
//     }, jwtSecret || 'jwt_secret');

//     return {
//       status: 'SUCCESS',
//       data: token,
//     };
//   }
// }

import { ModelStatic } from 'sequelize';
import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';
import User from '../database/models/User';
import LoginResponse from '../Interfaces/LoginResponse';

const jwtSecret: string | undefined = process.env.JWT_SECRET;
const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}$/;
const invalidMessage = 'Invalid email or password';

export default class UserService {
  constructor(
    private userModel: ModelStatic<User> = User,
  ) {}

  public async login(email: string, password: string): Promise<LoginResponse> {
    if (!email || !password) {
      return { status: 'BAD_REQUEST', message: invalidMessage };
    }
    if (!emailRegex.test(email)) {
      return { status: 'BAD_REQUEST', message: invalidMessage };
    }
    if (password.length < 6) {
      return { status: 'BAD_REQUEST', message: 'less than 6' };
    }

    const host = await this.userModel.findOne({ where: { email } });
    if (!host) return { status: 'UNAUTHORIZED', message: invalidMessage };

    const isValidPassword = await bcrypt.compare(password, host.dataValues.password);

    if (!isValidPassword) return { status: 'UNAUTHORIZED', message: invalidMessage };

    const token = jwt.sign(
      { id: host.dataValues.id, email: host.dataValues.email },
      jwtSecret || 'jwt_secret',
    );

    return { status: 'SUCCESS', data: token };
  }
}
