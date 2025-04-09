// Fonction pour récupérer les œuvres via l'API
async function getWorks() {
    const url = "http://localhost:5678/api/works";
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Erreur HTTP : ${response.status}`);
        }

        const works = await response.json();
        genererOeuvre(works);
        getCategories(works);
        genererModalOeuvre(works);
        
    } catch (error) {
        console.error("Erreur lors du chargement des œuvres :", error.message);
    }
}

// Fonction pour récupérer les catégories via l'API et générer les filtres
async function getCategories(works) {
    const url = "http://localhost:5678/api/categories";
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Erreur HTTP : ${response.status}`);
        }

        const categories = await response.json();
        genererFiltre(categories, works);
    } catch (error) {
        console.error("Erreur lors du chargement des catégories :", error.message);
    }
}

// Fonction pour générer les boutons de filtre
function genererFiltre(categories, works) {
    if (!categories || !works) {
        console.error("Erreur : catégories ou œuvres non définies !");
        return;
    }

    const divParent = document.querySelector(".filter-container");
    divParent.innerHTML = ""; 

    const uniqueCategories = new Set(categories.map(category => category.id));

    // Bouton "Tous" pour afficher toutes les œuvres
    const btnAll = document.createElement("button");
    btnAll.textContent = "Tous";
    btnAll.classList.add("filter-item");
    btnAll.addEventListener("click", () => genererOeuvre(works));
    divParent.appendChild(btnAll);

    // Création des boutons de catégorie
    categories.forEach(category => {
        if (uniqueCategories.has(category.id)) {
            const btn = document.createElement("button");
            btn.textContent = category.name;
            btn.classList.add("filter-item");
            btn.addEventListener("click", () => filterItems(works, category.id)); // Définir works et category Id
            divParent.appendChild(btn);

            uniqueCategories.delete(category.id);
        }
    });

    console.log("Filtres générés :", uniqueCategories);
}

// Fonction pour filtrer et afficher les œuvres
const filterItems = (works, categoryId) => {
    if (!works) {
        console.error("Erreur : works est undefined !");
        return;
    }
    const filteredWorks = works.filter(item => item.categoryId === categoryId);
    genererOeuvre(filteredWorks);
}; 

// Fonction pour afficher les œuvres
function genererOeuvre(oeuvre) {
    const figureParent = document.querySelector(".gallery");
    figureParent.innerHTML = ""; 

    oeuvre.forEach(item => {
        const figure = document.createElement("figure");
        figure.dataset.id = item.id; // Ajouter l'ID a l'élément figure
        figure.innerHTML = `<img src="${item.imageUrl}" alt="${item.title}">
        <figcaption>${item.title}</figcaption>`;

        figureParent.appendChild(figure);
    });
}

// Lancer le chargement des œuvres au chargement de la page
document.addEventListener("DOMContentLoaded", getWorks);




