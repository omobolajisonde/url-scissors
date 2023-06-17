import mongoose from "mongoose";

const DATABASE_URL =
  process.env.DATABASE_URL || "mongodb://localhost:27017/url-scissors";

export default async function () {
  try {
    await mongoose.connect(DATABASE_URL);
    console.log("connected to mongoDB successfully...");
  } catch (err) {
    console.log("connection to mongoDB failed...", err);
  }
}
