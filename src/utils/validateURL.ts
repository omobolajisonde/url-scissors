import axios from "axios";
import AppError from "./appError";

async function validateUrl(url: string) {
  try {
    const response = await axios.head(url);

    if (response.status >= 200 && response.status < 300) {
      return true; // URL is valid and links to a source
    } else {
      return false; // URL is valid, but the source is not accessible
    }
  } catch (error: any) {
    if (error.response) {
      // Error response received from the server
      if (error.response.status === 401) {
        throw new AppError(
          "Authentication required to access the resource.",
          500
        );
      } else {
        throw new AppError(
          `Error: ${error.response.status} ${error.response.statusText}`,
          500
        );
      }
    } else {
      // Other types of errors
      throw new AppError("Invalid URL or poor internet connection.", 500);
    }
  }
}

export default validateUrl;
