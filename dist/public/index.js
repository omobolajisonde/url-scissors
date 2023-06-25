import flashMessage from "./flashMessage.js";
import { AJAX } from "./helpers.js";

const shortnerForm = document.getElementById("shortnerForm");
const qrForm = document.getElementById("qrForm");
const qrcode = document.getElementById("qrcode");
const copyField = document.getElementById("copy-field");
const logoutBtn = document.getElementById("logout");

function copyToClipboard() {
  const copyText = document.getElementById("copy-input");

  navigator.clipboard
    .writeText(copyText.value)
    .then(() => {
      alert("Text copied to clipboard!");
    })
    .catch((error) => {
      console.error("Failed to copy text: ", error);
    });
}

function downloadQRCode() {
  const downloadLink = document.createElement("a");
  const qrcodeImg = document.getElementById("qrcodeImg");
  downloadLink.href = qrcodeImg.src;
  downloadLink.download = "qrCode.png";
  downloadLink.click();
}

logoutBtn?.addEventListener("click", function () {
  const confirmLogout = window.confirm("Are you sure you want to logout?");
  if (!confirmLogout) return;
  // Clear the cookie to logout by setting its expiration date to a date in the past
  document.cookie = "jwt=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
  // Redirect to a home page
  window.location.href = "/";
});

shortnerForm.addEventListener("submit", async function (e) {
  try {
    e.preventDefault();
    const formData = new FormData(this);
    const body = {
      longUrl: formData.get("longUrl"),
      customAlias: formData.get("customAlias"),
    };
    const headers = {
      "Content-Type": "application/json",
      Cookie: document.cookie,
    };
    const data = await AJAX("/api/v1/url/shortenURL", body, headers);
    console.log(data);

    const resultHTML = `
      <input type="text" value=${data.data.url.shortUrl} id="copy-input" class="smash-effect" readonly>
      <button class="btn" onclick="copyToClipboard()">Copy</button>
  `;
    copyField.innerHTML = "";
    copyField.insertAdjacentHTML("afterbegin", resultHTML);
  } catch (error) {
    flashMessage(error.message, "#ff0000");
  }
});

qrForm.addEventListener("submit", async function (e) {
  try {
    e.preventDefault();
    const formData = new FormData(this);
    const body = {
      Url: formData.get("Url"),
    };
    const data = await AJAX("/api/v1/url/qrcode", body);

    const resultHTML = `
        <img src=${data.data.url} id="qrcodeImg" alt="QR code" class="smash-effect">
        <button class="btn" type="button" onclick="downloadQRCode()">Download QR code</button>
    `;
    qrcode.innerHTML = "";
    qrcode.insertAdjacentHTML("afterbegin", resultHTML);
  } catch (error) {
    flashMessage(error.message, "#ff0000");
  }
});
