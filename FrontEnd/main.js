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

async function getFilters() {
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

getFilters();

// Intégration des filtres dans la page

const container = document.createElement("div");
document.body.appendChild(container);

function genererFiltre(categories) {
    for (let i = 0; i < categories.length; i++) {

        const btn = document.createElement("button");
        btn.innerHTML = `<button>${categories[i].name}</button>`;
        
        container.appendChild(btn);


    }
}



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









