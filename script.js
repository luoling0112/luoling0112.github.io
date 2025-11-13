function toggleDark() {
  document.body.classList.toggle("dark-mode");
  localStorage.setItem("dark-mode", document.body.classList.contains("dark-mode"));
}
window.addEventListener("DOMContentLoaded", () => {
  if (localStorage.getItem("dark-mode") === "true") {
    document.body.classList.add("dark-mode");
  }
  const path = location.pathname.split("/").pop() || "index.html";
  document.querySelectorAll(".navbar a").forEach(a => {
    if (a.getAttribute("href") === path) a.classList.add("active");
  });
});
