import flashMessage from "./flashMessage.js";
import { AJAX, setCookie } from "./helpers.js";

const signupForm = document.getElementById("signup");

signupForm.addEventListener("submit", async function (e) {
  try {
    e.preventDefault();
    const formData = new FormData(this);
    const body = {
      firstName: formData.get("firstName"),
      lastName: formData.get("lastName"),
      email: formData.get("email"),
      password: formData.get("password"),
      confirmPassword: formData.get("confirmPassword"),
    };
    const data = await AJAX("/api/v1/auth/signup", body);

    setCookie(data.token);

    // Redirect to a home page
    flashMessage("Sign up successful! Redirecting to home page...", "#5cb85c");
    setTimeout(() => {
      window.location.href = "/";
    }, 3000);
  } catch (error) {
    flashMessage(error.message, "#ff0000");
  }
});
