sessionStorage.removeItem("userRole");

const rolePages = {
  rider: "riderPage.html",
  driver: "driverPage.html",
  support: "staffPage.html",
};

const form = document.getElementById("login-form");
const roleSelect = document.getElementById("user-role");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("user-password");
const errorMessage = document.getElementById("error-message");

form.addEventListener("submit", async (event) => {
  event.preventDefault();

  const userRole = roleSelect.value;
  const email = emailInput.value.trim();
  const userPassword = passwordInput.value;

  try {
    const response = await fetch("/api/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        userPassword,
        userRole,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      errorMessage.textContent = data.message;
      return;
    }

    const verifiedRole = data.user.userRole;
    const page = rolePages[verifiedRole];

    if (!page) {
      errorMessage.textContent = "Unknown account role.";
      return;
    }

    sessionStorage.setItem("userRole", verifiedRole);

    window.location.href = page;
  } catch (error) {
    console.error("Login error: ", error);
    errorMessage.textContent = "Unable to connect to server. Please try again.";
  }
});

window.addEventListener("pageshow", () => {
  form.reset();
});
