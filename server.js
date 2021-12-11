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
app.get('/insertBook',serveBookInsert)
app.get('/home',serveHome)
app.get('/bookSearch/:search',searchByTitleServe)
app.get('/bookRedirect/:isbn',sendToBookPage)
app.get('/client.js',sendClient);
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

//function to insert a book into db
function serveBookInsert(req,res,next){
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
    client.query(`insert into book values (${isbn},${title},${genre},${price},${stock},${num_pages},${pub_cut})`), (err, queryResult) => {
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
//rerender the home page based on search query received from client
function searchByTitleServe(req,res,next){
    let titleToSearch = req.params.search;
    client.query(`SELECT * FROM book where title = '${titleToSearch}';`, (err, queryResult) => {
        res.status(200).send(pug.renderFile("./views/home.pug",queryResult));
    });
}


//function to serve the home page
function serveHome(req,res,next){
    //make a query for the whole page
    client.query(`SELECT * FROM book;`, (err, queryResult) => {
        res.render('home',queryResult);
    });
    //res.render("home");
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