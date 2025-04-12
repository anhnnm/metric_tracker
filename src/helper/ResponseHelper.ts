import { Response } from 'express';

export class ResponseHelper {
  static success(res: Response, message: string, data: any = null, code: number = 200) {
    return res.status(code).json({
      success: true,
      message,
      data,
    });
  }

  static error(res: Response, message: string, code: number = 500) {
    return res.status(code).json({
      success: false,
      message,
    });
  }
}
