import http from "http";
import https from "https";

function validateUrl(url: string) {
  return new Promise((resolve, reject) => {
    const protocol = url.startsWith("https") ? https : http;

    // Sends a HEAD request to the url
    const request = protocol.request(url, { method: "HEAD" }, (response) => {
      // Check if the response status code is in the 200 range

      if (
        (response as { statusCode: number }).statusCode >= 200 &&
        (response as { statusCode: number }).statusCode < 300
      ) {
        resolve(true); // URL is valid and links to a source
      } else {
        resolve(false); // URL is valid, but the source is not accessible
      }
    });

    request.on("error", (error) => {
      reject(error); // URL is invalid or an error occurred
    });

    request.end();
  });
}

export default validateUrl;
