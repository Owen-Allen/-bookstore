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
app.get('/nameSearch/:name',searchByName)
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


function searchByName(req,res,next){
    let nameToSearch = req.params.name;
    client.query(`SELECT * FROM student where name = '${nameToSearch}';`, (err, res) => {
        res.send(JSON.stringify(res));
    });
}


//function to serve the home page
function serveHome(req,res,next){
    //make a dummy query
    client.query(`SELECT * FROM student;`, (err, queryResult) => {
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