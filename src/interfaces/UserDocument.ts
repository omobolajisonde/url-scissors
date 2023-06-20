import { Document } from "mongoose";

interface UserDocument extends Document {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
  createdAt: Date;
  passwordModifiedAt?: Date;
  passwordResetToken?: string;
  passwordResetTokenExpiryTime?: Date;
  isCorrectPassword(password: string): Promise<boolean>;
  passwordModified(a: number): boolean;
  genResetToken(): string;
}

export default UserDocument;
