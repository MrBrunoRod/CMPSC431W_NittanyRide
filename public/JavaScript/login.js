sessionStorage.removeItem("userRole");

const rolePages = {
    rider: "riderPage.html",
    driver: "driverPage.html",
    support: "staffPage.html"
};

const form = document.getElementById("login-form");
const roleSelect = document.getElementById("user-role");

form.addEventListener("submit", (event) =>{
    event.preventDefault();

    const page = rolePages[roleSelect.value];
    if (page) {
        sessionStorage.setItem("userRole", roleSelect.value);
        window.location.href = page;
    }
});

window.addEventListener("pageshow", () => {
    form.reset();
});