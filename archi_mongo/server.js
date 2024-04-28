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

/**
 * @typedef {Object} User
 * @property {string} bithDate - The birth date of the user.
 * @property {string} email - The email of the user.
 * @property {string} name - The name of the user.
 * @property {string} surname - The surname of the user.
 * @property {string} city - The city of the user.
 * @property {string} postalCode - The postal code of the user.
 */

/**
 * Model representing a user in MongoDB.
 * @type {import("mongoose").Model<User>}
 */
const userSchema = new mongoose.Schema({
  bithDate: String,
  email: String,
  name: String,
  surname: String,
  city: String,
  postalCode: String
});

const User = mongoose.model("User", userSchema);

/**
 * Endpoint to add a new user.
 * @name POST/users
 * @function
 * @memberof app
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {Object} The added user.
 */
app.post("/users", async (req, res) => {
  try {
    const user = new User(req.body);
    await user.save();
    res.status(201).send(user);
  } catch (error) {
    res.status(400).send(error);
  }
});

/**
 * Endpoint to get all users.
 * @name GET/users
 * @function
 * @memberof app
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {Array<User>} Array of users.
 */
app.get("/users", async (req, res) => {
  try {
    const user = await User.find({});
    res.send(user);
  } catch (error) {
    res.status(500).send(error);
  }
});

/**
 * Endpoint to delete a user by ID.
 * @name DELETE/users/:id
 * @function
 * @memberof app
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {string} Message indicating success or failure.
 */
app.delete("/users/:id", async (req, res) => {
  try {
    if (req.body.delete_pswd != process.env.DELETE_PSWD) {
      res.status(401);
    }
    await User.findByIdAndDelete(req.params.id);
    res.send("User deleted successfully");
  } catch (error) {
    res.status(500).send(error);
  }
});

/**
 * Port on which the server is running.
 * @type {number}
 */
const port = process.env.PORT || 3000;

/**
 * Start the server.
 */
app.listen(port, () => {
  console.log(`Serveur démarré sur le port ${port}`);
});
