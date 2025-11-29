export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
}

export interface PageResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  first: boolean;
  last: boolean;
}