// import { Request, Response } from 'express';
// import UserService from '../services/user.service';
// import LoginResponse from '../Interfaces/LoginResponse';

// export default class UserController {
//   constructor(
//     private userService = new UserService(),
//   ) { }

//   public async login(req: Request, res: Response): Promise<LoginResponse> {
//     const { email, password } = req.body;
//     if (!email) {
//       return res.status(400).json({ message: 'All fields must be filled' });
//     }

//     if (!password) {
//       return res.status(400).json({ message: 'All fields must be filled' });
//     }

//     const loginResponse = await this.userService.login(email, password);
//     if (loginResponse.status === 'UNAUTHORIZED') {
//       return res.status(401).json({ message: 'Invalid email or password' });
//     }

//     return res.status(200).json({ token: loginResponse.data });
//   }
// }

import { Request, Response } from 'express';
import UserService from '../services/user.service';
// import LoginResponse from '../Interfaces/LoginResponse';

export default class UserController {
  constructor(
    private userService = new UserService(),
  ) {}

  public async login(req: Request, res: Response): Promise<Response> {
    const { email, password } = req.body;

    const loginResponse = await this.userService.login(email, password);

    if (loginResponse.status === 'SUCCESS') {
      return res.status(200).json({ token: loginResponse.data });
    }
    return res.status(loginResponse.status === 'BAD_REQUEST' ? 400 : 401)
      .json({ message: loginResponse.message });
  }
}
