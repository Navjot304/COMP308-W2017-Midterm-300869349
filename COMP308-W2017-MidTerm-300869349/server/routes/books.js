/*
Name: Navjot Kaur
Student ID: 300869349
File Name: books.js
Web app name: https://comp308-2017-midterm-300869349.herokuapp.com/
*/


// modules required for routing
let express = require('express');
let router = express.Router();
let mongoose = require('mongoose');

// define the book model
let book = require('../models/books');

function requireAuth(req, res, next) {
  if(!req.isAuthenticated()) {
    return res.redirect('/login');
  }
  next();
}

/* GET books List page. READ */
router.get('/', (req, res, next) => {
  // find all books in the books collection
  book.find( (err, books) => {
    if (err) {
      return console.error(err);
    }
    else {
      res.render('books/index', {
        title: 'Books',
        books: books,
        displayName:req.user.displayName
      });
    }
  });

});

//  GET the Book Details page in order to add a new Book
router.get('/add', (req, res, next) => {

    /*****************
     * ADD CODE HERE *
     *****************/

res.render('books/details', {
  title: "Add new book",
  books: '',
  displayName:req.user.displayName
});
});

// POST process the Book Details page and create a new Book - CREATE
router.post('/add', requireAuth, (req, res, next) => {

    /*****************
     * ADD CODE HERE *
     *****************/
    let newBook=new book({
      "Title": req.body.booktitle,
      "Description": "",
      "Price": req.body.price,
      "Author": req.body.author,
      "Genre": req.body.genre
    });

    book.create(newBook, (err,book) => {
      console.log(req, res)
      if(err){
        console.log(err);
        res.end(err);
    }
    else{
      res.redirect('/books');
    }
    });

});

// GET the Book Details page in order to edit an existing Book
router.get('/:id', requireAuth, (req, res, next) => {

    /*****************
     * ADD CODE HERE *
     *****************/
try{
  let id=mongoose.Types.ObjectId.createFromHexString(req.params.id);
book.findById(id, (err, books) => {
  if(err)
  {
    console.log(err);
    res.end(error);
  }
  else
  {
    res.render('books/details', {
      title: 'Book Details',
      books:books,
      displayName: req.user.displayName
    });
  }
});
}
catch(err)
{
  console.log(err);
  res.redirect('/errors/404');
}
});

// POST - process the information passed from the details form and update the document
router.post('/:id', requireAuth, (req, res, next) => {

    /*****************
     * ADD CODE HERE *
     *****************/
let id = req.params.id;
let updateBook=book(
  {
    "_id": id,
    "Title": req.body.booktile,
    "Description": "",
    "Price": req.body.price,
    "Author": req.body.author,
    "Genre": req.body.genre
  }
);

book.update({_id:id},
updateBook, (err) => {
  if(err)
  {
    console.log(err);
    res.end(err);
  }
  else{
    res.redirect('/books');
  }
});
});

// GET - process the delete by user id
router.get('/delete/:id', requireAuth, (req, res, next) => {

    /*****************
     * ADD CODE HERE *
     *****************/

    let id=req.params.id;
    book.remove({ _id:id}, (err) => {
      if(err)
      {
        console.log(err);
        res.end(err);
      }
      else{
        res.redirect('/books');
      }
    });
});


module.exports = router;
