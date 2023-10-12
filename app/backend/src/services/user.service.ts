import { ModelStatic } from 'sequelize';
import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';
import User from '../database/models/User';
import LoginResponse from '../Interfaces/LoginResponse';
import RoleResponse from '../Interfaces/RoleResponse';

const jwtSecret: string | undefined = process.env.JWT_SECRET;
const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}$/;
const invalidMessage = 'Invalid email or password';
const undefinedField = 'All fields must be filled';

export default class UserService {
  constructor(
    private userModel: ModelStatic<User> = User,
  ) {}

  public async login(email: string, password: string): Promise<LoginResponse> {
    if (!email || !password) {
      return { status: 'BAD_REQUEST', message: undefinedField };
    }
    if (!emailRegex.test(email)) {
      return { status: 'UNAUTHORIZED', message: invalidMessage };
    }
    if (password.length < 6) {
      return { status: 'UNAUTHORIZED', message: invalidMessage };
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

  public async role(token: string): Promise<RoleResponse | undefined> {
    const decodedToken = jwt.verify(token, 'jwt_secret');
    if (typeof decodedToken === 'string') {
      throw new Error('Failed to decode token');
    }
    const decodedEmail = decodedToken.email;
    const user = await this.userModel.findOne({
      where: ({ email: decodedEmail }),
      attributes: ['role'],
    });
    if (user) {
      return user.dataValues;
    }
  }
}
