const express = require("express");
const path = require("path");

const db = require("./database/nittanyDatabase");

const app = express();
const PORT = 3000;

app.use(express.json());

app.use(express.static(path.join(__dirname, "public")));

app.get("/api/test", (req, res) => {
  const result = db.prepare("SELECT COUNT(*) AS count FROM Users").get();

  res.json({
    message: "Database successfully connected! LESFUGINGOOOOOO",
    users: result.count,
  });
});

const bcrypt = require("bcrypt");

app.post("/api/login", async (req, res) => {
  const { email, userPassword, userRole } = req.body;

  if (!email || !userPassword || !userRole) {
    return res.status(400).json({
      message: "All fields are required. Please fill them in."
    });
  }

  try {
    const user = db.prepare("SELECT * FROM Users WHERE email = ?").get(email);

    if (!user) {
      return res.status(401).json({
        message: "Invalid login details."
      });
    }

    const passwordCheck = await bcrypt.compare(userPassword, user.userPassword);

    if (!passwordCheck || user.userRole !== userRole) {
      return res.status(401).json({
        message: "Invalid login details."
      });
    }

    return res.status(200).json({
      message: "Login successful.",
      user: {
        email: user.email,
        fullName: user.fullName,
        userRole: user.userRole
      }
    });
  } catch (error) {
    console.error("Login error: ", error);

    return res.status(500).json({
      message: "Internal server error."
    });
  }
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
