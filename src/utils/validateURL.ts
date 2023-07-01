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
  } catch (error) {
    throw new AppError("Your internet connection is very unstable.", 500); // URL is invalid or an error occurred
  }
}

export default validateUrl;
