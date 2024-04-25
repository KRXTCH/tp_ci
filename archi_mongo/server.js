const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect("mongodb://mongodb:27017/ynovmongo", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "Erreur de connexion à MongoDB :"));
db.once("open", () => {
  console.log("Connecté à la base de données MongoDB");
});

const userSchema = new mongoose.Schema({
  bithDate: String,
  email: String,
  name: String,
  surname: String,
  city: String,
  postalCode: String
});

const User = mongoose.model("User", userSchema);

app.post("/users", async (req, res) => {
  try {
    const user = new User(req.body);
    await user.save();
    res.status(201).send(user);
  } catch (error) {
    res.status(400).send(error);
  }
});

app.get("/users", async (req, res) => {
  try {
    const user = await User.find({});
    res.send(user);
  } catch (error) {
    res.status(500).send(error);
  }
});

app.delete("/users/:id", async (req, res) => {
  try {
    if (req.body.delete_pswd != process.env.DELETE_PSWD) {
      res.status(301).send("Unauthorized");
    }
    await User.findByIdAndDelete(req.params.id);
    res.send("Utilisateur supprimé avec succès");
  } catch (error) {
    res.status(500).send(error);
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Serveur démarré sur le port ${port}`);
});
