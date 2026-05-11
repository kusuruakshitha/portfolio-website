const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

// Track uptime
const startTime = Date.now();

// MongoDB connection
mongoose.connect("mongodb://localhost:27017/portfolio", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Schemas
const ProjectSchema = new mongoose.Schema({
  title: String,
  description: String,
  category: String, // Frontend, Backend, Database, UI/UX, DevOps
  favorite: { type: Boolean, default: false }
});

const ContactSchema = new mongoose.Schema({
  name: String,
  email: String,
  subject: String,
  message: String,
  createdAt: { type: Date, default: Date.now }
});

const UserSchema = new mongoose.Schema({
  username: String,
  password: String
});

const Project = mongoose.model("Project", ProjectSchema);
const Contact = mongoose.model("Contact", ContactSchema);
const User = mongoose.model("User", UserSchema);

// Routes

// Login
app.post("/login", async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username, password });
  if (user) {
    res.json({ success: true });
  } else {
    res.json({ success: false, message: "Invalid credentials" });
  }
});

// Stats (projects, messages, uptime)
app.get("/stats", async (req, res) => {
  const projects = await Project.countDocuments();
  const messages = await Contact.countDocuments();
  const uptime = Math.floor((Date.now() - startTime) / 1000);
  res.json({ projects, messages, uptime });
});

// Projects
app.get("/projects", async (req, res) => {
  const projects = await Project.find();
  res.json(projects);
});

app.post("/projects", async (req, res) => {
  const newProject = new Project(req.body);
  await newProject.save();
  res.json(newProject);
});

// Toggle favorite
app.post("/projects/:id/favorite", async (req, res) => {
  const project = await Project.findById(req.params.id);
  if (project) {
    project.favorite = !project.favorite;
    await project.save();
    res.json(project);
  } else {
    res.status(404).json({ error: "Project not found" });
  }
});

// Contact form
app.post("/contact", async (req, res) => {
  const newMessage = new Contact(req.body);
  await newMessage.save();
  res.json({ success: true, message: "Message saved!" });
});
