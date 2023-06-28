import flashMessage from "./flashMessage.js";
import { AJAX, setCookie } from "./helpers.js";
const signinForm = document.getElementById("signin");

signinForm.addEventListener("submit", async function (e) {
  try {
    e.preventDefault();
    const formData = new FormData(this);
    const body = {
      email: formData.get("email"),
      password: formData.get("password"),
    };

    const data = await AJAX("/api/v1/auth/signin", body);

    setCookie(data.token);

    // Redirect to a home page
    flashMessage("Sign in successful! Redirecting to home page...", "#5cb85c");
    setTimeout(() => {
      window.location.href = "/";
    }, 3000);
  } catch (error) {
    flashMessage(error.message, "#ff0000");
  }
});
