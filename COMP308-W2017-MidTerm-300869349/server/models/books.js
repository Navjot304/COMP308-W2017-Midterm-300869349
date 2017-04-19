/*
Name: Navjot Kaur
Student ID: 300869349
File Name: books.js
Web app name: https://comp308-2017-midterm-300869349.herokuapp.com/
*/

let mongoose = require('mongoose');

// create a model class
let booksSchema = mongoose.Schema({
    Title: String,
    Description: String,
    Price: Number,
    Author: String,
    Genre: String
},
{
  collection: "books"
});

module.exports = mongoose.model('books', booksSchema);
