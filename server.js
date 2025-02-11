require('dotenv').config();
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(cors());

// Connection to MongoDB Atlas
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => console.log("MongoDB Connected"))
  .catch(err => console.log(err));

const todoSchema = new mongoose.Schema({
    task: String
});
const Todo = mongoose.model("Todo", todoSchema);

// Routes
app.get("/", async (req, res) => {
    const todos = await Todo.find();
    res.render("index", { todos });
});

app.post("/add", async (req, res) => {
    const newTask = new Todo({ task: req.body.task });
    await newTask.save();
    res.redirect("/");
});

app.post("/delete/:id", async (req, res) => {
    await Todo.findByIdAndDelete(req.params.id);
    res.redirect("/");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
