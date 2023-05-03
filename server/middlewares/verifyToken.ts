import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

const secretKey = process.env.JWT_SECRET_KEY as string

export const verifyToken = (req: Request, res: Response, next: NextFunction) => {
  const header = req.headers["authorization"]
  if (!header) return res.status(401).json("Missing header.")
  const token = header.split(" ")[1]
  if (!token) return res.status(401).json("Missing token.")

  // console.log("token", token);
  

  try {
    const decodedToken = jwt.verify(token, secretKey) as jwt.JwtPayload
    // console.log("decodedtoken", decodedToken);
    res.locals.user = decodedToken._id
  } catch (error) {
    console.log("Nem sikerult decodeolni a jwt tokent");
  }
  next()
}