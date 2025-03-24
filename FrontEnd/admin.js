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



