import { Request, Response, NextFunction } from "express";

export default function rawBodyMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  req.setEncoding("utf8");
  let data = "";

  req.on("data", (chunk) => {
    data += chunk;
  });

  req.on("end", () => {
    req.body = Buffer.from(data);
    next();
  });
}
