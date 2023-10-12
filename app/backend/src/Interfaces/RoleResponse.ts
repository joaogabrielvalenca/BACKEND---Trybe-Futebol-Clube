import User from '../database/models/User';

export default interface RoleResponse {
  token?: string;
  message?: string;
  status?: string | object;
  user?: string | object | null | User;
  email?: string | null | object;
}
