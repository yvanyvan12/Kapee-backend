import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { User } from "../model/userModels"; // corrected path & name (models, singular)

const JWT_SECRET = process.env.JWT_SECRET ?? "";

export const requireSignin = async (
  req: Request & { user?: any }, // allow attaching `user` to req
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({ message: "Authentication is required" });
    }

    // support headers like "Bearer <token>"
    const token = authHeader.startsWith("Bearer ")
      ? authHeader.split(" ")[1]
      : authHeader;

    // verify token
    const decoded: any = jwt.verify(token, JWT_SECRET);

    // look up user by id and token
    const rootUser = await User.findOne({
      _id: decoded._id,
      "tokens.token": token,
    });

    if (!rootUser) {
      return res.status(401).json({ message: "User not found" });
    }

    // attach user to request and proceed
    req.user = rootUser;
    next();
  } catch (error) {
    console.error(error);
    return res.status(401).json({ message: "Authorization required" });
  }
};
