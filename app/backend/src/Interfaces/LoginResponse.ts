export default interface LoginResponse {
  token?: string;
  message?: string;
  status?: string | object;
  data?: string | object;
}
