import flashMessage from "./flashMessage.js";
import { AJAX, setCookie } from "./helpers.js";

const resetPassword = document.getElementById("resetPassword");

resetPassword.addEventListener("submit", async function (e) {
  try {
    e.preventDefault();
    const formData = new FormData(this);
    const body = {
      password: formData.get("password"),
      confirmPassword: formData.get("confirmPassword"),
    };
    // Get the query parameters from the current URL
    const queryParams = new URLSearchParams(window.location.search);
    const token = queryParams.get("resetToken");
    const data = await AJAX(
      `/api/v1/auth/resetPassword/${token}`,
      body,
      undefined,
      "PATCH"
    );

    setCookie(data.token);

    // Redirect to a home page
    flashMessage(
      "Password Reset successful! Redirecting to home page...",
      "#5cb85c"
    );
    setTimeout(() => {
      window.location.href = "/";
    }, 3000);
  } catch (error) {
    flashMessage(error.message, "#ff0000");
  }
});
