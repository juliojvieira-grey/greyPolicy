// utils/response.ts
export function apiResponse(success: boolean, message?: string, data?: any) {
    return {
      success,
      message,
      ...(data !== undefined ? { data } : {}),
    }
  }
  