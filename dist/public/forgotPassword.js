import flashMessage from "./flashMessage.js";
import { AJAX, setCookie } from "./helpers.js";
const forgotPasswordForm = document.getElementById("forgotPassword");

forgotPasswordForm.addEventListener("submit", async function (e) {
  try {
    e.preventDefault();
    const formData = new FormData(this);
    const body = {
      email: formData.get("email"),
    };

    const data = await AJAX("/api/v1/auth/forgotPassword", body);

    flashMessage(data.message, "#5cb85c");
  } catch (error) {
    flashMessage(error.message, "#ff0000");
  }
});
