import bcrypt from "bcrypt";

//hashing the otp to store the hashed otp in the database
export async function hashOtp(otp: string): Promise<string> {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(otp, salt);
}

//this funcation will validate the plan otp with the hashed otp
export async function validateOtp(
  plainOtp: string,
  hashedOtp: string
): Promise<boolean> {
  return bcrypt.compare(plainOtp, hashedOtp);
}

//this function checks the expiration of otp
export function isOtpExpired(expiresAt: Date): boolean {
  const now = new Date();
  return now > new Date(expiresAt);
}
