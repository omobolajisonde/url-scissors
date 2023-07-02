import crypto from "crypto";
import QRCode from "qrcode";

import catchAsync from "../utils/catchAsync";
import validateUrl from "../utils/validateURL";
import AppError from "../utils/appError";
import Url from "../models/urlModel";
import UserObject from "../interfaces/UserObject";
import Cache from "../config/redis";

export const shortenURL = catchAsync(async (req, res, next) => {
  // Get the longURL to shorten
  const { longUrl, customAlias } = req.body as {
    longUrl: string;
    customAlias: string;
  };

  // Check if the user has a short url for the inputted long url
  const existingUrl = await Url.findOne({
    userId: (req.user as UserObject)?._id, // If loggedIn, query is narrowed down to loggedIn user collection
    longUrl,
  });
  if (existingUrl) {
    return res
      .status(200)
      .json({ status: "success", data: { url: existingUrl } });
  }

  // Confirm it's a valid URL
  const isValid = await validateUrl(longUrl);
  if (isValid) {
    // Create MD5 (Message Digest Algorithm 5) hash
    const hash =
      customAlias ||
      crypto
        .createHash("md5")
        .update(
          (req.user as UserObject)?.email
            ? (req.user as UserObject)?.email + longUrl
            : longUrl
        )
        .digest("hex"); // Use custom alias if provided by user, else generate an hash alias
    const urlAlias = hash.slice(0, 6);
    const shortUrl = `${req.protocol}://${req.get("host")}/s/${urlAlias}`;
    const url = await Url.create({
      userId: (req.user as UserObject)?._id,
      longUrl,
      shortUrl,
      urlAlias,
    });
    // Cache Url info
    await Cache.redis.set(`url:${url.urlAlias}`, JSON.stringify(url));
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
    // Update click count
    url.clicks = url.clicks + 1;
    // Get source
    const referringSite = req.get("Referer");
    if (referringSite) {
      // Update clicks source
      url.clicksSource.push(referringSite);
    }
    // Save updates
    await url.save();
    // Update Cache
    await Cache.redis.set(`url:${url.urlAlias}`, JSON.stringify(url));
    // Redirect to the original URL
    return res.redirect(url.longUrl);
  } else {
    throw new AppError("Not found!", 404, true);
  }
});

export const generateQRCode = catchAsync(async (req, res, next) => {
  const { Url } = req.body as { Url: string };

  QRCode.toDataURL(
    Url,
    {
      errorCorrectionLevel: "H",
      type: "image/png",
      margin: 4,
      scale: 4,
      // color: {
      //   dark: "#333333",
      //   light: "#3498db",
      // },
    },
    (err, dataURI) => {
      if (err) {
        throw new AppError("Error generating QR code for, " + Url, 500);
      }
      return res
        .status(201)
        .json({ status: "success", data: { url: dataURI } });
    }
  );
});
