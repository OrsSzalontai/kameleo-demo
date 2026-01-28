export interface ApiError {
  error: {
    code: string;
    message: string;
    traceId?: string;
    details?: any;
  };
}
