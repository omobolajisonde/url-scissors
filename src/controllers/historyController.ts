import Url from "../models/urlModel";
import catchAsync from "../utils/catchAsync";
import UserObject from "../interfaces/UserObject";

export const renderHistory = catchAsync(async (req, res, next) => {
  let { page } = req.query as { page: string | number };
  page = +page || 1;
  const limit = 2;
  const start = (page - 1) * limit;
  const nextStart = page * limit;

  const urls = await Url.find({ userId: (req.user as UserObject)?._id });
  const selectedUrls = urls.slice(start, page * limit);
  const prevPage = page - 1;
  const showNext = nextStart < urls.length;
  return res.status(200).render("history", {
    isLoggedIn: true,
    user: req.user,
    urls: selectedUrls,
    prevPage,
    showNext,
  });
});

export const renderUrlAnalytics = catchAsync(async (req, res, next) => {
  let { urlAlias } = req.params as { urlAlias: string };

  const url = await Url.findOne({
    userId: (req.user as UserObject)?._id,
    urlAlias,
  });
  return res.status(200).render("urlAnalytics", {
    isLoggedIn: true,
    user: req.user,
    url,
  });
});
