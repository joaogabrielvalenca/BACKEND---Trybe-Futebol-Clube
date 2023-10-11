// export default interface ServiceResponse {
//   status: string;
//   data: {
//     id?: number;
//     teamName?: string;
//   };
// }
export default interface ServiceResponse<T = unknown> {
  // status: 'SUCCESSFUL' | 'NOT_FOUND' | 'ERROR';
  data?: T;
  message?: string;
}
