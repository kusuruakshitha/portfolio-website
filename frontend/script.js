// ------------------ LOGIN ------------------
document.getElementById("loginForm")?.addEventListener("submit", async (e) => {
  e.preventDefault();
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;

  const res = await fetch("http://localhost:5000/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password })
  });
  const data = await res.json();

  if (data.success) {
    window.location.href = "index.html";
  } else {
    document.getElementById("loginMessage").textContent = data.message;
    document.getElementById("loginMessage").style.color = "red";
  }
});

// ------------------ NAVIGATION LINKS ------------------
document.querySelectorAll('.nav-links a').forEach(link => {
  link.addEventListener('click', e => {
    e.preventDefault();
    const targetId = link.getAttribute('href');
    const targetSection = document.querySelector(targetId);
    if (targetSection) {
      targetSection.scrollIntoView({ behavior: 'smooth' });
    }
  });
});

// ------------------ THEME TOGGLE ------------------
document.getElementById("theme-toggle")?.addEventListener("click", () => {
  document.body.classList.toggle("light");
  document.getElementById("theme-toggle").textContent =
    document.body.classList.contains("light") ? "Dark theme" : "Light theme";
});

// ------------------ SCROLL TO CONTACT ------------------
function scrollToContact() {
  document.getElementById("contact").scrollIntoView({ behavior: "smooth" });
}

// ------------------ STATS COUNTERS ------------------
fetch("http://localhost:5000/stats")
  .then(res => res.json())
  .then(stats => {
    document.getElementById("projectCount").textContent = `${stats.projects} Projects`;
    document.getElementById("messageCount").textContent = `${stats.messages} Messages`;
    document.getElementById("uptime").textContent = `${stats.uptime}s Uptime`;
  });

// ------------------ PROJECTS ------------------
let allProjects = [];

function renderProjects(projects) {
  const projectList = document.getElementById("project-list");
  projectList.innerHTML = "";
  projects.forEach(p => {
    const card = document.createElement("div");
    card.className = "project-card";
    card.dataset.category = p.category;
    card.innerHTML = `
      <h3>${p.title}</h3>
      <p>${p.description}</p>
      <small>${p.category}</small><br>
      <button onclick="toggleFavorite('${p._id}')">
        ${p.favorite ? "★ Unfavorite" : "☆ Favorite"}
      </button>
    `;
    projectList.appendChild(card);
  });
}

fetch("http://localhost:5000/projects")
  .then(res => res.json())
  .then(projects => {
    allProjects = projects;
    renderProjects(allProjects);
    renderFavorites();
  });

// ------------------ SEARCH FILTER ------------------
document.getElementById("search")?.addEventListener("input", e => {
  const term = e.target.value.toLowerCase();
  const filtered = allProjects.filter(p =>
    p.title.toLowerCase().includes(term) || p.description.toLowerCase().includes(term)
  );
  renderProjects(filtered);
});

// ------------------ FAVORITES ------------------
function toggleFavorite(id) {
  fetch(`http://localhost:5000/projects/${id}/favorite`, { method: "POST" })
    .then(res => res.json())
    .then(updated => {
      allProjects = allProjects.map(p => p._id === updated._id ? updated : p);
      renderProjects(allProjects);
      renderFavorites();
    });
}

function renderFavorites() {
  const favList = document.getElementById("favorite-list");
  favList.innerHTML = "";
  const favorites = allProjects.filter(p => p.favorite);
  favorites.forEach(p => {
    const div = document.createElement("div");
    div.textContent = p.title;
    favList.appendChild(div);
  });
}

// ------------------ CONTACT FORM WITH MODAL ------------------
document.getElementById("contactForm")?.addEventListener("submit", async e => {
  e.preventDefault();
  const name = document.getElementById("name").value;
  const email = document.getElementById("email").value;
  const subject = document.getElementById("subject").value;
  const message = document.getElementById("message").value;

  const res = await fetch("http://localhost:5000/contact", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, email, subject, message })
  });
  const data = await res.json();

  const modal = document.getElementById("modal");
  const modalMessage = document.getElementById("modalMessage");
  if (data.success) {
    modalMessage.textContent = "✅ Thank you! Your message has been sent.";
    document.getElementById("contactForm").reset();
  } else {
    modalMessage.textContent = "❌ Failed to send message. Please try again.";
  }
  modal.style.display = "block";
});

// Close modal
document.getElementById("closeModal")?.addEventListener("click", () => {
  document.getElementById("modal").style.display = "none";
});
window.onclick = function(event) {
  const modal = document.getElementById("modal");
  if (event.target === modal) modal.style.display = "none";
};
