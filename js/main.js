/* ============ ПСКОВСКИЙ ОТБОР — main script ============ */

/* --- КОНФИГУРАЦИЯ: дата открытия (измените на реальную) --- */
const OPENING_DATE = new Date("2027-05-01T12:00:00+03:00");

/* --- Countdown --- */
function tickCountdown() {
  const now = new Date();
  let diff = OPENING_DATE - now;

  const cells = {
    days: document.getElementById("cd-days"),
    hours: document.getElementById("cd-hours"),
    mins: document.getElementById("cd-mins"),
    secs: document.getElementById("cd-secs"),
  };
  if (!cells.days) return;

  if (diff <= 0) {
    cells.days.textContent = "00";
    cells.hours.textContent = "00";
    cells.mins.textContent = "00";
    cells.secs.textContent = "00";
    const badge = document.querySelector(".hero__badge");
    if (badge) badge.lastChild.textContent = " Мы открылись!";
    return;
  }

  const d = Math.floor(diff / 86400000);
  diff -= d * 86400000;
  const h = Math.floor(diff / 3600000);
  diff -= h * 3600000;
  const m = Math.floor(diff / 60000);
  diff -= m * 60000;
  const s = Math.floor(diff / 1000);

  cells.days.textContent = String(d).padStart(2, "0");
  cells.hours.textContent = String(h).padStart(2, "0");
  cells.mins.textContent = String(m).padStart(2, "0");
  cells.secs.textContent = String(s).padStart(2, "0");
}
tickCountdown();
setInterval(tickCountdown, 1000);

/* --- Header scroll state --- */
const header = document.getElementById("header");
window.addEventListener("scroll", () => {
  header.classList.toggle("scrolled", window.scrollY > 40);
}, { passive: true });

/* --- Burger menu --- */
const burger = document.getElementById("burger");
const nav = document.getElementById("nav");
burger.addEventListener("click", () => {
  const open = nav.classList.toggle("open");
  document.body.classList.toggle("menu-open", open);
});
nav.addEventListener("click", (e) => {
  if (e.target.classList.contains("nav__link")) {
    nav.classList.remove("open");
    document.body.classList.remove("menu-open");
  }
});
/* закрытие меню тапом вне его */
document.addEventListener("click", (e) => {
  if (nav.classList.contains("open") && !nav.contains(e.target) && !burger.contains(e.target)) {
    nav.classList.remove("open");
    document.body.classList.remove("menu-open");
  }
});

/* --- Reveal on scroll --- */
const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("visible");
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll(".reveal").forEach((el) => observer.observe(el));

/* --- Lead form (заглушка: сохраняет заявку локально) --- */
const form = document.getElementById("lead-form");
form.addEventListener("submit", (e) => {
  e.preventDefault();

  const data = Object.fromEntries(new FormData(form));
  if (!data.name.trim() || !data.contact.trim()) {
    form.reportValidity();
    return;
  }

  const leads = JSON.parse(localStorage.getItem("po_leads") || "[]");
  leads.push({ ...data, date: new Date().toISOString() });
  localStorage.setItem("po_leads", JSON.stringify(leads));

  form.querySelector(".form__success").hidden = false;
  form.reset();

  /* Когда будет бэкенд/бот — заменить на fetch:
     fetch("/api/lead", { method: "POST", body: JSON.stringify(data) }); */
});
