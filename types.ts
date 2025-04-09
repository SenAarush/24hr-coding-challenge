export interface ApiResponse<T> {
  statusCode: number;
  message: string;
  data: T;
  token?: string;
  error?: string;
}

export interface TokenPayload {
  email: string;
  role: 'admin' | 'user';
}
