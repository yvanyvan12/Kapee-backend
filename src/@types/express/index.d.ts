// src/@types/express/index.d.ts
import 'express';

declare module 'express' {
  export interface Request {
    userId?: string; // this tells TS that req.userId exists
  }
}
