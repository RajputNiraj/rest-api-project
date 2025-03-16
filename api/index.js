/* 
index.js: Main server file for the Library App
It Handles routes for viewing, adding, editing, and deleting books.
*/

// Import required modules
const express = require("express");
const methodOverride = require("method-override");
const bodyParser = require("body-parser");
const path = require("path");

// Create an instance of Express
const app = express();

// Middleware setup
app.use(bodyParser.urlencoded({ extended: true })); //Converts incoming JSON and URL-encoded data into an object for Express to use.
app.use(express.json()); // Allowing Express to understand JSON data sent by the frontend
app.use(methodOverride("_method")); //By default, HTML forms only support GET and POST methods. However, in RESTful APIs, we often need PUT, PATCH, and DELETE to update or delete data. methodOverride allows HTML forms to use PUT, PATCH, and DELETE by sending a POST request with a query parameter (_method).

// Set the view engine to EJS for rendering templates
app.set("views", path.join(__dirname, "../views"));
app.set("view engine", "ejs");

// Sample data
let books = [
  {
    id: 1,
    title: "Srimad Bhagwat Geeta",
    author: "Maharishi Veda Vyasa",
    available: true,
  },
  {
    id: 2,
    title: "Chanakyaniti",
    author: "Chanakya",
    available: false,
  },
];

// Routes.

// Home -
// Show books
app.get("/", (req, res) => {
  res.render("index", { books });
});

// Add book -
// Show form to add a new book
app.get("/add", (req, res) => {
  res.render("add", { books });
});

// Handle form submission to add a book
app.post("/add", (req, res) => {
  const newBook = {
    id: books.length + 1, // Auto-increment ID
    title: req.body.title,
    author: req.body.author,
    available: req.body.available === "on", // Convert checkbox value to boolean
  };
  books.push(newBook); // Add book to the list
  res.redirect("/"); // Redirect to home page
});

// Edit book -
// Show form to edit a book
app.get("/edit/:id", (req, res) => {
  const book = books.find((b) => b.id === parseInt(req.params.id)); // Convert request ID to a number and find the book in the books array by matching ID.
  if (!book) return res.status(404).send("Book not found"); // Check if the book is not found in the books array (undefined); if so, return a 404 error.
  res.render("edit", { book });
});

// Handle form submission to edit a book
app.put("/edit/:id", (req, res) => {
  const book = books.find((b) => b.id === parseInt(req.params.id)); // Convert request ID to a number and find the book in the books array by matching ID
  if (!book) return res.status(404).send("Book not found"); // Check if the book is not found in the books array (undefined); if so, return a 404 error.

  // Update book details
  book.title = req.body.title;
  book.author = req.body.author;
  book.available = req.body.available === "on"; // Convert checkbox value to boolean

  res.redirect("/"); // Redirect to the home page
});

// Delete book -
// Handle deletion
app.delete("/delete/:id", (req, res) => {
  books = books.filter((b) => b.id !== parseInt(req.params.id)); // Convert request ID to a number and Remove the book from the array that has the matching ID

  res.redirect("/"); // Redirect to the home page
});

// Start the server
app.listen(3000, () => {
  console.log("Server is running on http://localhost:3000");
});
