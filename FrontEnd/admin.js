// Logout link
document.addEventListener("DOMContentLoaded", () => {
    let loginLink = document.getElementById("login-link");
    let isLoggedIn = localStorage.getItem("isLoggedIn");
    let editBar = document.getElementById("edit-bar");
    let filterNav = document.querySelector(".filter-container");
    let editBtn = document.querySelector(".editBtn");

  if (isLoggedIn === "true") {
    loginLink.textContent = "Logout";
    loginLink.style.fontSize = "16px";
    loginLink.href = "#"; // Désactive le lien vers la page de connexion   
    editBar.style.display = "block"; 
    filterNav.style.display = "none";
    editBtn.style.display = "block";
      

  loginLink.addEventListener("click", () => {
    localStorage.removeItem("isLoggedIn"); // Déconnexion
    sessionStorage.removeItem("loginToken"); //Supprime le token
    window.location.reload(); // Rafraîchir la page pour mettre à jour le lien
    });
  }
  });

// Modale
let modal = null
const focusableSelector = "button, a, input, textarea"
let focusable = []

const openModal = function (e) {
  e.preventDefault();
    modal = document.querySelector(e.target.getAttribute("href"));
    focusables = Array.from(modal.querySelectorAll(focusableSelector))
    focusables[0].focus()
    modal.style.display = null;
    modal.removeAttribute("aria-hidden");
    modal.setAttribute("aria-modal", "true");
    modal.addEventListener("click", closeModal)
    modal.querySelector(".js-modal-close").addEventListener("click", closeModal)
    modal.querySelector(".js-modal-stop").addEventListener("click", stopPropagation)
}

const closeModal = function (e) {
  if (modal === null) return
  e.preventDefault();
    modal.style.display = "none";
    modal.setAttribute("aria-hidden", "true");
    modal.removeAttribute("aria-modal");
    modal.removeEventListener("click", closeModal)
    modal.querySelector(".js-modal-close").removeEventListener("click", closeModal)
    modal.querySelector(".js-modal-stop").removeEventListener("click", stopPropagation)
    modal = null
}

const stopPropagation = function (e) {
  e.stopPropagation()
}

const focusInModal = function (e) {
  e.preventDefault()
  let index = focusables.findIndex(f => f === modal.querySelector(":focus"))
  if (e.shiftKey === true) {
    index--
  } else {
  index++
  }
  if (index >= focusables.length) {
    index = 0
  }
  if (index < 0) {
    index = focusables.length -1
  }
  focusables[index].focus()
}

document.querySelectorAll(".js-modal").forEach(a => {
  a.addEventListener("click", openModal);
});

window.addEventListener("keydown", function (e) {
  if (e.key === "Escape" || e.key === "Esc") {
    closeModal(e)
  }
  if (e.key === "Tab" && modal !== null) {
    focusInModal(e)
  }
})

// Affichage des photos dans la modale
function genererModalOeuvre(oeuvre) {
  oeuvre.forEach(item => {
      const figure = document.createElement("figure");
      figure.innerHTML = `<div class="img-modal"><img src="${item.imageUrl}" alt="${item.title}"><i id=${item.id} class="fa-solid fa-trash-can overlay-icon"></i></div>`;

      document.querySelector(".modal-gallery").append(figure)
  });
}


