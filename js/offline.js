// ⚠️ Offline warning banner
if (!navigator.onLine) {
  const banner = document.createElement("div");
  banner.textContent = "⚠️ You are offline. Some features won't work until you're back online.";
  banner.style.background = "#f8d7da";
  banner.style.color = "#721c24";
  banner.style.padding = "10px";
  banner.style.textAlign = "center";
  banner.style.fontWeight = "bold";
  banner.style.position = "fixed";
  banner.style.top = "0";
  banner.style.left = "0";
  banner.style.right = "0";
  banner.style.zIndex = "9999";
  document.body.prepend(banner);
}

// 🧠 Optional: Hide banner when back online
window.addEventListener("online", () => {
  const banner = document.querySelector("div[offline-banner]");
  if (banner) banner.remove();
});

// 🧠 Optional: Show again if offline
window.addEventListener("offline", () => {
  if (!document.querySelector("div[offline-banner]")) {
    const banner = document.createElement("div");
    banner.textContent = "⚠️ You are offline. Some features won't work until you're back online.";
    banner.setAttribute("offline-banner", "");
    banner.style.background = "#f8d7da";
    banner.style.color = "#721c24";
    banner.style.padding = "10px";
    banner.style.textAlign = "center";
    banner.style.fontWeight = "bold";
    banner.style.position = "fixed";
    banner.style.top = "0";
    banner.style.left = "0";
    banner.style.right = "0";
    banner.style.zIndex = "9999";
    document.body.prepend(banner);
  }
});
