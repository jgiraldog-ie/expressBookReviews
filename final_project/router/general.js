const express = require('express');
const axios = require('axios');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

const doesExist = (username) => {
    // Filter the users array for any user with the same username
    let userswithsamename = users.filter((user) => {
        return user.username === username;
    });
    // Return true if any user with the same username is found, otherwise false
    if (userswithsamename.length > 0) {
        return true;
    } else {
        return false;
    }
}

public_users.post("/register", (req,res) => {
    const username = req.body.username;
    const password = req.body.password;
    // Check if both username and password are provided
    if (username && password) {
        // Check if the user does not already exist
        if (!doesExist(username)) {
            // Add the new user to the users array
            users.push({"username": username, "password": password});
            return res.status(200).json({message: "User successfully registered. Now you can login"});
        } else {
            return res.status(404).json({message: "User already exists!"});
        }
    }
    // Return error if username or password is missing
    return res.status(404).json({message: "Unable to register user. Please check if you introduced Username AND Password"});
});

// Get the book list available in the shop

public_users.get('/', async function (req, res) {
  try {
    const data = await new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve(books);
      }, 1000);
    });
    res.send(JSON.stringify(data));
  } catch (error) {
    console.error(error);
    res.status(500).send('Could not find the books');
  }
});

public_users.get('/isbn/:isbn', async function (req, res) {
  try {
    const isbn = req.params.isbn;

    // Simular una operación asíncrona
    const selectedBook = await new Promise((resolve, reject) => {
      setTimeout(() => {
        if (books[isbn]) {
          resolve(books[isbn]);
        } else {
          reject(new Error('Book Not Found'));
        }
      }, 500);
    });

    res.send(selectedBook);
  } catch (error) {
    console.error(error);
    res.status(404).send('Error finding the Book');
  }
});

  
public_users.get('/author/:author', async function (req, res) {
    try {
      const author = req.params.author;
      const booksByAuthor = await new Promise((resolve, reject) => {
        setTimeout(() => {
          const filteredBooks = Object.values(books).filter((book) => book.author === author);
          if (filteredBooks.length > 0) {
            resolve(filteredBooks);
          } else {
            reject(new Error('Book not found for this author'));
          }
        }, 500); 
      });
  
      res.send(booksByAuthor);
    } catch (error) {
      console.error(error);
      res.status(404).send('Error finding the Book');
    }
  });



// Get all books based on title
public_users.get('/title/:title', async function (req, res) {
    try {
      const title = req.params.title;
      const booksByTitle = await new Promise((resolve, reject) => {
        setTimeout(() => {
          const filteredBooks = Object.values(books).filter((book) => book.title === title);
          if (filteredBooks.length > 0) {
            resolve(filteredBooks);
          } else {
            reject(new Error('Book not found with this Title'));
          }
        }, 500);
      });
      res.send(booksByTitle);
    } catch (error) {
      console.error(error);
      res.status(404).send('Error finding the Book');
    }
  });

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
    const isbn = req.params.isbn;
    const selectedBook = books[isbn];
    res.send(selectedBook.reviews);
});

module.exports.general = public_users;
