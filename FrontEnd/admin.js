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
function genererModalOeuvre(oeuvres) {
  const modalGallery = document.querySelector(".modal-gallery");
  modalGallery.innerHTML = ""; // Nettoie avant d'ajouter les nouvelles œuvres

  oeuvres.forEach(item => {
      const figure = document.createElement("figure");
      figure.dataset.id = item.id;

      figure.innerHTML = `
          <div class="img-modal">
              <img src="${item.imageUrl}" alt="${item.title}">
              <i class="fa-solid fa-trash-can overlay-icon" data-id="${item.id}"></i>
          </div>
      `;

      modalGallery.appendChild(figure);
  });
  /* faut-il garder <figcaption>${item.title}</figcaption>*/

  // Ajout des écouteurs d'événements APRÈS la création des icônes
  document.querySelectorAll(".fa-trash-can").forEach(btn => {
      btn.addEventListener("click", deleteWork);
  });
}

// Fonction de suppression via API 
async function deleteWork(event) {
  event.stopPropagation();
  const id = event.target.dataset.id; // Utilisation de dataset pour récupérer l'id
  const token = sessionStorage.getItem("loginToken");


  if (!confirm("Voulez-vous vraiment supprimer cette photo ?")) return;

  try {
      const response = await fetch(`http://localhost:5678/api/works/${id}`, {
          method: "DELETE",
          headers: {
              "Authorization": `Bearer ${token}`
          }
      });

      if (response.status == 401 || response.status == 500) {
        const errorBox = document.createElement("div");
        errorBox.className = "error-login";
        errorBox.innerHTML = "Il y a eu une erreur";
        document.querySelector(".modal-button-container").prepend(errorBox);
      }

      if (response.ok) {
          // Suppression immédiate de l'image dans l'UI
          document.querySelector(`figure[data-id="${id}"]`).remove();
      } else {
          alert("Erreur lors de la suppression !");
      }
  } catch (error) {
      console.error("Erreur lors de la suppression :", error);
  }
}

// Toggle entre les deux vues de la modale
const backBtn = document.querySelector(".js-modal-back");
const addPhotoBtn = document.querySelector(".add-photoBtn");

function toggleModal() {
  const addPhotoView = document.getElementById("addPhotoView");
  const galleryView = document.getElementById("galleryView");

  if (
    galleryView.style.display === "block" || galleryView.style.display === ""
  ) {
    galleryView.style.display = "none";
    addPhotoView.style.display ="block";

    // Nettoyer les messages d'erreur
    document.querySelector(".error-message-container").innerHTML = "";

  } else {
    galleryView.style.display = "block";
    addPhotoView.style.display ="none";

  }
}

backBtn.addEventListener("click", toggleModal);
addPhotoBtn.addEventListener("click", toggleModal);

// Gérer l'affichage de l'aperçu de l'image sélectionnée
document.getElementById("file").addEventListener("change", function (event) {
  const file = event.target.files[0]; // Récupérer le fichier sélectionné
  const photoContainer = document.getElementById("photo-container");
  const addPhotoContainer = document.querySelector(".photo-loaded-container");

  // Nettoyer le conteneur avant d'ajouter un nouvel aperçu
  photoContainer.innerHTML = "";

  if (!file) return;

  addPhotoContainer.classList.add("hidden"); // Masquer le bouton d'ajout de photo

  // Vérifier le type de fichier (seulement JPG/PNG)
  const allowedTypes = ["image/jpeg", "image/png"];
  if (!allowedTypes.includes(file.type)) {
    showError("Format d'image invalide, veuillez choisir un format JPG ou PNG");
    return;
  }

  // Vérifier la taille du fichier (max 4 Mo)
  if (file.size > 4 * 1024 * 1024) {
    showError("L'image doit faire moins de 4 Mo.");
    return;
  }

  // Lire et afficher l'aperçu de l'image
  const reader = new FileReader();
  reader.onload = function (e) {
    const imgPreview = document.createElement("img");
    imgPreview.src = e.target.result;
    imgPreview.alt = "Aperçu de l'image";
    imgPreview.style.width = "129px"; // Ajuster la taille
    imgPreview.style.height = "193px";
    imgPreview.style.borderRadius = "0px";

    photoContainer.appendChild(imgPreview);
  };

  reader.readAsDataURL(file); // Lire l'image sous forme d'URL
});

