const loginApi = "http://localhost:5678/api/users/login";

document.getElementById("loginForm").addEventListener("submit", async (event) => {
event.preventDefault();   

  let user = {
    email: document.getElementById("email").value,
    password: document.getElementById("password").value
};

  let response = await fetch(loginApi, {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify(user),  
});

  let result = await response.json();
  

  if (response.ok){
    const token =result.token;
    sessionStorage.setItem("loginToken", token);
    localStorage.setItem("isLoggedIn", "true");
    alert("Connexion réussie !")
    window.location.href = "index.html";

  } else {
    let errorMessage = document.createElement("p");
    errorMessage.id = "error-message";
    errorMessage.textContent= "Identitifants et Mots de passe incorrects";
    errorMessage.style.color = "red";
    errorMessage.style.textAlign = "center";
    document.getElementById("loginForm").appendChild(errorMessage);  
  }
});


