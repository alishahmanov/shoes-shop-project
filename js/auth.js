
const loginLink = document.getElementById("loginLink");
if (loginLink) {
    const user = localStorage.getItem("loggedUser");
    if (user) {
        loginLink.textContent = "Профиль";
        loginLink.href = "profile.html";
    }
}
