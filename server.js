const express = require('express');
//const session = require('express-session');
const pug = require('pug');
//partials = require('express-partials')

let app = express();
app.use(express.json());
const fs = require("fs");
//View engine
app.set("view engine", "pug");
app.use(express.urlencoded({extended: true})); 
app.use(express.static("public"));
app.get('/',serveHome)
app.get('/bookSearch',serveBookSearchPage)
app.get('/insertBook',serveBookInsert)
app.get('/home',serveHome)
//serves for the searchParams
app.get('/bookSearchTitle/:search',searchByTitleServe)
app.get('/bookSearchGenre/:search',searchByGenreServe)
app.get('/bookSearchAuthor/:search',searchByAuthorServe)
app.get('/bookSearchPrice/:min/:max')
app.get('/bookRedirect/:isbn',sendToBookPage)
app.get('/client.js',sendClient);
app.get('/style.css',sendClient);
app.post('/insertBook', addBookToDB)


//connect to pg
const { Client } = require('pg');
const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false
    }
});
//open the server
openServer();

//serve the book search page:
function serveBookSearchPage(req,res,next){
     //make a query for the whole page
     client.query(`SELECT * FROM book;`, (err, queryResult) => {
        res.render('bookSearch',queryResult);
    });
}


//function to insert a book into db
function addBookToDB(req,res,next){
    //two ways to get ISBN, one is to increment by one for each book, so get the "max" ISBN from the db
    //other is to just make a random number:
    let isbn = Math.floor(Math.random() * 100000000000);
    isbn = isbn.toString();
    //get the rest of the parameters.
    let title = req.body.title;
    let genre = req.body.genre;
    let price = parseFloat(req.body.price);
    let stock = parseInt(req.body.stock);
    let num_pages = parseInt(req.body.num_pages);
    let pub_cut = parseFloat(req.body.pub_cut);
    //add the book to db
    client.query(`insert into book values('${isbn}','${title}','${genre}',${price},${stock},${num_pages},${pub_cut})`), (err, queryResult) => {
        if (err) throw err;
    }
    //redirect to the book's page
    client.query(`SELECT * FROM book where isbn = '${isbn}';`, (err, queryResult) => {
        res.render('book',queryResult);
    });
}
//serve the book insert page
function serveBookInsert(req,res,next){
    res.render("insertBook");
}


//send to a book page based on the isbn received from link
function sendToBookPage(req,res,next){
    let isbnToSearch = req.params.isbn;
    client.query(`SELECT * FROM book where isbn = '${isbnToSearch}';`, (err, queryResult) => {
        res.render('book',queryResult);
    });
}

//BOOK SEARCHES

//rerender the bookSearch page based on a title search query received from client
function searchByTitleServe(req,res,next){
    let titleToSearch = req.params.search;
    client.query(`SELECT * FROM book where title = '${titleToSearch}';`, (err, queryResult) => {
        res.status(200).send(pug.renderFile("./views/bookSearch.pug",queryResult));
    });
}

//rerender the home page based on a genre search query received from client
function searchByGenreServe(req,res,next){
    let genreToSearch = req.params.search;
    client.query(`SELECT * FROM book where genre = '${genreToSearch}';`, (err, queryResult) => {
        res.status(200).send(pug.renderFile("./views/bookSearch.pug",queryResult));
    });
}

//rerender the home page based on a author search query received from client
function searchByAuthorServe(req,res,next){
    let authorToSearch = req.params.search;
    client.query(`SELECT * FROM book natural join wrote natural join author where name = '${authorToSearch}';`, (err, queryResult) => {
        res.status(200).send(pug.renderFile("./views/bookSearch.pug",queryResult));
    });
}

//rerender the home page based on a price search query received from client
function searchByAuthorServe(req,res,next){
    let minToSearch = req.params.price.min;
    let maxToSearch = req.params.price.max;
    client.query(`SELECT * FROM book where price > ${minToSearch} and price < ${maxToSearch};`, (err, queryResult) => {
        res.status(200).send(pug.renderFile("./views/bookSearch.pug",queryResult));
    });
}


//function to serve the home page
function serveHome(req,res,next){
    res.render('home');
   
}

//open the server
function openServer(){
    app.listen(process.env.PORT || 3000);
    client.connect();
    console.log("Server listening at http://localhost:3000");
}

//read and send the js file for use
function sendClient(req,res,next){
	fs.readFile("client.js", function(err, data){
		if(err){
			res.status(500).send("Error.");
			return;
		}
		res.status(200).send(data)
	});
}

//read and send the js file for use
function sendCSS(req,res,next){
	fs.readFile("style.css", function(err, data){
		if(err){
			res.status(500).send("Error.");
			return;
		}
		res.status(200).send(data)
	});
}