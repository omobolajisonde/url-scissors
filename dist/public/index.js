const logoutBtn = document.getElementById("logout");

logoutBtn.addEventListener("click", function () {
  const confirmLogout = window.confirm("Are you sure you want to logout?");
  if (!confirmLogout) return;
  // Clear the cookie to logout by setting its expiration date to a date in the past
  document.cookie = "jwt=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
  // Redirect to a home page
  window.location.href = "/";
});
