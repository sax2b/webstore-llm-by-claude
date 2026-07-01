export interface GenericResponse<T> {
  code: string;
  success: boolean;
  results: T;
}

export interface GuestSessionPayload {
  token: string;
}
