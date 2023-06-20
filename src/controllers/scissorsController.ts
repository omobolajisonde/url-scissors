import crypto from "crypto";

import catchAsync from "../utils/catchAsync";
import validateUrl from "../utils/validateURL";
import AppError from "../utils/appError";
import Url from "../models/urlModel";

export const shortenURL = catchAsync(async (req, res, next) => {
  // Get the longURL to shorten
  const { longUrl } = req.body as { longUrl: string };
  // Check if the user has a short url for the inputted long url
  const existingUrl = await Url.findOne({ userId: null, longUrl });
  if (existingUrl) {
    return res.status(200).json({ status: "success", data: { existingUrl } });
  }
  // Confirm it's a valid URL
  const isValid = await validateUrl(longUrl);
  if (isValid) {
    // Create MD5 (Message Digest Algorithm 5) hash
    const hash = crypto.createHash("md5").update(longUrl).digest("hex");
    const urlAlias = hash.slice(0, 6);
    const shortUrl = `${req.protocol}://${req.get("host")}/${urlAlias}`;
    const url = await Url.create({ longUrl, shortUrl, urlAlias });
    return res.status(201).json({ status: "success", data: { url } });
  } else {
    throw new AppError(
      "The long URL you provided is techically valid, but source is not accessible.",
      400
    );
  }
});

export const redirectToOriginalURL = catchAsync(async (req, res, next) => {
  // Get the url alias from the url params
  const { urlAlias } = req.params as { urlAlias: string };
  // Check if the current user has such url alias in their shortned url collection
  const url = await Url.findOne({ urlAlias });
  if (url) {
    // Redirect to the original URL
    return res.redirect(url.longUrl);
  } else {
    throw new AppError("Not found!", 404);
  }
});
