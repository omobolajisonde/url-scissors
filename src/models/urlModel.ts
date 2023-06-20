import mongoose from "mongoose";

const Schema = mongoose.Schema;
const ObjectId = mongoose.Schema.Types.ObjectId;
const urlSchema = new Schema(
  {
    longUrl: {
      type: String,
      required: [true, "Please provide the URL you are trying to shorten."],
      trim: true,
    },
    shortUrl: {
      type: String,
      required: true,
      trim: true,
    },
    urlAlias: {
      type: String,
      required: true,
      trim: true,
    },
    userId: {
      type: ObjectId,
      ref: "User",
    },
    clicks: { type: Number, default: 0 },
    clicksSource: [String],
  },
  { timestamps: {} }
);

const Url = mongoose.model("Url", urlSchema);

export default Url;
