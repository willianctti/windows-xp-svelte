const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const db = require("./database");

const app = express();
const PORT = 3000;
const JWT_SECRET = "your-secret-key";

console.log('Server starting...');

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

app.get("/api/notepad", authenticateToken, (req, res) => {
  const userId = req.user.id;
  db.all(
    "SELECT * FROM notepad_files WHERE user_id = ?",
    [userId],
    (err, files) => {
      res.json(files);
    }
  );
});

app.post("/api/notepad", authenticateToken, (req, res) => {
  const { name, content } = req.body;
  const userId = req.user.id;

  db.run(
    "INSERT INTO notepad_files (name, content, user_id) VALUES (?, ?, ?)",
    [name, content, userId],
    function (err) {
      res.json({ id: this.lastID, name, content });
    }
  );
});

app.get("/api/notepad/:id", authenticateToken, (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;

  db.get(
    "SELECT * FROM notepad_files WHERE id = ? AND user_id = ?",
    [id, userId],
    (err, file) => {
      res.json(file);
    }
  );
});

app.put("/api/notepad", authenticateToken, (req, res) => {
  const { id, name, content } = req.body;
  const userId = req.user.id;

  db.run(
    "UPDATE notepad_files SET name = ?, content = ? WHERE id = ? AND user_id = ?",
    [name, content, id, userId],
    function (err) {
      if (err) return res.status(500).json({ error: "Error updating notepad" });
      res.json({ id, name, content });
    }
  );
});


app.get("/api/code-editor/files", authenticateToken, (req, res) => {
  const userId = req.user.id;

  db.all(
    "SELECT * FROM code_files WHERE user_id = ? ORDER BY file_path",
    [userId],
    (err, files) => {
      if (err) {
        console.error('Error fetching files:', err);
        return res.status(500).json({ error: "Failed to fetch files" });
      }
      console.log('Files found:', files);
      res.json(files || []);
    }
  );
});

app.post("/api/code-editor/save", authenticateToken, (req, res) => {
  const { path, content } = req.body;
  const userId = req.user.id;

  db.run(
    "INSERT OR REPLACE INTO code_files (user_id, file_path, content) VALUES (?, ?, ?)",
    [userId, path, content],
    function(err) {
      if (err) {
        console.error('Error saving file:', err);
        return res.status(500).json({ error: "Failed to save file" });
      }
      console.log('File saved successfully');
      res.json({ 
        id: this.lastID,
        file_path: path,
        content: content
      });
    }
  );
});

app.delete("/api/code-editor/files/:path", authenticateToken, (req, res) => {
  const userId = req.user.id;
  const filePath = decodeURIComponent(req.params.path);

  db.run(
    "DELETE FROM code_files WHERE user_id = ? AND file_path = ?",
    [userId, filePath],
    function(err) {
      if (err) {
        console.error('Error deleting file:', err);
        return res.status(500).json({ error: "Failed to delete file" });
      }
      if (this.changes === 0) {
        return res.status(404).json({ error: "File not found" });
      }
      res.json({ success: true });
    }
  );
});

app.listen(PORT, () => {
  console.log(`rodandoooo porta ${PORT}`);
});