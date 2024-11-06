const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const db = require("./database");

const app = express();
const PORT = 3000;
const JWT_SECRET = "your-secret-key";

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());

const authenticateToken = (req, res, next) => {
  const token = req.cookies.token;
  if (!token) return res.status(401).json({ error: "Unauthorized" });

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: "Invalid token" });
    req.user = user;
    next();
  });
};

app.post("/api/auth/register", async (req, res) => {
  const { username, password } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    db.run(
      "INSERT INTO users (username, password) VALUES (?, ?)",
      [username, hashedPassword],
      function (err) {
        if (err) {
          return res.status(400).json({ error: "Username already exists" });
        }

        const token = jwt.sign({ id: this.lastID, username }, JWT_SECRET);
        res.cookie("token", token, { httpOnly: true });
        res.json({ success: true, username });
      }
    );
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

app.post("/api/auth/login", async (req, res) => {
  const { username, password } = req.body;

  db.get(
    "SELECT * FROM users WHERE username = ?",
    [username],
    async (err, user) => {
      if (err || !user) {
        return res.status(400).json({ error: "User not found" });
      }

      const validPassword = await bcrypt.compare(password, user.password);
      if (!validPassword) {
        return res.status(400).json({ error: "Invalid password" });
      }

      const token = jwt.sign({ id: user.id, username }, JWT_SECRET);
      res.cookie("token", token, { httpOnly: true });
      res.json({ success: true, username });
    }
  );
});

app.get("/api/auth/check", authenticateToken, (req, res) => {
  res.json({ isLoggedIn: true, username: req.user.username });
});

app.post("/api/auth/logout", (req, res) => {
  res.clearCookie("token");
  res.json({ success: true });
});

app.post("/api/folders", authenticateToken, (req, res) => {
  const { name, parentId } = req.body;
  const userId = req.user.id;

  db.run(
    "INSERT INTO folders (name, parent_id, user_id) VALUES (?, ?, ?)",
    [name, parentId, userId],
    function (err) {
      if (err) return res.status(500).json({ error: "Erro criando pasta" });
      res.json({ id: this.lastID, name, parentId });
    }
  );
});

app.get("/api/folders", authenticateToken, (req, res) => {
  const userId = req.user.id;
  const parentId = req.query.parentId || null;

  db.all(
    "SELECT * FROM folders WHERE user_id = ? AND parent_id IS ?",
    [userId, parentId],
    (err, folders) => {
      if (err)
        return res.status(500).json({ error: "Failed to fetch folders" });
      res.json(folders);
    }
  );
});

app.listen(PORT, () => {
  console.log(`To roadndo na porta ${PORT}`);
});
