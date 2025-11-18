import jwt from "jsonwebtoken";
import crypto from "crypto";
import prisma from "../../../database/prismaclient";

// ----- ACCESS TOKEN -----

export function generateAccessToken(payload: any): string {
  return jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET!, {
    expiresIn: "15m",
  });
}

// ----- REFRESH TOKEN -----

export async function generateRefreshToken(userId: string) {
  // totally random secure token
  const token = crypto.randomBytes(48).toString("hex");

  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 30); // 30 days validity

  // store token in DB
  await prisma.refreshToken.create({
    data: {
      token,
      userId,
      expiresAt,
    },
  });

  return token;
}

// ----- VERIFY ACCESS TOKEN -----

export function verifyAccessToken(token: string) {
  try {
    return jwt.verify(token, process.env.ACCESS_TOKEN_SECRET!);
  } catch {
    return null;
  }
}

// ----- VERIFY REFRESH TOKEN -----

export async function verifyRefreshToken(refreshToken: string) {
  const tokenData = await prisma.refreshToken.findUnique({
    where: { token: refreshToken },
  });

  if (!tokenData) return null;

  if (new Date() > new Date(tokenData.expiresAt)) return null;

  return tokenData;
}

// ----- GENERATE FULL TOKEN PAIR -----

export async function generateTokenPair(userId: string, role: string) {
  const accessToken = generateAccessToken({ userId, role });
  const refreshToken = await generateRefreshToken(userId);

  return { accessToken, refreshToken };
}
