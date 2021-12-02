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
app.get('/home',serveHome)
app.get('/bookSearch/:isbn',searchByTitleServe)
app.get('/bookRedirect/:search',sendToBookPage)
app.get('/client.js',sendClient);

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


function sendToBookPage(req,res,next){
    let titleToSearch = req.params.search;
    client.query(`SELECT * FROM book where title = '${isbnToSearch}';`, (err, queryResult) => {
        res.render('book',queryResult);
    });
}

function searchByTitleServe(req,res,next){
    let isbnToSearch = req.params.isbn;
    client.query(`SELECT * FROM book where isbn = '${isbnToSearch}';`, (err, queryResult) => {
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