import { TIMEOUT_SEC, COOKIE_EXPIRY_TIME } from "./config.js";

const timeout = function (s) {
  return new Promise(function (_, reject) {
    setTimeout(function () {
      reject(new Error(`Request took too long! Timeout after ${s} second`));
    }, s * 1000);
  });
};

/**
 * Makes "GET" | "POST" async request to the specified url
 * @param {string} url url to the remote server
 * @param {string} [method=="POST"]
 * @param {Object | undefined} [uploadData=undefined] Incase of a POST request, the data to be sent to the remote server.
 * @param {Object} [headers]
 * @returns {Object} The data requested for.
 * @author Sonde Omobolaji
 */

const headersObj = {
  "Content-Type": "application/json",
};

export const AJAX = async function (
  url,
  uploadData = undefined,
  headers = headersObj,
  method = "POST"
) {
  try {
    const fetchPro = uploadData
      ? fetch(url, {
          method,
          headers,
          body: JSON.stringify(uploadData),
        })
      : fetch(url);

    const res = await Promise.race([fetchPro, timeout(TIMEOUT_SEC)]);
    console.log(res);
    const data = await res.json();

    if (!res.ok) throw new Error(data.message);
    return data;
  } catch (err) {
    throw err;
  }
};

export const setCookie = function (value) {
  // Calculate the cookie expiration time
  const expirationDate = new Date();
  expirationDate.setTime(
    expirationDate.getTime() + COOKIE_EXPIRY_TIME * 60 * 60 * 1000
  ); // Convert 9 hours to milliseconds

  // Format the cookie string
  const cookieString = `jwt=${encodeURIComponent(
    value
  )}; expires=${expirationDate.toUTCString()}; path=/;`;

  // Set the cookie
  document.cookie = cookieString;
};
