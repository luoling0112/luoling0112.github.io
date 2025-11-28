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

function toggleAbstract(btn) {
  const abs = btn.nextElementSibling; // 下一个 div.abstract
  if (abs.style.display === "none") {
    abs.style.display = "block";
    btn.textContent = "Hide Abstract";
  } else {
    abs.style.display = "none";
    btn.textContent = "Abstract";
  }
}

