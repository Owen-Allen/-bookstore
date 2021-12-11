const express = require('express');
const session = require('express-session');
const pug = require('pug');
//partials = require('express-partials')

let app = express();
app.use(express.json());
const fs = require("fs");
//use session api
app.use(session({ secret: 'some secret here'}))
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
app.get('/bookSearchPrice/:min/max/:max',searchByPriceServe)
//other gets
app.get('/bookRedirect/:isbn',sendToBookPage)
app.get('/client.js',sendClient);
app.get('/style.css',sendCSS);
app.get('/currentCart',serveCurrentCartPage);
app.get('/reports',serveReportsPage);
//posts
app.post('/insertBook', addBookToDB)
app.post('/orderBook',addBookToCart)

currentCart=[];

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

function serveCurrentCartPage(req,res,next){
    res.render('cart',{cart: currentCart});
}

//function to serve the reports page
function serveReportsPage(req,res,next){
    //change to render reports
    res.render('cart',{cart: currentCart});
}

//function to process adding a book to cart
function addBookToCart(req,res,next){
    isbn = req.body.isbn;
    quantity = parseInt(req.body.quantity);
    title = req.body.title;

    console.log(isbn)
    console.log(quantity)
    console.log(title);

    let found = false
    //check the cart for the same book
    for (let bookOrder of currentCart){
        //if they are the same book
        if (bookOrder.isbn == isbn){
            //check to see if adding this will order too many books (i.e newQuantity becomes greater than stock)
            let newQuantity= bookOrder.quantity + quantity;
            //find the book
            console.log("about to execute 1st query")
            client.query(`SELECT * FROM book where isbn = '${isbn}';`, (err, queryResult) => {
                //should only return one row, but we need to access iteratively
                for (let book of queryResult.rows){
                    //the stock is less than the requested order
                    if (book.stock < newQuantity){
                        //don't allow the order to proceed.
                        res.send("NOT ENOUGH BOOK STOCK TO COMPLETE THIS ORDER. (ONE ALREADY EXISTS, devnote)");
                    }else{
                        //if the code gets to this point, the stock is okay, so update the bookOrder in cart to have the newQuantity
                        console.log("I ADDED THE QUANTITY")
                        bookOrder.quantity = newQuantity;
                        found = true;
                        console.log("found inside loop is")
                        console.log(found)
                        res.render('cart',{cart: currentCart});
                        return;
                    }
                };
                console.log("end code of 1st query code")
            });
            console.log("outside of 1st query logic")
        }
    };
    //sleep(5000)
    console.log("found outside loop is")
    console.log(found);

    if (found == false){
        //CHECK THE SYNCHRONISITY, it might be messed up
        //if code reaches here, the book is NOT already in the cart, so we check quantity, then add it
        let bookOrderToAdd = {
            isbn: isbn,
            quantity: quantity,
            title: title
        }
        //check the stock
        console.log("about to execute 2nd query")
        client.query(`SELECT * FROM book where isbn = '${bookOrderToAdd.isbn}';`, (err, queryResult) => {
            //should only return one row, but we need to access iteratively
            for (let book of queryResult.rows){
                //the stock is less than the requested order
                if (book.stock < bookOrderToAdd.quantity){
                    //don't allow the order to proceed.
                    res.send("NOT ENOUGH BOOK STOCK TO COMPLETE THIS ORDER.");
                } else{
                    //if the code gets to this point, the stock is okay,
                    console.log("I ADDED THE OBJECT")
                    currentCart.push(bookOrderToAdd)
                    res.render('cart',{cart: currentCart});
                }
            };
            console.log("end code of 1st query code")
        });
        console.log("outside of 2nd query logic")
    }
}



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
    let authors = req.body.author_id.split(",");
    let publishers = req.body.publisher_id.split(",");

    //add the book to db
    client.query(`insert into book values('${isbn}','${title}','${genre}',${price},${stock},${num_pages},${pub_cut})`), (err, queryResult) => {
        if (err) throw err;
    }
    //add the book to wrote:
    authors.forEach(author=>{
        console.log(author)
        client.query(`insert into wrote values('${isbn}','${author}')`), (err, queryResult) => {
            if (err) throw err;
        }
    })
     //add the book to published:
     publishers.forEach(publisher=>{
        console.log(publisher)
        client.query(`insert into published values('${isbn}','${publisher}')`), (err, queryResult) => {
            if (err) throw err;
        }
    })
    
    
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
function searchByPriceServe(req,res,next){
    let minToSearch = req.params.min;
    let maxToSearch = req.params.max;
    client.query(`SELECT * FROM book where price >= ${minToSearch} and price <= ${maxToSearch};`, (err, queryResult) => {
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



/*function sleep(milliseconds) {
    const date = Date.now();
    let currentDate = null;
    do {
      currentDate = Date.now();
    } while (currentDate - date < milliseconds);
  }*/