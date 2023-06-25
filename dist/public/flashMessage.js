import { FLASH_MESSAGE_DURATION } from "./config.js";

export default function (message, bgColor) {
  Toastify({
    text: message,
    duration: FLASH_MESSAGE_DURATION * 1000, // Duration in milliseconds
    gravity: "top", // Position: "top", "bottom", or "center"
    position: "right", // Position: "left", "right", or "center"
    close: true, // Show close button
    className: "flash-message", // Additional CSS classes for the toast container
    backgroundColor: bgColor,
  }).showToast();
}
