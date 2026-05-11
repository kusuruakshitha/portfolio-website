const mongoose = require("mongoose");

mongoose.connect("mongodb://localhost:27017/portfolio", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const ProjectSchema = new mongoose.Schema({
  title: String,
  description: String,
  category: String,
  favorite: { type: Boolean, default: false }
});

const UserSchema = new mongoose.Schema({
  username: String,
  password: String
});

const Project = mongoose.model("Project", ProjectSchema);
const User = mongoose.model("User", UserSchema);

async function seed() {
  await Project.deleteMany({});
  await User.deleteMany({});

  // Create login user
  await User.create({ username: "admin", password: "1234" });

  // Insert ONE project
  await Project.create({
    title: "Internship Portfolio Website",
    description: "A responsive full-stack portfolio built with HTML, CSS, JavaScript, Express.js, and MongoDB.",
    category: "Frontend"
  });

  console.log("Database seeded with one project!");
  mongoose.connection.close();
}

seed();
