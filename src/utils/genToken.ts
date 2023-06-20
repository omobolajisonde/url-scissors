import jwt from "jsonwebtoken";

import UserDocument from "../interfaces/UserDocument";

export default function (user: UserDocument) {
  const payload = { user };
  const token = jwt.sign(payload, process.env.JWT_SECRET, {
    algorithm: "HS256",
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
  return token;
}
