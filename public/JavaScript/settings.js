const homePages = {
    rider: "riderPage.html",
    driver: "driverPage.html",
    support: "staffPage.html"
};

const role = sessionStorage.getItem("userRole");
if (homePages[role]) {
    document.getElementById("return-link").href = homePages[role];
}