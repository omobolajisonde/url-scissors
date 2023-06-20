const signinForm = document.getElementById("signin");

signinForm.addEventListener("submit", async function (e) {
  try {
    e.preventDefault();
    const formData = new FormData(this);
    const body = {
      email: formData.get("email"),
      password: formData.get("password"),
    };
    const response = await fetch("/api/v1/auth/signin", {
      method: "POST",
      body: JSON.stringify(body),
      headers: {
        "Content-Type": "application/json",
      },
    });
    const data = await response.json();
    // Calculate the cookie expiration time
    const expirationDate = new Date();
    expirationDate.setTime(expirationDate.getTime() + 60 * 60 * 1000); // Convert 60 minutes to milliseconds

    // Format the cookie string
    const cookieString = `jwt=${encodeURIComponent(
      data.token
    )}; expires=${expirationDate.toUTCString()}; path=/;`;

    // Set the cookie
    document.cookie = cookieString;

    // Redirect to a home page
    window.location.href = "/";
  } catch (error) {}
});
