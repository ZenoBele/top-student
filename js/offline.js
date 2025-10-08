// ⚠️ Offline detection for dynamic pages only
(function() {
  // List of pages that require Supabase data
  const dynamicPages = [
    "papers.html",
    "challenge.html",
    "reminder.html",
	"pack.html",
	"press.html",
	"guides.html",
	"news.html",
	"capability.html",
    "community.html",
    "read.html",
    "rewards.html"
    // add any other dynamic pages
  ];

  const currentPage = window.location.pathname.split("/").pop().toLowerCase();

  if (dynamicPages.includes(currentPage) && !navigator.onLine) {
    // User is offline on a dynamic page
    const offlineMsg = document.createElement("p");
    offlineMsg.textContent = "⚠️ You are offline. Connect to see papers and quizzes.";
    offlineMsg.style.color = "red";
    offlineMsg.style.textAlign = "center";
    offlineMsg.style.fontWeight = "bold";
    offlineMsg.style.margin = "10px";
    document.body.prepend(offlineMsg);
  }

  // Reload page automatically when connection is restored
  window.addEventListener("online", () => {
    if (dynamicPages.includes(currentPage)) location.reload();
  });

  // Optional: log when offline
  window.addEventListener("offline", () => {
    if (dynamicPages.includes(currentPage)) console.log("You are offline");
  });
})();