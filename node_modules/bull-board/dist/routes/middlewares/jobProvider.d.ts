import { NextFunction, Request, Response } from 'express-serve-static-core';
export declare function jobProvider(): (req: Request, res: Response, next: NextFunction) => Promise<void | Response<any, Record<string, any>, number>>;
