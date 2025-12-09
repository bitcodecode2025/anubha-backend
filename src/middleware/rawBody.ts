import { Request, Response, NextFunction } from "express";

/**
 * Middleware to preserve raw body for webhook signature verification
 * Razorpay requires the raw body string to verify webhook signatures
 */
export default function rawBodyMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (req.method !== "POST") {
    return next();
  }

  req.setEncoding("utf8");
  let data = "";

  req.on("data", (chunk) => {
    data += chunk;
  });

  req.on("end", () => {
    // Store raw body as string for signature verification
    (req as any).rawBody = data;

    // Also parse JSON for normal request handling
    try {
      req.body = JSON.parse(data);
    } catch (e) {
      req.body = {};
    }

    next();
  });
}