document.getElementById("picture-form").addEventListener("submit", async function (event) {
  event.preventDefault();

  const fileInput = document.getElementById("file");
  const file = fileInput.files[0]; // Récupérer le fichier
  const title = document.getElementById("title").value.trim(); // Récupérer le titre
  const category = document.getElementById("category").value; // Récupérer la catégorie

  // Vérifier que tous les champs sont remplis
  if (!file || !title || !category) {
    showError("Tous les champs doivent être remplis.");
    return;
  }

  // Vérifier la taille et le format du fichier
  if (file.size > 4 * 1024 * 1024) {
    showError("L'image doit faire moins de 4 Mo.");
    return;
  }

  const allowedTypes = ["image/jpeg", "image/png"];
  if (!allowedTypes.includes(file.type)) {
    showError("Format d'image invalide, veuillez choisir un format JPG ou PNG.");
    return;
  }

  // Récupérer le token pour l'authentification
  const token = sessionStorage.getItem("loginToken");
  if (!token) {
    showError("Vous devez être connecté.");
    return;
  }

  try {
    // Création du FormData pour envoyer les fichiers
    const formData = new FormData();
    formData.append("image", file);
    formData.append("title", title);
    formData.append("category", category);

    // Envoi à l'API
    const response = await fetch("http://localhost:5678/api/works", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${token}`,
      },
      body: formData,
    });

    if (!response.ok) {
      throw new Error("Erreur lors de l'ajout de la photo.");
    }

    const newWork = await response.json();
    addPhotoToGallery(newWork);
    addPhotoToModal(newWork);

    // Réinitialiser le formulaire après l'ajout
    
    document.getElementById("picture-form").reset();
    document.querySelector(".validate-photoBtn").setAttribute("disabled", "true");

  // Réinitialiser l'image sélectionnée
  const fileInput = document.getElementById("file");
  fileInput.value = ""; // Réinitialiser le champ file

  // Réinitialiser l'affichage de l’image
  const photoContainer = document.getElementById("photo-container");
  photoContainer.innerHTML = ""; // Supprimer l’aperçu de l’image

  const addPhotoContainer = document.querySelector(".photo-loaded-container");
  addPhotoContainer.classList.remove("hidden")

    // Nettoyer les messages d'erreur après un ajout réussi
    document.querySelector(".error-message-container").innerHTML = "";

  } catch (error) {
    console.error("Erreur:", error);
    showError(error.message);
  }
});

// Afficher un message d'erreur
function showError(message) {
  console.log("Erreur détectée:", message);

  const errorContainer = document.querySelector(".error-message-container");
  if (!errorContainer) {
    console.error("Le conteneur d'erreur est introuvable !");
    return;
  }

  const errorBox = document.createElement("div");
  errorBox.className = "error-login";
  errorBox.textContent = message;
  errorBox.textContent = message;
  errorBox.style.color = "red";
  errorBox.style.fontSize = "14px";
  errorBox.style.marginTop = "10px";

  // Supprimer les anciens messages d'erreur avant d'afficher un nouveau
  errorContainer.innerHTML ="";

  errorContainer.appendChild(errorBox);
}
// Ajouter les images à la galerie principale
function addPhotoToGallery(item) {
  const gallery = document.querySelector(".gallery");
  const figure = document.createElement("figure");
  figure.dataset.id = item.id;
  figure.innerHTML = `
    <img src="${item.imageUrl}" alt="${item.title}">
    <figcaption>${item.title}</figcaption>
  `;
  gallery.appendChild(figure);
}

// Ajouter les images à la modale
function addPhotoToModal(item) {
  const modalGallery = document.querySelector(".modal-gallery");
  const figure = document.createElement("figure");
  figure.dataset.id = item.id;

  figure.innerHTML = `
    <div class="img-modal">
      <img src="${item.imageUrl}" alt="${item.title}">
      <i class="fa-solid fa-trash-can overlay-icon" data-id="${item.id}"></i>
    </div>
  `;

  modalGallery.appendChild(figure);

  // Ajouter l'événement de suppression sur l'icône poubelle
  figure.querySelector(".fa-trash-can").addEventListener("click", deleteWork);
}

// Activer/Désactiver le bouton "Valider" si tous les champs sont remplis
document.getElementById("picture-form").addEventListener("input", function () {
  try {
  const fileInput = document.getElementById("file").files.length > 0;
  const title = document.getElementById("title").value.trim() !== "";
  const category = document.getElementById("category").value !== "";

  const validateBtn = document.querySelector(".validate-photoBtn");
  if (fileInput && title && category) {
    validateBtn.removeAttribute("disabled");
  } else {
    validateBtn.setAttribute("disabled", "true");
  }
} catch (error) {
  console.error("Erreur de validation du formulaire :", error);
}
});