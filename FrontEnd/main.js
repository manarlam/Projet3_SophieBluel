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

function genererOeuvre(oeuvre) {
    for (let i = 0; i < oeuvre.length; i++) {

        const figure = document.createElement("figure");
        figure.innerHTML = `<img src=${oeuvre[i].imageUrl} alt="${oeuvre[i].title}">
        <figcaption>${oeuvre[i].title}</figcaption>`;

        const figureParent = document.querySelector(".gallery");
        figureParent.appendChild(figure);
    }
}









