const express = require('express');
//partials = require('express-partials')

let app = express();
//app.use(partials());
//parse body requests as JSON
app.use(express.json());
const fs = require("fs");
//View engine
app.set("view engine", "pug");
app.use(express.urlencoded({extended: true})); 
app.use(express.static("public"));
app.get('/',serveHome)
app.get('/restaurants',serveRestList)
app.post('/restaurants',receiveNewRestaurant)
app.get('/addrestaurant',addRestaurantsPage)
app.get('/restaurants/:restID', serveSpecificRestaurant)
app.get("/client.js", sendClient);
app.put('/restaurants/:restID',updateRestaurant)
let restsServer = [];//array of restaurant data
let restsID=[];//array of restaurant ids

readRestaurantData();//start the server opening process

/*
const { Client } = require('pg');

const client = new Client({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

client.connect();

client.query('SELECT * FROM student;', (err, res) => {
  if (err) throw err;
  for (let row of res.rows) {
    console.log(JSON.stringify(row));
  }
  client.end();
});*/


//function to serve the home page
function serveHome(req,res,next){
    res.render("home");
}
//function to update restaurant when given new restaurant to change
function updateRestaurant(req,res,next){
    console.log(req.body)
    let idToCheck = req.params.restID;
    let restFound= false
    for(let i = 0; i< restsServer.length; i++){
        if (restsServer[i].id == idToCheck){
            //console.log("I found a match and updated the restaurant")
            restsServer[i] = req.body
            restFound = true;
        }
    }
    if (restFound){
        res.sendStatus(200);
    }else{
        res.sendStatus(404)
    }
    console.log(restsServer)
    
}

//function to receive newly created restaurant data
function receiveNewRestaurant(req,res,next){
    console.log(req.body)
    compileRestaurantIDs();
    newID=restsID.length
    newID++;
    console.log(newID)
    //ensure fields exist and are valid
    if(req.body.name && req.body.min_order&& (!isNaN(req.body.min_order)) && req.body.delivery_fee && (!isNaN(req.body.delivery_fee))){
        newRestaurant = {"id": newID, "name": req.body.name,
            "min_order": req.body.min_order, 
            "delivery_fee": req.body.delivery_fee, 
            "menu": {}}
        console.log(newRestaurant)
        restsServer.push(newRestaurant)
        //send the restaurant after adding
        res.status(200).json({restaurant: newRestaurant})
    }else{
        res.sendStatus(400)
    }
    
}

//function to serve the list of restaurants
function serveRestList(req,res,next){
    //console.log(req.header)
    res.format({
		"application/json": function(){//if JSON
            compileRestaurantIDs();
			res.status(200).json({restaurants: restsID});
		},//ELSE IF html
		"text/html": () => { res.render("restaurants",{restaurants: restsServer}) }
	});
    
}
//function to serve the addRestaurantsPage
function addRestaurantsPage(req,res,next){
    res.render("addPage");
}

//function to serve a specific restaurant
function serveSpecificRestaurant(req,res,next){
    restaurantID = req.params.restID
    console.log(restaurantID);
    let restaurantToSend;
            restsServer.forEach(restaurant=>{
                if(restaurant.id == restaurantID){
                    //console.log(`I found a match for param: ${restaurantID} to ${restaurant.id}`)
                    restaurantToSend = restaurant;
                }
            })
    res.format({
		"application/json": function(){//if JSON
			res.status(200).json({restaurant: restaurantToSend});
		},//ELSE IF html
        //NULLS CAN BE ADDED, CHECK IF NEED FIX
		"text/html": () => {
            console.log(`The restaurant to send is: ${restaurantToSend.name}`)
            res.render("restaurant",{restaurant: restaurantToSend}) }
	});
}

function compileRestaurantIDs(){
    restsID.length = 0;
    restsServer.forEach(restaurant=>{
        restsID.push(restaurant.id)
    })
}

//open the server
function openServer(){
    app.listen(process.env.PORT || 3000);
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

//working, just check timing again
function readRestaurantData(){//read all data from the restaurants file.
    fs.readdir("restaurants", function(err, filenames) {
        if (err) {//IF ERROR
            console.log("ERROR ON RESTAURANT FOLDER READ")
            return;
        }
        
        filenames.forEach(function(filename) {
          fs.readFile("restaurants/" + filename, 'utf-8', function(err, content) {
            if (err) {
              console.log(`ERROR ON ACCESS ${"/restaurants/" + filename}`)
              return;
            }
            else{//if all goes smoothly
                //console.log(`Success on ACCESS ${"/restaurants/" + filename}`)
                if(filename.includes(".json")){//make sure we access the actual json files, not anything else (like ds store)
                    restaurantToAdd = JSON.parse(content);//load the file content as a JSON file
                    restsServer.push(restaurantToAdd);//push the JSON file to the server list
                    //console.log(restsServer)
                }
            }
          });
        }/*,openServer()*/);
		openServer();//call the server to open after the filenames have been gathered.
      });
}