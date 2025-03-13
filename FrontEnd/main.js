async function getWorks() {
    const url = "http://localhost:5678/api/works";
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Response status: ${response.status}`);
        }

        const json = await response.json();
        console.log(json);
        genererOeuvre(json);
    } catch (error) {
        console.error(error.message);
    }
}

getWorks();

async function getCategories() {
    const url = "http://localhost:5678/api/categories";
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Response status: ${response.status}`);
        }

        const json = await response.json();
        console.log(json);
        genererFiltre(json);
    } catch (error) {
        console.error(error.message);
    }
}

getCategories();

// Intégration des filtres dans la page avec une boucle for

// function genererFiltre(categorie) {
//     for (let i = 0; i < categorie.length; i++) {

//         const div = document.createElement("div");
//         div.innerHTML = categorie[i].name;
//         const divParent = document.querySelector(".filter-container");
//         divParent.appendChild(div);
//     }
// }

// Intégration des filtres dans la page avec un Set

function genererFiltre(categories) {
    const divParent = document.querySelector(".filter-container");

    const uniqueCategories = new Set(categories.map(item => item.name)); 
    /*map pour créer un nouveau tableau et item pour transformer l'objet en nom seulement*/

    uniqueCategories.forEach(categories => { /*forEach pour parcourir le tableau*/
        const btn = document.createElement("button");
        btn.textContent= categories;
        btn.classList.add("filter-item");
        btn.addEventListener("click", () => filterItems(categories));
        divParent.appendChild(btn);
    });
    
    console.log(uniqueCategories);
}

const filterItems = (works, categoryId) => {
    const filtered = works.filter(item => item.categoryId == categoryId);
    return filtered;
    
};

// Intégration des oeuvres dans la page

function genererOeuvre(oeuvre) {
    for (let i = 0; i < oeuvre.length; i++) {

        const figure = document.createElement("figure");
        figure.innerHTML = `<img src=${oeuvre[i].imageUrl} alt="${oeuvre[i].title}">
        <figcaption>${oeuvre[i].title}</figcaption>`;

        const figureParent = document.querySelector(".gallery");
        figureParent.appendChild(figure);
    }
}









