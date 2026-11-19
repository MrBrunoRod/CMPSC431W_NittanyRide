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

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
